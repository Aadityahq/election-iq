import React, { useState, useEffect } from 'react';
import { getNearbyPollingStations, getDirectionsLink, loadMapsAPI } from '../services/mapsService';
import UiIcon from './UiIcon';
import '../styles/map.css';

function Map() {
  const [map, setMap] = useState(null);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [manualLocation, setManualLocation] = useState('');

  useEffect(() => {
    const initMap = async () => {
      try {
        await loadMapsAPI();
        if (!window.google || !window.google.maps) {
          setError('Google Maps key not configured. Add VITE_GOOGLE_MAPS_API_KEY in .env.local.');
          return;
        }
        
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              setUserLocation({ lat: latitude, lng: longitude });

              const googleMap = new window.google.maps.Map(
                document.getElementById('map'),
                {
                  zoom: 13,
                  center: { lat: latitude, lng: longitude },
                  styles: [
                    {
                      elementType: 'geometry',
                      stylers: [{ color: '#1e293b' }],
                    },
                    {
                      elementType: 'labels.text.stroke',
                      stylers: [{ color: '#1e293b' }],
                    },
                    {
                      elementType: 'labels.text.fill',
                      stylers: [{ color: '#ffffff' }],
                    },
                  ],
                }
              );

              setMap(googleMap);

              new window.google.maps.Marker({
                position: { lat: latitude, lng: longitude },
                map: googleMap,
                title: 'Your Location',
                icon: '🎯',
              });

              searchPollingStations(latitude, longitude);
            },
            () => {
              setError('Location access denied. Use manual location search below.');
            }
          );
        } else {
          setError('Geolocation is not supported by your browser.');
        }
      } catch (err) {
        setError('Failed to load map. Please try again.');
        console.error(err);
      }
    };

    initMap();
  }, []);

  const searchPollingStations = async (lat, lng) => {
    setLoading(true);
    try {
      const results = await getNearbyPollingStations(lat, lng);
      setStations(results || []);

      if (map && results) {
        results.forEach((station) => {
          new window.google.maps.Marker({
            position: {
              lat: station.geometry.location.lat(),
              lng: station.geometry.location.lng(),
            },
            map: map,
            title: station.name,
            icon: '🗳️',
          });
        });
      }
    } catch (err) {
      setError('Failed to find polling stations. Try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const searchByManualLocation = async () => {
    if (!manualLocation.trim() || !window.google || !window.google.maps) return;

    setLoading(true);
    setError('');

    try {
      const geocoder = new window.google.maps.Geocoder();
      const response = await geocoder.geocode({ address: manualLocation.trim() });
      const result = response.results?.[0];

      if (!result) {
        setError('Location not found. Try a city or full address.');
        setLoading(false);
        return;
      }

      const lat = result.geometry.location.lat();
      const lng = result.geometry.location.lng();
      setUserLocation({ lat, lng });

      const googleMap = new window.google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: { lat, lng },
      });

      setMap(googleMap);
      searchPollingStations(lat, lng);
    } catch (err) {
      console.error(err);
      setError('Failed to search this location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="map-container">
      <h2>
        <UiIcon name="map" size={20} />
        <span>Find Polling Stations</span>
      </h2>

      <div className="manual-search" aria-label="Manual polling location search">
        <input
          type="text"
          value={manualLocation}
          onChange={(e) => setManualLocation(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && searchByManualLocation()}
          placeholder="Enter city or address (e.g., Delhi, India)"
          aria-label="Search polling stations by city or address"
        />
        <button onClick={searchByManualLocation} aria-label="Search polling stations">
          Search
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}

      <div id="map" className="map-element" role="region" aria-label="Polling stations map"></div>

      <div className="stations-list">
        <h3>Nearby Polling Stations ({stations.length})</h3>
        
        {loading && <p className="loading">Searching for polling stations...</p>}

        {stations.length === 0 && !loading && (
          <p className="no-stations">No polling stations found nearby.</p>
        )}

        {stations.map((station, idx) => (
          <div key={idx} className="station-card">
            <h4>
              <UiIcon name="polling" size={16} />
              <span>{station.name}</span>
            </h4>
            <p className="address">{station.vicinity}</p>
            <p className="rating">
              Rating: {'⭐'.repeat(Math.floor(station.rating || 0))}
            </p>
            <a
              href={getDirectionsLink(
                station.geometry.location.lat(),
                station.geometry.location.lng()
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="directions-link"
            >
              <UiIcon name="arrowRight" size={16} />
              Get Directions →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Map;
