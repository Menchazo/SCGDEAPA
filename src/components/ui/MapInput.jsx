
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

const MapUpdater = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        // Only fly to the center if it's a valid position
        if (center && typeof center.lat === 'number') {
            map.flyTo([center.lat, center.lng], zoom, {
                animate: true,
                duration: 1.0
            });
        }
    }, [center, zoom, map]);
    return null;
}

const MapInput = ({ value, onChange, isViewOnly = false }) => {
  const [markerPosition, setMarkerPosition] = useState({ lat: null, lng: null });
  const [viewCenter, setViewCenter] = useState(defaultCenter);
  const [zoom, setZoom] = useState(13);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const geocodeTimerRef = useRef(null);

  useEffect(() => {
    // If there's an existing value (editing mode), use it.
    if (value && typeof value.lat === 'number') {
      setMarkerPosition(value);
      setViewCenter(value);
      setZoom(17);
      return; 
    }

    if (isViewOnly) {
        setViewCenter(defaultCenter);
        setZoom(13);
        return;
    }

    // For new entries, try to geolocate the user.
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            const newPos = { lat: latitude, lng: longitude };
            setMarkerPosition(newPos);
            setViewCenter(newPos);
            setZoom(17);
            setIsLocating(false);
        },
        (error) => {
            console.warn(`Geolocation error: ${error.message}.`);
            // Keep marker null, just center map on default.
            setViewCenter(defaultCenter);
            setZoom(13);
            setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []); // Run only once on mount

  // Fetch address (reverse geocoding) when marker position changes
  useEffect(() => {
    if (!markerPosition || typeof markerPosition.lat !== 'number') {
      return;
    }

    clearTimeout(geocodeTimerRef.current);
    geocodeTimerRef.current = setTimeout(() => {
      setIsGeocoding(true);
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${markerPosition.lat}&lon=${markerPosition.lng}`)
        .then(res => res.json())
        .then(data => {
          const address = data.display_name || 'Ubicación no encontrada.';
          onChange({ lat: markerPosition.lat, lng: markerPosition.lng, address });
        })
        .catch(error => {
          console.error("Geocoding error:", error);
          onChange({ lat: markerPosition.lat, lng: markerPosition.lng, address: 'Error al obtener la dirección.' });
        })
        .finally(() => {
          setIsGeocoding(false);
        });
    }, 500);

    return () => clearTimeout(geocodeTimerRef.current);
  }, [markerPosition, onChange]);

  const handleRecenter = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            const newPos = { lat: latitude, lng: longitude };
            setMarkerPosition(newPos); // Update marker
            setViewCenter(newPos);      // AND update map view
            setZoom(17);
            setIsLocating(false);
        },
        (error) => {
            console.error("Error recentering:", error);
            setIsLocating(false);
        }
    );
  };

  return (
    <div className="h-72 w-full rounded-lg overflow-hidden relative border border-gray-300">
      <MapContainer 
        center={[viewCenter.lat, viewCenter.lng]} 
        zoom={zoom} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
       >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={markerPosition} setPosition={setMarkerPosition} isViewOnly={isViewOnly} />
        <MapUpdater center={viewCenter} zoom={zoom} />
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
          <p>{isLocating ? 'Obteniendo ubicación...' : 'Obteniendo dirección...'}</p>
        </div>
      )}
    </div>
  );
};

export default MapInput;
