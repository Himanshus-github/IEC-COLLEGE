import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  ShieldCheck, 
  User as UserIcon, 
  LogOut, 
  GraduationCap, 
  Activity, 
  Menu, 
  X,
  ChevronDown,
  PlusCircle
} from 'lucide-react';
import { User } from '../types';
import { NavTabId } from './MeniscusNav';

interface NavbarProps {
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenOtpDemo: () => void;
  onOpenDiagnostics: () => void;
  onOpenSearch: () => void;
  onOpenAiAssistant: () => void;
  onOpenAddInfo: () => void;
  activeTab: NavTabId;
  onTabChange: (tab: NavTabId) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenAuth,
  onLogout,
  onOpenOtpDemo,
  onOpenDiagnostics,
  onOpenSearch,
  onOpenAiAssistant,
  onOpenAddInfo,
  activeTab,
  onTabChange
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Brand Logo & College Insignia */}
          <div 
            id="brand-logo-container"
            onClick={() => onTabChange('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* IEC Crest Insignia */}
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-red-600 via-red-700 to-amber-600 p-0.5 shadow-lg shadow-red-600/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-red-400 group-hover:rotate-6 transition-transform" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-red-400 bg-clip-text text-transparent">
                  IEC GROUP
                </span>
                <span className="px-1.5 py-0.5 bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-bold rounded uppercase tracking-wider">
                  Est. 1981
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                Campus Portal • Greater Noida (AKTU)
              </p>
            </div>
          </div>

          {/* Center Search Trigger Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4">
            <button
              id="navbar-search-trigger"
              onClick={onOpenSearch}
              className="w-full py-2 px-4 bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl text-left text-xs text-slate-400 flex items-center justify-between transition-all group shadow-inner"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-500 group-hover:text-red-400 transition-colors" />
                <span>Search Block E, rooms, notices, lost items...</span>
              </div>
              <kbd className="px-2 py-0.5 bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-400 rounded">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Action Tools & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Search Mobile Icon */}
            <button
              onClick={onOpenSearch}
              className="lg:hidden p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl"
              aria-label="Open Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Add Information Quick Trigger */}
            <button
              id="navbar-add-info-btn"
              onClick={onOpenAddInfo}
              className="flex items-center gap-1.5 py-2 px-3 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-600/30 transition-all cursor-pointer group"
              title="Add Campus Information / Entities"
            >
              <PlusCircle className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" />
              <span className="hidden sm:inline">+ Add Info</span>
            </button>

            {/* AI Assistant Quick Trigger */}
            <button
              id="navbar-ai-assistant-btn"
              onClick={onOpenAiAssistant}
              className="hidden sm:flex items-center gap-1.5 py-2 px-3 bg-gradient-to-r from-red-950/60 to-slate-900 border border-red-500/30 hover:border-red-400/60 text-red-300 text-xs font-semibold rounded-xl transition-all shadow-sm group"
            >
              <Sparkles className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              <span>Campus AI</span>
            </button>

            {/* Interactive OTP V3 Demo Trigger */}
            <button
              id="navbar-otp-demo-btn"
              onClick={onOpenOtpDemo}
              className="hidden sm:flex items-center gap-1.5 py-2 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium rounded-xl transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>OTP Demo</span>
            </button>

            {/* Phase 1-19 Diagnostics Runner Trigger */}
            <button
              id="navbar-diagnostics-btn"
              onClick={onOpenDiagnostics}
              title="Run Phase 1-19 Master System Tests"
              className="p-2 text-slate-400 hover:text-emerald-400 bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-xl transition-colors"
            >
              <Activity className="w-4 h-4" />
            </button>

            {/* User Account / Profile */}
            {user ? (
              <div className="relative">
                <button
                  id="user-profile-trigger"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors"
                >
                  <img
                    src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover border border-red-500/30"
                  />
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-semibold text-slate-200 truncate max-w-[100px]">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-red-400 font-medium capitalize">
                      {user.role}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {/* Dropdown Menu */}
                {showProfileMenu && (
                  <div
                    id="user-profile-dropdown"
                    className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 animate-fade-in"
                  >
                    <div className="px-3 py-2 border-b border-slate-800">
                      <div className="text-xs font-bold text-slate-200">{user.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                      <div className="mt-1 inline-block px-2 py-0.5 bg-red-500/10 border border-red-500/20 text-[10px] font-semibold text-red-400 rounded">
                        {user.department || 'Engineering'}
                      </div>
                    </div>

                    <div className="py-1">
                      {user.role === 'admin' && (
                        <button
                          onClick={() => {
                            onTabChange('admin');
                            setShowProfileMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 rounded-lg flex items-center gap-2"
                        >
                          <ShieldCheck className="w-4 h-4 text-red-400" />
                          <span>Admin Control Center</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          onTabChange('claims');
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 rounded-lg flex items-center gap-2"
                      >
                        <UserIcon className="w-4 h-4 text-slate-400" />
                        <span>My Reports & Claims</span>
                      </button>
                    </div>

                    <div className="pt-1 border-t border-slate-800">
                      <button
                        id="logout-button"
                        onClick={() => {
                          setShowProfileMenu(false);
                          onLogout();
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-950/30 rounded-lg flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="login-modal-trigger"
                onClick={onOpenAuth}
                className="py-2 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-600/20 transition-all active:scale-95"
              >
                Sign In
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 p-4 space-y-3">
          <button
            onClick={() => {
              onOpenAddInfo();
              setMobileMenuOpen(false);
            }}
            className="w-full p-3 bg-red-600 hover:bg-red-500 rounded-xl text-left text-xs font-bold text-white flex items-center justify-center gap-2 shadow-lg shadow-red-600/30"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Add Information to Campus System</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onOpenAiAssistant();
                setMobileMenuOpen(false);
              }}
              className="p-3 bg-slate-900 border border-red-500/20 rounded-xl text-left text-xs font-semibold text-red-400 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Campus AI</span>
            </button>
            <button
              onClick={() => {
                onOpenOtpDemo();
                setMobileMenuOpen(false);
              }}
              className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-left text-xs font-semibold text-slate-300 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>OTP Demo</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
