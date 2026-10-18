import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Layers, MapPin, Waves, Mountain, Wind, ShieldAlert, Check, Sparkles } from 'lucide-react';
import { NOAH_LAYERS, NoahLayerType } from '../services/noah';

interface NoahMapProps {
  latitude: number;
  longitude: number;
  title?: string;
  initialLayer?: NoahLayerType;
  heightClass?: string;
  showLayerControls?: boolean;
}

export const NoahMap: React.FC<NoahMapProps> = ({
  latitude,
  longitude,
  title = 'Property Location',
  initialLayer = 'flood',
  heightClass = 'h-[320px] sm:h-[400px]',
  showLayerControls = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const noahTileLayersRef = useRef<L.TileLayer[]>([]);
  const [activeLayer, setActiveLayer] = useState<NoahLayerType>(initialLayer);

  // Clear all attached NOAH tile layers
  const clearNoahTileLayers = () => {
    if (!mapInstanceRef.current) return;
    noahTileLayersRef.current.forEach((layer) => {
      mapInstanceRef.current?.removeLayer(layer);
    });
    noahTileLayersRef.current = [];
  };

  // Add a specific NOAH tile layer
  const addTileLayer = (url: string, opacity: number = 0.65) => {
    if (!mapInstanceRef.current || !url) return;
    const layer = L.tileLayer(url, {
      opacity,
      maxNativeZoom: 12,
      maxZoom: 19,
      attribution: '&copy; DOST-Project NOAH',
    });
    layer.addTo(mapInstanceRef.current);
    noahTileLayersRef.current.push(layer);
  };

  // Switch NOAH Overlay Layer (supports single layers or all simultaneously)
  const toggleNoahLayer = (layerId: NoahLayerType) => {
    if (!mapInstanceRef.current) return;

    const nextLayer: NoahLayerType = activeLayer === layerId ? 'none' : layerId;
    setActiveLayer(nextLayer);

    clearNoahTileLayers();

    if (nextLayer === 'flood') {
      addTileLayer(NOAH_LAYERS.flood.tileUrl, 0.65);
    } else if (nextLayer === 'landslide') {
      addTileLayer(NOAH_LAYERS.landslide.tileUrl, 0.65);
    } else if (nextLayer === 'storm_surge') {
      addTileLayer(NOAH_LAYERS.storm_surge.tileUrl, 0.65);
    } else if (nextLayer === 'all') {
      // 5th Option: Render all 3 hazard overlays at the same time
      addTileLayer(NOAH_LAYERS.flood.tileUrl, 0.55);
      addTileLayer(NOAH_LAYERS.landslide.tileUrl, 0.55);
      addTileLayer(NOAH_LAYERS.storm_surge.tileUrl, 0.55);
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Custom Memphis Pin
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
      center: [latitude, longitude],
      zoom: 14,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    // Standard OSM base layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add property marker
    const marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);
    marker.bindPopup(`<strong style="font-size:12px;">${title}</strong><br/><span style="font-size:11px; color:#6b7d8f;">Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}</span>`);

    mapInstanceRef.current = map;

    // Attach initial layer
    if (initialLayer === 'all') {
      addTileLayer(NOAH_LAYERS.flood.tileUrl, 0.55);
      addTileLayer(NOAH_LAYERS.landslide.tileUrl, 0.55);
      addTileLayer(NOAH_LAYERS.storm_surge.tileUrl, 0.55);
    } else if (initialLayer !== 'none') {
      addTileLayer(NOAH_LAYERS[initialLayer].tileUrl, 0.65);
    }

    return () => {
      map.remove();
    };
  }, [latitude, longitude]);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border-2 border-border-light shadow-sm bg-background-main">
      
      {/* Top Floating Overlay Controls */}
      {showLayerControls && (
        <div className="absolute top-3 left-3 right-3 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          
          {/* 5-Option Layer Selection Chips */}
          <div className="flex items-center gap-1.5 p-1 bg-white/95 backdrop-blur-md rounded-2xl shadow-md border border-border-light overflow-x-auto pointer-events-auto">
            {/* 1. Base */}
            <button
              type="button"
              onClick={() => toggleNoahLayer('none')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                activeLayer === 'none'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-text-secondary hover:text-text-primary hover:bg-background-main'
              }`}
            >
              <span>Base</span>
            </button>

            {/* 2. Flood */}
            <button
              type="button"
              onClick={() => toggleNoahLayer('flood')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                activeLayer === 'flood'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-text-secondary hover:text-primary hover:bg-primary-pastel/40'
              }`}
              title="DOST-NOAH 5-Year Flood Hazard Simulation"
            >
              <span>🌊 Flood (5yr)</span>
            </button>

            {/* 3. Landslide */}
            <button
              type="button"
              onClick={() => toggleNoahLayer('landslide')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                activeLayer === 'landslide'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-text-secondary hover:text-amber-600 hover:bg-amber-50'
              }`}
              title="MGB-NOAH Rain-Induced Landslide Susceptibility"
            >
              <span>⛰️ Landslide</span>
            </button>

            {/* 4. Storm Surge */}
            <button
              type="button"
              onClick={() => toggleNoahLayer('storm_surge')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                activeLayer === 'storm_surge'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'text-text-secondary hover:text-cyan-600 hover:bg-cyan-50'
              }`}
              title="PAGASA-NOAH Storm Surge Advisory Inundation Buffer"
            >
              <span>🌀 Storm Surge</span>
            </button>

            {/* 5. All Overlays At The Same Time */}
            <button
              type="button"
              onClick={() => toggleNoahLayer('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeLayer === 'all'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md ring-2 ring-purple-300'
                  : 'text-purple-700 bg-purple-50 hover:bg-purple-100 hover:text-purple-900 border border-purple-200'
              }`}
              title="Show Flood, Landslide, and Storm Surge Overlays Simultaneously"
            >
              <span>⚡ All Overlays</span>
              {activeLayer === 'all' && <Check size={13} className="stroke-[3]" />}
            </button>
          </div>

          {/* Active Legend */}
          {activeLayer !== 'none' && (
            <div className="bg-white/95 backdrop-blur-md rounded-2xl px-3.5 py-2 shadow-md border border-border-light text-[11px] pointer-events-auto flex items-center gap-3">
              <span className="font-bold text-text-primary flex items-center gap-1.5">
                <Layers size={13} className={activeLayer === 'all' ? 'text-purple-600' : 'text-primary'} />
                <span>
                  {activeLayer === 'all' ? 'Combined Hazard Overlays' : `${NOAH_LAYERS[activeLayer].shortName} Risk`}
                </span>
              </span>
              <div className="flex items-center gap-2.5 text-[10px] text-text-secondary font-medium">
                {activeLayer === 'all' ? (
                  <>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block shadow-xs" /> Flood
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block shadow-xs" /> Landslide
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block shadow-xs" /> Surge
                    </span>
                  </>
                ) : (
                  <>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> High
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Moderate
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" /> Low
                    </span>
                  </>
                )}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Map Canvas */}
      <div ref={mapContainerRef} className={`w-full ${heightClass} z-10`} />
    </div>
  );
};

export default NoahMap;
