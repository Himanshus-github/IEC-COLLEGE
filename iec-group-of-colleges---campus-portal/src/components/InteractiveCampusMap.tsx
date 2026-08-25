import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Navigation, 
  Layers, 
  Info, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Compass, 
  Cpu, 
  Building2, 
  BookOpen, 
  Coffee, 
  FlaskConical, 
  Wrench, 
  Home,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Box,
  Map as MapIcon
} from 'lucide-react';
import { BUILDINGS, ROOMS } from '../data/campusData';
import { Building, Teacher } from '../types';
import { ThreeCampusMap3D } from './ThreeCampusMap3D';

interface InteractiveCampusMapProps {
  onSelectRoom?: (roomId: string) => void;
  preSelectedBuildingId?: string;
  teachers?: Teacher[];
  defaultMapMode?: '3d' | '2d';
}

export const InteractiveCampusMap: React.FC<InteractiveCampusMapProps> = ({
  onSelectRoom,
  preSelectedBuildingId = 'block-e',
  teachers = [],
  defaultMapMode = '3d'
}) => {
  const [mapMode, setMapMode] = useState<'3d' | '2d'>(defaultMapMode);
  const [selectedBuilding, setSelectedBuilding] = useState<Building>(
    BUILDINGS.find(b => b.id === preSelectedBuildingId) || BUILDINGS[0]
  );
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [activeFloor, setActiveFloor] = useState<number>(1);
  const [routeStart, setRouteStart] = useState<string>('block-a');
  const [routeEnd, setRouteEnd] = useState<string>('block-e');
  const [showRoute, setShowRoute] = useState<boolean>(true);

  const buildingRooms = ROOMS.filter(r => r.buildingId === selectedBuilding.id);
  const floorRooms = buildingRooms.filter(r => r.floor === activeFloor);

  const startBuilding = BUILDINGS.find(b => b.id === routeStart);
  const endBuilding = BUILDINGS.find(b => b.id === routeEnd);

  return (
    <motion.div 
      id="interactive-campus-map-section" 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Primary Map Mode Switcher (3D vs 2D) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400">
            {mapMode === '3d' ? <Box className="w-5 h-5" /> : <MapIcon className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-100 tracking-tight flex items-center gap-2">
              <span>IEC Group of Colleges • Campus Visualization</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                {mapMode === '3d' ? '3D WebGL Perspective' : '2D Vector Layout'}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Plot 4, Knowledge Park III, Greater Noida (AKTU Code 090) • 17.5 Acres
            </p>
          </div>
        </div>

        {/* Mode Toggle Button */}
        <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-xl">
          <button
            onClick={() => setMapMode('3d')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mapMode === '3d'
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md shadow-red-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D Interactive Map</span>
          </button>
          <button
            onClick={() => setMapMode('2d')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mapMode === '2d'
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md shadow-red-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>2D Vector Map</span>
          </button>
        </div>
      </div>

      {/* 3D Map Mode View */}
      {mapMode === '3d' && (
        <ThreeCampusMap3D
          selectedBuildingId={selectedBuilding.id}
          onSelectBuilding={(bId) => {
            const found = BUILDINGS.find(b => b.id === bId);
            if (found) setSelectedBuilding(found);
          }}
          teachers={teachers}
        />
      )}

      {/* 2D Vector Map Mode View */}
      {mapMode === '2d' && (
        <div className="space-y-6">
          {/* Map Control Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2.5">
                <MapPin className="w-5 h-5 text-red-500" />
                <span>2D Architectural Vector Layout</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Tap buildings to inspect floors, lecture halls & wayfinding routes
              </p>
            </div>

            {/* Route Finder Controls */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-wrap items-center gap-2 p-2 bg-slate-900/90 border border-slate-800 rounded-2xl backdrop-blur-md shadow-lg"
            >
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <Navigation className="w-4 h-4 text-red-400 animate-pulse" />
                <span className="font-semibold">Wayfinding:</span>
              </div>

              <select
                value={routeStart}
                onChange={(e) => setRouteStart(e.target.value)}
                className="py-1 px-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-red-400 cursor-pointer"
              >
                {BUILDINGS.map(b => (
                  <option key={b.id} value={b.id}>From: {b.code}</option>
                ))}
              </select>

              <span className="text-amber-400 text-xs font-bold">➔</span>

              <select
                value={routeEnd}
                onChange={(e) => setRouteEnd(e.target.value)}
                className="py-1 px-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-red-400 cursor-pointer"
              >
                {BUILDINGS.map(b => (
                  <option key={b.id} value={b.id}>To: {b.code}</option>
                ))}
              </select>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowRoute(!showRoute)}
                className={`py-1 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  showRoute
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {showRoute ? 'Hide Route' : 'Show Route'}
              </motion.button>
            </motion.div>
          </div>

          {/* Main Map Canvas + Side Info Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Vector Map Canvas */}
            <div className="lg:col-span-2 relative bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-4 min-h-[480px] sm:min-h-[540px] flex flex-col justify-between">
              {/* Zoom controls with spring buttons */}
              <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 bg-slate-900/90 border border-slate-800 rounded-xl p-1 shadow-lg backdrop-blur-md">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.6))}
                  className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.8))}
                  className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setZoomLevel(1)}
                  className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Campus Map Legend with animated indicators */}
              <div className="absolute bottom-4 left-4 z-20 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2 text-[11px] text-slate-300 flex flex-wrap items-center gap-3 backdrop-blur-md shadow-md">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <strong className="text-red-400">Block E (AI & Tech Hub)</strong>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  Admin Tower
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  Library & Aud.
                </span>
              </div>

              {/* SVG Map Canvas with Scalable Vector Graphics */}
              <div className="w-full h-full flex items-center justify-center overflow-hidden py-4">
                <svg
                  viewBox="0 0 1000 700"
                  className="w-full h-full transition-transform duration-300 ease-out select-none"
                  style={{ transform: `scale(${zoomLevel})` }}
                >
                  <defs>
                    <pattern id="campusGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1E293B" strokeWidth="0.8" opacity="0.4" />
                    </pattern>
                  </defs>

                  {/* Campus Base Area */}
                  <rect width="1000" height="700" fill="#090D16" />
                  <rect width="1000" height="700" fill="url(#campusGrid)" />

                  {/* Main Ring Road & Walkways */}
                  <path
                    d="M 100 120 L 900 120 L 900 620 L 100 620 Z"
                    fill="none"
                    stroke="#1E293B"
                    strokeWidth="28"
                    strokeLinejoin="round"
                    rx="30"
                  />
                  <path
                    d="M 100 120 L 900 120 L 900 620 L 100 620 Z"
                    fill="none"
                    stroke="#334155"
                    strokeWidth="1.5"
                    strokeDasharray="6 6"
                  />

                  {/* Cross Campus Pathways */}
                  <line x1="100" y1="360" x2="900" y2="360" stroke="#1E293B" strokeWidth="18" />
                  <line x1="500" y1="120" x2="500" y2="620" stroke="#1E293B" strokeWidth="18" />

                  {/* Central Green Campus Lawn */}
                  <rect x="420" y="300" width="160" height="120" rx="20" fill="#064E3B" opacity="0.4" stroke="#059669" strokeWidth="1.5" />
                  <text x="500" y="365" textAnchor="middle" fill="#34D399" fontSize="13" fontWeight="bold">
                    IEC CENTRAL LAWNS
                  </text>

                  {/* Sports Ground & Cricket Arena */}
                  <circle cx="820" cy="480" r="70" fill="#14532D" opacity="0.3" stroke="#22C55E" strokeWidth="1.5" />
                  <text x="820" y="485" textAnchor="middle" fill="#86EFAC" fontSize="11" fontWeight="bold">
                    SPORTS ARENA
                  </text>

                  {/* Campus Main Entrance Gate */}
                  <rect x="60" y="320" width="40" height="80" rx="6" fill="#B91C1C" />
                  <text x="50" y="365" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold" transform="rotate(-90 50 365)">
                    MAIN GATE
                  </text>

                  {/* Buildings Footprints */}
                  {BUILDINGS.map((b) => {
                    const isSelected = selectedBuilding.id === b.id;
                    const bx = b.coordinates.x * 9 + 20;
                    const by = b.coordinates.y * 6 + 40;
                    const bw = b.isBlockE ? 160 : 130;
                    const bh = b.isBlockE ? 110 : 90;

                    return (
                      <g
                        key={b.id}
                        onClick={() => setSelectedBuilding(b)}
                        className="cursor-pointer transition-all duration-300"
                      >
                        {isSelected && (
                          <rect
                            x={bx - 6}
                            y={by - 6}
                            width={bw + 12}
                            height={bh + 12}
                            rx="18"
                            fill="none"
                            stroke={b.colorTheme}
                            strokeWidth="3"
                            className="animate-pulse"
                          />
                        )}

                        <rect
                          x={bx}
                          y={by}
                          width={bw}
                          height={bh}
                          rx="14"
                          fill={isSelected ? '#1E293B' : '#0F172A'}
                          stroke={isSelected ? b.colorTheme : '#334155'}
                          strokeWidth={b.isBlockE ? '2.5' : '1.5'}
                          className="hover:fill-slate-800 transition-colors"
                        />

                        <text
                          x={bx + bw / 2}
                          y={by + 35}
                          textAnchor="middle"
                          fill={b.colorTheme}
                          fontSize="14"
                          fontWeight="900"
                        >
                          {b.code}
                        </text>

                        <text
                          x={bx + bw / 2}
                          y={by + 58}
                          textAnchor="middle"
                          fill="#E2E8F0"
                          fontSize="10"
                          fontWeight="600"
                        >
                          {b.name.split('(')[0].slice(0, 16)}...
                        </text>

                        <text
                          x={bx + bw / 2}
                          y={by + 76}
                          textAnchor="middle"
                          fill="#94A3B8"
                          fontSize="9"
                        >
                          {b.floorsCount} Floors
                        </text>
                      </g>
                    );
                  })}

                  {/* Wayfinding Animated Route Line */}
                  {showRoute && startBuilding && endBuilding && (
                    <g id="wayfinding-route-line">
                      <circle
                        cx={startBuilding.coordinates.x * 9 + 85}
                        cy={startBuilding.coordinates.y * 6 + 85}
                        r="8"
                        fill="#3B82F6"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                      />
                      <circle
                        cx={endBuilding.coordinates.x * 9 + 100}
                        cy={endBuilding.coordinates.y * 6 + 95}
                        r="14"
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth="2"
                        className="animate-ping"
                      />
                      <circle
                        cx={endBuilding.coordinates.x * 9 + 100}
                        cy={endBuilding.coordinates.y * 6 + 95}
                        r="9"
                        fill="#EF4444"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                      />
                      <line
                        x1={startBuilding.coordinates.x * 9 + 85}
                        y1={startBuilding.coordinates.y * 6 + 85}
                        x2={endBuilding.coordinates.x * 9 + 100}
                        y2={endBuilding.coordinates.y * 6 + 95}
                        stroke="#F59E0B"
                        strokeWidth="4.5"
                        strokeLinecap="round"
                        className="animate-dash"
                      />
                    </g>
                  )}
                </svg>
              </div>
            </div>

            {/* Right: Selected Building Dossier & Floor Navigator */}
            <motion.div 
              layout
              className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-5 backdrop-blur-md"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span
                      className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold"
                      style={{ backgroundColor: `${selectedBuilding.colorTheme}20`, color: selectedBuilding.colorTheme }}
                    >
                      {selectedBuilding.code}
                    </span>
                    <h3 className="text-lg font-bold text-slate-100 mt-2">
                      {selectedBuilding.name}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                  {selectedBuilding.fullDescription}
                </p>

                {/* Floor selector */}
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-red-400" />
                      <span>Inspect Floor:</span>
                    </span>
                    <div className="flex gap-1">
                      {Array.from({ length: selectedBuilding.floorsCount }, (_, i) => i + 1).map(fl => (
                        <motion.button
                          key={fl}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setActiveFloor(fl)}
                          className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                            activeFloor === fl
                              ? 'bg-red-600 text-white shadow-md'
                              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          F{fl}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Rooms for this floor */}
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={`${selectedBuilding.id}-fl-${activeFloor}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-2 mt-3 max-h-56 overflow-y-auto pr-1"
                    >
                      {floorRooms.length > 0 ? (
                        floorRooms.map(room => (
                          <motion.div
                            key={room.id}
                            whileHover={{ scale: 1.02, x: 2 }}
                            onClick={() => onSelectRoom && onSelectRoom(room.id)}
                            className="p-3 bg-slate-950 rounded-xl border border-slate-800 hover:border-red-500/40 transition-colors cursor-pointer group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-200 group-hover:text-red-400 transition-colors">
                                {room.roomNumber} • {room.name}
                              </span>
                              <span className="text-[10px] text-emerald-400 font-semibold">
                                {room.capacity} seats
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {room.department}
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center text-xs text-slate-400">
                          Floor {activeFloor} contains faculty staff cabins and tutorial suites.
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Location quick stats */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Admin Office:</span>
                  <strong className="text-slate-200">{selectedBuilding.headOffice}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Security/Helpdesk:</span>
                  <strong className="text-emerald-400">Main Gate 1 & Desk A-001</strong>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
