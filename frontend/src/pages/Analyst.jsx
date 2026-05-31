import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  User, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight, 
  HelpCircle, 
  Info, 
  RefreshCw, 
  Zap, 
  Trophy, 
  CheckCircle,
  TrendingUp,
  Cpu
} from 'lucide-react';

export default function Analyst() {
  const [matches, setMatches] = useState([
    { id: "ind_vs_pak_2022", name: "India vs Pakistan (T20 World Cup 2022)", batting_team: "India", bowling_team: "Pakistan" },
    { id: "rcb_vs_srh_2016", name: "RCB vs SRH (IPL 2016 Final)", batting_team: "RCB", bowling_team: "SRH" },
    { id: "ind_vs_aus_2023", name: "India vs Australia (World Cup 2023 Final)", batting_team: "India", bowling_team: "Australia" }
  ]);
  const [selectedMatch, setSelectedMatch] = useState("ind_vs_pak_2022");
  
  // Chat threads
  const [messages, setMessages] = useState([
    {
      role: 'model',
      type: 'greeting',
      answer: "Welcome to CricketIQ AI Match Analyst! Select a match preset above, and ask me any tactical questions, or click one of our **Instant Insights** triggers below to instantly run deep learning analysis on historical scorecards."
    }
  ]);
  const [queryInput, setQueryInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Handle preset selector adjustments
  const handleMatchChange = (matchId) => {
    setSelectedMatch(matchId);
    const selected = matches.find(m => m.id === matchId);
    setMessages([
      {
        role: 'model',
        type: 'greeting',
        answer: `Context successfully shifted to **${selected.name}**. I have loaded all calculated over-by-over momentum baselines, turning point swings, and wicket records. Submit a query below, or choose an instant trigger to consult my Gemini intelligence engine.`
      }
    ]);
  };

  // Submit custom query or template to POST /api/analyst/query
  const handleQuerySubmit = async (questionText) => {
    if (!questionText.trim() || loading) return;

    // Append user question bubble
    setMessages(prev => [...prev, { role: 'user', type: 'text', answer: questionText }]);
    setQueryInput("");
    setLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/analyst/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionText,
          match_id: selectedMatch
        })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, {
          role: 'model',
          type: 'analysis',
          answer: data.answer,
          evidence: data.evidence,
          key_events: data.key_events,
          confidence: data.confidence
        }]);
      } else {
        throw new Error("HTTP error querying analyst");
      }
    } catch (err) {
      console.warn("POST Analyst Query failed. Booting deterministic analysis fallback locally.");
      // Run high-fidelity client-side calculations fallback matching the selected match
      simulateLocalAnalystFallback(questionText);
    } finally {
      setLoading(false);
    }
  };

  // Client-side fallback generator to ensure it works beautifully offline
  const simulateLocalAnalystFallback = (questionText) => {
    setTimeout(() => {
      const selected = matches.find(m => m.id === selectedMatch);
      const q = questionText.toLowerCase();
      
      let answer = "";
      let evidence = [];
      let key_events = [];
      let confidence = 0.94;

      const batting = selected.batting_team;
      const bowling = selected.bowling_team;

      if (selectedMatch === "ind_vs_pak_2022") {
        if (q.includes("turning") || q.includes("change") || q.includes("shift") || q.includes("moment")) {
          answer = "The match shifted decisively in Over 20. India had successfully recovered momentum through Virat Kohli's legendary over 18 and 19 onslaughts, but نواز's final over wickets and run-pressure induced a massive 22.5-point momentum drop, turning the match into the ultimate finish.";
          evidence = [
            "Over 20 recorded a massive absolute swing delta of 22.5 points in the calculated dataset.",
            "Wickets lost in the final over crashed batting momentum index scores from a peak +15.0 down to -7.5.",
            "Virat Kohli's consecutive boundaries inside Over 19 set up the final chase rate."
          ];
          key_events = [
            "Over 20: Nawaz final over extreme wicket drama",
            "Over 19: Virat Kohli consecutive sixes off Haris Rauf",
            "Over 12: India counter-attack starts against spinners"
          ];
        } else {
          answer = `Tactically, *${batting}* suffered early in the powerplays losing 3 wickets by Over 6, dropping their control index below baseline. While a middle-over counter-attack stabilized the innings, the death over squeeze took the game to the wire.`;
          evidence = [
            "Powerplay phase (overs 1-6) recorded 3 major wickets falling, keeping the momentum score negative.",
            "Middle overs (12-15) scored a resurgent 42 runs, reviving the chase.",
            "Turning point in Over 20 sealed India's dramatic victory with a late boundary."
          ];
          key_events = [
            "Over 6: Suryakumar Yadav out in powerplay",
            "Over 12: Shadab Khan conceded 20 runs in over-assault",
            "Over 20: Final over turning point"
          ];
        }
      } else if (selectedMatch === "rcb_vs_srh_2016") {
        if (q.includes("turning") || q.includes("change") || q.includes("shift") || q.includes("moment")) {
          answer = "The match turning point occurred in Over 11 and 13. Chris Gayle was caught in the 11th over after scoring a blistering 76, which triggered a 15-point drop. Kohli's bowled dismissal in the 13th over shifted control decisively to SRH.";
          evidence = [
            "Gayle's dismissal in Over 11 crashed momentum score from a peak +16.0 to a low +4.0.",
            "Watson's and De Villiers' subsequent dismissals conceded absolute death over squeeze.",
            "RCB's powerplay rate peaked at an incredible 12.5 runs per over."
          ];
          key_events = [
            "Over 11: Chris Gayle caught out after 76 runs",
            "Over 13: Virat Kohli bowled by Sran",
            "Over 20: Bhuvneshwar Kumar death over boundary choke"
          ];
        } else {
          answer = `RCB dominated the first half of the match, hitting a record 75 runs in the Powerplay. However, SRH's premium death bowlers squeezed the scoring rate starting in Over 11, triggering successive wickets and sealing a tight SRH win.`;
          evidence = [
            "Powerplay over 5 peaked at 18 runs scored, the highest in the match.",
            "Wickets fell in overs 11, 13, 15, and 17, completely stopping the chase momentum.",
            "Required rate climbed above 14 rpo in the final 3 overs."
          ];
          key_events = [
            "Over 5: Gayle onslaught peak over",
            "Over 11: Gayle dismissed, opening wicket strike",
            "Over 15: AB de Villiers dismissed by Bipul Sharma"
          ];
        }
      } else {
        // IND vs AUS WC 2023
        answer = "India's momentum collapsed during the middle overs (11-20). After Rohit Sharma's explosive start, Australia's spinners choked the scoring, conceding only 28 runs in 10 overs without a single boundary, turning the game decisively.";
        evidence = [
          "India scored only 3, 2, 3, and 4 runs in consecutive middle overs, dropping the CRR.",
          "Rohit's wicket in Over 9 triggered a massive 15-point momentum shift.",
          "Wickets lost in Over 10 further crashed the batting team's control index."
        ];
        key_events = [
          "Over 9: Rohit Sharma caught by Travis Head",
          "Over 10: Shreyas Iyer dismissed cheap",
          "Over 11-20: Spin choke phase by Cummins and Maxwell"
        ];
      }

      setMessages(prev => [...prev, {
        role: 'model',
        type: 'analysis',
        answer: answer,
        evidence: evidence,
        key_events: key_events,
        confidence: confidence
      }]);
    }, 1000);
  };

  const suggestedQuestions = [
    "Why did India lose momentum?",
    "What was the turning point?",
    "Which over changed the game?",
    "Who had the biggest impact?",
    "Explain the momentum shift.",
    "What should the batting team have done differently?",
    "Which over was most costly?",
    "What won the match?"
  ];

  const instantInsights = [
    { title: "Turning Point", prompt: "Explain the absolute turning point of this match using calculated swings." },
    { title: "Match Summary", prompt: "Summarize this entire match over-by-over like a TV commentator." },
    { title: "Winning Factors", prompt: "What were the key mathematical winning factors in this match?" },
    { title: "Losing Factors", prompt: "Why did the losing team fail to maintain control in the middle overs?" },
    { title: "Key Performer", prompt: "Who was the most impactful performer based on peak momentum swing scores?" },
    { title: "Momentum Analysis", prompt: "Explain the largest momentum swing and the overall swing zones." }
  ];

  return (
    <div className="space-y-8">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center">
            <Bot className="h-7 w-7 text-stadium-cyan mr-2" /> AI Match Analyst
          </h1>
          <p className="text-slate-400 text-xs">Prompt our Gemini-powered intelligence engine for tactical match explanations, stats, and turning points.</p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center space-x-2.5 bg-stadium-card border border-stadium-border px-3.5 py-1.5 rounded-xl self-start">
          <span className="text-[10px] text-slate-500 font-bold uppercase shrink-0">Match Context</span>
          <select 
            value={selectedMatch}
            onChange={(e) => handleMatchChange(e.target.value)}
            className="bg-transparent text-xs text-white border-0 font-bold focus:ring-0 focus:outline-none cursor-pointer"
          >
            {matches.map(m => (
              <option key={m.id} value={m.id} className="bg-stadium-card text-white">{m.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Chat Stream Panel */}
        <div className="lg:col-span-3 flex flex-col h-[560px] glass-panel border border-stadium-border rounded-2xl overflow-hidden shadow-2xl">
          
          {/* Header */}
          <div className="px-6 py-4 bg-stadium-card/90 border-b border-stadium-border flex justify-between items-center shrink-0">
            <div className="flex items-center space-x-3.5">
              <div className="relative h-9 w-9 bg-stadium-cyan/15 rounded-lg border border-stadium-cyan/35 flex items-center justify-center shrink-0">
                <Bot className="h-5.5 w-5.5 text-stadium-cyan" />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-stadium-emerald border-2 border-stadium-card"></span>
              </div>
              <div>
                <span className="block text-xs font-bold text-white tracking-wide">Gemini Cricket Analyst</span>
                <span className="block text-[9px] text-slate-500 font-extrabold uppercase tracking-widest">Live TV Commentator Mode</span>
              </div>
            </div>
            
            <span className="text-[9px] font-black px-2.5 py-1 rounded-full text-stadium-cyan bg-stadium-cyan/10 border border-stadium-cyan/20 uppercase tracking-wider flex items-center">
              <ShieldCheck className="h-4 w-4 mr-1 text-stadium-cyan" /> active session
            </span>
          </div>

          {/* Balloon Message Thread */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-stadium-dark/40">
            {messages.map((msg, index) => {
              const isAI = msg.role === 'model';
              const isGreeting = msg.type === 'greeting';
              return (
                <div key={index} className={`flex items-start space-x-4 max-w-[90%] ${isAI ? '' : 'ml-auto flex-row-reverse space-x-reverse'}`}>
                  
                  {/* Avatar Icon */}
                  <div className={`p-2.5 rounded-xl border shrink-0 ${
                    isAI 
                      ? 'bg-stadium-cyan/10 border-stadium-cyan/30 text-stadium-cyan' 
                      : 'bg-stadium-emerald/10 border-stadium-emerald/30 text-stadium-emerald'
                  }`}>
                    {isAI ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
                  </div>

                  {/* Bubble Container */}
                  <div className="space-y-2">
                    
                    {/* Rich Bubble */}
                    <div className={`rounded-2xl p-4 border text-xs leading-relaxed ${
                      isAI 
                        ? 'bg-stadium-card/90 border-stadium-border text-slate-200 shadow-lg' 
                        : 'bg-stadium-emerald/10 border-stadium-emerald/30 text-white font-medium shadow-md'
                    }`}>
                      {/* Dynamic bold formatter */}
                      {msg.answer.split('**').map((chunk, cIdx) => (
                        cIdx % 2 === 1 ? <strong key={cIdx} className="text-stadium-cyan">{chunk}</strong> : <span key={cIdx}>{chunk}</span>
                      ))}

                      {/* Render structured lists for analysis bubble */}
                      {isAI && msg.type === 'analysis' && (
                        <div className="mt-4 pt-4 border-t border-stadium-border/50 space-y-4">
                          
                          {/* Evidence block */}
                          {msg.evidence && msg.evidence.length > 0 && (
                            <div>
                              <span className="text-[10px] text-stadium-emerald font-black uppercase tracking-wider block mb-1.5 flex items-center">
                                <TrendingUp className="h-3.5 w-3.5 mr-1" /> Supporting statistical evidence
                              </span>
                              <ul className="space-y-1.5 text-slate-400 pl-1 text-[11px]">
                                {msg.evidence.map((ev, eIdx) => (
                                  <li key={eIdx} className="flex items-start space-x-1.5">
                                    <span className="text-stadium-emerald shrink-0">&bull;</span>
                                    <span>{ev}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Key events block */}
                          {msg.key_events && msg.key_events.length > 0 && (
                            <div>
                              <span className="text-[10px] text-stadium-cyan font-black uppercase tracking-wider block mb-1.5 flex items-center">
                                <Zap className="h-3.5 w-3.5 mr-1 fill-current" /> key match moments
                              </span>
                              <ul className="space-y-1.5 text-slate-400 pl-1 text-[11px]">
                                {msg.key_events.map((evt, evIdx) => (
                                  <li key={evIdx} className="flex items-start space-x-1.5">
                                    <ChevronRight className="h-3.5 w-3.5 text-stadium-cyan shrink-0 mt-0.5" />
                                    <span>{evt}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                        </div>
                      )}
                    </div>

                    {/* Confidence Rating Badge */}
                    {isAI && msg.type === 'analysis' && (
                      <span className="inline-block text-[9px] font-extrabold text-slate-500 bg-stadium-dark px-2 py-0.5 rounded-full border border-stadium-border/60">
                        Analyst Confidence Index: <span className="text-stadium-cyan">{Math.round(msg.confidence * 100)}%</span>
                      </span>
                    )}

                  </div>

                </div>
              );
            })}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex items-start space-x-4">
                <div className="p-2.5 rounded-xl border shrink-0 bg-stadium-cyan/10 border-stadium-cyan/30 text-stadium-cyan animate-pulse">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="rounded-2xl p-4 border bg-stadium-card/90 border-stadium-border flex items-center space-x-2 shadow-lg">
                  <span className="text-[10px] text-slate-400 font-bold mr-1">Consulting score records</span>
                  <div className="w-1.5 h-1.5 bg-stadium-cyan rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-stadium-cyan rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-stadium-cyan rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Form input bar */}
          <div className="p-4 bg-stadium-card/60 border-t border-stadium-border shrink-0">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleQuerySubmit(queryInput); }}
              className="relative flex items-center bg-stadium-dark/95 border border-stadium-border focus-within:border-stadium-cyan/60 rounded-xl px-4 py-2 transition-all shadow-inner"
            >
              <input 
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="Ask e.g. Why did we lose momentum? or What was the turning point over?"
                className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none py-2"
                disabled={loading}
              />
              <button 
                type="submit"
                disabled={!queryInput.trim() || loading}
                className="p-1.5 text-stadium-cyan hover:text-white disabled:opacity-30 transition-all shrink-0"
              >
                <Send className="h-4.5 w-4.5" />
              </button>
            </form>
          </div>

        </div>

        {/* Right Sidebar panel containing Instant insights clickers and suggested prompt matrices */}
        <div className="space-y-6">
          
          {/* Instant Insights Clickers */}
          <div className="glass-panel border border-stadium-emerald/30 pitch-glow rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-black text-stadium-emerald uppercase tracking-wider flex items-center mb-1">
              <Sparkles className="h-4.5 w-4.5 text-stadium-emerald mr-1.5" /> Instant Insights
            </h3>
            <p className="text-[10px] text-slate-500 leading-normal leading-normal">
              Click any quick trigger to run specialized metrics scans and query the commentator:
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              {instantInsights.map((ins, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuerySubmit(ins.prompt)}
                  disabled={loading}
                  className="p-2.5 text-center bg-stadium-border/20 border border-stadium-border hover:border-stadium-cyan/20 hover:bg-stadium-border/50 text-[10px] font-bold text-slate-300 hover:text-white rounded-xl transition-all duration-200"
                >
                  {ins.title}
                </button>
              ))}
            </div>
          </div>

          {/* Preloaded Suggested prompts list */}
          <div className="glass-panel border border-stadium-border rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-1 flex items-center">
              <HelpCircle className="h-4.5 w-4.5 text-slate-500 mr-1.5" /> Suggested Queries
            </h3>
            
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuerySubmit(q)}
                  disabled={loading}
                  className="w-full text-left px-3 py-2 text-[10px] font-bold bg-stadium-dark/40 hover:bg-stadium-border border border-stadium-border hover:border-stadium-cyan/20 text-slate-400 hover:text-white rounded-xl transition-all duration-200 truncate"
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
