
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

const defaultCenter = { lat: 10.6676, lng: -71.6145 };

const LocationMarker = ({ position, setPosition, isViewOnly }) => {
  const markerRef = useRef(null);
  const map = useMapEvents({
    click(e) {
      if (!isViewOnly) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      }
    },
  });

  const eventHandlers = useMemo(() => ({
    dragend() {
      const marker = markerRef.current;
      if (marker != null) {
        setPosition(marker.getLatLng());
      }
    },
  }), [setPosition]);

  return position.lat !== null ? (
    <Marker
      position={position}
      draggable={!isViewOnly}
      ref={markerRef}
      eventHandlers={isViewOnly ? undefined : eventHandlers}
    />
  ) : null;
};

const MapInput = ({ value, onChange, isViewOnly = false }) => {
  const [currentPosition, setCurrentPosition] = useState({ lat: null, lng: null });
  const [isGeocoding, setIsGeocoding] = useState(false);
  const geocodeTimerRef = useRef(null);

  useEffect(() => {
    if (value && typeof value.lat === 'number' && typeof value.lng === 'number') {
      setCurrentPosition(value);
    } else {
      setCurrentPosition({ lat: null, lng: null });
    }
  }, [value]);

  useEffect(() => {
    if (isViewOnly || !currentPosition || typeof currentPosition.lat !== 'number') {
      return;
    }

    clearTimeout(geocodeTimerRef.current);
    geocodeTimerRef.current = setTimeout(() => {
      setIsGeocoding(true);
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${currentPosition.lat}&lon=${currentPosition.lng}`)
        .then(res => res.json())
        .then(data => {
          const address = data.display_name || 'Ubicación no encontrada.';
          onChange({ lat: currentPosition.lat, lng: currentPosition.lng, address });
        })
        .catch(error => {
          console.error("Geocoding error:", error);
          onChange({ lat: currentPosition.lat, lng: currentPosition.lng, address: 'Error al obtener la dirección.' });
        })
        .finally(() => {
          setIsGeocoding(false);
        });
    }, 500); // 500ms debounce

    return () => clearTimeout(geocodeTimerRef.current);
  }, [currentPosition.lat, currentPosition.lng, isViewOnly, onChange]);

  const handlePositionChange = (newPosition) => {
    if (!isViewOnly) {
      setCurrentPosition(newPosition);
    }
  };

  const mapCenter = useMemo(() => (
    (currentPosition && currentPosition.lat) ? [currentPosition.lat, currentPosition.lng] : [defaultCenter.lat, defaultCenter.lng]
  ), [currentPosition]);

  return (
    <div className="h-64 w-full rounded-lg overflow-hidden relative border border-gray-300">
      <MapContainer center={mapCenter} zoom={currentPosition.lat ? 16 : 13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={currentPosition} setPosition={handlePositionChange} isViewOnly={isViewOnly} />
      </MapContainer>

      {!isViewOnly && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-[1000] bg-white bg-opacity-80 p-2 rounded-md shadow-lg text-xs text-gray-700 pointer-events-none">
          <p>Haga clic o arrastre el marcador para fijar la dirección.</p>
        </div>
      )}

      {isGeocoding && (
        <div className="absolute bottom-2 left-2 z-[1000] bg-white bg-opacity-80 py-1 px-2 rounded-md shadow-lg text-xs text-gray-800">
          <p>Obteniendo dirección...</p>
        </div>
      )}
    </div>
  );
};

export default MapInput;
