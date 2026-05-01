import { motion } from 'motion/react';
import { Flame, Target, Sparkles, Wind } from 'lucide-react';

export default function Story() {
  return (
    <div className="pt-24 min-h-screen bg-obsidian relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-orange-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden z-10">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=2070" 
            className="w-full h-full object-cover opacity-20 grayscale" 
            alt=""
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-transparent to-obsidian" />
        </div>
        <div className="relative z-10 text-center px-6">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.6em] text-ember mb-6 block">Origin Narrative</span>
            <h1 className="text-5xl md:text-8xl font-light italic tracking-tighter uppercase leading-none underline underline-offset-12 decoration-ember/20">The <span className="font-bold not-italic text-ember">Ember</span> Code</h1>
          </motion.div>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-24 px-6 max-w-4xl mx-auto relative z-10">
        <div className="space-y-12 text-white/50 text-lg leading-relaxed font-light">
          <p className="first-letter:text-7xl first-letter:font-light first-letter:italic first-letter:text-ember first-letter:mr-6 first-letter:float-left first-letter:leading-none">
            In the year 2024, Chef Aris Thorne stood before a dying hearth in a forgotten coastal village and realized that the future of dining wasn't in more complexity, but in the mastery of the most basic element. Zuma Hearth was conceived as a laboratory where extreme technology serves to amplify, not replace, the primordial experience of heat.
          </p>
          <p>
            Our philosophy, "The Flame Invariability," dictates that every dish must pass through at least three stages of thermal transformation: The Initial Shock, The Steady Equilibrium, and The Subtle Afterglow.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12">
            <div className="p-10 glass-effect rounded-[2rem] border-white/5 shadow-xl">
               <Target className="w-8 h-8 text-ember mb-6" />
               <h3 className="text-xl font-light italic uppercase tracking-tight mb-4 text-white">The Precision</h3>
               <p className="text-[10px] uppercase tracking-widest leading-relaxed">We use thermal imaging and AI-coupled sensors to monitor each micron of the cooking surface.</p>
            </div>
            <div className="p-10 glass-effect rounded-[2.5rem] border-white/5 shadow-xl">
               <Wind className="w-8 h-8 text-ember mb-6" />
               <h3 className="text-xl font-light italic uppercase tracking-tight mb-4 text-white">The Atmosphere</h3>
               <p className="text-[10px] uppercase tracking-widest leading-relaxed">Air composition in the dining room is adjusted per course to enhance olfactory perception.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Visionaries */}
      <section className="py-32 px-6 bg-obsidian/40 backdrop-blur-md border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
           <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-ember mb-16 block">The Architects</span>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
              <div className="relative group">
                <div className="absolute -inset-8 bg-ember/5 blur-[100px] group-hover:bg-ember/10 transition-all" />
                <img 
                  src="https://images.unsplash.com/photo-1583394238560-0486928fd53d?auto=format&fit=crop&q=80&w=1978" 
                  className="w-full h-[600px] object-cover grayscale rounded-[3rem] border border-white/10 group-hover:grayscale-0 transition-all duration-1000 shadow-2xl" 
                  alt="Chef Aris Thorne"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-10">
                <h2 className="text-5xl font-light italic uppercase tracking-tighter">Aris Thorne</h2>
                <h4 className="text-[10px] font-mono uppercase tracking-[0.4em] text-ember">Founder & Culinary Director</h4>
                <p className="text-white/40 font-light leading-relaxed text-xl italic">
                  "Fire is the only honest medium. It doesn't lie about timing or quality. At Zuma, we have simply given the fire a brain."
                </p>
                <div className="p-8 glass-effect rounded-3xl border-white/5">
                  <p className="text-[10px] uppercase tracking-widest text-white/50 leading-relaxed">
                    Thorne has spent two decades at the intersection of thermal physics and high gastronomy, holding three obsidian stars for innovation.
                  </p>
                </div>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
