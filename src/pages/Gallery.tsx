import { motion } from 'motion/react';
import { useState } from 'react';
import { X, Maximize2 } from 'lucide-react';

const IMAGES = [
  "https://images.unsplash.com/photo-1550966848-185d9afbcc4f?auto=format&fit=crop&q=80&w=2070",
  "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2070",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=2070",
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=2070",
  "https://images.unsplash.com/photo-1560624052-449f5ddf0c3d?auto=format&fit=crop&q=80&w=2070",
  "https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&q=80&w=1920",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=2070",
  "https://images.unsplash.com/photo-1551218808-94e220e03182?auto=format&fit=crop&q=80&w=2070",
  "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&q=80&w=1920"
];

export default function Gallery() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="pt-24 pb-20 bg-black min-h-screen px-6">
      <div className="max-w-7xl mx-auto mb-20 text-center">
        <span className="text-[10px] font-mono uppercase tracking-[0.6em] text-ember mb-6 block">Visual Fragments</span>
        <h1 className="text-6xl md:text-8xl font-light italic tracking-tighter uppercase mb-6 decoration-ember/20 underline underline-offset-8">
          The <span className="font-bold not-italic text-white/90">Observatory.</span>
        </h1>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]">
        {IMAGES.map((src, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setSelected(src)}
            className={cn(
               "group relative cursor-pointer overflow-hidden rounded-[2rem] border border-white/5 shadow-xl glass-effect",
               i === 0 ? "md:row-span-2 md:col-span-2" : ""
            )}
          >
            <img 
              src={src} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale hover:grayscale-0" 
              alt={`Gallery ${i}`}
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Maximize2 className="w-8 h-8 text-ember" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
           <button onClick={() => setSelected(null)} className="absolute top-10 right-10 p-4 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-8 h-8" />
           </button>
           <motion.div 
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="max-w-6xl w-full h-auto aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10"
           >
              <img src={selected} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
           </motion.div>
        </div>
      )}
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
