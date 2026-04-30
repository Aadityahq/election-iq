import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getNearbyPollingStations, getDirectionsLink, loadMapsAPI } from '../services/mapsService';
import { MapPin, Navigation } from 'lucide-react';
import '../styles/map.css';

function Map() {
  const [map, setMap] = useState(null);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [manualLocation, setManualLocation] = useState('');
  const [mapReady, setMapReady] = useState(false);
  const [geoPermissionDenied, setGeoPermissionDenied] = useState(false);
  const mapRef = useRef(null);

  // Search stations with map reference
  const searchPollingStations = useCallback(async (lat, lng, googleMap) => {
    setLoading(true);
    setError('');
    try {
      // Pass the googleMap instance to the service
      const results = await getNearbyPollingStations(lat, lng, googleMap);
      console.log('Search results:', results?.length || 0, 'stations found');
      setStations(results || []);

      if (googleMap && results && results.length > 0) {
        results.forEach((station) => {
          new window.google.maps.Marker({
            position: {
              lat: station.geometry.location.lat(),
              lng: station.geometry.location.lng(),
            },
            map: googleMap,
            title: station.name,
            icon: '🗳️',
          });
        });
      }
    } catch (err) {
      console.error('Search polling stations error:', err);
      setError('Failed to find polling stations. Try another location.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize map with proper DOM timing
  const initializeMap = useCallback(async (lat, lng) => {
    try {
      if (!window.google?.maps) {
        setError('Google Maps API failed to load. Check your API key.');
        return;
      }

      // Ensure map element exists and is ready
      const mapEl = mapRef.current;
      if (!mapEl) {
        setTimeout(() => initializeMap(lat, lng), 100);
        return;
      }

      const googleMap = new window.google.maps.Map(mapEl, {
        zoom: 13,
        center: { lat, lng },
        styles: [
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#dbeafe' }],
          },
          {
            featureType: 'landscape',
            elementType: 'geometry',
            stylers: [{ color: '#f1f5f9' }],
          },
        ],
      });

      setMap(googleMap);
      setMapReady(true);
      setError('');

      // Add user location marker
      new window.google.maps.Marker({
        position: { lat, lng },
        map: googleMap,
        title: 'Your Location',
        icon: '🎯',
      });

      // Search for polling stations at this location
      await searchPollingStations(lat, lng, googleMap);
    } catch (err) {
      console.error('Map initialization error:', err);
      setError('Failed to initialize map. Please try again.');
    }
  }, [searchPollingStations]);

  useEffect(() => {
    const setupMap = async () => {
      try {
        await loadMapsAPI();
        if (!window.google?.maps) {
          setError('Google Maps API key not configured. Add VITE_GOOGLE_MAPS_API_KEY to .env.local');
          return;
        }

        if (!navigator.geolocation) {
          setError('Geolocation is not supported by your browser.');
          setGeoPermissionDenied(true);
          return;
        }

        // Request geolocation with 5 second timeout
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ lat: latitude, lng: longitude });
            setGeoPermissionDenied(false);
            initializeMap(latitude, longitude);
          },
          (error) => {
            console.warn('Geolocation error:', error);
            setGeoPermissionDenied(true);
            setError('📍 Location access denied. Please search manually below.');
            // Don't initialize map, let user search manually
          },
          { timeout: 5000, enableHighAccuracy: false }
        );
      } catch (err) {
        console.error('Setup error:', err);
        setError('Failed to load map. Please try again.');
      }
    };

    setupMap();
  }, [initializeMap]);

  const searchByManualLocation = async () => {
    if (!manualLocation.trim() || !window.google?.maps) {
      setError('Please enter a valid location.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const geocoder = new window.google.maps.Geocoder();
      const response = await geocoder.geocode({ address: manualLocation.trim() });
      const result = response.results?.[0];

      if (!result) {
        setError('❌ Location not found. Try a city name like "Delhi" or "New York".');
        setLoading(false);
        return;
      }

      const lat = result.geometry.location.lat();
      const lng = result.geometry.location.lng();
      setUserLocation({ lat, lng });

      // Ensure map element is ready
      const mapEl = mapRef.current;
      if (!mapEl) {
        setError('Map element not ready. Please refresh the page.');
        setLoading(false);
        return;
      }

      const googleMap = new window.google.maps.Map(mapEl, {
        zoom: 13,
        center: { lat, lng },
        styles: [
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#dbeafe' }],
          },
          {
            featureType: 'landscape',
            elementType: 'geometry',
            stylers: [{ color: '#f1f5f9' }],
          },
        ],
      });

      setMap(googleMap);
      setMapReady(true);

      // Add marker for searched location
      new window.google.maps.Marker({
        position: { lat, lng },
        map: googleMap,
        title: 'Searched Location',
        icon: '📍',
      });

      await searchPollingStations(lat, lng, googleMap);
    } catch (err) {
      console.error('Manual search error:', err);
      setError('❌ Failed to search this location. Try another address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="map-container">
      <h2>
        <MapPin size={22} strokeWidth={1.8} />
        <span>Find Polling Stations</span>
      </h2>

      {/* Manual Search Section - Always Visible */}
      <div className="manual-search" aria-label="Manual polling location search">
        <input
          type="text"
          value={manualLocation}
          onChange={(e) => setManualLocation(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && searchByManualLocation()}
          placeholder="Enter city or address (e.g., Delhi, India)"
          aria-label="Search polling stations by city or address"
          disabled={loading}
        />
        <button 
          onClick={searchByManualLocation} 
          aria-label="Search polling stations"
          disabled={loading}
        >
          {loading ? '...' : 'Search'}
        </button>
      </div>

      {/* Error Message */}
      {error && <div className="error-message" role="alert">{error}</div>}

      {/* Map Element - Only show if not permission denied or after manual search */}
      {!geoPermissionDenied || userLocation ? (
        <div 
          id="map" 
          ref={mapRef} 
          className="map-element" 
          role="region" 
          aria-label="Polling stations map"
        ></div>
      ) : (
        <div className="map-placeholder">
          <p>🗺️ Enter a location above to see nearby polling stations</p>
        </div>
      )}

      {/* Stations List */}
      <div className="stations-list">
        <h3>Nearby Polling Stations ({stations.length})</h3>

        {loading && <p className="loading">🔍 Searching for polling stations...</p>}

        {stations.length === 0 && !loading && userLocation && (
          <p className="no-stations">✅ No polling stations found. Try another location.</p>
        )}

        {stations.map((station, idx) => (
          <div key={idx} className="station-card">
            <h4>
              <MapPin size={16} strokeWidth={1.8} />
              <span>{station.name}</span>
            </h4>
            <p className="address">{station.vicinity}</p>
            {station.rating && (
              <p className="rating">
                Rating: {'⭐'.repeat(Math.floor(station.rating))} ({station.rating.toFixed(1)})
              </p>
            )}
            <a
              href={getDirectionsLink(
                station.geometry.location.lat(),
                station.geometry.location.lng()
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="directions-link"
            >
              <Navigation size={14} strokeWidth={1.8} />
              Get Directions →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Map;
