
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Button } from '@/components/ui/button';
import { LocateFixed } from 'lucide-react';

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

// Default center (e.g., center of the community)
const defaultCenter = { lat: 11.4176, lng: -70.2645 };

const LocationMarker = ({ position, setPosition, isViewOnly }) => {
  const markerRef = useRef(null);
  useMapEvents({
    click(e) {
      if (!isViewOnly) {
        setPosition(e.latlng);
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

// This component will handle map view changes
const MapUpdater = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, zoom, {
                animate: true,
                duration: 1.5
            });
        }
    }, [center, zoom, map]);
    return null;
}

const MapInput = ({ value, onChange, isViewOnly = false }) => {
  const [currentPosition, setCurrentPosition] = useState({ lat: null, lng: null });
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const geocodeTimerRef = useRef(null);

  // Set position from parent's value
  useEffect(() => {
    if (value && typeof value.lat === 'number' && typeof value.lng === 'number') {
      setCurrentPosition(value);
    } else {
      setCurrentPosition({ lat: null, lng: null });
    }
  }, [value]);

  // Handle automatic geolocation on component mount
  useEffect(() => {
    if (!isViewOnly && (!value || value.lat === null)) {
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const newPos = { lat: latitude, lng: longitude };
                setCurrentPosition(newPos);
                setIsLocating(false);
            },
            (error) => {
                console.warn(`Geolocation error: ${error.message}. Defaulting to center.`);
                setCurrentPosition(defaultCenter);
                setIsLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    }
  }, [isViewOnly, value]);

  // Fetch address (reverse geocoding) when position changes
  useEffect(() => {
    if (!currentPosition || typeof currentPosition.lat !== 'number') {
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
    }, 500);

    return () => clearTimeout(geocodeTimerRef.current);
  }, [currentPosition.lat, currentPosition.lng, onChange]);

  const mapCenter = useMemo(() => (
    (currentPosition && currentPosition.lat) ? [currentPosition.lat, currentPosition.lng] : [defaultCenter.lat, defaultCenter.lng]
  ), [currentPosition]);

  const handleRecenter = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentPosition({ lat: latitude, lng: longitude });
            setIsLocating(false);
        },
        (error) => {
            console.error("Error recentering:", error);
            setIsLocating(false);
            // Optionally show a toast or alert to the user
        }
    );
  };

  return (
    <div className="h-72 w-full rounded-lg overflow-hidden relative border border-gray-300">
      <MapContainer center={mapCenter} zoom={15} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={currentPosition} setPosition={setCurrentPosition} isViewOnly={isViewOnly} />
        <MapUpdater center={mapCenter} zoom={currentPosition.lat ? 17 : 15} />
      </MapContainer>

      {!isViewOnly && (
        <>
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-[1000] bg-white bg-opacity-80 p-2 rounded-md shadow-lg text-xs text-gray-700 pointer-events-none">
                <p>Haga clic o arrastre el marcador para fijar la dirección.</p>
            </div>
            <Button
                type="button"
                size="icon"
                className="absolute top-2 right-2 z-[1000] btn-primary"
                onClick={handleRecenter}
                disabled={isLocating}
            >
                <LocateFixed className={`w-5 h-5 ${isLocating ? 'animate-pulse' : ''}`} />
            </Button>
        </>
      )}

      {(isGeocoding || isLocating) && (
        <div className="absolute bottom-2 left-2 z-[1000] bg-white bg-opacity-80 py-1 px-2 rounded-md shadow-lg text-xs text-gray-800">
          <p>{isLocating ? 'Obteniendo ubicación actual...' : 'Obteniendo dirección...'}</p>
        </div>
      )}
    </div>
  );
};

export default MapInput;
