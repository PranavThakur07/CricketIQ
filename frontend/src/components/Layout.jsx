import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { fetchLiveStatus } from '../services/liveService';
import { Zap } from 'lucide-react';

export default function Layout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [appMode, setAppMode] = useState(() => sessionStorage.getItem('appMode') || 'historical');
  const [providerStatus, setProviderStatus] = useState({
    status: 'not_configured',
    provider_name: 'None',
    display_message: 'Checking connection...'
  });

  // Demo Tour States
  const [tourActive, setTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(1);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Persist app mode to session storage
  useEffect(() => {
    sessionStorage.setItem('appMode', appMode);
  }, [appMode]);

  // Load API provider connection status
  useEffect(() => {
    async function checkStatus() {
      const status = await fetchLiveStatus();
      setProviderStatus(status);
    }
    checkStatus();
  }, []);

  return (
    <div className={`min-h-screen flex transition-colors duration-500 ${
      appMode === 'live' ? 'bg-stadium-dark text-white' : 'bg-stadium-dark text-slate-100'
    }`}>
      {/* Sidebar Navigation */}
      <Sidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
        appMode={appMode} 
        setAppMode={setAppMode} 
        providerStatus={providerStatus} 
        setTourActive={setTourActive}
        setTourStep={setTourStep}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Top Header */}
        <Topbar 
          toggleSidebar={toggleSidebar} 
          appMode={appMode} 
          setAppMode={setAppMode} 
          providerStatus={providerStatus}
        />

        {/* Dashboard Pages Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-[1600px] w-full mx-auto relative">
          {/* Outlet context gives children routes instant access to states */}
          <div className="animate-fade-in transition-all duration-300">
            <Outlet context={{ appMode, setAppMode, providerStatus }} />
          </div>

          {/* ==================== FLOATING DEMO TOUR CONSOLE ==================== */}
          {tourActive && (
            <div className="fixed bottom-6 right-6 z-50 w-80 bg-stadium-card/95 border border-stadium-cyan/45 rounded-3xl p-5 shadow-2xl animate-scale-up backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-stadium-border/50 pb-2.5 mb-3.5">
                <span className="text-[10px] font-black text-stadium-cyan uppercase tracking-widest flex items-center">
                  <Zap className="h-4.5 w-4.5 mr-1.5 text-stadium-cyan animate-pulse fill-current" /> Judge APL Tour (2-Min)
                </span>
                <button 
                  onClick={() => { setTourActive(false); setTourStep(1); }} 
                  className="text-slate-500 hover:text-white text-[10px] font-extrabold uppercase shrink-0"
                >
                  Exit Tour
                </button>
              </div>

              {tourStep === 1 && (
                <div className="space-y-3 text-xs text-slate-300">
                  <span className="block font-black text-white text-[12px] uppercase tracking-wide">Step 1: Momentum Engine</span>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    Analyze over-by-over momentum spikes, dot-ball pressure zones, and turning point deltas calculated by our custom algorithms.
                  </p>
                  <button
                    onClick={() => navigate('/momentum')}
                    className="w-full py-2.5 bg-gradient-to-r from-stadium-emerald to-stadium-cyan text-stadium-dark font-black text-[10px] uppercase tracking-wider rounded-xl cursor-pointer hover:opacity-90 transition-all shadow-md"
                  >
                    1. View Momentum Dash
                  </button>
                </div>
              )}

              {tourStep === 2 && (
                <div className="space-y-3 text-xs text-slate-300">
                  <span className="block font-black text-white text-[12px] uppercase tracking-wide">Step 2: Convene War Room</span>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    APL Flagship Feature: Convene all three AI agents (🏏 Analyst, 📈 Predictor, 🎯 Strategist) simultaneously side-by-side!
                  </p>
                  <button
                    onClick={() => navigate('/war-room')}
                    className="w-full py-2.5 bg-gradient-to-r from-stadium-emerald to-stadium-cyan text-stadium-dark font-black text-[10px] uppercase tracking-wider rounded-xl cursor-pointer hover:opacity-90 transition-all shadow-md"
                  >
                    2. Open AI War Room
                  </button>
                </div>
              )}

              {tourStep === 3 && (
                <div className="space-y-3 text-xs text-slate-300">
                  <span className="block font-black text-white text-[12px] uppercase tracking-wide">Step 3: Universe Simulator</span>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    Simulate custom alternate realities (e.g. "What if Kohli survived?") and check win probability shifts inside Alternate Universe.
                  </p>
                  <button
                    onClick={() => navigate('/simulator')}
                    className="w-full py-2.5 bg-gradient-to-r from-stadium-emerald to-stadium-cyan text-stadium-dark font-black text-[10px] uppercase tracking-wider rounded-xl cursor-pointer hover:opacity-90 transition-all shadow-md"
                  >
                    3. Launch Simulator
                  </button>
                </div>
              )}

              {tourStep === 4 && (
                <div className="space-y-3 text-xs text-slate-300">
                  <span className="block font-black text-white text-[12px] uppercase tracking-wide">Step 4: Compiled Report</span>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    Generate a premium Match Intelligence Report compiling re-caps, MVPs, winning factors, and future strategical learnings.
                  </p>
                  <button
                    onClick={() => navigate('/war-room')}
                    className="w-full py-2.5 bg-gradient-to-r from-stadium-emerald to-stadium-cyan text-stadium-dark font-black text-[10px] uppercase tracking-wider rounded-xl cursor-pointer hover:opacity-90 transition-all shadow-md"
                  >
                    4. Open Report Console
                  </button>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex items-center justify-between border-t border-stadium-border/50 mt-4 pt-3 text-[10px] font-black uppercase text-slate-500">
                <button
                  disabled={tourStep === 1}
                  onClick={() => {
                    const prevStep = tourStep - 1;
                    setTourStep(prevStep);
                    if (prevStep === 1) navigate('/momentum');
                    if (prevStep === 2) navigate('/war-room');
                    if (prevStep === 3) navigate('/simulator');
                  }}
                  className="hover:text-white disabled:opacity-30 tracking-wider cursor-pointer transition-colors"
                >
                  &larr; Back
                </button>
                
                <span className="tracking-widest">{tourStep} / 4</span>

                {tourStep < 4 ? (
                  <button
                    onClick={() => {
                      const nextStep = tourStep + 1;
                      setTourStep(nextStep);
                      if (nextStep === 2) navigate('/war-room');
                      if (nextStep === 3) navigate('/simulator');
                      if (nextStep === 4) navigate('/war-room');
                    }}
                    className="text-stadium-cyan hover:text-white tracking-wider cursor-pointer transition-colors"
                  >
                    Next &rarr;
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setTourActive(false);
                      setTourStep(1);
                      navigate('/');
                    }}
                    className="text-stadium-emerald hover:text-white tracking-wider cursor-pointer animate-pulse"
                  >
                    Finish Tour 🎉
                  </button>
                )}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
