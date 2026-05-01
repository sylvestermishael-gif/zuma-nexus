import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  distance: number;
}

export const ClickEffect: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Find out if we clicked a button or link to determine intensity
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('button, a');
      
      const newParticles: Particle[] = [];
      const count = isInteractive ? 12 : 6;
      const colors = ['#F27D26', '#FFC107', '#FF5722', '#FFFFFF', '#6366F1'];
      
      for (let i = 0; i < count; i++) {
        newParticles.push({
          id: Math.random(),
          x: e.clientX,
          y: e.clientY,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * (isInteractive ? 5 : 3) + 1,
          angle: Math.random() * Math.PI * 2,
          distance: Math.random() * (isInteractive ? 80 : 40) + 10,
        });
      }
      
      setParticles(prev => [...prev, ...newParticles].slice(-50));
    };

    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <AnimatePresence>
        {particles.map(p => (
          <motion.div
            key={p.id}
            initial={{ 
              x: p.x, 
              y: p.y, 
              opacity: 1, 
              scale: 1 
            }}
            animate={{ 
              x: p.x + Math.cos(p.angle) * p.distance,
              y: p.y + Math.sin(p.angle) * p.distance,
              opacity: 0,
              scale: 0
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            onAnimationComplete={() => {
              setParticles(prev => prev.filter(item => item.id !== p.id));
            }}
            className="absolute rounded-full shadow-[0_0_8px_rgba(242,125,38,0.4)]"
            style={{ 
              width: p.size, 
              height: p.size, 
              backgroundColor: p.color,
              left: -p.size/2,
              top: -p.size/2,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
