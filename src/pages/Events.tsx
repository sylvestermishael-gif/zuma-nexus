import { motion } from 'motion/react';
import { Calendar, Ticket, ArrowRight, Share2, Flame } from 'lucide-react';

const EVENTS = [
  {
    title: "The Cryogenic Solstice",
    date: "Dec 21, 2026",
    desc: "A celebration of absolute zero. 8 courses of flash-frozen delicacies served in our sub-zero cellar chamber.",
    price: "₦600,000",
    img: "https://images.unsplash.com/photo-1516715667182-c8e1955d7181?auto=format&fit=crop&q=80&w=1973"
  },
  {
    title: "Ember & Orchids",
    date: "Feb 14, 2027",
    desc: "A botanical fire journey. Flora-infused grilling techniques paired with rare volcanic wines.",
    price: "₦450,000",
    img: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=2069"
  },
  {
    title: "Late Night Tech/Ember",
    date: "Every Sat Night",
    desc: "Ambient tech DJ sets meeting high-pressure espresso martinis and charcoal-fired skewers.",
    price: "₦100,000 Entry",
    img: "https://images.unsplash.com/photo-1514525253361-b5906b128470?auto=format&fit=crop&q=80&w=1974"
  }
];

export default function Events() {
  return (
    <div className="pt-24 pb-20 bg-obsidian min-h-screen px-6 relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-orange-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto mb-20 text-center relative z-10">
        <span className="text-[10px] font-mono uppercase tracking-[0.6em] text-ember mb-6 block">Temporal Gathers</span>
        <h1 className="text-6xl md:text-8xl font-light italic tracking-tighter uppercase mb-6 decoration-ember/20 underline underline-offset-8">
          The <span className="font-bold not-italic text-white/90">Convergence.</span>
        </h1>
      </div>

      <div className="max-w-5xl mx-auto space-y-32 relative z-10">
        {EVENTS.map((event, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-16 items-center`}
          >
            <div className="w-full md:w-1/2 aspect-square overflow-hidden rounded-[3rem] grayscale border border-white/10 group relative shadow-2xl">
               <img src={event.img} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:grayscale-0" referrerPolicy="no-referrer" alt="" />
               <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-60" />
               <div className="absolute bottom-10 left-10">
                  <div className="flex items-center gap-2 text-ember font-mono text-[10px] uppercase tracking-widest mb-3">
                     <Calendar className="w-3 h-3" /> {event.date}
                  </div>
                  <h3 className="text-4xl font-light italic uppercase tracking-tight">{event.title}</h3>
               </div>
            </div>
            
            <div className="w-full md:w-1/2 space-y-10">
               <div className="flex justify-between items-center pb-8 border-b border-white/10">
                  <span className="text-ember font-mono text-2xl font-medium tracking-tighter">{event.price}</span>
                  <div className="flex gap-4">
                     <button className="p-3 bg-white/5 rounded-full hover:text-ember transition-colors"><Share2 className="w-4 h-4" /></button>
                  </div>
               </div>
               <p className="text-[10px] uppercase tracking-widest text-white/40 leading-relaxed">
                 {event.desc}
               </p>
               <button className="px-10 py-5 bg-white text-black font-bold uppercase tracking-widest hover:bg-ember transition-all flex items-center justify-center gap-4 group">
                  <Ticket className="w-4 h-4" /> Acquire Entry
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
               </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Special Request */}
      <section className="mt-40 max-w-4xl mx-auto glass-effect p-16 md:p-24 text-center rounded-[3rem] border-white/5 relative overflow-hidden shadow-2xl z-10">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Flame className="w-32 h-32 text-ember" />
        </div>
        <h2 className="text-5xl font-light italic uppercase tracking-tighter mb-8 underline underline-offset-12 decoration-ember/20">Private Induction</h2>
        <p className="text-white/40 mb-12 text-[10px] uppercase tracking-widest leading-relaxed max-w-sm mx-auto">
          Tailored culinary sequences for exclusive collectives. Accommodates up to 24 units.
        </p>
        <button className="px-12 py-5 bg-white text-black font-bold uppercase tracking-widest hover:bg-ember transition-all">Request Private Slot</button>
      </section>
    </div>
  );
}
