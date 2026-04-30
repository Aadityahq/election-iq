import { getEnv } from './env';

const MAPS_API_KEY = getEnv('VITE_GOOGLE_MAPS_API_KEY');

let mapsLoadPromise = null;

export async function loadMapsAPI() {
  if (!MAPS_API_KEY || MAPS_API_KEY.includes('your_')) {
    console.warn('Google Maps API key is missing. Map features will stay disabled until .env.local is completed.');
    return;
  }

  // Already loaded
  if (window.google?.maps) return;

  // Already loading — reuse the same promise to avoid duplicate script injection
  if (mapsLoadPromise) return mapsLoadPromise;

  mapsLoadPromise = new Promise((resolve, reject) => {
    // Check if script tag already exists (e.g. from HMR)
    const existing = document.querySelector(`script[src*="maps.googleapis.com"]`);
    if (existing) {
      existing.addEventListener('load', resolve);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = () => {
      mapsLoadPromise = null;
      reject(new Error('Failed to load Google Maps API'));
    };
    document.body.appendChild(script);
  });

  return mapsLoadPromise;
}

export async function getNearbyPollingStations(lat, lng, mapInstance) {
  if (!window.google?.maps) await loadMapsAPI();

  return new Promise((resolve, reject) => {
    try {
      // Use the actual map instance if provided (more reliable)
      const service = new window.google.maps.places.PlacesService(
        mapInstance || document.createElement('div')
      );

      const request = {
        location: new window.google.maps.LatLng(lat, lng),
        radius: 5000,
        keyword: 'polling station',
        type: 'point_of_interest',
      };

      service.nearbySearch(request, (results, status) => {
        console.log('PlacesService status:', status, 'Results found:', results?.length || 0);
        
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          console.log('Polling stations found:', results.length);
          resolve(results.slice(0, 5));
        } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          console.warn('No polling stations found for this location');
          resolve([]);
        } else {
          console.warn('PlacesService error:', status);
          resolve([]);
        }
      });
    } catch (err) {
      console.error('PlacesService error:', err);
      resolve([]);
    }
  });
}

export function getDirectionsLink(lat, lng) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}
