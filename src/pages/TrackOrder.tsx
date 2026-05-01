import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { motion } from 'motion/react';
import { Flame, MapPin, Clock, ShieldCheck, Phone } from 'lucide-react';

// Fix for default marker icons in Leaflet with React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const DEFAULT_CENTER: [number, number] = [37.7749, -122.4194]; // San Francisco as fallback

export default function TrackOrder() {
  const { orderId } = useParams();
  const [courierPos, setCourierPos] = useState<[number, number]>([37.78, -122.42]);
  const [destination] = useState<[number, number]>([37.76, -122.41]);
  const [status, setStatus] = useState('Inducting');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const statuses = ['Inducting', 'Igniting', 'In Transit', 'Approaching', 'Arrived'];
    let currentIdx = 0;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus('Delivered');
          return 100;
        }
        
        const next = prev + 5;
        const newIdx = Math.floor((next / 100) * (statuses.length - 1));
        if (newIdx !== currentIdx) {
          currentIdx = newIdx;
          setStatus(statuses[newIdx]);
        }

        // Move courier slightly towards destination
        setCourierPos(prevPos => [
          prevPos[0] + (destination[0] - prevPos[0]) * 0.05,
          prevPos[1] + (destination[1] - prevPos[1]) * 0.05
        ]);

        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [destination]);

  return (
    <div className="pt-20 min-h-screen bg-black flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Left: Map */}
      <div className="flex-1 relative order-2 md:order-1 h-1/2 md:h-full border-r border-white/5">
        <MapContainer 
          center={DEFAULT_CENTER} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={destination}>
            <Popup>Your Destination</Popup>
          </Marker>
          <Marker 
            position={courierPos} 
            icon={new L.Icon({
              iconUrl: 'https://cdn-icons-png.flaticon.com/512/3246/3246194.png',
              iconSize: [40, 40],
              iconAnchor: [20, 40]
            })}
          >
            <Popup>Chef Emissary (In Transit)</Popup>
          </Marker>
          <MapUpdater center={courierPos} />
        </MapContainer>

        {/* Overlay Labels */}
        <div className="absolute bottom-8 left-8 z-[400] space-y-4">
           <div className="glass-effect p-4 rounded-xl flex items-center gap-4 border-ember/30">
              <div className="w-10 h-10 bg-ember rounded-full flex items-center justify-center animate-pulse">
                <Flame className="w-6 h-6 text-black" />
              </div>
              <div>
                <h4 className="text-xs font-mono uppercase text-ember tracking-widest">Active Induction</h4>
                <p className="text-lg font-display uppercase italic tracking-tighter">Emissary ZH-9</p>
              </div>
           </div>
        </div>
      </div>

      {/* Right: Info Panel */}
      <div className="w-full md:w-[400px] bg-obsidian p-8 md:p-12 overflow-y-auto order-1 md:order-2 flex flex-col h-1/2 md:h-full">
        <div className="mb-12">
          <Link to="/" className="text-[10px] font-mono text-white/30 uppercase tracking-[0.4em] hover:text-ember transition-colors mb-8 block">Back into Matrix</Link>
          <h1 className="text-3xl font-display font-medium uppercase italic tracking-tighter mb-2">Tracking Pulse</h1>
          <span className="text-xs font-mono text-ember flex items-center gap-2">
            Order Ref: {orderId} <span className="w-1 h-1 bg-ember rounded-full animate-ping" />
          </span>
        </div>

        <div className="space-y-10 flex-1">
          <div className="space-y-2">
             <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Induction State</span>
                <span className="text-xl font-display uppercase italic tracking-tight text-ember">{status}</span>
             </div>
             <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-ember" 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
             </div>
          </div>

          <div className="space-y-6 pt-6">
             <div className="flex gap-4">
                <div className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center shrink-0">
                   <Clock className="w-4 h-4 text-white/50" />
                </div>
                <div>
                   <h6 className="text-[10px] font-mono uppercase text-white/30 tracking-widest mb-1">Estimated Fusion</h6>
                   <p className="text-sm font-medium">12 - 18 Microcycles (Mins)</p>
                </div>
             </div>
             <div className="flex gap-4">
                <div className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center shrink-0">
                   <MapPin className="w-4 h-4 text-white/50" />
                </div>
                <div>
                   <h6 className="text-[10px] font-mono uppercase text-white/30 tracking-widest mb-1">Target Coordinate</h6>
                   <p className="text-sm font-medium">San Francisco, CA</p>
                </div>
             </div>
             <div className="flex gap-4">
                <div className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center shrink-0">
                   <ShieldCheck className="w-4 h-4 text-white/50" />
                </div>
                <div>
                   <h6 className="text-[10px] font-mono uppercase text-white/30 tracking-widest mb-1">Thermal Integrity</h6>
                   <p className="text-sm font-medium text-green-400">Stable @ 180°C</p>
                </div>
             </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 mt-auto">
          <button className="w-full flex items-center justify-center gap-3 py-4 border border-white/10 rounded-xl text-xs font-mono uppercase tracking-widest hover:border-ember transition-colors">
            <Phone className="w-4 h-4" /> Signal Emissary
          </button>
        </div>
      </div>
    </div>
  );
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.panTo(center);
  }, [center, map]);
  return null;
}
