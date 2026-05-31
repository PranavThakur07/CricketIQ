import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  TrendingUp, 
  Activity, 
  Cpu, 
  Sparkles, 
  Bot, 
  ArrowUpRight, 
  Trophy, 
  Target, 
  Zap, 
  Play,
  RotateCcw
} from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { label: "Predictive Models Active", value: "99.4%", change: "+2.1% accuracy", icon: TrendingUp, color: "text-stadium-cyan bg-stadium-cyan/10" },
    { label: "Universe Simulations Run", value: "14,802", change: "+1,250 today", icon: RotateCcw, color: "text-stadium-accent bg-stadium-accent/10" },
    { label: "AI Analytical Confidence", value: "94.8%", change: "+0.8% delta", icon: Bot, color: "text-stadium-emerald bg-stadium-emerald/10" },
    { label: "Fantasy Win Ratio", value: "81.2%", change: "Top 0.5% Rank", icon: Sparkles, color: "text-purple-400 bg-purple-500/10" },
  ];

  const quickEngines = [
    { 
      name: "Momentum Intelligence", 
      desc: "Track over-by-over momentum flow and game-defining shifts in real-time.", 
      path: "/momentum", 
      icon: Activity, 
      tag: "Live Graph",
      theme: "border-stadium-emerald/30 hover:border-stadium-emerald"
    },
    { 
      name: "AI Match Analyst", 
      desc: "Prompt CricketIQ's Gemini-powered expert for target bowling matchups.", 
      path: "/analyst", 
      icon: Bot, 
      tag: "Gemini 2.5",
      theme: "border-stadium-cyan/30 hover:border-stadium-cyan"
    },
    { 
      name: "Win Predictor", 
      desc: "Submit live match metrics to run Monte Carlo probability calculations.", 
      path: "/predictor", 
      icon: TrendingUp, 
      tag: "99.4% Acc",
      theme: "border-purple-500/30 hover:border-purple-500"
    },
    { 
      name: "Fantasy Assistant", 
      desc: "Configure risk parameters to generate optimal high-scoring rosters.", 
      path: "/fantasy", 
      icon: Sparkles, 
      tag: "Team Picker",
      theme: "border-stadium-accent/30 hover:border-stadium-accent"
    },
  ];

  const liveFeeds = [
    { time: "2 mins ago", event: "Win Predictor model calibrated", desc: "IND vs AUS probability shifts to 54.2% batting win after Bumrah's tight 16th over.", type: "predictor" },
    { time: "15 mins ago", event: "Simulator Completed Universe #409", desc: "RCB successfully defended 170 in 2016 Final under 'Rain-shortened 12 overs' rule.", type: "simulator" },
    { time: "40 mins ago", event: "AI Analyst Matchup Alert", desc: "Identified a historical weak point: Steve Smith averages only 18.2 against left-arm orthodox spinner Axar Patel in subcontinent pitches.", type: "analyst" }
  ];

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stadium-cardLight to-stadium-card border border-stadium-border p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-stadium-emerald/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 -mb-16 w-80 h-80 bg-stadium-cyan/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-stadium-emerald/10 border border-stadium-emerald/30 text-stadium-emerald text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
            <Zap className="h-3.5 w-3.5 mr-1 text-stadium-emerald" /> Platform Active
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
            Transforming Raw Cricket Data into <span className="bg-gradient-to-r from-stadium-emerald to-stadium-cyan bg-clip-text text-transparent">AI Intelligence</span>
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Welcome to CricketIQ. Deploy machine learning models, simulate alternate cricket histories, calculate hyper-accurate match probability, and generate Gemini-driven team diagnostics.
          </p>
          <div className="flex flex-wrap gap-4">
            <NavLink 
              to="/simulator" 
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-stadium-dark bg-gradient-to-r from-stadium-emerald to-stadium-cyan hover:opacity-90 shadow-lg shadow-stadium-emerald/15 transition-all flex items-center space-x-2"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Launch Universe Simulator</span>
            </NavLink>
            <NavLink 
              to="/analyst" 
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white border border-stadium-border hover:bg-stadium-border/40 transition-all flex items-center space-x-2"
            >
              <Bot className="h-3.5 w-3.5" />
              <span>Consult Gemini Analyst</span>
            </NavLink>
          </div>
        </div>
      </div>

      {/* Analytics Statistics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="glass-panel rounded-2xl p-5 border border-stadium-border flex items-center justify-between shadow-lg">
              <div className="space-y-1">
                <span className="text-slate-400 text-xs font-medium uppercase tracking-wider block">{stat.label}</span>
                <span className="text-2xl font-extrabold text-white block">{stat.value}</span>
                <span className="text-[10px] font-bold text-stadium-emerald tracking-wide block">{stat.change}</span>
              </div>
              <div className={`p-3 rounded-xl ${stat.color} shrink-0`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Core Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Quick Launch Engines */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white tracking-wide">Select Intelligence Model</h2>
            <span className="text-xs text-stadium-cyan font-bold hover:underline cursor-pointer">View Systems</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {quickEngines.map((engine, idx) => {
              const Icon = engine.icon;
              return (
                <NavLink 
                  key={idx}
                  to={engine.path}
                  className={`glass-panel p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between h-48 group cursor-pointer ${engine.theme}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2.5 rounded-xl bg-stadium-border border border-stadium-border group-hover:border-stadium-cyan/20 text-white transition-all">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[9px] font-extrabold text-stadium-cyan bg-stadium-cyan/10 border border-stadium-cyan/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {engine.tag}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-stadium-cyan transition-colors mb-2">{engine.name}</h3>
                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">{engine.desc}</p>
                  </div>
                  <div className="flex items-center space-x-1 text-[10px] font-bold text-stadium-emerald group-hover:translate-x-1 transition-transform self-end mt-4">
                    <span>Deploy Engine</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </div>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Right Column: AI Live Stream Feed */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white tracking-wide">AI Intelligence Stream</h2>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-stadium-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-stadium-cyan"></span>
            </span>
          </div>

          <div className="glass-panel border border-stadium-border rounded-2xl p-5 space-y-5 h-[410px] overflow-y-auto">
            {liveFeeds.map((feed, idx) => (
              <div key={idx} className="border-b border-stadium-border/50 pb-4 last:border-b-0 last:pb-0">
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold mb-2">
                  <span className="flex items-center text-stadium-cyan">
                    <Zap className="h-3 w-3 mr-1 fill-current" /> {feed.event}
                  </span>
                  <span>{feed.time}</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">{feed.desc}</p>
              </div>
            ))}
            
            {/* Call to action inside live analyst */}
            <div className="bg-stadium-border/30 border border-stadium-border rounded-xl p-4 text-center">
              <span className="text-[10px] text-slate-400 font-bold block mb-1">Need live custom metrics?</span>
              <NavLink to="/analyst" className="text-xs text-stadium-cyan font-bold hover:underline flex items-center justify-center">
                Chat with Live Analyst now &rarr;
              </NavLink>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
