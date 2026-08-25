import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  MapPin, 
  Layers, 
  Bell, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  X,
  Compass,
  Cpu,
  BookOpen
} from 'lucide-react';
import { BUILDINGS, ROOMS } from '../data/campusData';
import { LostFoundItem, Notice } from '../types';
import { NavTabId } from './MeniscusNav';
import { PlusCircle } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: NavTabId) => void;
  onSelectBuilding?: (buildingId: string) => void;
  onOpenOtpDemo: () => void;
  onOpenDiagnostics: () => void;
  onOpenAiAssistant: () => void;
  onOpenAddInfo?: () => void;
  lostFoundItems: LostFoundItem[];
  notices: Notice[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onSelectBuilding,
  onOpenOtpDemo,
  onOpenDiagnostics,
  onOpenAiAssistant,
  onOpenAddInfo,
  lostFoundItems,
  notices
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key || '').toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const q = (query || '').toLowerCase().trim();

  // Matched rooms
  const matchedRooms = ROOMS.filter(r => 
    ((r.name || (r as any).room_name || '')).toLowerCase().includes(q) ||
    ((r.roomNumber || '')).toLowerCase().includes(q) ||
    ((r.department || '')).toLowerCase().includes(q)
  ).slice(0, 3);

  // Matched buildings
  const matchedBuildings = BUILDINGS.filter(b =>
    ((b.name || '')).toLowerCase().includes(q) ||
    ((b.code || '')).toLowerCase().includes(q) ||
    (((b as any).shortDescription || b.description || '')).toLowerCase().includes(q)
  ).slice(0, 3);

  // Matched notices
  const matchedNotices = (notices || []).filter(n =>
    ((n.title || '')).toLowerCase().includes(q) ||
    ((n.content || '')).toLowerCase().includes(q)
  ).slice(0, 2);

  // Matched lost items
  const matchedItems = (lostFoundItems || []).filter(i =>
    ((i.title || '')).toLowerCase().includes(q) ||
    ((i.description || '')).toLowerCase().includes(q)
  ).slice(0, 2);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id="command-palette-backdrop"
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-slate-950/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            id="command-palette-container"
            initial={{ opacity: 0, scale: 0.94, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center gap-3 bg-slate-950/40">
              <Search className="w-5 h-5 text-red-500 shrink-0 animate-pulse" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a room (E-204), facility, notice, or command..."
                className="w-full bg-transparent text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none"
              />
              <kbd className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-[10px] font-mono font-bold text-slate-400 rounded-lg shadow-sm">
                ESC
              </kbd>
            </div>

            {/* Results List */}
            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
              {/* Quick Action Commands */}
              {!query && (
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">
                    Quick Shortcuts
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {onOpenAddInfo && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          onOpenAddInfo();
                          onClose();
                        }}
                        className="p-3 bg-red-950/40 hover:bg-red-900/50 border border-red-500/40 rounded-2xl text-left flex items-center justify-between group transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <PlusCircle className="w-4 h-4 text-red-400 animate-pulse" />
                          <div>
                            <div className="text-xs font-bold text-red-200">+ Add Campus Data</div>
                            <div className="text-[10px] text-red-300/80">Insert rooms, labs, items, claims</div>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-red-400 group-hover:translate-x-0.5 transition-transform" />
                      </motion.button>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onNavigateTab('teachers');
                        onClose();
                      }}
                      className="p-3 bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 rounded-2xl text-left flex items-center justify-between group transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <BookOpen className="w-4 h-4 text-emerald-400" />
                        <div>
                          <div className="text-xs font-bold text-slate-200">Faculty & Teachers Roster</div>
                          <div className="text-[10px] text-slate-400">View & Manage Teacher Subjects</div>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-red-400 transition-colors" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onNavigateTab('map');
                        onClose();
                      }}
                      className="p-3 bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 rounded-2xl text-left flex items-center justify-between group transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <MapPin className="w-4 h-4 text-red-400" />
                        <div>
                          <div className="text-xs font-bold text-slate-200">3D Interactive Campus Map</div>
                          <div className="text-[10px] text-slate-400">17.5-Acre WebGL 3D Model & Slicing</div>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-red-400 transition-colors" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onOpenAiAssistant();
                        onClose();
                      }}
                      className="p-3 bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 rounded-2xl text-left flex items-center justify-between group transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <div>
                          <div className="text-xs font-bold text-slate-200">Campus AI Assistant</div>
                          <div className="text-[10px] text-slate-400">Ask campus regulations & STEM</div>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-red-400 transition-colors" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onOpenOtpDemo();
                        onClose();
                      }}
                      className="p-3 bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 rounded-2xl text-left flex items-center justify-between group transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <div>
                          <div className="text-xs font-bold text-slate-200">OTP V3 Interactive Demo</div>
                          <div className="text-[10px] text-slate-400">Auto-fill physics & validation</div>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-red-400 transition-colors" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onOpenDiagnostics();
                        onClose();
                      }}
                      className="p-3 bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 rounded-2xl text-left flex items-center justify-between group transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Sparkles className="w-4 h-4 text-blue-400" />
                        <div>
                          <div className="text-xs font-bold text-slate-200">Phase 1-19 Diagnostics</div>
                          <div className="text-[10px] text-slate-400">System verification runner</div>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-red-400 transition-colors" />
                    </motion.button>
                  </div>
                </div>
              )}

              {/* Rooms Results */}
              {matchedRooms.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">
                    Rooms & Laboratories
                  </div>
                  <div className="space-y-1.5">
                    {matchedRooms.map(room => (
                      <motion.div
                        key={room.id}
                        whileHover={{ scale: 1.01, x: 2 }}
                        onClick={() => {
                          onNavigateTab('directory');
                          onClose();
                        }}
                        className="p-3 bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800/80 rounded-2xl cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-0.5 bg-red-500/10 text-red-400 font-mono font-bold text-xs rounded">
                            {room.roomNumber}
                          </span>
                          <div>
                            <div className="text-xs font-bold text-slate-200">{room.name}</div>
                            <div className="text-[10px] text-slate-400">{room.buildingName} • Floor {room.floor}</div>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Buildings Results */}
              {matchedBuildings.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">
                    Campus Buildings
                  </div>
                  <div className="space-y-1.5">
                    {matchedBuildings.map(b => (
                      <motion.div
                        key={b.id}
                        whileHover={{ scale: 1.01, x: 2 }}
                        onClick={() => {
                          if (b.isBlockE) onNavigateTab('block-e');
                          else {
                            if (onSelectBuilding) onSelectBuilding(b.id);
                            onNavigateTab('map');
                          }
                          onClose();
                        }}
                        className="p-3 bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800/80 rounded-2xl cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-xs text-slate-200">
                            {b.code}
                          </span>
                          <div>
                            <div className="text-xs font-bold text-slate-200">{b.name}</div>
                            <div className="text-[10px] text-slate-400">{b.shortDescription}</div>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notices Results */}
              {matchedNotices.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">
                    Academic Circulars
                  </div>
                  <div className="space-y-1.5">
                    {matchedNotices.map(n => (
                      <motion.div
                        key={n.id}
                        whileHover={{ scale: 1.01, x: 2 }}
                        onClick={() => {
                          onNavigateTab('notices');
                          onClose();
                        }}
                        className="p-3 bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800/80 rounded-2xl cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-200">{n.title}</div>
                          <div className="text-[10px] text-slate-400">{n.department} • {n.publishDate}</div>
                        </div>
                        <span className="text-[10px] text-red-400 font-bold uppercase">{n.priority}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Lost & Found Results */}
              {matchedItems.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">
                    Lost & Found Registry
                  </div>
                  <div className="space-y-1.5">
                    {matchedItems.map(item => (
                      <motion.div
                        key={item.id}
                        whileHover={{ scale: 1.01, x: 2 }}
                        onClick={() => {
                          onNavigateTab('lost-found');
                          onClose();
                        }}
                        className="p-3 bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800/80 rounded-2xl cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-200">{item.title}</div>
                          <div className="text-[10px] text-slate-400">{item.location.buildingName} • {item.nearestLandmark}</div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          item.type === 'lost' ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500 text-slate-950'
                        }`}>
                          {item.type}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
