import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext, NavLink } from 'react-router-dom';
import { 
  Swords, 
  Bot, 
  TrendingUp, 
  Activity, 
  Sparkles, 
  Send, 
  User, 
  FileText, 
  RotateCcw, 
  ShieldCheck, 
  Trophy, 
  Zap, 
  CheckCircle,
  AlertTriangle,
  WifiOff
} from 'lucide-react';
import { askWarRoom, generateMatchReport } from '../services/liveService';

export default function WarRoom() {
  const { appMode, providerStatus } = useOutletContext();
  
  // Available matches context list
  const presetMatches = [
    { id: "ind_vs_pak_2022", name: "India vs Pakistan (T20 World Cup 2022)" },
    { id: "rcb_vs_srh_2016", name: "RCB vs SRH (IPL 2016 Final)" },
    { id: "ind_vs_aus_2023", name: "India vs Australia (World Cup 2023 Final)" }
  ];
  
  const [selectedMatch, setSelectedMatch] = useState("ind_vs_pak_2022");
  const [activeAgent, setActiveAgent] = useState("all"); // 'analyst', 'predictor', 'strategist', 'all'
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Multi-agent query responses
  const [responses, setResponses] = useState([]);
  
  // Match Report State
  const [report, setReport] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [responses, loading]);

  // Handle live data unavailable check
  const isLiveOffline = appMode === 'live' && providerStatus?.status === 'not_configured';

  // Preset quick tactical questions
  const presetQuestions = [
    "Deconstruct the turning point over.",
    "What is the current win probability explainable model?",
    "What immediate bowling matchup changes are required next?",
    "Why did the momentum crash during the middle overs?",
    "Suggest strategic field placements to protect short boundaries."
  ];

  // Submit Query to War Room Agent(s)
  const handleQuerySubmit = async (questionText) => {
    if (!questionText.trim() || loading) return;

    setResponses(prev => [...prev, { role: 'user', content: questionText }]);
    setUserInput("");
    setLoading(true);

    try {
      const isLive = appMode === 'live';
      const targetMatchId = isLive ? "live_match" : selectedMatch;

      // Convene all agents simultaneously!
      if (activeAgent === "all") {
        const agentTypes = ["analyst", "predictor", "strategist"];
        const promises = agentTypes.map(async (agent) => {
          try {
            const data = await askWarRoom(agent, questionText, targetMatchId, isLive);
            return { agent, success: true, ...data };
          } catch (e) {
            // Local fallback simulator if API is unreachable
            return simulateLocalAgentQuery(agent, questionText);
          }
        });

        const results = await Promise.all(promises);
        setResponses(prev => [...prev, {
          role: 'assistant',
          type: 'multi',
          agents: results
        }]);
      } else {
        // Query single agent
        let data;
        try {
          data = await askWarRoom(activeAgent, questionText, targetMatchId, isLive);
        } catch (e) {
          data = simulateLocalAgentQuery(activeAgent, questionText);
        }

        setResponses(prev => [...prev, {
          role: 'assistant',
          type: 'single',
          agent: activeAgent,
          ...data
        }]);
      }
    } catch (err) {
      console.error("War Room Query failed", err);
    } finally {
      setLoading(false);
    }
  };

  // Generate Exhaustive Match Report
  const handleGenerateReport = async () => {
    setReportLoading(true);
    setReport(null);
    try {
      const isLive = appMode === 'live';
      const targetMatchId = isLive ? "live_match" : selectedMatch;
      const data = await generateMatchReport(targetMatchId, isLive);
      setReport(data);
    } catch (err) {
      console.warn("Match report API unreachable. Loading local tactical mockup.");
      // Render beautiful local mockup
      simulateLocalMatchReport();
    } finally {
      setReportLoading(false);
    }
  };

  // Local Offline Fallbacks
  const simulateLocalAgentQuery = (agentType, questionText) => {
    const q = questionText.toLowerCase();
    let reply = "";
    let insights = [];
    let score = 0.95;

    if (agentType === "analyst") {
      reply = `🏏 Analyst Agent: Deconstructing turning points for ${selectedMatch}. The momentum curve shows a clear inflection point in the middle-overs spin spells. Boundaries dried up entirely, creating cumulative scoreboard choke pressure.`;
      insights = [
        "Inflection over registered a critical wicket fall that crashed the team run rate index.",
        "Accumulating dot ball sequences boosted the bowling pressure index by +35%.",
        "Wicket preservation ratio collapsed, limiting subsequent death over acceleration."
      ];
      score = 0.97;
    } else if (agentType === "predictor") {
      reply = `📈 Predictor Agent: Evaluating match win vectors. The expected chasing rate is currently sensitive to upcoming bowler match-ups. Dot balls will increase the RRR exponentially, while a boundary pushes win metrics by +14%.`;
      insights = [
        "Historical chase victory rates at this venue under these conditions stand at 48%.",
        "Chasing win probability is highly sensitive to spinner-matchup wickets in the next 12 balls.",
        "Expected final total is projected within a narrow 5-run par index."
      ];
      score = 0.94;
    } else {
      reply = `🎯 Strategist Agent: Coach's briefing. Deploy a spin squeeze immediately against the new batsmen. Batters must focus on turning over strikes with easy singles instead of executing high-risk boundary pulls.`;
      insights = [
        "Bowling: Bring in leg-spinners to exploit the batsman's turning pad weakness.",
        "Fielding: Place deep mid-wicket boundary riders to cover sweep shots.",
        "Batting: Avoid consecutive dot balls to ease final-overs run pressure."
      ];
      score = 0.98;
    }

    return { agent_type: agentType, reply, strategic_insights: insights, confidence_score: score };
  };

  const simulateLocalMatchReport = () => {
    let matchName = "India vs Pakistan (T20 World Cup 2022) - Deep Analytical Report";
    let summary = "A spectacular clash of strategic maneuvers concluded with one of the most intense final-overs in cricket history. Pakistan established a tight pace choke early, picking up 3 wickets in the powerplay. A stellar partnership between Kohli and Pandya anchored the recovery, culminating in an explosive boundary assault inside the death overs.";
    let turning_points = [
      "Over 12: India takes down spin spells scoring 20 runs, breaking the momentum choke.",
      "Over 19: Virat Kohli hits two straight sixes off Haris Rauf, shifting win probability by +42%."
    ];
    let key_performer = "Virat Kohli - 82* off 53 balls, executing a legendary anchoring masterclass under extreme scoreboard pressure.";
    let factors = [
      "Intelligent chase-pacing, conserving crucial wickets until the final death assault.",
      "Scoreboard pressure management restricting batsman panic in critical dot-ball windows.",
      "Exploitation of weak spinner matchups in the middle phase."
    ];
    let insights = [
      "Ensure a steady powerplay run flow (40+ runs) to avoid early middle-overs collapse.",
      "Protect deep cow-corner boundaries with specialized sweep-neutralizing placements.",
      "Anchor set batsmen through the 18th over to exploit spinner matchups in the final phase."
    ];

    if (selectedMatch === "rcb_vs_srh_2016") {
      matchName = "RCB vs SRH (IPL 2016 Final) - Deep Analytical Report";
      summary = "A high-scoring IPL final at the Chinnaswamy stadium witnessed extreme batting velocity. Chasing 208, Chris Gayle and Virat Kohli hit a record powerplay score. However, a tight middle-overs spell by SRH's pacers broke the opening stand, triggering successive wicket collapses and snatching the victory by 8 runs.";
      turning_points = [
        "Over 11: Chris Gayle dismissed, instantly cooling the boundary acceleration curve.",
        "Over 13: Virat Kohli bowled by Sran, shifting absolute control back to SRH."
      ];
      key_performer = "Chris Gayle - 76 off 38 balls, including 8 massive sixes in an opening blitz.";
      factors = [
        "Bhuvneshwar Kumar's masterclass execution of wide-line death-over yorkers.",
        "Aggressive captaincy by Warner targeting new batsmen with tight bowling spells.",
        "Batting pressure collapses after wickets fell, inflating required rates above 14 rpo."
      ];
      insights = [
        "Chasing high totals requires at least two robust partnerships scaling 60+ runs.",
        "Incorporate slow cutters to neutralize aggressive pull and sweep placements.",
        "Exploit set batsman strike rates with wide-crease bowling configurations."
      ];
    } else if (selectedMatch === "ind_vs_aus_2023") {
      matchName = "India vs Australia (WC 2023 Final) - Deep Analytical Report";
      summary = "A tactical choke by Australia's bowlers restricted India's explosive batting lineup to a par score. Rohit Sharma launched a rapid start, but Travis Head's catch broke the momentum. Australia's spinners locked down middle-overs, conceding zero boundaries in 10 overs, securing a comfortable chase under lights.";
      turning_points = [
        "Over 9: Rohit Sharma caught by Travis Head, triggering defensive middle-over blocks.",
        "Over 10: Shreyas Iyer dismissed cheap, allowing Australia to establish a spin choke."
      ];
      key_performer = "Travis Head - Stunning match-winning century and clutch catch to dismiss Rohit Sharma.";
      factors = [
        "Australia's elite fielding performance saving a projected 25+ runs inside the circle.",
        "Spin-choke execution in middle overs, preventing boundary rotation entirely.",
        "Cummins' tactical bowling changes preventing set batsmen from settling."
      ];
      insights = [
        "Rotate strike actively against spin traps to prevent required rate inflation.",
        "Establish back-foot defensive fielders to protect sliding cut boundaries.",
        "Incorporate early boundary aggression to offset slow scoring spells."
      ];
    }

    setTimeout(() => {
      setReport({
        match_name: matchName,
        match_summary: summary,
        turning_points: turning_points,
        key_performer: key_performer,
        winning_factors: factors,
        strategic_insights: insights
      });
    }, 1000);
  };

  // If in Live Mode and no provider is active, render fallback card
  if (isLiveOffline) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center">
            <Swords className="h-7 w-7 text-red-500 mr-2" /> Agentic War Room
          </h1>
          <p className="text-slate-400 text-xs mt-1">Convene CricketIQ's elite AI strategists for real-time tactical briefs.</p>
        </div>

        <div className="rounded-3xl border border-amber-500/20 bg-stadium-card p-6 md:p-10 text-center space-y-6 max-w-2xl mx-auto shadow-2xl">
          <WifiOff className="h-14 w-14 text-amber-500 mx-auto animate-pulse" />
          <h3 className="text-xl font-bold text-white uppercase tracking-wider">War Room Live Mode Offline</h3>
          <p className="text-slate-400 text-xs leading-relaxed max-w-md mx-auto">
            The Agentic War Room relies on active live match data structures to coordinate briefings. Since no cricket provider API key is configured, the War Room cannot access live match feeds.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => {
                sessionStorage.setItem('appMode', 'historical');
                window.location.reload();
              }}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-stadium-dark bg-gradient-to-r from-stadium-emerald to-stadium-cyan hover:opacity-90 transition-all cursor-pointer"
            >
              Switch to Historical Mode
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center">
            <Swords className="h-7 w-7 text-stadium-cyan mr-2" /> Agentic War Room
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            APL Hackathon Flagship: Convene specialized AI agents (🏏 Analyst, 📈 Predictor, 🎯 Strategist) side-by-side.
          </p>
        </div>

        {/* Tactical Actions bar */}
        <div className="flex flex-wrap gap-3">
          {/* Match Context Selector */}
          <div className="flex items-center space-x-2 bg-stadium-card border border-stadium-border px-3.5 py-1.5 rounded-xl">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Briefing Context</span>
            <select
              value={selectedMatch}
              onChange={(e) => { setSelectedMatch(e.target.value); setReport(null); }}
              className="bg-transparent text-xs text-white border-0 font-bold focus:ring-0 focus:outline-none cursor-pointer"
            >
              {presetMatches.map(m => (
                <option key={m.id} value={m.id} className="bg-stadium-card text-white text-xs">{m.name}</option>
              ))}
            </select>
          </div>

          {/* Generate Match Report Trigger */}
          <button
            onClick={handleGenerateReport}
            disabled={reportLoading}
            className="px-4 py-2 rounded-xl text-xs font-black text-stadium-dark bg-gradient-to-r from-stadium-emerald to-stadium-cyan hover:opacity-90 shadow-md shadow-stadium-emerald/15 transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-40"
          >
            <FileText className="h-4.5 w-4.5" />
            <span>{reportLoading ? "Compiling..." : "📊 Generate Match Report"}</span>
          </button>
        </div>
      </div>

      {/* Main layout split: Left is Chat room / report, Right is Agent console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Chat / Report Room */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Detailed Match Intelligence Report Panel */}
          {report && (
            <div className="glass-panel border border-stadium-emerald/40 pitch-glow rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative animate-scale-up">
              <div className="absolute top-4 right-4 flex items-center space-x-1 bg-stadium-emerald/15 border border-stadium-emerald/30 text-stadium-emerald text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                <Trophy className="h-3 w-3 mr-0.5 fill-current" /> compiler output
              </div>

              <div className="border-b border-stadium-border/60 pb-4">
                <span className="block text-[9px] font-extrabold text-stadium-cyan uppercase tracking-widest mb-1">CricketIQ Chief Editorial Brief</span>
                <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">{report.match_name}</h2>
              </div>

              {/* Summary */}
              <div className="space-y-2">
                <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center">
                  <Zap className="h-4 w-4 mr-1 text-stadium-cyan fill-current" /> Cinematic Game Recap
                </h3>
                <p className="text-slate-300 text-xs leading-relaxed pl-5 border-l-2 border-stadium-border/65">{report.match_summary}</p>
              </div>

              {/* Turning Points & Key Performer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Turning Points list */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-stadium-emerald uppercase tracking-wider flex items-center">
                    <Activity className="h-4 w-4 mr-1.5" /> Turning Point Milestones
                  </h4>
                  <ul className="space-y-2 text-slate-400 text-[11px] pl-1">
                    {report.turning_points.map((tp, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-stadium-emerald shrink-0 font-bold mr-1.5">&bull;</span>
                        <span>{tp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* MVP highlight */}
                <div className="bg-stadium-dark/50 border border-stadium-border rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Man of the Match MVP</span>
                    <span className="text-white text-xs font-black block leading-normal">{report.key_performer.split(' - ')[0]}</span>
                    <span className="text-slate-400 text-[11px] block mt-1.5">{report.key_performer.split(' - ')[1] || report.key_performer}</span>
                  </div>
                  <div className="text-[10px] text-stadium-cyan font-bold mt-4 flex items-center justify-end">
                    <ShieldCheck className="h-4 w-4 mr-1 text-stadium-cyan" /> strategic impact peak
                  </div>
                </div>
              </div>

              {/* Winning Factors & Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-stadium-border/50 pt-6">
                {/* Winning factors */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1.5 text-stadium-emerald" /> Tactical Winning Factors
                  </h4>
                  <ol className="space-y-2 text-slate-400 text-[11px] pl-1">
                    {report.winning_factors.map((f, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-stadium-emerald shrink-0 font-bold mr-2">{idx + 1}.</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Strategic insights */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-stadium-cyan uppercase tracking-wider flex items-center">
                    <Sparkles className="h-4 w-4 mr-1.5" /> Future Strategic Recommendations
                  </h4>
                  <ul className="space-y-2 text-slate-400 text-[11px] pl-1">
                    {report.strategic_insights.map((ins, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-stadium-cyan shrink-0 mr-1.5">&bull;</span>
                        <span>{ins}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setReport(null)}
                  className="px-4 py-2 border border-stadium-border text-slate-400 hover:text-white rounded-xl text-xs hover:bg-stadium-border/40 transition-all cursor-pointer"
                >
                  Close Report
                </button>
              </div>

            </div>
          )}

          {/* AI Battle Console Balloon Stream */}
          <div className="glass-panel border border-stadium-border rounded-3xl h-[560px] flex flex-col overflow-hidden shadow-2xl">
            
            {/* Thread Header */}
            <div className="px-6 py-4 bg-stadium-card/90 border-b border-stadium-border flex justify-between items-center shrink-0">
              <div className="flex items-center space-x-3.5">
                <div className="h-9 w-9 bg-stadium-cyan/15 rounded-lg border border-stadium-cyan/35 flex items-center justify-center shrink-0">
                  <Swords className="h-5.5 w-5.5 text-stadium-cyan" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-white tracking-wide">AI Battle Command Thread</span>
                  <span className="block text-[9px] text-slate-500 font-extrabold uppercase tracking-widest">
                    Conventing: {activeAgent === 'all' ? "Analyst, Predictor, Strategist" : `${activeAgent} agent`}
                  </span>
                </div>
              </div>

              <span className="text-[9px] font-black px-2.5 py-1 rounded-full text-stadium-cyan bg-stadium-cyan/10 border border-stadium-cyan/20 uppercase tracking-wider flex items-center animate-pulse">
                <ShieldCheck className="h-4 w-4 mr-1 text-stadium-cyan" /> active war room
              </span>
            </div>

            {/* Balloon thread scroll */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-stadium-dark/40">
              {responses.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 max-w-sm mx-auto opacity-75">
                  <Bot className="h-12 w-12 text-slate-600" />
                  <span className="text-xs font-bold text-white block">Convene the Counsel</span>
                  <span className="text-[10px] text-slate-500 leading-normal block">
                    Select an active agent configuration on the right, type a tactical question below, or execute a **Quick Strategy** trigger to initiate briefings.
                  </span>
                </div>
              ) : (
                responses.map((msg, index) => {
                  const isUser = msg.role === 'user';
                  if (isUser) {
                    return (
                      <div key={index} className="flex items-start space-x-4 max-w-[85%] ml-auto flex-row-reverse space-x-reverse">
                        <div className="p-2.5 rounded-xl border shrink-0 bg-stadium-emerald/10 border-stadium-emerald/30 text-stadium-emerald">
                          <User className="h-5 w-5" />
                        </div>
                        <div className="rounded-2xl p-4 border bg-stadium-emerald/10 border-stadium-emerald/30 text-white text-xs font-semibold shadow-md">
                          {msg.content}
                        </div>
                      </div>
                    );
                  }

                  // Assistant reply
                  if (msg.type === 'single') {
                    const agentColors = {
                      analyst: "border-stadium-emerald/30 text-stadium-emerald bg-stadium-emerald/10",
                      predictor: "border-stadium-cyan/30 text-stadium-cyan bg-stadium-cyan/10",
                      strategist: "border-purple-500/30 text-purple-400 bg-purple-500/10"
                    };
                    return (
                      <div key={index} className="flex items-start space-x-4 max-w-[90%]">
                        <div className="p-2.5 rounded-xl border shrink-0 bg-stadium-cyan/10 border-stadium-cyan/30 text-stadium-cyan">
                          <Bot className="h-5 w-5" />
                        </div>
                        <div className="space-y-2">
                          <div className="rounded-2xl p-4 border bg-stadium-card/90 border-stadium-border text-slate-200 text-xs leading-relaxed shadow-lg">
                            <span className={`inline-block text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border mb-3 ${agentColors[msg.agent] || ""}`}>
                              {msg.agent} agent report
                            </span>
                            <p>{msg.reply}</p>
                            
                            {msg.strategic_insights && msg.strategic_insights.length > 0 && (
                              <div className="mt-4 pt-3 border-t border-stadium-border/50">
                                <span className="text-[10px] text-stadium-cyan font-black uppercase tracking-wider block mb-1.5">Actionable insights</span>
                                <ul className="space-y-1.5 text-slate-400 pl-1 text-[11px]">
                                  {msg.strategic_insights.map((ins, iIdx) => (
                                    <li key={iIdx} className="flex items-start">
                                      <span className="text-stadium-cyan shrink-0 mr-1.5">&bull;</span>
                                      <span>{ins}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                          <span className="inline-block text-[9px] font-extrabold text-slate-500 bg-stadium-dark px-2 py-0.5 rounded-full border border-stadium-border/60">
                            Confidence Level: <span className="text-stadium-cyan">{Math.round(msg.confidence_score * 100)}%</span>
                          </span>
                        </div>
                      </div>
                    );
                  }

                  // Multi-agent side-by-side briefing!
                  return (
                    <div key={index} className="space-y-4">
                      <div className="flex items-center space-x-2 text-xs font-black uppercase text-stadium-cyan">
                        <Swords className="h-4 w-4 text-stadium-cyan" /> <span>Multi-Agent Joint Counsel Briefing</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {msg.agents.map((agData, agIdx) => {
                          const agentIcons = {
                            analyst: Activity,
                            predictor: TrendingUp,
                            strategist: Sparkles
                          };
                          const agentColors = {
                            analyst: "border-stadium-emerald/40 text-stadium-emerald",
                            predictor: "border-stadium-cyan/40 text-stadium-cyan",
                            strategist: "border-purple-500/40 text-purple-400"
                          };
                          const Icon = agentIcons[agData.agent] || Bot;
                          return (
                            <div key={agIdx} className="rounded-2xl p-4 border bg-stadium-card/90 border-stadium-border text-slate-200 text-[11px] leading-relaxed shadow-lg flex flex-col justify-between">
                              <div>
                                <div className="flex items-center justify-between border-b border-stadium-border/50 pb-2 mb-3">
                                  <span className={`text-[9px] font-black uppercase tracking-wider ${agentColors[agData.agent] || ""}`}>
                                    {agData.agent}
                                  </span>
                                  <Icon className={`h-4 w-4 ${agentColors[agData.agent] || "text-slate-400"}`} />
                                </div>
                                <p className="text-slate-300 leading-normal">{agData.reply}</p>
                              </div>

                              {agData.strategic_insights && agData.strategic_insights.length > 0 && (
                                <div className="mt-4 pt-3 border-t border-stadium-border/30">
                                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Top recommendation</span>
                                  <span className="text-[10px] text-slate-400 italic block leading-snug">
                                    "{agData.strategic_insights[0]}"
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}

              {/* Chat Loading */}
              {loading && (
                <div className="flex items-start space-x-4">
                  <div className="p-2.5 rounded-xl border shrink-0 bg-stadium-cyan/10 border-stadium-cyan/30 text-stadium-cyan animate-pulse">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="rounded-2xl p-4 border bg-stadium-card/90 border-stadium-border flex items-center space-x-2 shadow-lg">
                    <span className="text-[10px] text-slate-400 font-bold mr-1">Convening counsel briefing</span>
                    <div className="w-1.5 h-1.5 bg-stadium-cyan rounded-full animate-bounce animate-pulse" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-stadium-cyan rounded-full animate-bounce animate-pulse" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-stadium-cyan rounded-full animate-bounce animate-pulse" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-stadium-card/60 border-t border-stadium-border shrink-0">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleQuerySubmit(userInput); }}
                className="relative flex items-center bg-stadium-dark/95 border border-stadium-border focus-within:border-stadium-cyan/60 rounded-xl px-4 py-2 transition-all shadow-inner"
              >
                <input 
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Ask a strategic war room question or choose a prompt..."
                  className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none py-2"
                  disabled={loading}
                />
                <button 
                  type="submit"
                  disabled={!userInput.trim() || loading}
                  className="p-1.5 text-stadium-cyan hover:text-white disabled:opacity-30 transition-all shrink-0 cursor-pointer"
                >
                  <Send className="h-4.5 w-4.5" />
                </button>
              </form>
            </div>

          </div>

        </div>

        {/* Right 1 Column: Agent selector & tactical triggers */}
        <div className="space-y-6">
          
          {/* Agent Configuration selectors */}
          <div className="glass-panel border border-stadium-border rounded-3xl p-5 space-y-4">
            <h3 className="text-xs font-black text-white uppercase tracking-wider mb-2 flex items-center">
              <Bot className="h-4.5 w-4.5 text-stadium-cyan mr-1.5 animate-pulse" /> Configure AI Council
            </h3>
            
            <div className="space-y-2.5">
              
              {/* Convene All agents card */}
              <button
                onClick={() => setActiveAgent("all")}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-300 flex items-center justify-between cursor-pointer ${
                  activeAgent === 'all'
                    ? 'bg-gradient-to-r from-stadium-cyan/15 to-purple-500/10 border-stadium-cyan/50 text-white shadow-lg'
                    : 'bg-stadium-dark/40 border-stadium-border/60 hover:bg-stadium-border/30 text-slate-400'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-xl border ${activeAgent === 'all' ? 'bg-stadium-cyan/20 border-stadium-cyan/40 text-stadium-cyan' : 'bg-stadium-border text-slate-500'}`}>
                    <Swords className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-white">Convene Joint Counsel</span>
                    <span className="block text-[9px] text-slate-500 font-semibold mt-0.5">Joint Analyst, Predictor, Strategist brief</span>
                  </div>
                </div>
                <div className="h-2 w-2 rounded-full bg-stadium-cyan animate-pulse"></div>
              </button>

              {/* Analyst Agent */}
              <button
                onClick={() => setActiveAgent("analyst")}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-300 flex items-center justify-between cursor-pointer ${
                  activeAgent === 'analyst'
                    ? 'bg-gradient-to-r from-stadium-emerald/15 to-stadium-emerald/5 border-stadium-emerald/50 text-white shadow-lg'
                    : 'bg-stadium-dark/40 border-stadium-border/60 hover:bg-stadium-border/30 text-slate-400'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-xl border ${activeAgent === 'analyst' ? 'bg-stadium-emerald/20 border-stadium-emerald/40 text-stadium-emerald' : 'bg-stadium-border text-slate-500'}`}>
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-white">🏏 Analyst Agent</span>
                    <span className="block text-[9px] text-slate-500 font-semibold mt-0.5">Explains momentum, turning points</span>
                  </div>
                </div>
              </button>

              {/* Predictor Agent */}
              <button
                onClick={() => setActiveAgent("predictor")}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-300 flex items-center justify-between cursor-pointer ${
                  activeAgent === 'predictor'
                    ? 'bg-gradient-to-r from-stadium-cyan/15 to-stadium-cyan/5 border-stadium-cyan/50 text-white shadow-lg'
                    : 'bg-stadium-dark/40 border-stadium-border/60 hover:bg-stadium-border/30 text-slate-400'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-xl border ${activeAgent === 'predictor' ? 'bg-stadium-cyan/20 border-stadium-cyan/40 text-stadium-cyan' : 'bg-stadium-border text-slate-500'}`}>
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-white">📈 Predictor Agent</span>
                    <span className="block text-[9px] text-slate-500 font-semibold mt-0.5">Explains win probability & outcomes</span>
                  </div>
                </div>
              </button>

              {/* Strategist Agent */}
              <button
                onClick={() => setActiveAgent("strategist")}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-300 flex items-center justify-between cursor-pointer ${
                  activeAgent === 'strategist'
                    ? 'bg-gradient-to-r from-purple-950/20 to-purple-900/10 border-purple-500/40 text-white shadow-lg'
                    : 'bg-stadium-dark/40 border-stadium-border/60 hover:bg-stadium-border/30 text-slate-400'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-xl border ${activeAgent === 'strategist' ? 'bg-purple-500/20 border-purple-500/40 text-purple-400' : 'bg-stadium-border text-slate-500'}`}>
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-white">🎯 Strategist Agent</span>
                    <span className="block text-[9px] text-slate-500 font-semibold mt-0.5">Suggests live tactical decisions next</span>
                  </div>
                </div>
              </button>

            </div>

          </div>

          {/* Quick strategy triggers */}
          <div className="glass-panel border border-stadium-emerald/30 pitch-glow rounded-3xl p-5 space-y-4">
            <h3 className="text-xs font-black text-stadium-emerald uppercase tracking-wider flex items-center">
              <Zap className="h-4 w-4 text-stadium-emerald mr-1.5" /> Quick strategy triggers
            </h3>
            <p className="text-[10px] text-slate-500 leading-normal leading-normal">
              Click any quick trigger to run deep tactical analysis over the active scorecard details:
            </p>

            <div className="space-y-2">
              {presetQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuerySubmit(q)}
                  disabled={loading}
                  className="w-full text-left px-3.5 py-2.5 bg-stadium-border/20 border border-stadium-border hover:border-stadium-cyan/20 hover:bg-stadium-border/50 text-[10px] font-bold text-slate-300 hover:text-white rounded-xl transition-all duration-200 truncate cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
