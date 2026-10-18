import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Crosshair, MapPin, Search, Loader2 } from 'lucide-react';
import { checkNoahRisk, NoahCheckResponse } from '../services/noah';

interface MapPickerProps {
  initialLat?: number;
  initialLng?: number;
  onLocationSelect: (location: {
    address: string;
    latitude: number;
    longitude: number;
    noahRisk?: NoahCheckResponse;
  }) => void;
}

export const MapPicker: React.FC<MapPickerProps> = ({
  initialLat = 10.3157,
  initialLng = 123.8854,
  onLocationSelect,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>({
    lat: initialLat,
    lng: initialLng,
  });

  // Reverse geocodes coordinates into a readable address via OpenStreetMap Nominatim
  // Also quietly pre-fetches NOAH risk in the background for the results page
  const reverseGeocode = async (lat: number, lng: number) => {
    setLoading(true);
    let resolvedAddress = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en',
            'User-Agent': 'Valyou-Web-App',
          },
        }
      );
      const data = await response.json();
      if (data && data.display_name) {
        resolvedAddress = data.display_name;
      }
    } catch (err) {
      console.warn('Reverse geocoding error:', err);
    } finally {
      setLoading(false);
      // Fetch NOAH risk in background for results
      try {
        const risk = await checkNoahRisk(lat, lng);
        onLocationSelect({
          address: resolvedAddress,
          latitude: lat,
          longitude: lng,
          noahRisk: risk,
        });
      } catch {
        onLocationSelect({
          address: resolvedAddress,
          latitude: lat,
          longitude: lng,
        });
      }
    }
  };

  // Search address by name via Nominatim
  const handleAddressSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim() || !mapInstanceRef.current) return;

    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=1`,
        {
          headers: {
            'Accept-Language': 'en',
            'User-Agent': 'Valyou-Web-App',
          },
        }
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const result = data[0];
        const newLat = parseFloat(result.lat);
        const newLng = parseFloat(result.lon);

        setCurrentCoords({ lat: newLat, lng: newLng });
        mapInstanceRef.current.setView([newLat, newLng], 16);

        if (markerRef.current) {
          markerRef.current.setLatLng([newLat, newLng]);
        }

        try {
          const risk = await checkNoahRisk(newLat, newLng);
          onLocationSelect({
            address: result.display_name,
            latitude: newLat,
            longitude: newLng,
            noahRisk: risk,
          });
        } catch {
          onLocationSelect({
            address: result.display_name,
            latitude: newLat,
            longitude: newLng,
          });
        }
      } else {
        alert('Location not found. Try clicking directly on the map.');
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setSearching(false);
    }
  };

  // Get current browser GPS location
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCurrentCoords({ lat, lng });

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([lat, lng], 17);
        }
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        }
        reverseGeocode(lat, lng);
      },
      (error) => {
        console.warn('Geolocation error:', error);
        alert('Could not retrieve your GPS location. Please drop a pin manually.');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Initialize Leaflet Map (Clean standard map, NO NOAH overlays)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Custom Memphis Map Marker Icon
    const customIcon = L.divIcon({
      className: 'custom-valyou-pin',
      html: `
        <div style="
          width: 38px;
          height: 38px;
          background: #1569ca;
          border: 3px solid white;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 8px 16px rgba(21, 105, 202, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            width: 12px;
            height: 12px;
            background: #ff8401;
            border-radius: 50%;
            transform: rotate(45deg);
          "></div>
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 38],
    });

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 14,
      zoomControl: true,
    });

    // Standard OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    const marker = L.marker([initialLat, initialLng], {
      icon: customIcon,
      draggable: true,
    }).addTo(map);

    markerRef.current = marker;
    mapInstanceRef.current = map;

    // Handle marker drag
    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      setCurrentCoords({ lat: pos.lat, lng: pos.lng });
      reverseGeocode(pos.lat, pos.lng);
    });

    // Handle map click
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      setCurrentCoords({ lat, lng });
      reverseGeocode(lat, lng);
    });

    // Initial silent check
    checkNoahRisk(initialLat, initialLng)
      .then((risk) => {
        onLocationSelect({
          address: 'Banilad, Cebu City, Central Visayas, Philippines',
          latitude: initialLat,
          longitude: initialLng,
          noahRisk: risk,
        });
      })
      .catch(() => {});

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border-2 border-border-light shadow-sm bg-background-main">
      {/* Top Search Overlay */}
      <div className="absolute top-3 left-3 right-3 z-30 max-w-lg">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center bg-white/95 backdrop-blur-md rounded-2xl px-3.5 py-2.5 shadow-md border border-border-light">
            <Search size={16} className="text-text-muted mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search street, barangay, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddressSearch();
                }
              }}
              className="w-full text-xs sm:text-sm text-text-primary placeholder:text-text-muted bg-transparent focus:outline-none"
            />
            {searching && <Loader2 size={16} className="animate-spin text-primary ml-2" />}
          </div>
          <button
            type="button"
            onClick={handleAddressSearch}
            className="px-4 py-2.5 bg-primary text-white text-xs font-bold rounded-2xl shadow-md hover:bg-primary-hover active:scale-95 transition-all shrink-0 cursor-pointer"
          >
            Find
          </button>
        </div>
      </div>

      {/* Floating GPS Action Button */}
      <button
        type="button"
        onClick={handleLocateMe}
        disabled={loading}
        className="absolute bottom-4 right-4 z-30 flex items-center gap-2 px-3.5 py-2.5 bg-white/95 backdrop-blur-md text-primary font-bold text-xs rounded-2xl shadow-lg border border-border-light hover:bg-primary-pastel active:scale-95 transition-all cursor-pointer"
        title="Use My Current GPS Location"
      >
        <Crosshair size={16} className={loading ? 'animate-spin' : ''} />
        <span>Current GPS</span>
      </button>

      {/* Pin Instructions Badge */}
      <div className="absolute bottom-4 left-4 z-30 hidden sm:flex items-center gap-2 px-3.5 py-2 bg-white/90 backdrop-blur-md rounded-2xl border border-border-light text-[11px] font-semibold text-text-secondary shadow-sm">
        <MapPin size={13} className="text-accent-orange" />
        <span>Click map or drag pin to position property</span>
      </div>

      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-[340px] sm:h-[440px] z-10" />
    </div>
  );
};

export default MapPicker;
