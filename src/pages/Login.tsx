import { motion } from 'motion/react';
import { LogIn, ShieldCheck, Flame, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Login() {
  const { signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const from = (location.state as any)?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleGoogleLogin = async () => {
    if (isAuthenticating) return;
    
    setIsAuthenticating(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError("Protocol aborted: Verification window was closed by operator.");
      } else if (err.code === 'auth/internal-error') {
        setError("Nexus conflict: Please refresh the protocol and try again.");
      } else if (err.code === 'auth/unauthorized-domain') {
        setError("Domain access denied: Verify that this domain is authorized in Firebase console.");
      } else {
        setError("Security protocol failed. Please re-authenticate (Check Firebase console if deploying).");
      }
      console.error(err);
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="pt-40 pb-20 px-6 min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg aspect-square bg-ember/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="w-full max-w-md relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-obsidian border border-white/10 p-10 rounded-[2.5rem] shadow-2xl text-center space-y-8"
        >
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-ember/20 rounded-2xl flex items-center justify-center animate-pulse">
              <Flame className="w-8 h-8 text-ember" />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-ember block mb-2">Access Portal</span>
            <h1 className="text-4xl font-display font-medium uppercase italic tracking-tighter">
              Verify <span className="text-white">Identity</span>
            </h1>
            <p className="text-sm font-light text-white/40 leading-relaxed">
              Authenticate via the global sequence to access acquisition and reservation protocols.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-2xl text-[10px] font-mono text-red-400 uppercase tracking-widest">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isAuthenticating}
              onClick={handleGoogleLogin}
              className="w-full h-16 bg-white text-black font-bold uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 hover:bg-ember transition-all group shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            >
              <LogIn className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              {isAuthenticating ? "Synchronizing..." : "Initiate Google Protocol"}
            </motion.button>

            <div className="flex items-center gap-4 py-2">
              <div className="h-[1px] flex-1 bg-white/10"></div>
              <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Secure Handshake</span>
              <div className="h-[1px] flex-1 bg-white/10"></div>
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-white/30 uppercase tracking-widest">
              <ShieldCheck className="w-3 h-3" />
              <span>Full AES-256 Identity Protection</span>
            </div>
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => navigate('/')}
          className="mt-8 mx-auto flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/40 hover:text-white transition-colors"
        >
          Return to Nexus <ArrowRight className="w-3 h-3" />
        </motion.button>
      </div>
    </div>
  );
}
