import React, { useState } from 'react';
import { Sparkles, Trophy, UserCheck, ShieldAlert, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function Fantasy() {
  const [riskLevel, setRiskLevel] = useState(3); // 1 to 5
  
  // Custom mock database that updates based on risk factor
  const getPlayers = (risk) => {
    const base = [
      { name: "Virat Kohli", role: "BAT", points: 88, selection: 92, credits: 10.5, category: "Anchor / Highly Consistent" },
      { name: "Jasprit Bumrah", role: "BOWL", points: 94, selection: 88, credits: 10.0, category: "Premium Death Bowler" },
      { name: "Heinrich Klaasen", role: "WK", points: 82, selection: 76, credits: 9.5, category: "High Strike Spinner Hitter" },
      { name: "Hardik Pandya", role: "AR", points: 76, selection: 65, credits: 9.5, category: "Balance All-rounder" },
      { name: "Travis Head", role: "BAT", points: 85, selection: 79, credits: 9.5, category: "Aggressive Powerplay Opener" },
      { name: "Rashid Khan", role: "BOWL", points: 80, selection: 71, credits: 9.0, category: "Mystery Spinner Anchor" },
      { name: "Axar Patel", role: "AR", points: 72, selection: 58, credits: 8.5, category: "Tidy Spin / Finisher" },
      { name: "Yashasvi Jaiswal", role: "BAT", points: 78, selection: 68, credits: 9.0, category: "Young Dynamic Opener" },
      { name: "Matheesha Pathirana", role: "BOWL", points: 68, selection: 42, credits: 8.0, category: "Slingy Yorker Specialist" },
      { name: "Kuldeep Yadav", role: "BOWL", points: 74, selection: 50, credits: 8.5, category: "Chinaman Wicket Taker" },
      { name: "Rinku Singh", role: "BAT", points: 60, selection: 31, credits: 7.5, category: "Death Over Finisher Pick" },
    ];

    // Alter points, selection, and name indicators based on risk level
    return base.map(p => {
      let ptAdj = 0;
      let diffText = "";
      let selectionAdj = p.selection;

      if (risk === 1) {
        // Safe play
        ptAdj = p.points > 80 ? 4 : -2;
        selectionAdj = Math.min(selectionAdj + 5, 99);
      } else if (risk === 2) {
        ptAdj = p.points > 80 ? 2 : -1;
      } else if (risk === 4) {
        // High risk
        ptAdj = p.credits < 9.0 ? 8 : -3;
        selectionAdj = Math.max(selectionAdj - 12, 10);
        if (p.credits < 8.5) diffText = "Differential Gold";
      } else if (risk === 5) {
        // Extreme risk
        ptAdj = p.credits < 8.5 ? 18 : -8;
        selectionAdj = Math.max(selectionAdj - 25, 5);
        if (p.credits < 8.5) diffText = "Differential Gold";
      }

      return {
        ...p,
        points: Math.round(p.points + ptAdj),
        selection: Math.round(selectionAdj),
        differential: diffText
      };
    });
  };

  const players = getPlayers(riskLevel);

  // Dynamic captains based on risk level
  const getCaptains = (risk) => {
    if (risk <= 2) {
      return {
        captain: { name: "Virat Kohli", stats: "Safe choice. Averages 58.2 in this ground with 88% model stability." },
        viceCaptain: { name: "Jasprit Bumrah", stats: "Concedes only 6.2 rpo in powerplays. Guaranteed economy wickets." }
      };
    } else if (risk === 3) {
      return {
        captain: { name: "Jasprit Bumrah", stats: "High-value strike rate. Predictor expects 2+ wickets at death." },
        viceCaptain: { name: "Travis Head", stats: "Explosive opener. If survives the first 3 overs, yields 90+ points." }
      };
    } else {
      return {
        captain: { name: "Heinrich Klaasen", stats: "High Ceiling pick. Spin matching rate is 182.4, highly disruptive in middle overs." },
        viceCaptain: { name: "Matheesha Pathirana", stats: "Differential selection. Lowered pick-rate (42%) but massive 3-wicket ceiling." }
      };
    }
  };

  const { captain, viceCaptain } = getCaptains(riskLevel);

  return (
    <div className="space-y-8">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center">
            <Sparkles className="h-7 w-7 text-stadium-accent mr-2" /> Fantasy Assistant
          </h1>
          <p className="text-slate-400 text-xs">Calibrate risk tolerances to formulate the ultimate high-scoring fantasy roster recommendations.</p>
        </div>

        {/* Risk Tolerances Slider Widget */}
        <div className="glass-panel border border-stadium-border px-4 py-3 rounded-2xl flex items-center space-x-4">
          <span className="text-[10px] text-slate-400 font-bold uppercase shrink-0">Strategy Risk</span>
          <div className="flex items-center space-x-3">
            <input 
              type="range" 
              min="1" 
              max="5" 
              value={riskLevel} 
              onChange={(e) => setRiskLevel(Number(e.target.value))}
              className="accent-stadium-cyan w-24 h-1 bg-stadium-dark rounded-full appearance-none cursor-pointer"
            />
            <span className={`text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
              riskLevel <= 2 
                ? 'bg-stadium-emerald/15 text-stadium-emerald' 
                : riskLevel === 3 
                  ? 'bg-stadium-cyan/15 text-stadium-cyan'
                  : 'bg-red-500/15 text-red-400'
            }`}>
              {riskLevel === 1 && "Conservative"}
              {riskLevel === 2 && "Moderate"}
              {riskLevel === 3 && "Balanced"}
              {riskLevel === 4 && "Aggressive"}
              {riskLevel === 5 && "High Risk"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Suggested Team Grid Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel border border-stadium-border rounded-2xl overflow-hidden shadow-xl">
            <div className="px-6 py-4 bg-stadium-card/80 border-b border-stadium-border flex justify-between items-center">
              <span className="text-xs font-bold text-white uppercase">Optimal Roster Suggestions (11 Players)</span>
              <span className="text-[10px] text-slate-500 font-bold">Credits Used: 98.0 / 100</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-stadium-border bg-stadium-dark/40 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                    <th className="px-6 py-3.5">Player Name</th>
                    <th className="px-6 py-3.5">Role</th>
                    <th className="px-6 py-3.5">Proj. Points</th>
                    <th className="px-6 py-3.5">Selected %</th>
                    <th className="px-6 py-3.5">Credits</th>
                    <th className="px-6 py-3.5 text-right">Strategic Insights</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stadium-border/50">
                  {players.map((p, idx) => (
                    <tr key={idx} className="hover:bg-stadium-cardLight/40 transition-colors">
                      <td className="px-6 py-3.5 font-bold text-white">{p.name}</td>
                      <td className="px-6 py-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-stadium-border text-slate-300">
                          {p.role}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 font-bold text-stadium-cyan">{p.points}</td>
                      <td className="px-6 py-3.5 text-slate-300">{p.selection}%</td>
                      <td className="px-6 py-3.5 font-semibold text-slate-300">{p.credits}</td>
                      <td className="px-6 py-3.5 text-right">
                        {p.differential ? (
                          <span className="inline-flex items-center text-[9px] font-black text-stadium-accent bg-stadium-accent/10 border border-stadium-accent/20 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                            {p.differential}
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[10px]">{p.category}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right side Captain recommendations and strategic warnings */}
        <div className="space-y-6">
          
          {/* Captain recommendations */}
          <div className="glass-panel border border-stadium-accent/40 pitch-glow rounded-2xl p-5 md:p-6 space-y-6">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center border-b border-stadium-border/50 pb-3">
              <Trophy className="h-5 w-5 text-stadium-accent mr-2" /> Captaincy Recommendations
            </h2>

            {/* Captain card */}
            <div className="space-y-4">
              <div className="bg-stadium-dark/60 rounded-xl p-4 border border-stadium-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold text-stadium-accent bg-stadium-accent/10 border border-stadium-accent/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Captain (2x Points)
                  </span>
                  <span className="text-xs font-bold text-white">{captain.name}</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {captain.stats}
                </p>
              </div>

              {/* Vice Captain card */}
              <div className="bg-stadium-dark/60 rounded-xl p-4 border border-stadium-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold text-stadium-cyan bg-stadium-cyan/10 border border-stadium-cyan/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Vice-Captain (1.5x)
                  </span>
                  <span className="text-xs font-bold text-white">{viceCaptain.name}</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {viceCaptain.stats}
                </p>
              </div>
            </div>
          </div>

          {/* Roster Balance Index */}
          <div className="glass-panel border border-stadium-border rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Roster Balance Analysis</h3>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>Powerplay Firepower</span>
                  <span className="text-stadium-emerald font-semibold">Excellent (84%)</span>
                </div>
                <div className="h-1.5 w-full bg-stadium-dark rounded-full overflow-hidden">
                  <div className="h-full bg-stadium-emerald" style={{ width: '84%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>Death Overs Control</span>
                  <span className="text-stadium-cyan font-semibold">Optimal (90%)</span>
                </div>
                <div className="h-1.5 w-full bg-stadium-dark rounded-full overflow-hidden">
                  <div className="h-full bg-stadium-cyan" style={{ width: '90%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>Differential Leverage</span>
                  <span className={`font-semibold ${riskLevel >= 4 ? 'text-stadium-accent' : 'text-slate-400'}`}>
                    {riskLevel <= 2 && "Low (15%)"}
                    {riskLevel === 3 && "Standard (30%)"}
                    {riskLevel >= 4 && "Aggressive (72%)"}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-stadium-dark rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-stadium-cyan to-stadium-accent" style={{ 
                    width: riskLevel <= 2 ? '15%' : riskLevel === 3 ? '30%' : '72%' 
                  }}></div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
