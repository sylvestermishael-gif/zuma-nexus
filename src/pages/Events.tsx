import { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Ticket, ArrowRight, Share2, Flame, ShieldAlert } from 'lucide-react';
import { usePaystackPayment } from 'react-paystack';
import { useAuth } from '../context/AuthContext';

const EVENTS = [
  {
    id: 'ev-1',
    title: "The Winter Solstice",
    date: "Dec 21, 2026",
    desc: "A celebration of absolute zero. 8 courses of chilled delicacies served in our elegant cellar chamber.",
    price: "₦600,000",
    amount: 600000,
    img: "https://images.unsplash.com/photo-1550966848-185d9afbcc4f?auto=format&fit=crop&q=80&w=2070"
  },
  {
    id: 'ev-2',
    title: "Ember & Orchids",
    date: "Feb 14, 2027",
    desc: "A botanical fire journey. Flora-infused grilling techniques paired with rare volcanic wines.",
    price: "₦450,000",
    amount: 450000,
    img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2069"
  },
  {
    id: 'ev-3',
    title: "Late Night Zuma",
    date: "Every Sat Night",
    desc: "Ambient beats meeting high-pressure espresso martinis and charcoal-fired skewers.",
    price: "₦100,000 Entry",
    amount: 100000,
    img: "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=1974"
  }
];

interface EventButtonProps {
  event: typeof EVENTS[0];
  userEmail: string;
}

function BookButton({ event, userEmail }: EventButtonProps) {
  const config = {
    reference: `EVT-${event.id}-${Date.now()}`,
    email: userEmail,
    amount: event.amount * 100,
    publicKey: (import.meta as any).env.VITE_PAYSTACK_PUBLIC_KEY || '',
  };

  const initializePayment = usePaystackPayment(config);

  const handlePay = () => {
    if (!config.publicKey) {
      alert("Payment System Offline: VITE_PAYSTACK_PUBLIC_KEY is not configured.");
      return;
    }
    initializePayment({
      onSuccess: () => alert(`Booking Confirmed: Your entry to ${event.title} has been confirmed. Please check your email.`),
      onClose: () => {}
    });
  };

  return (
    <button 
      onClick={handlePay}
      className="w-full md:w-fit px-8 md:px-10 py-4 md:py-5 bg-white text-black font-bold uppercase tracking-widest hover:bg-ember transition-all flex items-center justify-center gap-4 group"
    >
      <Ticket className="w-4 h-4" /> Book Ticket
      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
    </button>
  );
}

export default function Events() {
  const { user } = useAuth();
  const userEmail = user?.email || 'guest@zumahearth.com';

  return (
    <div className="pt-24 pb-20 bg-obsidian min-h-screen px-6 relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-orange-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto mb-12 sm:mb-20 text-center relative z-10">
        <span className="text-[10px] font-mono uppercase tracking-[0.6em] text-ember mb-6 block">Upcoming Events</span>
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-light italic tracking-tighter uppercase mb-6 decoration-ember/20 underline underline-offset-8">
          The <span className="font-bold not-italic text-white/90">Events.</span>
        </h1>
      </div>

      <div className="max-w-5xl mx-auto space-y-20 md:space-y-32 relative z-10">
        {EVENTS.map((event, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-16 items-center`}
          >
            <div className="w-full md:w-1/2 h-[350px] sm:h-[450px] md:h-auto md:aspect-square overflow-hidden rounded-[2rem] md:rounded-[3rem] border border-white/10 group relative shadow-2xl">
               <img src={event.img} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" referrerPolicy="no-referrer" alt="" />
               <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-60" />
               <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10">
                  <div className="flex items-center gap-2 text-ember font-mono text-[8px] md:text-[10px] uppercase tracking-widest mb-2 md:mb-3">
                     <Calendar className="w-3 h-3" /> {event.date}
                  </div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-light italic uppercase tracking-tight">{event.title}</h3>
               </div>
            </div>
            
            <div className="w-full md:w-1/2 space-y-6 md:space-y-10 text-center md:text-left">
               <div className="flex flex-row justify-between items-center pb-6 md:pb-8 border-b border-white/10">
                  <span className="text-ember font-mono text-xl md:text-2xl font-medium tracking-tighter">{event.price}</span>
                  <div className="flex gap-2 md:gap-4">
                     <button className="p-2 md:p-3 bg-white/5 rounded-full hover:text-ember transition-colors"><Share2 className="w-4 h-4" /></button>
                  </div>
               </div>
               <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-white/40 leading-relaxed max-w-lg mx-auto md:mx-0">
                 {event.desc}
               </p>
               <BookButton event={event} userEmail={userEmail} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Special Request */}
      <section className="mt-24 md:mt-40 max-w-4xl mx-auto glass-effect p-10 sm:p-16 md:p-24 text-center rounded-[2rem] md:rounded-[3rem] border-white/5 relative overflow-hidden shadow-2xl z-10">
        <div className="absolute top-0 right-0 p-8 md:p-12 opacity-10">
          <Flame className="w-20 h-20 md:w-32 md:h-32 text-ember" />
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-light italic uppercase tracking-tighter mb-6 md:mb-8 underline underline-offset-8 md:underline-offset-12 decoration-ember/20">Private Dining</h2>
        <p className="text-white/40 mb-10 md:mb-12 text-[9px] md:text-[10px] uppercase tracking-widest leading-relaxed max-w-xs md:max-w-sm mx-auto">
          Tailored culinary experiences for exclusive groups. Accommodates up to 24 guests.
        </p>
        <button className="w-full sm:w-auto px-10 md:px-12 py-4 md:py-5 bg-white text-black font-bold uppercase tracking-widest hover:bg-ember transition-all">Inquire Now</button>
      </section>
    </div>
  );
}
