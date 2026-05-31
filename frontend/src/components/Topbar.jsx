import React, { useState, useEffect } from 'react';
import { Menu, Search, Bell, Shield, Radio } from 'lucide-react';

export default function Topbar({ toggleSidebar, appMode, setAppMode, providerStatus }) {
  const [liveScores, setLiveScores] = useState({
    batting: "IND",
    score: "182/4",
    overs: "17.2",
    bowling: "AUS",
    text: "India requires 20 runs from 16 balls to win (RRR: 7.50)"
  });

  // Small live ticker ball simulator!
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveScores(prev => {
        // Increment ball or score
        const [runs, wickets] = prev.score.split('/').map(Number);
        const [ovs, balls] = prev.overs.split('.').map(Number);
        
        let newBalls = balls + 1;
        let newOvs = ovs;
        if (newBalls >= 6) {
          newOvs = ovs + 1;
          newBalls = 0;
        }

        const runIncrement = Math.random() < 0.15 ? 0 : Math.random() < 0.6 ? 1 : Math.random() < 0.8 ? 4 : 6;
        const newRuns = runs + runIncrement;
        const isWicket = Math.random() < 0.05 && wickets < 9;
        const newWickets = wickets + (isWicket ? 1 : 0);
        
        const target = 202;
        const r_run = target - newRuns;
        const totalBallsLeft = (20 * 6) - (newOvs * 6 + newBalls);
        const rrr = totalBallsLeft > 0 ? (r_run / (totalBallsLeft / 6)) : 0;

        let statusText = "";
        if (newRuns >= target) {
          statusText = `India won by ${10 - newWickets} wickets!`;
          clearInterval(interval);
        } else if (totalBallsLeft <= 0 || newWickets >= 10) {
          statusText = `Australia won by ${target - newRuns} runs!`;
          clearInterval(interval);
        } else {
          statusText = `India requires ${r_run} runs from ${totalBallsLeft} balls (RRR: ${rrr.toFixed(2)})`;
        }

        return {
          batting: "IND",
          score: `${newRuns}/${newWickets}`,
          overs: `${newOvs}.${newBalls}`,
          bowling: "AUS",
          text: statusText
        };
      });
    }, 15000); // Update ticker stats slowly

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-stadium-border bg-stadium-dark/80 backdrop-blur-md px-6">
      
      {/* Mobile Drawer Trigger & Search */}
      <div className="flex items-center space-x-4">
        <button 
          onClick={toggleSidebar}
          className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-stadium-border lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative hidden md:block w-64">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
            <Search className="h-4 w-4" />
          </span>
          <input 
            type="text"
            placeholder="Search teams, simulation ids..."
            className="w-full bg-stadium-card/60 text-xs text-white placeholder-slate-500 border border-stadium-border rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-stadium-cyan focus:border-stadium-cyan transition-all"
          />
        </div>
      </div>

      {/* Ticker Section - Very Premium Sports Analytics Look */}
      {appMode === 'live' ? (
        providerStatus?.status === 'connected' ? (
          <div className="flex-1 max-w-lg mx-6 bg-stadium-card border border-red-500/35 rounded-full px-4 py-1 flex items-center justify-between text-xs overflow-hidden animate-pulse-slow">
            <div className="flex items-center space-x-2 shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="font-bold text-red-500 uppercase text-[10px] tracking-wider flex items-center">
                <Radio className="h-3 w-3 mr-1 animate-pulse" /> LIVE ANALYTICS
              </span>
            </div>
            <div className="hidden sm:flex items-center space-x-2 mx-4 text-slate-300 font-semibold border-l border-stadium-border pl-4">
              <span className="text-white">LIVE FEED</span>
              <span className="text-red-500 font-bold text-[10px] uppercase">{providerStatus?.provider_name}</span>
            </div>
            <div className="text-[10px] font-bold text-red-400 truncate max-w-[200px] md:max-w-xs">
              Live match feeds active
            </div>
          </div>
        ) : (
          <div className="flex-1 max-w-lg mx-6 bg-stadium-card border border-amber-600/30 rounded-full px-4 py-1 flex items-center justify-between text-xs overflow-hidden">
            <div className="flex items-center space-x-2 shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="font-bold text-amber-500 uppercase text-[9px] tracking-wider flex items-center">
                ⚠ FEED OFFLINE
              </span>
            </div>
            <div className="text-[10px] font-bold text-amber-500 truncate max-w-[280px] md:max-w-sm pl-3 border-l border-stadium-border/60 ml-3">
              Live Provider Not Configured. Check dashboard fallbacks.
            </div>
          </div>
        )
      ) : (
        <div className="flex-1 max-w-lg mx-6 bg-stadium-card border border-stadium-emerald/30 rounded-full px-4 py-1 flex items-center justify-between text-xs overflow-hidden animate-pulse-slow">
          <div className="flex items-center space-x-2 shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-stadium-emerald opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-stadium-emerald"></span>
            </span>
            <span className="font-bold text-stadium-emerald uppercase text-[10px] tracking-wider flex items-center">
              <Radio className="h-3 w-3 mr-1 animate-pulse" /> HISTORICAL MODE
            </span>
          </div>
          <div className="hidden sm:flex items-center space-x-2 mx-4 text-slate-300 font-semibold border-l border-stadium-border pl-4">
            <span className="text-white">{liveScores.batting}</span>
            <span className="text-stadium-emerald font-bold text-sm">{liveScores.score}</span>
            <span className="text-slate-500">({liveScores.overs} ov)</span>
            <span className="text-slate-500">v</span>
            <span>{liveScores.bowling}</span>
          </div>
          <div className="text-[10px] font-medium text-slate-400 truncate max-w-[150px] md:max-w-xs">
            {liveScores.text}
          </div>
        </div>
      )}

      {/* Actions and User */}
      <div className="flex items-center space-x-4">
        <button className="relative p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-stadium-border transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 flex h-1.5 w-1.5 bg-stadium-cyan rounded-full"></span>
        </button>

        <div className="flex items-center space-x-2 pl-2 border-l border-stadium-border">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stadium-border border border-stadium-cyan/20">
            <Shield className="h-4 w-4 text-stadium-cyan" />
          </div>
          <div className="hidden lg:block text-left">
            <span className="block text-xs font-bold text-white">APL Hacker</span>
            <span className="block text-[10px] font-semibold text-stadium-emerald uppercase tracking-wider">PREMIER LVL 1</span>
          </div>
        </div>
      </div>
    </header>
  );
}
