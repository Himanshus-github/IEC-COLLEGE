import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Cpu, 
  MapPin, 
  Search, 
  ShieldCheck, 
  Bell, 
  GraduationCap, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  Zap,
  BookOpen,
  Users,
  Compass,
  Activity
} from 'lucide-react';
import { User, Notice, LostFoundItem } from '../types';
import { NavTabId } from './MeniscusNav';

interface OverviewHeroProps {
  user: User | null;
  notices: Notice[];
  lostFoundItems: LostFoundItem[];
  onNavigateTab: (tab: NavTabId) => void;
  onOpenOtpDemo: () => void;
  onOpenAiAssistant: () => void;
  onOpenAuth: () => void;
}

export const OverviewHero: React.FC<OverviewHeroProps> = ({
  user,
  notices,
  lostFoundItems,
  onNavigateTab,
  onOpenOtpDemo,
  onOpenAiAssistant,
  onOpenAuth
}) => {
  const urgentNotice = notices.find(n => n.priority === 'urgent') || notices[0];
  const lostCount = lostFoundItems.filter(i => i.type === 'lost').length;
  const foundCount = lostFoundItems.filter(i => i.type === 'found').length;

  // Interactive Live Metrics
  const [animatedGpuUsage, setAnimatedGpuUsage] = useState(78);
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedGpuUsage(prev => Math.min(96, Math.max(62, prev + (Math.random() * 8 - 4))));
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      id="overview-hero-container" 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="space-y-8"
    >
      {/* Campus Hero Showcase Banner with Animated Glow & Floating Elements */}
      <motion.div 
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-10 shadow-2xl"
        whileHover={{ borderColor: 'rgba(239, 68, 68, 0.35)' }}
        transition={{ duration: 0.3 }}
      >
        {/* Animated Glow Gradients & Ambient Floating Orbs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
            x: [0, 15, 0],
            y: [0, -10, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-24 -right-24 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
            x: [0, -20, 0],
            y: [0, 15, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" 
        />

        <div className="relative z-10 max-w-4xl space-y-6">
          {/* Badge & AKTU Affiliation with Staggered Fade */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-wrap items-center gap-2"
          >
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-red-500/15 border border-red-500/35 rounded-full text-red-400 text-xs font-bold uppercase tracking-wider shadow-sm">
              <motion.span 
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="inline-block"
              >
                <GraduationCap className="w-4 h-4" />
              </motion.span>
              <span>AKTU Code 090 • Est. 1981</span>
            </span>

            <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-800/80 border border-slate-700/80 rounded-full text-slate-300 text-xs font-medium backdrop-blur-md">
              <MapPin className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              <span>Plot 4, Knowledge Park III, Greater Noida</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>DGX A100 Cluster Active ({Math.round(animatedGpuUsage)}%)</span>
            </span>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-3xl sm:text-5xl font-black text-slate-100 tracking-tight leading-tight">
              IEC Group of Colleges
              <span className="block text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-400 via-amber-300 to-slate-200 bg-clip-text text-transparent mt-2">
                Campus Operations & Student Intelligence Platform
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed max-w-2xl">
              Experience the integrated digital campus: inspect the <strong>Block E Centre of Excellence in AI</strong>, locate possessions in <strong>Lost & Found</strong>, track circulars, and interact with the <strong>Grounded Campus AI Assistant</strong>.
            </p>
          </motion.div>

          {/* Key Quick Action Buttons with Spring Hover Physics */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap gap-3 pt-2"
          >
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onNavigateTab('block-e')}
              className="py-3 px-5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-bold rounded-2xl shadow-xl shadow-red-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Cpu className="w-4 h-4 animate-spin-slow" />
              <span>Explore Block E AI Centre</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={onOpenAiAssistant}
              className="py-3 px-5 bg-slate-800/90 hover:bg-slate-750 text-slate-200 hover:text-white text-xs font-bold rounded-2xl border border-slate-700 shadow-md transition-all flex items-center gap-2 cursor-pointer backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Ask Campus AI</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={onOpenOtpDemo}
              className="py-3 px-5 bg-slate-900/90 hover:bg-slate-850 text-slate-300 hover:text-white text-xs font-semibold rounded-2xl border border-slate-800 transition-all flex items-center gap-2 cursor-pointer backdrop-blur-md"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Interactive OTP V3</span>
            </motion.button>
          </motion.div>
        </div>

        {/* Live Interactive Quick Metrics Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800/60 backdrop-blur-sm"
          >
            <div className="text-xl font-black text-slate-100">7</div>
            <div className="text-[11px] text-slate-400 font-medium">Academic Blocks</div>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800/60 backdrop-blur-sm"
          >
            <div className="text-xl font-black text-amber-400">17.5</div>
            <div className="text-[11px] text-slate-400 font-medium">Acres Green Campus</div>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800/60 backdrop-blur-sm"
          >
            <div className="text-xl font-black text-red-400">{lostCount + foundCount}</div>
            <div className="text-[11px] text-slate-400 font-medium">Lost & Found Active</div>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800/60 backdrop-blur-sm"
          >
            <div className="text-xl font-black text-emerald-400">{notices.length}</div>
            <div className="text-[11px] text-slate-400 font-medium">Official Circulars</div>
          </motion.div>
        </div>
      </motion.div>

      {/* Urgent Notice Alert Banner with Pulse Glow */}
      {urgentNotice && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.01, borderColor: 'rgba(239, 68, 68, 0.7)' }}
          transition={{ duration: 0.2 }}
          onClick={() => onNavigateTab('notices')}
          className="p-4 bg-gradient-to-r from-red-950/70 via-slate-900 to-slate-900 border border-red-500/40 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-all shadow-lg group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-3 relative z-10">
            <motion.div 
              animate={{ rotate: [-6, 6, -6] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="p-2.5 bg-red-600/20 text-red-400 rounded-xl shrink-0"
            >
              <Bell className="w-5 h-5" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-black uppercase rounded shadow-sm">
                  {urgentNotice.priority}
                </span>
                <span className="text-xs text-slate-400 font-medium">{urgentNotice.department}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-100 mt-0.5 group-hover:text-red-400 transition-colors">
                {urgentNotice.title}
              </h4>
            </div>
          </div>

          <span className="text-xs font-semibold text-red-400 flex items-center gap-1 shrink-0 self-end sm:self-center relative z-10">
            <span>Read Circular</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </motion.div>
      )}

      {/* 4 Feature Bento Pillars with Interactive Staggered Spring Animation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pillar 1: Block E AI Hub */}
        <motion.div
          whileHover={{ y: -6, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          onClick={() => onNavigateTab('block-e')}
          className="p-6 bg-slate-900/90 border border-slate-800 hover:border-red-500/40 rounded-3xl transition-all cursor-pointer hover:shadow-2xl hover:shadow-red-950/40 group flex flex-col justify-between relative overflow-hidden"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4 group-hover:scale-110 group-hover:bg-red-500/20 transition-all">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-100 group-hover:text-red-400 transition-colors">
              Block E AI Hub
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Explore 4 floors of laboratories, NVIDIA DGX A100 stations, Robotics arena, and incubation pod.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-red-400 font-semibold">
            <span>Inspect Blueprint</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
          </div>
        </motion.div>

        {/* Pillar 2: Lost & Found */}
        <motion.div
          whileHover={{ y: -6, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          onClick={() => onNavigateTab('lost-found')}
          className="p-6 bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-3xl transition-all cursor-pointer hover:shadow-2xl hover:shadow-amber-950/40 group flex flex-col justify-between relative overflow-hidden"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
              Lost & Found Hub
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              {lostCount} items reported lost. Real-time correlation engine matches found items with ownership proofs.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-amber-400 font-semibold">
            <span>Report or Claim</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
          </div>
        </motion.div>

        {/* Pillar 3: Interactive Vector Map */}
        <motion.div
          whileHover={{ y: -6, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          onClick={() => onNavigateTab('map')}
          className="p-6 bg-slate-900/90 border border-slate-800 hover:border-blue-500/40 rounded-3xl transition-all cursor-pointer hover:shadow-2xl hover:shadow-blue-950/40 group flex flex-col justify-between relative overflow-hidden"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
              Interactive Map
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              17.5-acre vector wayfinding, building coordinates, lawns, sports arena, and cross-campus routing.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-blue-400 font-semibold">
            <span>Open Vector Map</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
          </div>
        </motion.div>

        {/* Pillar 4: Campus AI Assistant */}
        <motion.div
          whileHover={{ y: -6, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          onClick={onOpenAiAssistant}
          className="p-6 bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 rounded-3xl transition-all cursor-pointer hover:shadow-2xl hover:shadow-purple-950/40 group flex flex-col justify-between relative overflow-hidden"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-100 group-hover:text-purple-400 transition-colors">
              Dual-Mode AI
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Server-side Gemini 3.7: Switch between verified campus directory facts and advanced STEM algorithms.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-purple-400 font-semibold">
            <span>Launch Campus AI</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
