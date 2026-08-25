import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  Layers, 
  Users, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  ChevronRight, 
  Mail, 
  MapPin, 
  Terminal, 
  Compass, 
  ExternalLink,
  Activity,
  Server,
  Play
} from 'lucide-react';
import { ROOMS, BUILDINGS } from '../data/campusData';

interface BlockESpotlightProps {
  onNavigateToRoom?: (roomId: string) => void;
  onOpenAiDraft?: (context: string) => void;
}

export const BlockESpotlight: React.FC<BlockESpotlightProps> = ({
  onNavigateToRoom,
  onOpenAiDraft,
}) => {
  const [activeFloor, setActiveFloor] = useState<number>(2); // Default to Floor 2 (NVIDIA AI Lab)
  const [isSimulatingJob, setIsSimulatingJob] = useState<boolean>(false);
  const [jobProgress, setJobProgress] = useState<number>(0);
  const [gpuTemp, setGpuTemp] = useState<number>(58);

  const blockEInfo = BUILDINGS.find(b => b.isBlockE) || BUILDINGS[0];
  const blockERooms = ROOMS.filter(r => r.buildingId === 'block-e');
  const floorRooms = blockERooms.filter(r => r.floor === activeFloor);

  // Live GPU telemetry fluctuations
  useEffect(() => {
    const timer = setInterval(() => {
      setGpuTemp(prev => Math.min(74, Math.max(52, prev + (Math.random() * 4 - 2))));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleSimulateGpuJob = () => {
    if (isSimulatingJob) return;
    setIsSimulatingJob(true);
    setJobProgress(0);

    const interval = setInterval(() => {
      setJobProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsSimulatingJob(false), 800);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const floorHighlights: Record<number, { title: string; subtitle: string; icon: any }> = {
    1: { title: 'Ground & 1st Tier: Smart Lecture Theatres & Algorithms Studio', subtitle: 'Interactive 4K smart lecture halls and foundational programming suites.', icon: Terminal },
    2: { title: '2nd Tier: NVIDIA AI & Deep Learning Research Lab', subtitle: 'Flagship NVIDIA DGX A100 station, 40x RTX 4090 rigs, & Dean Directorate.', icon: Cpu },
    3: { title: '3rd Tier: Robotics & Autonomous Drones Arena', subtitle: 'Drone flight test cages, LiDAR sensor benches, & Cyber Security SOC.', icon: Zap },
    4: { title: '4th Tier: Startup Incubation & High-Performance Cloud Pod', subtitle: 'Modular pitch auditorium, accelerator lounge, & AWS/GCP cluster node.', icon: Sparkles }
  };

  return (
    <motion.div 
      id="block-e-spotlight-section" 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Hero Banner with Futuristic Tech Glow & Interactive Live GPU Cluster */}
      <motion.div 
        whileHover={{ borderColor: 'rgba(239, 68, 68, 0.5)' }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-red-950/40 border border-red-500/30 p-6 sm:p-10 shadow-2xl shadow-red-950/20"
      >
        <motion.div 
          animate={{ scale: [1, 1.25, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-red-600/20 rounded-full blur-3xl pointer-events-none" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.18, 0.08] }}
          transition={{ duration: 7, repeat: Infinity, delay: 1 }}
          className="absolute bottom-0 left-1/3 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" 
        />

        <div className="relative z-10 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/15 border border-red-500/40 rounded-full text-red-400 text-xs font-bold uppercase tracking-wider shadow-sm">
              <Cpu className="w-3.5 h-3.5 animate-spin-slow" />
              <span>Flagship Campus Facility</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/15 border border-emerald-500/40 rounded-full text-emerald-400 text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>DGX A100 Core: {gpuTemp.toFixed(1)}°C</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-slate-100 tracking-tight leading-tight">
            Block E: Centre of Excellence in AI & Computing
          </h2>

          <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed max-w-2xl">
            The intellectual and high-tech powerhouse of IEC Group of Colleges. Equipped with NVIDIA GPU compute clusters, autonomous robotics benches, and the incubation cell for student entrepreneurs.
          </p>

          {/* Quick Metrics & Interactive Simulation Button */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
            <motion.div whileHover={{ scale: 1.04 }} className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800 backdrop-blur-sm">
              <div className="text-lg font-black text-red-400">4 Floors</div>
              <div className="text-[11px] text-slate-400">High-Tech Labs</div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800 backdrop-blur-sm">
              <div className="text-lg font-black text-amber-400">NVIDIA DGX</div>
              <div className="text-[11px] text-slate-400">A100 Research Hub</div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800 backdrop-blur-sm">
              <div className="text-lg font-black text-emerald-400">40+ Rigs</div>
              <div className="text-[11px] text-slate-400">RTX 4090 Workstations</div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800 backdrop-blur-sm">
              <div className="text-lg font-black text-purple-400">E-401 Hub</div>
              <div className="text-[11px] text-slate-400">Incubation Cell</div>
            </motion.div>
          </div>

          {/* Interactive Simulation Bar */}
          <div className="mt-5 p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Server className="w-4 h-4 text-amber-400 animate-pulse" />
              <div className="text-xs">
                <span className="text-slate-300 font-bold">TensorFlow / PyTorch Benchmark Pipeline:</span>
                <span className="text-slate-400 ml-1.5">{isSimulatingJob ? `Processing Epochs (${jobProgress}%)` : 'Ready for workload dispatch'}</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              disabled={isSimulatingJob}
              onClick={handleSimulateGpuJob}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                isSimulatingJob
                  ? 'bg-amber-600/30 text-amber-400 border border-amber-500/40'
                  : 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-md'
              }`}
            >
              <Play className={`w-3.5 h-3.5 ${isSimulatingJob ? 'animate-spin' : ''}`} />
              <span>{isSimulatingJob ? 'Simulating Batch...' : 'Test DGX GPU Task'}</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Floor Plan Explorer */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-red-400" />
              <span>Interactive Floor Plan & Lab Directory</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select a floor to view room specifications, equipment inventory, and lab in-charges
            </p>
          </div>

          {/* Floor Switcher Buttons with Motion Layout */}
          <div className="flex p-1 bg-slate-950 rounded-2xl border border-slate-800 shrink-0 gap-1 relative">
            {[1, 2, 3, 4].map((fl) => {
              const isActive = activeFloor === fl;
              return (
                <button
                  key={fl}
                  onClick={() => setActiveFloor(fl)}
                  className={`relative py-1.5 px-4 text-xs font-semibold rounded-xl transition-colors cursor-pointer select-none ${
                    isActive ? 'text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="block-e-floor-pill"
                      className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 rounded-xl shadow-md shadow-red-600/30 -z-10"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span>Floor {fl}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Floor Banner */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={`banner-${activeFloor}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl mb-6 flex items-start gap-3"
          >
            <div className="p-2.5 bg-red-500/10 text-red-400 rounded-xl shrink-0">
              {React.createElement(floorHighlights[activeFloor]?.icon || Layers, { className: 'w-5 h-5' })}
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-200">{floorHighlights[activeFloor]?.title}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{floorHighlights[activeFloor]?.subtitle}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Rooms Grid for Active Floor */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={`rooms-grid-${activeFloor}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {floorRooms.map((room) => (
              <motion.div
                key={room.id}
                whileHover={{ y: -4, borderColor: 'rgba(239, 68, 68, 0.4)' }}
                className="p-5 bg-slate-950/60 border border-slate-800 rounded-2xl transition-all hover:shadow-xl group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="px-2 py-0.5 bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-mono font-bold rounded">
                        Room {room.roomNumber}
                      </span>
                      <h5 className="text-base font-bold text-slate-100 mt-1.5 group-hover:text-red-400 transition-colors">
                        {room.name}
                      </h5>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      room.status === 'available'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {room.status === 'available' ? 'Available' : 'Occupied Session'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-2">
                    Department: <strong className="text-slate-300">{room.department}</strong> • Capacity: <strong>{room.capacity} seats</strong>
                  </p>

                  {/* Equipment Badges */}
                  <div className="mt-3">
                    <div className="text-[11px] font-semibold text-slate-400 mb-1.5">Key Equipment & Features:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {room.equipment.map((eq, i) => (
                        <motion.span
                          key={i}
                          whileHover={{ scale: 1.05 }}
                          className="px-2 py-0.5 bg-slate-900 text-slate-300 border border-slate-800 rounded-md text-[11px] cursor-default"
                        >
                          {eq}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Lab In-Charge & Actions */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="text-xs text-slate-400 flex items-center gap-1.5 truncate max-w-[200px]">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    <span className="truncate">{room.inCharge || 'IEC Department Desk'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {onOpenAiDraft && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onOpenAiDraft(`Access or booking request for ${room.name} (Room ${room.roomNumber})`)}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white text-[11px] font-medium rounded-lg border border-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Mail className="w-3 h-3 text-red-400" />
                        <span>Draft Request</span>
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
