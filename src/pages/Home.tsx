import { motion } from 'motion/react';
import { Flame, ChevronRight, Clock, Star, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Home() {
  const [titleColor, setTitleColor] = useState('text-ember');

  const cycleColor = () => {
    const colors = ['text-ember', 'text-blue-500', 'text-purple-500', 'text-emerald-500', 'text-rose-500'];
    const currentIndex = colors.indexOf(titleColor);
    const nextIndex = (currentIndex + 1) % colors.length;
    setTitleColor(colors[nextIndex]);
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image / Placeholder */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2070" 
            alt="Zuma Hearth Ambience" 
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-radial-gradient(circle at center, transparent 0%, black 100%) opacity-60" />
        </div>

        {/* Animated Particles / Embers (Simplified) */}
        <div className="absolute inset-0 z-10 pointer-events-none opacity-50">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute rounded-full ${titleColor === 'text-ember' ? 'bg-ember' : titleColor.replace('text-', 'bg-')}`}
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: window.innerHeight + 10,
                width: Math.random() * 4 + 1,
                height: Math.random() * 4 + 1,
                opacity: Math.random() * 0.5 + 0.2
              }}
              animate={{ 
                y: -100,
                opacity: 0
              }}
              transition={{ 
                duration: Math.random() * 5 + 5, 
                repeat: Infinity,
                delay: Math.random() * 5
              }}
            />
          ))}
        </div>

        <div className="relative z-20 text-center px-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-ember mb-6 block">
              Est. 2024 • Maitama, Abuja
            </span>
            <motion.h1 
              onClick={cycleColor}
              className="text-6xl md:text-8xl lg:text-9xl font-light italic leading-[0.85] tracking-tighter mb-8 decoration-ember/20 underline underline-offset-8 cursor-pointer select-none"
              whileTap={{ scale: 0.98 }}
            >
              Classic <span className={`transition-colors duration-500 ${titleColor}`}>flavors</span> meets <br />
              <span className="font-bold not-italic text-white/90">modern art.</span>
            </motion.h1>
            <p className="max-w-xl mx-auto text-base md:text-lg text-white/40 font-light mb-12 leading-relaxed">
              Experience the perfect blend of traditional wood-fired cooking and modern culinary innovation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/reservations"
                className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-ember transition-all duration-300"
              >
                Book a Table
              </Link>
              <Link
                to="/menu"
                className="px-8 py-4 bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors uppercase tracking-widest font-bold"
              >
                Our Menu
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-ember to-transparent mx-auto" />
        </motion.div>
      </section>

      {/* Featured Dish Section */}
      <section className="py-32 px-6 bg-black relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-ember/10 blur-3xl rounded-full" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative aspect-square overflow-hidden rounded-2xl border border-white/10"
            >
              <img 
                src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1974" 
                alt="Signature Dish" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div className="absolute -bottom-10 -right-10 bg-black p-8 border border-white/10 hidden md:block">
              <div className="flex items-center gap-1 text-ember mb-2">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
              </div>
              <span className="text-xs font-mono uppercase tracking-widest text-white/50">Chef's Selection</span>
              <p className="text-lg font-display uppercase tracking-tight italic mt-1 text-ember">Charcoal Glazed Wagyu</p>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-ember/60 mb-6 block">Our Story</span>
            <h2 className="text-4xl md:text-6xl font-display font-medium tracking-tight uppercase leading-tight mb-8">
              A Symphony of <br />
              Heat and Time
            </h2>
            <div className="space-y-6 text-white/60 text-lg leading-relaxed font-light">
              <p>
                Founded by Chef Aris Thorne, Zuma Hearth was born from a singular vision: to return to the heart of cooking—the fire.
              </p>
              <p>
                We use custom-built wood-fired ovens to bring out the boldest flavors in every ingredient, blending time-honored techniques with a modern touch.
              </p>
            </div>
            <Link to="/story" className="inline-flex items-center gap-4 mt-10 text-ember uppercase font-mono text-sm tracking-[0.2em] group">
              Read our full story
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Experience Grid */}
      <section className="py-32 px-6 bg-obsidian">
        <div className="max-w-7xl mx-auto mb-20 text-center">
          <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-ember/60 mb-6 block">Refined Experiences</span>
          <h2 className="text-4xl font-display font-medium tracking-tight uppercase">The Elements of Zuma</h2>
        </div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "The Chef's Table",
              desc: "An exclusive dining experience with 12 courses, served directly by our master chefs.",
              img: "https://images.unsplash.com/photo-1550966848-185d9afbcc4f?auto=format&fit=crop&q=80&w=2070",
              icon: Users
            },
            {
              title: "Signature Cocktails",
              desc: "A creative bar program featuring smoke-infused spirits and artisanal classics.",
              img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2070",
              icon: Flame
            },
            {
              title: "Late Night Lounge",
              desc: "Elegant environment featuring great music and light bites served until the early hours.",
              img: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=2069",
              icon: Clock
            }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="group relative h-[500px] overflow-hidden rounded-3xl border border-white/10 glass-effect"
            >
              <img 
                src={item.img} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80" 
                alt={item.title}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 w-full backdrop-blur-sm bg-obsidian/20">
                <item.icon className="w-8 h-8 text-ember mb-4" />
                <h3 className="text-2xl font-light italic tracking-tight mb-3 uppercase">{item.title}</h3>
                <p className="text-[10px] uppercase tracking-widest text-white/40 leading-relaxed max-w-xs">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-40 px-6 relative overflow-hidden text-center">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1498654077810-12c21d4d6dc3?auto=format&fit=crop&q=80&w=2070')] bg-cover bg-center grayscale opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
        </div>
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           className="max-w-4xl mx-auto"
        >
          <h2 className="text-5xl md:text-7xl font-display font-bold uppercase italic mb-10 tracking-tighter text-white">Join us for <br /><span className="text-ember">dinner</span>.</h2>
          <Link
            to="/reservations"
            className="inline-block px-12 py-6 bg-ember text-black font-bold uppercase tracking-[0.3em] hover:bg-white transition-all duration-300 ember-glow"
          >
            Book Your Table
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
