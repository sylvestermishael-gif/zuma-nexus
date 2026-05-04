import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';

export default function Contact() {
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
    </div>
  );
}
