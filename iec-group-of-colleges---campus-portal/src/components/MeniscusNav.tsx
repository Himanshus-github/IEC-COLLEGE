import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Home, 
  Compass, 
  MapPin, 
  Search, 
  Bell, 
  ShieldAlert, 
  Sparkles, 
  Layers,
  GraduationCap
} from 'lucide-react';

export type NavTabId = 'home' | 'directory' | 'teachers' | 'block-e' | 'map' | 'lost-found' | 'claims' | 'notices' | 'admin' | 'ai-assistant';

interface MeniscusNavProps {
  activeTab: NavTabId;
  onTabChange: (tab: NavTabId) => void;
  isAdmin?: boolean;
  claimsCount?: number;
  noticesCount?: number;
  teachersCount?: number;
}

interface TabItem {
  id: NavTabId;
  label: string;
  icon: React.FC<{ className?: string }>;
  badge?: number;
  adminOnly?: boolean;
}

export const MeniscusNav: React.FC<MeniscusNavProps> = ({
  activeTab,
  onTabChange,
  isAdmin = false,
  claimsCount = 0,
  noticesCount = 0,
  teachersCount = 0,
}) => {
  const tabs: TabItem[] = [
    { id: 'home', label: 'Overview', icon: Home },
    { id: 'directory', label: 'Directory', icon: Compass },
    { id: 'teachers', label: 'Teachers', icon: GraduationCap, badge: teachersCount },
    { id: 'block-e', label: 'Block E Hub', icon: Layers },
    { id: 'map', label: '3D Campus Map', icon: MapPin },
    { id: 'lost-found', label: 'Lost & Found', icon: Search },
    { id: 'claims', label: 'Claims & Match', icon: ShieldAlert, badge: claimsCount },
    { id: 'notices', label: 'Notices', icon: Bell, badge: noticesCount },
    { id: 'admin', label: 'Admin Desk', icon: ShieldAlert, adminOnly: true },
    { id: 'ai-assistant', label: 'Campus AI', icon: Sparkles },
  ];

  const visibleTabs = tabs.filter(t => !t.adminOnly || isAdmin);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight') {
      const next = (index + 1) % visibleTabs.length;
      onTabChange(visibleTabs[next].id);
    } else if (e.key === 'ArrowLeft') {
      const prev = (index - 1 + visibleTabs.length) % visibleTabs.length;
      onTabChange(visibleTabs[prev].id);
    }
  };

  return (
    <nav
      id="meniscus-navigation"
      aria-label="Main Campus Navigation"
      className="relative z-30 w-full max-w-7xl mx-auto px-4 py-2"
    >
      {/* Desktop Meniscus Fluid Pill Bar with Liquid Sliding Motion */}
      <div
        ref={containerRef}
        role="tablist"
        className="hidden md:flex items-center justify-between p-1.5 bg-slate-900/90 border border-slate-800/90 rounded-2xl shadow-xl shadow-slate-950/40 backdrop-blur-xl gap-1 overflow-x-auto scrollbar-none relative"
      >
        {visibleTabs.map((tab, idx) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onTabChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`relative px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-colors duration-200 flex items-center gap-2 select-none whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-red-400/40 ${
                isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {/* Fluid Sliding Active Pill Background */}
              {isActive && (
                <motion.div
                  layoutId="meniscus-active-tab"
                  className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-red-700 rounded-xl shadow-lg shadow-red-600/35 -z-10"
                  transition={{
                    type: 'spring',
                    stiffness: 420,
                    damping: 32,
                  }}
                />
              )}

              <motion.div
                whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="flex items-center"
              >
                <Icon className={`w-4 h-4 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
              </motion.div>

              <span className="relative z-10">{tab.label}</span>

              {tab.badge !== undefined && tab.badge > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`relative z-10 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white text-red-700 shadow-sm' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                >
                  {tab.badge}
                </motion.span>
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile Meniscus Bottom Bar with Spring Motion Indicator */}
      <div
        id="mobile-meniscus-bar"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800/90 px-2 py-2 backdrop-blur-lg flex items-center justify-around"
      >
        {visibleTabs.slice(0, 5).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center justify-center p-2 rounded-xl text-[10px] font-medium transition-all"
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-meniscus-active-tab"
                  className="absolute inset-0 bg-red-500/15 rounded-xl border border-red-500/30 -z-10"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              <div className="relative">
                <motion.div
                  animate={isActive ? { scale: [1, 1.2, 1], y: [0, -2, 0] } : { scale: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-red-400' : 'text-slate-400'}`} />
                </motion.div>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2 px-1 py-0.1 bg-red-600 text-white rounded-full text-[9px] font-bold animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`mt-1 ${isActive ? 'text-red-400 font-bold' : 'text-slate-400'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
