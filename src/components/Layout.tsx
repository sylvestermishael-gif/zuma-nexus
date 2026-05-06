import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Menu as MenuIcon, X, MapPin, Phone, Instagram, Facebook, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { ClickEffect } from './ClickEffect';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [bgPulse, setBgPulse] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const handlePulse = () => {
      setBgPulse(true);
      setTimeout(() => setBgPulse(false), 300);
    };
    window.addEventListener('mousedown', handlePulse);
    return () => window.removeEventListener('mousedown', handlePulse);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: 'Reservations', href: '/reservations' },
    { name: 'Order', href: '/order' },
    { name: 'Our Story', href: '/story' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Events', href: '/events' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <div className="min-h-screen bg-obsidian text-white selection:bg-ember selection:text-black font-sans">
      <ClickEffect />
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className={cn(
          "absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-900/20 rounded-full blur-[120px] transition-colors duration-300",
          bgPulse && "bg-orange-600/30"
        )}></div>
        <div className={cn(
          "absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px] transition-colors duration-300",
          bgPulse && "bg-blue-600/20"
        )}></div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-obsidian/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-ember rounded-sm rotate-45 flex items-center justify-center transition-transform group-hover:rotate-[225deg] duration-700">
              <span className="text-black font-black text-[10px] -rotate-45">ZH</span>
            </div>
            <span className="font-display text-xl font-light tracking-[0.2em] uppercase">
              Zuma <span className="text-white/60">Hearth</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "text-[10px] font-medium uppercase tracking-[0.2em] transition-all relative py-1",
                  location.pathname === link.href 
                    ? "text-white border-b border-ember" 
                    : "text-white/60 hover:text-white"
                )}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/order"
              className="px-6 py-2 bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-ember transition-colors"
            >
              Order Now
            </Link>

            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                <div className="flex flex-col items-end">
                  <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest">Account</span>
                  <span className="text-[10px] font-medium text-white truncate max-w-[100px]">{user.displayName || user.email?.split('@')[0]}</span>
                </div>
                <button 
                  onClick={() => logout()}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center gap-2 hover:bg-red-500/20 hover:border-red-500/50 transition-all text-white/40 hover:text-red-400 group"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Logout</span>
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-ember hover:text-white transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" /> Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-black pt-24 px-6 lg:hidden"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "text-3xl font-display font-medium tracking-tight",
                    location.pathname === link.href ? "text-ember" : "text-white"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/order"
                className="mt-4 px-8 py-4 bg-ember text-black text-center font-bold tracking-widest uppercase"
              >
                Order Now
              </Link>

              {user ? (
                <div className="mt-10 pt-10 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-ember/20 flex items-center justify-center">
                      <UserIcon className="w-6 h-6 text-ember" />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Signed In As</p>
                      <p className="text-xl font-display text-white">{user.displayName || user.email?.split('@')[0]}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => logout()}
                    className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-red-900/10 border border-red-900/20 text-red-400 font-bold uppercase text-xs tracking-widest"
                  >
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="mt-10 flex items-center justify-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 text-xl font-display text-white"
                >
                  <LogIn className="w-6 h-6 text-ember" /> Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-obsidian/80 backdrop-blur-md px-10 py-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[9px] uppercase tracking-[0.3em] text-white/40">Status: Online</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            <span className="text-[9px] uppercase tracking-[0.3em] text-white/40">Kitchen: Active</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-white/20 rounded-full"></div>
            <span className="text-[9px] uppercase tracking-[0.3em] text-white/40">System: Secure</span>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="flex gap-4">
            <a href="#" className="text-white/30 hover:text-white transition-colors"><Instagram className="w-4 h-4" /></a>
            <a href="#" className="text-white/30 hover:text-white transition-colors"><Facebook className="w-4 h-4" /></a>
          </div>
          <div className="text-[9px] text-white/20 uppercase tracking-[0.4em]">
            &copy; 2026 Zuma Hearth • Maitama, Abuja • Crafted with Precision
          </div>
        </div>
      </footer>
    </div>
  );
}
