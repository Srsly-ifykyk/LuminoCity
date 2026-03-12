import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline, Tooltip } from "react-leaflet";
import L from "leaflet";
import { SMART_CITIES, SUBSTATIONS, POWER_SOURCES } from "../constants";
import { motion } from "motion/react";
import { Zap, Activity, Moon, Navigation } from "lucide-react";

// Fix for default marker icons in Leaflet with Webpack/Vite
import "leaflet/dist/leaflet.css";

type MapViewType = "transmission" | "distribution" | "night" | "overview";

// Custom Icon for Smart Cities
const createCityIcon = (isSelected: boolean) => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-8 h-8 bg-emerald-500/20 rounded-full animate-ping ${isSelected ? 'opacity-100' : 'opacity-40'}"></div>
        <div class="w-3 h-3 bg-emerald-500 rounded-full border border-white shadow-[0_0_10px_rgba(16,185,129,0.5)] ${isSelected ? 'scale-150' : ''} transition-transform"></div>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

// Custom Icon for Power Sources
const createSourceIcon = (type: "renewable" | "non-renewable") => {
  const color = type === "renewable" ? "#3b82f6" : "#ef4444";
  const glowColor = type === "renewable" ? "rgba(59, 130, 246, 0.8)" : "rgba(239, 68, 68, 0.8)";
  const pulseColor = type === "renewable" ? "rgba(59, 130, 246, 0.2)" : "rgba(239, 68, 68, 0.2)";
  
  return L.divIcon({
    className: "source-marker",
    html: `
      <div class="relative flex items-center justify-center">
        <!-- Outer soft glow -->
        <div class="absolute w-10 h-10 rounded-full animate-pulse-slow" style="background: radial-gradient(circle, ${pulseColor} 0%, transparent 70%)"></div>
        <!-- Inner glow ring -->
        <div class="absolute w-6 h-6 rounded-full animate-ping-slow opacity-20" style="border: 1px solid ${color}"></div>
        <!-- Core dot with glow -->
        <div class="w-2.5 h-2.5 rounded-full border border-white/80 z-10" 
             style="background-color: ${color}; box-shadow: 0 0 12px ${glowColor}, 0 0 4px ${glowColor}"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

// Custom Icon for Substations
const createSubstationIcon = () => {
  return L.divIcon({
    className: "substation-marker",
    html: `
      <div class="w-3 h-3 bg-amber-400 rotate-45 border border-black shadow-[0_0_10px_#fbbf24]"></div>
    `,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
};

// Helper for curved lines (3D-like)
const getCurvePoints = (start: [number, number], end: [number, number]) => {
  const points: [number, number][] = [];
  const segments = 20;
  
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const lat = start[0] + (end[0] - start[0]) * t;
    const lng = start[1] + (end[1] - start[1]) * t;
    
    // Add a subtle vertical offset for a slight curve effect
    const offset = Math.sin(Math.PI * t) * 0.15; // Reduced curvature factor
    points.push([lat + offset, lng]);
  }
  return points;
};

interface IndiaMapProps {
  onCitySelect: (cityName: string) => void;
  selectedCity: string | null;
  cityDemands?: Record<string, { percent: number, mw: number }>; // Demand data
  theme?: "light" | "dark";
  cities?: typeof SMART_CITIES;
  allowedViews?: MapViewType[];
}

function RecenterControl({ center, zoom, isCitySelected }: { center: [number, number], zoom: number, isCitySelected: boolean }) {
  const map = useMap();
  return (
    <div className="absolute bottom-6 right-8 z-[1000]">
      <button
        onClick={(e) => {
          e.stopPropagation();
          map.flyTo(center, zoom, { animate: true, duration: 1.5 });
        }}
        className="flex items-center gap-2 bg-[var(--card-bg)]/90 backdrop-blur-md border border-[var(--border)] p-2 px-4 rounded-xl shadow-xl text-[var(--text-muted)] hover:text-[var(--primary)] transition-all group/recenter"
      >
        <Navigation size={14} className="group-hover/recenter:rotate-45 transition-transform" />
        <span className="text-[10px] font-mono uppercase tracking-widest font-bold">
          {isCitySelected ? "Focus City" : "Recenter"}
        </span>
      </button>
    </div>
  );
}

function MapViewHandler({ center, zoom, onZoomChange }: { center: [number, number], zoom: number, onZoomChange: (z: number) => void }) {
  const map = useMap();
  
  useEffect(() => {
    map.flyTo(center, zoom, { animate: true, duration: 2 });
  }, [center, zoom, map]);

  useEffect(() => {
    const handleZoom = () => onZoomChange(map.getZoom());
    map.on('zoomend', handleZoom);
    return () => { map.off('zoomend', handleZoom); };
  }, [map, onZoomChange]);

  return null;
}

export const IndiaMap: React.FC<IndiaMapProps> = ({ 
  onCitySelect, 
  selectedCity, 
  cityDemands = {}, 
  theme = "light", 
  cities = SMART_CITIES,
  allowedViews = ["overview", "transmission", "distribution", "night"]
}) => {
  const [mapView, setMapView] = useState<MapViewType>(allowedViews[0]);
  const [currentZoom, setCurrentZoom] = useState(5);

  useEffect(() => {
    if (!allowedViews.includes(mapView)) {
      setMapView(allowedViews[0]);
    }
  }, [allowedViews, mapView]);
  
  const isDark = theme === "dark";
  const mapBg = isDark ? "#050505" : "#f8fafc";
  const tileUrl = isDark 
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
  
  const defaultCenter = React.useMemo<[number, number]>(() => [22.5937, 78.9629], []);
  const defaultZoom = 5;

  const getDemandColor = (demand: number) => {
    if (demand > 80) return "#ef4444"; // Red (Peak)
    if (demand > 50) return "#facc15"; // Yellow (Moderate)
    return "#10b981"; // Green (Low)
  };

  const getDemandGlowColor = (demand: number) => {
    if (demand > 80) return "rgba(239, 68, 68, 0.4)"; 
    if (demand > 50) return "rgba(250, 204, 21, 0.4)";
    return "rgba(16, 185, 129, 0.4)";
  };

  const selectedCityData = React.useMemo(() => 
    selectedCity ? SMART_CITIES.find(c => c.name === selectedCity) : null,
    [selectedCity]
  );

  const mapCenter = React.useMemo<[number, number]>(() => 
    selectedCityData 
      ? [selectedCityData.coordinates[1], selectedCityData.coordinates[0]] 
      : defaultCenter,
    [selectedCityData, defaultCenter]
  );
  
  const mapZoom = React.useMemo(() => 
    selectedCityData ? 12 : defaultZoom,
    [selectedCityData]
  );

  return (
    <div className="w-full h-full bg-[var(--card-bg)] rounded-2xl overflow-hidden relative border border-[var(--border)] group z-0">
      {/* Header Info */}
      <div className="absolute top-6 left-8 z-[1000] pointer-events-none">
        <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--primary)] font-bold">
          {mapView === "night" ? "Heat Map" : mapView === "distribution" ? "Distribution Network" : "Transmission Backbone"}
        </h3>
        <p className="text-lg font-display font-bold text-[var(--text)] mt-1">
          {selectedCity ? selectedCity : "National Grid"}
        </p>
      </div>

      {/* View Switcher Dropdown */}
      {allowedViews.length > 1 && (
        <div className="absolute top-6 right-8 z-[1000]">
          <div className="flex items-center gap-1 bg-[var(--card-bg)]/90 backdrop-blur-md border border-[var(--border)] p-1 rounded-xl shadow-xl">
            {allowedViews.map((view) => (
              <button
                key={view}
                onClick={() => setMapView(view)}
                className={`p-2 px-3 rounded-lg transition-all flex items-center gap-2 text-[9px] font-mono uppercase tracking-widest ${
                  mapView === view 
                    ? "bg-[var(--primary)] text-white font-bold shadow-sm" 
                    : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--text)]/5"
                }`}
              >
                {view === "night" && <Moon size={12} />}
                {view === "distribution" && <Zap size={12} />}
                {view === "transmission" && <Activity size={12} />}
                {view === "overview" && <Navigation size={12} />}
                <span className="hidden sm:inline">{view === "night" ? "Heat Map" : view}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <MapContainer 
        center={defaultCenter} 
        zoom={defaultZoom} 
        style={{ height: "100%", width: "100%", background: mapBg }}
        zoomControl={false}
        attributionControl={false}
        zoomAnimation={true}
        fadeAnimation={true}
        markerZoomAnimation={true}
      >
        <TileLayer
          url={tileUrl}
          attribution='&copy; CARTO'
        />

        <MapViewHandler center={mapCenter} zoom={mapZoom} onZoomChange={setCurrentZoom} />
        <RecenterControl center={mapCenter} zoom={mapZoom} isCitySelected={!!selectedCity} />

        {/* Map 1: Night View - City Energy Heat Zones */}
        {mapView === "night" && cities.map(city => {
          const demandData = cityDemands[city.name] || { percent: (40 + (city.name.length * 7) % 50), mw: 0 };
          const demand = demandData.percent;
          const color = getDemandColor(demand);
          
          // Dynamic sizing based on zoom
          const zoomFactor = Math.pow(currentZoom / 5, 1.2);
          const baseSize = 60 * zoomFactor;
          
          return (
            <Marker 
              key={`heat-zone-${city.name}`}
              position={[city.coordinates[1], city.coordinates[0]]}
              icon={L.divIcon({
                className: 'city-heat-zone',
                html: `
                  <div class="relative flex items-center justify-center">
                    <!-- Outer Heat Glow -->
                    <div class="absolute rounded-full animate-pulse" 
                         style="
                           width: ${baseSize}px; 
                           height: ${baseSize}px; 
                           margin-left: -${baseSize/2}px; 
                           margin-top: -${baseSize/2}px; 
                           filter: blur(${baseSize/3}px);
                           background: ${color};
                           opacity: 0.3;
                         "></div>
                    <!-- Core Pulse -->
                    <div class="absolute rounded-full" 
                         style="
                           width: ${baseSize/2}px; 
                           height: ${baseSize/2}px; 
                           margin-left: -${baseSize/4}px; 
                           margin-top: -${baseSize/4}px; 
                           filter: blur(${baseSize/10}px);
                           background: ${color};
                           opacity: 0.6;
                         "></div>
                  </div>
                `,
                iconSize: [0, 0]
              })}
            />
          );
        })}

        {/* Map 2: Distribution View - Neon Road Connections */}
        {(mapView === "distribution") && (selectedCityData ? SUBSTATIONS.filter(s => s.city === selectedCityData.name) : SUBSTATIONS).map(sub => {
          const city = cities.find(c => c.name === sub.city);
          if (!city) return null;
          return (
            <Polyline
              key={`dist-${sub.name}`}
              positions={[
                [sub.coordinates[1], sub.coordinates[0]],
                [city.coordinates[1], city.coordinates[0]]
              ]}
              pathOptions={{
                color: "#fbbf24", // Yellow as requested
                weight: 2,
                opacity: 0.6,
                dashArray: "5, 10",
                className: "neon-path"
              }}
            />
          );
        })}

        {/* Map 3: Transmission View - Curved Source to Substation Connections */}
        {(mapView === "transmission") && POWER_SOURCES.map(source => (
          source.connectedTo.map(subName => {
            const sub = SUBSTATIONS.find(s => s.name === subName);
            if (!sub) return null;
            const lineColor = source.type === "renewable" ? "#3b82f6" : "#ef4444";
            return (
              <React.Fragment key={`trans-group-${source.name}-${subName}`}>
                {/* Glow Layer */}
                <Polyline
                  positions={getCurvePoints(
                    [source.coordinates[1], source.coordinates[0]],
                    [sub.coordinates[1], sub.coordinates[0]]
                  )}
                  pathOptions={{
                    color: lineColor,
                    weight: 4,
                    opacity: 0.05,
                    className: "transmission-glow"
                  }}
                />
                {/* Main Line */}
                <Polyline
                  positions={getCurvePoints(
                    [source.coordinates[1], source.coordinates[0]],
                    [sub.coordinates[1], sub.coordinates[0]]
                  )}
                  pathOptions={{
                    color: lineColor,
                    weight: 1,
                    opacity: 0.3,
                    dashArray: "4, 8",
                    className: "transmission-path"
                  }}
                />
              </React.Fragment>
            );
          })
        ))}

        {/* Markers - Show Smart Cities */}
        {cities.map((city) => {
          const demandData = cityDemands[city.name] || { percent: (40 + (city.name.length * 7) % 50), mw: 0 };
          const demand = demandData.percent;
          const isSelected = selectedCity === city.name;
          const color = isSelected ? "#10b981" : getDemandColor(demand);
          
          // Dynamic sizing for standard markers
          const zoomFactor = Math.max(0.5, currentZoom / 5);
          const pingSize = (isSelected ? 48 : 32) * zoomFactor;
          const dotSize = (isSelected ? 14 : 10) * zoomFactor; // Smaller dots when zoomed out
          const shadowSize = currentZoom > 10 ? (isSelected ? 25 : 15) * zoomFactor : 0; // Only glow when significantly zoomed in
          const pingOpacity = currentZoom > 10 ? (isSelected ? 'opacity-100' : 'opacity-40') : 'opacity-0';
          
          return (
            <Marker
              key={city.name}
              position={[city.coordinates[1], city.coordinates[0]]}
              icon={L.divIcon({
                className: "custom-marker",
                html: `
                  <div class="relative flex items-center justify-center">
                    <div class="absolute rounded-full animate-ping ${pingOpacity}" 
                         style="
                           width: ${pingSize}px; 
                           height: ${pingSize}px; 
                           background-color: ${color}44
                         "></div>
                    <div class="rounded-full border border-white/50 transition-transform ${isSelected ? 'scale-125' : ''}" 
                         style="
                           width: ${dotSize}px; 
                           height: ${dotSize}px; 
                           background-color: ${color}; 
                           box-shadow: 0 0 ${shadowSize}px ${color}
                         "></div>
                  </div>
                `,
                iconSize: [pingSize, pingSize],
                iconAnchor: [pingSize/2, pingSize/2],
              })}
              eventHandlers={{
                click: () => onCitySelect(city.name),
              }}
            >
              <Popup className="custom-popup">
                <div className="bg-[var(--card-bg)] text-[var(--text)] p-4 border border-[var(--border)] rounded-xl font-sans text-xs min-w-[200px] shadow-2xl">
                  <p className="font-bold uppercase mb-3 border-b border-[var(--border)] pb-2 flex items-center justify-between" style={{ color }}>
                    <span>{city.name} Node</span>
                    <Activity size={14} />
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase font-mono">Status</span>
                      <span className="font-bold" style={{ color }}>{demand > 80 ? 'CRITICAL' : demand > 50 ? 'WARNING' : 'OPTIMIZED'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase font-mono">Grid Load</span>
                      <span className="font-bold">{demandData.mw > 0 ? `${demandData.mw.toFixed(1)} MW` : `${demand.toFixed(1)}%`}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase font-mono">Substations</span>
                      <span className="font-bold">{city.substations.length}</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Show Sources and Substations in all views */}
        {true && (
          <>
            {POWER_SOURCES.filter(source => {
              if (mapView === "night") return false; // Hide sources in heat map view
              if (mapView === "overview" || mapView === "transmission") return true;
              if (mapView === "distribution") return false; // Hide sources in distribution view
              if (!selectedCityData) return true;
              // If city selected, show only sources connected to this city's substations
              return source.connectedTo.some(subName => 
                selectedCityData.substations.includes(subName)
              );
            }).map(source => (
              <Marker
                key={`source-${source.name}`}
                position={[source.coordinates[1], source.coordinates[0]]}
                icon={createSourceIcon(source.type as any)}
              >
                <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                  <div className="bg-[var(--card-bg)] text-[var(--text)] p-2 px-3 border border-[var(--border)] rounded-lg font-mono text-[9px] shadow-lg">
                    <p className={`font-bold ${source.type === "renewable" ? "text-emerald-500" : "text-red-400"}`}>
                      {source.name}
                    </p>
                    <p className="text-[8px] opacity-50 uppercase mt-0.5">{source.type} SOURCE</p>
                  </div>
                </Tooltip>
                <Popup className="custom-popup">
                  <div className="bg-[var(--card-bg)] text-[var(--text)] p-2 border border-[var(--glass-border)] rounded-lg font-mono text-[9px]">
                    <p className={source.type === "renewable" ? "text-emerald-400" : "text-red-400"}>
                      {source.name}
                    </p>
                    <p className="opacity-50 uppercase mt-1">{source.type} SOURCE</p>
                  </div>
                </Popup>
              </Marker>
            ))}
            {SUBSTATIONS.filter(sub => {
              if (mapView === "night") return false; // Hide substations in heat map view
              if (mapView === "overview" || mapView === "transmission" || mapView === "distribution") return true;
              if (!selectedCityData) return true;
              return sub.city === selectedCityData.name || selectedCityData.substations.includes(sub.name);
            }).map(sub => (
              <Marker
                key={`sub-${sub.name}`}
                position={[sub.coordinates[1], sub.coordinates[0]]}
                icon={createSubstationIcon()}
              >
                <Tooltip direction="top" offset={[0, -5]} opacity={1}>
                  <div className="bg-[#0a0a0a] text-white p-2 border border-amber-400/20 rounded-lg font-mono text-[9px] shadow-2xl">
                    <p className="text-amber-400">{sub.name}</p>
                    <p className="opacity-50 uppercase mt-1">Substation</p>
                  </div>
                </Tooltip>
                <Popup className="custom-popup">
                  <div className="bg-[#0a0a0a] text-white p-2 border border-amber-400/20 rounded-lg font-mono text-[9px]">
                    <p className="text-amber-400">{sub.name} Substation</p>
                    <p className="opacity-50 uppercase mt-1">Grid Hub: {sub.city}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </>
        )}
      </MapContainer>

      <style dangerouslySetInnerHTML={{ __html: `
        .leaflet-container {
          background: ${mapBg} !important;
        }
        .leaflet-popup-content-wrapper {
          background: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .leaflet-popup-tip {
          background: var(--card-bg) !important;
          border: 1px solid var(--glass-border) !important;
        }
        .custom-popup .leaflet-popup-content {
          margin: 0 !important;
          width: auto !important;
        }
        .leaflet-tooltip {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .leaflet-tooltip-top:before {
          border-top-color: var(--card-bg) !important;
        }
        .neon-path {
          filter: drop-shadow(0 0 5px #10b981);
          animation: flow 4s linear infinite;
        }
        .transmission-path {
          filter: drop-shadow(0 0 3px currentColor);
          animation: transmissionFlow 6s linear infinite;
        }
        .transmission-glow {
          filter: blur(4px);
        }
        @keyframes flow {
          from { stroke-dashoffset: 20; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes transmissionFlow {
          from { stroke-dashoffset: 12; }
          to { stroke-dashoffset: 0; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(2); }
        }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.8; }
          70%, 100% { transform: scale(3); opacity: 0; }
        }
        .curved-path {
          filter: drop-shadow(0 0 2px rgba(255,255,255,0.1));
        }
        .animate-flicker {
          animation: flicker 3s linear infinite;
        }
        @keyframes flicker {
          0%, 100% { opacity: 1; transform: scale(1); }
          33% { opacity: 0.7; transform: scale(0.9); }
          66% { opacity: 0.9; transform: scale(1.1); }
        }
      `}} />
    </div>
  );
};
