import { getEnv } from './env';

const MAPS_API_KEY = getEnv('VITE_GOOGLE_MAPS_API_KEY');

let mapsLoaded = false;

export async function loadMapsAPI() {
  if (!MAPS_API_KEY || MAPS_API_KEY.includes('your_')) {
    console.warn('Google Maps API key is missing. Map features will stay disabled until .env.local is completed.');
    return;
  }

  if (mapsLoaded) return;

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.onload = () => {
      mapsLoaded = true;
      resolve();
    };
    script.onerror = () => reject(new Error('Failed to load Google Maps API'));
    document.body.appendChild(script);
  });
}

export async function getNearbyPollingStations(lat, lng) {
  if (!mapsLoaded) await loadMapsAPI();

  return new Promise((resolve, reject) => {
    const service = new window.google.maps.places.PlacesService(
      document.createElement('div')
    );

    const request = {
      location: new window.google.maps.LatLng(lat, lng),
      radius: 5000,
      keyword: 'polling station',
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        resolve(results.slice(0, 5));
      } else {
        resolve([]);
      }
    });
  });
}

export function getDirectionsLink(lat, lng) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}
