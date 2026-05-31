import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutGrid, 
  Activity, 
  Bot, 
  TrendingUp, 
  Sparkles, 
  RotateCcw,
  Trophy,
  HelpCircle,
  Menu,
  X,
  Swords,
  Radio,
  Wifi,
  WifiOff,
  Zap
} from 'lucide-react';

export default function Sidebar({ isOpen, toggleSidebar, appMode, setAppMode, providerStatus, setTourActive, setTourStep }) {
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutGrid },
    { name: 'Momentum Intelligence', path: '/momentum', icon: Activity },
    { name: 'AI Match Analyst', path: '/analyst', icon: Bot },
    { name: 'Agentic War Room', path: '/war-room', icon: Swords },
    { name: 'Win Predictor', path: '/predictor', icon: TrendingUp },
    { name: 'Fantasy Assistant', path: '/fantasy', icon: Sparkles },
    { name: 'Universe Simulator', path: '/simulator', icon: RotateCcw },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-stadium-dark/60 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 border-r border-stadium-border bg-stadium-card/95 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Branding */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-stadium-border">
          <NavLink to="/" className="flex items-center space-x-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-stadium-emerald to-stadium-cyan text-stadium-dark font-extrabold shadow-md group-hover:scale-105 transition-transform duration-200">
              <Trophy className="h-5 w-5 text-stadium-dark" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-wider text-white">Cricket<span className="text-stadium-cyan">IQ</span></span>
              <span className="block text-[9px] font-medium text-stadium-emerald/80 tracking-widest uppercase">APL 2026</span>
            </div>
          </NavLink>
          
          <button 
            onClick={toggleSidebar} 
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-stadium-border lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Dynamic Mode Switch Widget */}
        <div className="px-6 pt-6 pb-2">
          <div className="bg-stadium-dark/80 border border-stadium-border rounded-2xl p-1.5 flex items-center justify-between shadow-inner">
            <button
              onClick={() => setAppMode('historical')}
              className={`flex-1 text-center py-2 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all duration-300 ${
                appMode === 'historical'
                  ? 'bg-gradient-to-r from-stadium-emerald/20 to-stadium-cyan/20 border border-stadium-emerald/30 text-white shadow-sm font-extrabold'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Historical
            </button>
            <button
              onClick={() => setAppMode('live')}
              className={`flex-1 text-center py-2 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center ${
                appMode === 'live'
                  ? 'bg-gradient-to-r from-rose-950/40 to-red-900/30 border border-red-600/40 text-red-400 shadow-sm font-extrabold animate-pulse-slow'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
                appMode === 'live' ? 'bg-red-500 animate-ping' : 'bg-slate-500'
              }`}></span>
              Live Mode
            </button>
          </div>
        </div>

        {/* Judge Demo Tour Launcher */}
        <div className="px-6 pb-2">
          <button
            onClick={() => {
              setTourActive(true);
              setTourStep(1);
            }}
            className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-stadium-emerald/10 via-stadium-cyan/15 to-stadium-emerald/10 hover:from-stadium-emerald/20 hover:to-stadium-cyan/20 border border-stadium-cyan/45 text-[10px] font-black text-white uppercase tracking-widest flex items-center justify-center space-x-1.5 shadow-lg group cursor-pointer"
          >
            <Zap className="h-3.5 w-3.5 text-stadium-cyan group-hover:scale-110 transition-transform fill-current animate-pulse mr-1" />
            <span>⚡ 2-Min Judge Tour</span>
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 space-y-1.5 px-4 py-4 overflow-y-auto h-[calc(100vh-14rem)]">
          <div className="px-3 mb-2 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Intelligence Engines
            </span>
            {appMode === 'live' && (
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
            )}
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            // Check if specific items are live-disabled or live-customized
            const isSimulator = item.path === '/simulator';
            const isWarRoom = item.path === '/war-room';
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => { if (window.innerWidth < 1024) toggleSidebar(); }}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? appMode === 'live'
                        ? 'bg-gradient-to-r from-red-950/20 to-rose-900/10 text-white border-l-4 border-red-500 shadow-sm'
                        : 'bg-gradient-to-r from-stadium-emerald/20 to-stadium-cyan/10 text-white border-l-4 border-stadium-emerald shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-stadium-border/40'
                  }`
                }
              >
                <div className="flex items-center space-x-3">
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{item.name}</span>
                </div>
                
                {/* Visual badges for live features */}
                {appMode === 'live' && (item.path === '/momentum' || item.path === '/predictor') && (
                  <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-red-950/60 border border-red-500/30 text-red-500 uppercase tracking-wider scale-90 animate-pulse">
                    Live
                  </span>
                )}
                {isWarRoom && (
                  <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-stadium-cyan/10 border border-stadium-cyan/35 text-stadium-cyan uppercase tracking-wider scale-90">
                    War Room
                  </span>
                )}
              </NavLink>
            );
          })}

          <div className="pt-4 border-t border-stadium-border/50 mt-4 space-y-4">
            <div>
              <div className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Resources
              </div>
              <a 
                href="/docs" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center space-x-3 px-3 py-1.5 text-slate-400 hover:text-white text-xs transition-colors duration-200"
              >
                <HelpCircle className="h-4 w-4" />
                <span>API Documentation</span>
              </a>
            </div>

            {/* Provider Connection Status Widget */}
            <div className="px-3 py-2 bg-stadium-dark/40 border border-stadium-border/60 rounded-xl">
              <div className="flex items-center justify-between text-[9px] font-extrabold uppercase text-slate-500 mb-1">
                <span>API Data Feed</span>
                {providerStatus?.status === 'connected' ? (
                  <Wifi className="h-3 w-3 text-stadium-emerald" />
                ) : (
                  <WifiOff className="h-3 w-3 text-amber-500" />
                )}
              </div>
              <span className={`block text-[10px] font-bold truncate ${
                providerStatus?.status === 'connected' ? 'text-stadium-emerald' : 'text-amber-500'
              }`}>
                {providerStatus?.display_message || 'Checking feed...'}
              </span>
            </div>

          </div>
        </nav>
      </aside>
    </>
  );
}
