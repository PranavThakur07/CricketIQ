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
  X
} from 'lucide-react';

export default function Sidebar({ isOpen, toggleSidebar }) {
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutGrid },
    { name: 'Momentum Intelligence', path: '/momentum', icon: Activity },
    { name: 'AI Match Analyst', path: '/analyst', icon: Bot },
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

        {/* Navigation list */}
        <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto h-[calc(100vh-4rem)]">
          <div className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Intelligence Engines
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => { if (window.innerWidth < 1024) toggleSidebar(); }}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-stadium-emerald/20 to-stadium-cyan/10 text-white border-l-4 border-stadium-emerald shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-stadium-border/40'
                  }`
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}

          <div className="pt-6 border-t border-stadium-border/50 mt-6">
            <div className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Resources
            </div>
            <a 
              href="/docs" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center space-x-3 px-3 py-2 text-slate-400 hover:text-white text-xs transition-colors duration-200"
            >
              <HelpCircle className="h-4 w-4" />
              <span>API Documentation</span>
            </a>
          </div>
        </nav>
      </aside>
    </>
  );
}
