import { useState, useRef, useEffect } from 'react';
import type { FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Phone, Mail, Instagram, Facebook, Send, Sparkles, User, Bot, X } from 'lucide-react';
import { getChatResponse } from '../services/geminiService';
import { cn } from '../lib/utils';

export default function Contact() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: 'Welcome to the Zuma Matrix. I am Gemini-Ember. How can I assist your culinary induction?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await getChatResponse(userMsg);
      setMessages(prev => [...prev, { role: 'bot', text: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "Signal interference detected. We are located at 123 Obsidian Row, Abuja." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="pt-24 pb-20 bg-obsidian min-h-screen px-6 relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-orange-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-20 text-center">
          <span className="text-[10px] font-mono uppercase tracking-[0.6em] text-ember mb-6 block">Terminal Access</span>
          <h1 className="text-6xl md:text-8xl font-light italic tracking-tighter uppercase mb-6 underline underline-offset-8 decoration-ember/20">The <span className="font-bold not-italic text-white/90">Contact.</span></h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="space-y-16">
            <div className="space-y-6">
               <h3 className="text-xl font-light italic uppercase tracking-tight text-ember">Location Coordinates</h3>
               <p className="text-white/40 text-[10px] uppercase tracking-widest leading-relaxed max-w-sm">
                 123 Obsidian Row, Maitama, Abuja, Nigeria. Valet parking initialized upon approach.
               </p>
               <button className="flex items-center gap-3 text-[8px] font-mono uppercase tracking-[0.3em] text-white/40 hover:text-white transition-colors">
                 <MapPin className="w-3 h-3 text-ember" /> Open in Google Maps
               </button>
            </div>

            <div className="space-y-6">
               <h3 className="text-xl font-light italic uppercase tracking-tight text-ember">Frequency Lines</h3>
               <div className="space-y-4">
                 <a href="tel:+234800ZUMAHEARTH" className="flex items-center gap-6 text-white/40 hover:text-white transition-colors text-[10px] font-mono uppercase tracking-widest">
                   <div className="w-10 h-10 glass-effect rounded-full flex items-center justify-center shrink-0">
                     <Phone className="w-4 h-4 text-ember/60" />
                   </div>
                   +234 (0) 800-ZUMA-HEARTH
                 </a>
                 <a href="mailto:presence@zumahearth.tech" className="flex items-center gap-6 text-white/40 hover:text-white transition-colors text-[10px] font-mono uppercase tracking-widest">
                   <div className="w-10 h-10 glass-effect rounded-full flex items-center justify-center shrink-0">
                     <Mail className="w-4 h-4 text-ember/60" />
                   </div>
                   presence@zumahearth.tech
                 </a>
               </div>
            </div>

            <div className="space-y-6">
               <h3 className="text-xl font-light italic uppercase tracking-tight text-ember">Signal Channels</h3>
               <div className="flex gap-6">
                 <a href="#" className="p-4 glass-effect rounded-2xl hover:border-ember transition-all group">
                   <Instagram className="w-6 h-6 text-white group-hover:text-ember" />
                 </a>
                 <a href="#" className="p-4 glass-effect rounded-2xl hover:border-ember transition-all group">
                   <Facebook className="w-6 h-6 text-white group-hover:text-ember" />
                 </a>
               </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-10 bg-ember/10 blur-[120px]" />
            <div className="relative h-[600px] w-full rounded-[3rem] overflow-hidden glass-effect border-white/5 shadow-2xl">
               {/* Map Placeholder */}
               <iframe 
                width="100%" 
                height="100%" 
                frameBorder={0} 
                scrolling="no" 
                marginHeight={0} 
                marginWidth={0} 
                src="https://maps.google.com/maps?q=Maitama,%20Abuja&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="grayscale invert brightness-50 contrast-125 opacity-30 hover:opacity-60 transition-opacity duration-1000"
               />
            </div>
          </div>
        </div>
      </div>

      {/* AI Chatbot FAB */}
      <div className="fixed bottom-10 right-10 z-[100]">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="absolute bottom-24 right-0 w-80 md:w-96 bg-obsidian/40 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="p-6 bg-white text-black flex justify-between items-center">
                 <div className="flex items-center gap-3">
                   <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-orange-400 to-purple-600 animate-pulse" />
                   <span className="text-[10px] font-bold uppercase tracking-widest">Gemini Concierge</span>
                 </div>
                 <button onClick={() => setIsChatOpen(false)} className="p-1 hover:rotate-90 transition-transform"><X className="w-5 h-5" /></button>
              </div>
              
              <div ref={scrollRef} className="flex-1 h-96 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                {messages.map((msg, idx) => (
                  <div key={idx} className={cn("flex gap-4", msg.role === 'user' ? "flex-row-reverse" : "")}>
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
                      msg.role === 'bot' ? "bg-white/5 border-white/10 text-ember" : "bg-white border-white text-black"
                    )}>
                      {msg.role === 'bot' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    <div className={cn(
                      "p-4 rounded-2xl text-[10px] uppercase tracking-widest leading-relaxed max-w-[80%]",
                      msg.role === 'bot' ? "bg-white/5 text-white/60" : "bg-white/10 border border-white/20 text-white"
                    )}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 text-ember flex items-center justify-center">
                       <Bot className="w-4 h-4 animate-pulse" />
                    </div>
                    <div className="p-4 bg-white/5 text-white/20 text-[8px] uppercase tracking-widest animate-pulse">Consulting Ember Logs...</div>
                  </div>
                )}
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 flex gap-3">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Transmit Signal..." 
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-3 text-[10px] uppercase tracking-widest focus:outline-none focus:border-ember placeholder:text-white/20 transition-all font-mono"
                />
                <button type="submit" className="w-12 h-12 bg-white text-black rounded-xl hover:bg-ember transition-all flex items-center justify-center"><Send className="w-4 h-4" /></button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.15)] hover:scale-110 transition-transform relative z-10 group"
        >
          <Bot className="w-10 h-10 group-hover:rotate-12 transition-transform" />
          <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-10 pointer-events-none" />
        </button>
      </div>
    </div>
  );
}
