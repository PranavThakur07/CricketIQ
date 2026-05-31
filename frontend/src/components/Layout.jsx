import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { fetchLiveStatus } from '../services/liveService';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [appMode, setAppMode] = useState(() => sessionStorage.getItem('appMode') || 'historical');
  const [providerStatus, setProviderStatus] = useState({
    status: 'not_configured',
    provider_name: 'None',
    display_message: 'Checking connection...'
  });

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
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-[1600px] w-full mx-auto">
          {/* Outlet context gives children routes instant access to states */}
          <div className="animate-fade-in transition-all duration-300">
            <Outlet context={{ appMode, setAppMode, providerStatus }} />
          </div>
        </main>
      </div>
    </div>
  );
}
