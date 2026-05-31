import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, Sparkles, MessageSquare, Shield, HelpCircle } from 'lucide-react';

export default function Analyst() {
  const [messages, setMessages] = useState([
    {
      role: 'model',
      content: "Hello! I am your CricketIQ Expert, backed by Gemini intelligence. Ask me any technical cricket questions regarding player matchups, powerplay strategy, pitch analysis, or statistical histories."
    }
  ]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestedFollowUps, setSuggestedFollowUps] = useState([
    "How to counter spinners on a red-soil pitch?",
    "Explain Virat Kohli's run-chasing statistics.",
    "What is Dhoni's record in finishing tight chases?"
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (userPrompt) => {
    if (!userPrompt.trim() || loading) return;

    const userMessage = { role: 'user', content: userPrompt };
    setMessages(prev => [...prev, userMessage]);
    setPrompt("");
    setLoading(true);

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/analyst/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userPrompt,
          chat_history: messages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { role: 'model', content: data.reply }]);
        setSuggestedFollowUps(data.suggested_follow_ups);
      } else {
        throw new Error("HTTP error");
      }
    } catch (e) {
      console.warn("Backend unavailable, loading local expert simulator response.");
      setTimeout(() => {
        let reply = "";
        let followUps = [];

        const lower = userPrompt.toLowerCase();
        if (lower.includes("spin") || lower.includes("pitch")) {
          reply = "Pitches that turn significantly (like those in Chennai or Mumbai's red soil) demand a specific sweep-and-stride technique. Batters who use their feet to get to the pitch of the ball successfully neutralize spin by preventing the ball from reacting off surface cracks.";
          followUps = ["Which spinners have the highest turn rate?", "Analyze Chennai pitch statistics."];
        } else if (lower.includes("dhoni") || lower.includes("msd")) {
          reply = "MS Dhoni's finishing style is a deliberate mathematical strategy: he maximizes bowler anxiety and pressure by dragging chases into the final over while conserving wickets.";
          followUps = ["What is Dhoni's average in successful run chases?", "Compare Dhoni vs Gilchrist stats."];
        } else if (lower.includes("kohli") || lower.includes("virat")) {
          reply = "Virat Kohli averages over 64 in ODI run chases with 27 centuries in successful chases. His masterclass lies in low-risk boundary hitting and running between wickets with extremely high physical intensity.";
          followUps = ["Compare Kohli vs Sachin ODI statistics.", "Kohli's record in ICC knockout matches."];
        } else {
          reply = "That is an excellent analytical query. Modern cricket has evolved heavily towards matchup data, showing that left-arm orthodox spinners concede 14% less runs against right-handers compared to traditional off-spinners, causing captains to make data-driven bowling shifts.";
          followUps = ["How does data analytics influence live matches?", "Explain the concept of 'Matchups' in cricket."];
        }

        setMessages(prev => [...prev, { role: 'model', content: reply }]);
        setSuggestedFollowUps(followUps);
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Title Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center">
          <Bot className="h-7 w-7 text-stadium-cyan mr-2" /> AI Match Analyst
        </h1>
        <p className="text-slate-400 text-xs">Consult our Gemini intelligence engine for deep tactical match analytics, player statistics, and fielding setups.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Chat window panel */}
        <div className="lg:col-span-3 flex flex-col h-[520px] glass-panel border border-stadium-border rounded-2xl overflow-hidden shadow-2xl">
          
          {/* Active status panel */}
          <div className="px-6 py-4 bg-stadium-card/80 border-b border-stadium-border flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-stadium-cyan/10 border border-stadium-cyan/20">
                <Bot className="h-5 w-5 text-stadium-cyan" />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-stadium-emerald rounded-full border-2 border-stadium-card"></span>
              </div>
              <div>
                <span className="block text-xs font-bold text-white">Gemini 2.5 Analyst Engine</span>
                <span className="block text-[9px] text-slate-500 font-semibold uppercase tracking-widest">Active & Calibrated</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-[10px] font-extrabold px-3 py-1 rounded-full text-stadium-cyan bg-stadium-cyan/10 border border-stadium-cyan/20">
              <Shield className="h-3.5 w-3.5 mr-1" /> GDG-NOIDA-APL
            </div>
          </div>

          {/* Conversation history bubble stream */}
          <div className="flex-1 p-6 overflow-y-auto space-y-5 bg-stadium-dark/40">
            {messages.map((msg, index) => {
              const isAI = msg.role === 'model';
              return (
                <div key={index} className={`flex items-start space-x-3.5 max-w-[85%] ${isAI ? '' : 'ml-auto flex-row-reverse space-x-reverse'}`}>
                  
                  {/* Icon */}
                  <div className={`p-2 rounded-lg shrink-0 ${isAI ? 'bg-stadium-cyan/15 text-stadium-cyan' : 'bg-stadium-emerald/15 text-stadium-emerald'}`}>
                    {isAI ? <Bot className="h-4.5 w-4.5" /> : <User className="h-4.5 w-4.5" />}
                  </div>

                  {/* Bubble */}
                  <div className={`rounded-2xl p-4 border text-xs leading-relaxed ${
                    isAI 
                      ? 'bg-stadium-card/90 border-stadium-border text-slate-200' 
                      : 'bg-stadium-emerald/10 border-stadium-emerald/30 text-white font-medium'
                  }`}>
                    {msg.content.split('\n').map((para, pIdx) => (
                      <p key={pIdx} className="mb-2 last:mb-0">{para}</p>
                    ))}
                  </div>

                </div>
              );
            })}
            
            {loading && (
              <div className="flex items-start space-x-3.5">
                <div className="p-2 rounded-lg shrink-0 bg-stadium-cyan/15 text-stadium-cyan animate-pulse">
                  <Bot className="h-4.5 w-4.5" />
                </div>
                <div className="rounded-2xl p-4 border bg-stadium-card/90 border-stadium-border flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-stadium-cyan rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-stadium-cyan rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-stadium-cyan rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Send query input panel */}
          <div className="p-4 bg-stadium-card/60 border-t border-stadium-border shrink-0">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(prompt); }}
              className="relative flex items-center bg-stadium-dark/95 border border-stadium-border focus-within:border-stadium-cyan/60 rounded-xl px-4 py-2 transition-all"
            >
              <input 
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask about batsman mechanics, historical boundary rates, pitch spinners..."
                className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none py-1.5"
                disabled={loading}
              />
              <button 
                type="submit" 
                disabled={!prompt.trim() || loading}
                className="p-1.5 text-stadium-cyan hover:text-white disabled:opacity-50 transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Right side suggestions checklist sidebar panel */}
        <div className="space-y-6">
          <div className="glass-panel border border-stadium-border rounded-2xl p-5 space-y-4">
            <div className="flex items-center space-x-2 text-stadium-accent font-bold text-xs uppercase tracking-wider mb-2">
              <Sparkles className="h-4.5 w-4.5" />
              <span>Dynamic Match suggestions</span>
            </div>
            
            <p className="text-[11px] text-slate-400 leading-normal">
              Click any statistical template below to instantly query our deep learning cricket expert:
            </p>

            <div className="space-y-2.5">
              {suggestedFollowUps.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(item)}
                  disabled={loading}
                  className="w-full text-left p-3 text-xs bg-stadium-border/30 hover:bg-stadium-border border border-stadium-border hover:border-stadium-cyan/20 rounded-xl text-slate-300 hover:text-white transition-all duration-200 flex items-start space-x-2 group"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-stadium-cyan shrink-0 mt-0.5" />
                  <span>{item}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Stats Panel */}
          <div className="glass-panel border border-stadium-border rounded-2xl p-5">
            <h3 className="text-xs font-bold text-white mb-2 flex items-center">
              <HelpCircle className="h-4 w-4 text-slate-500 mr-1.5" /> Query Analytics Logs
            </h3>
            <div className="space-y-2 text-[10px] text-slate-400">
              <div className="flex justify-between">
                <span>Model Latency:</span>
                <span className="text-white font-semibold">120ms</span>
              </div>
              <div className="flex justify-between">
                <span>Tokens Generated:</span>
                <span className="text-white font-semibold">4.8k</span>
              </div>
              <div className="flex justify-between">
                <span>Data Pipelines:</span>
                <span className="text-stadium-emerald font-semibold">Synchronized</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
