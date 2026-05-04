import { motion, AnimatePresence } from 'motion/react';
import { LogIn, ShieldCheck, Flame, ArrowRight, AlertCircle, Mail, Lock, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { sendEmailVerification } from 'firebase/auth';

export default function Login() {
  const { signInWithGoogle, signUp, logIn, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  
  // Auth State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Redirect if already logged in and verified
  useEffect(() => {
    if (user && user.emailVerified && !isAuthenticating) {
      const from = (location.state as any)?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [user, navigate, location, isAuthenticating]);

  const handleGoogleLogin = async () => {
    if (isAuthenticating) return;
    setIsAuthenticating(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      handleAuthError(err);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isAuthenticating || !email || !password) return;
    setIsAuthenticating(true);
    setError(null);
    try {
      if (mode === 'register') {
        await signUp(email, password);
      } else {
        await logIn(email, password);
      }
    } catch (err: any) {
      handleAuthError(err);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleResendVerification = async () => {
    if (!user || isAuthenticating) return;
    setIsAuthenticating(true);
    try {
      await sendEmailVerification(user);
      setError(null);
      alert("Verification sequence initiated. Check your inbox.");
    } catch (err: any) {
      handleAuthError(err);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleAuthError = (err: any) => {
    if (err.code === 'auth/popup-closed-by-user') {
      setError("Protocol aborted: Verification window was closed by operator.");
    } else if (err.code === 'auth/invalid-credential') {
      setError("Identity mismatch: Check your passkey and email.");
    } else if (err.code === 'auth/email-already-in-use') {
      setError("Conflict detected: This email is already synchronized. Return to login.");
    } else if (err.message?.includes('-26') || err.code === 'internal-error') {
      setError("Nexus Sync Delay: Firebase service is initializing. Please wait 30 seconds and retry.");
    } else {
      setError(err.message || "Security protocol failed. Please re-authenticate.");
    }
    console.error(err);
  };

  if (user && !user.emailVerified) {
    return (
      <div className="pt-40 pb-20 px-6 min-h-screen bg-black flex items-center justify-center relative overflow-hidden text-white font-sans">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg aspect-square bg-ember/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="w-full max-w-md relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-obsidian border border-white/10 p-10 rounded-[2.5rem] shadow-2xl text-center space-y-8"
          >
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                <Mail className="w-8 h-8 text-white" />
              </div>
            </div>

            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-ember block">Verification Required</span>
              <h1 className="text-3xl font-display font-medium uppercase italic tracking-tighter">
                Awaiting <span className="text-white">Validation</span>
              </h1>
              <p className="text-xs text-white/40 leading-relaxed">
                A signal has been sent to <span className="text-white italic">{user.email}</span>. 
                Verify your link to finalize identity synchronization.
              </p>
            </div>

            <div className="space-y-3">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.reload()}
                className="w-full h-14 bg-white text-black font-bold uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 text-xs"
              >
                <RefreshCw className="w-4 h-4" /> Sync Status
              </motion.button>
              
              <button
                disabled={isAuthenticating}
                onClick={handleResendVerification}
                className="w-full h-14 border border-white/10 text-white/60 font-bold uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 hover:bg-white/5 transition-all text-[10px] disabled:opacity-50"
              >
                {isAuthenticating ? "Transmitting..." : "Resend Link"}
              </button>

              <button
                onClick={() => logout()}
                className="w-full py-2 text-[8px] font-mono uppercase tracking-widest text-white/20 hover:text-white transition-colors"
              >
                Terminate Session
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-40 pb-20 px-6 min-h-screen bg-black flex items-center justify-center relative overflow-hidden text-white font-sans">
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

          <div className="space-y-6 text-center">
            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 mb-8">
              <button 
                onClick={() => setMode('login')}
                className={`flex-1 py-3 text-[10px] font-mono uppercase tracking-[0.2em] rounded-xl transition-all ${mode === 'login' ? 'bg-white text-black font-bold' : 'text-white/40 hover:text-white'}`}
              >
                Verification
              </button>
              <button 
                onClick={() => setMode('register')}
                className={`flex-1 py-3 text-[10px] font-mono uppercase tracking-[0.2em] rounded-xl transition-all ${mode === 'register' ? 'bg-ember text-white font-bold' : 'text-white/40 hover:text-white'}`}
              >
                Sign Up
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-ember block mb-2">Access Portal</span>
              <h1 className="text-4xl font-display font-medium uppercase italic tracking-tighter leading-none">
                {mode === 'login' ? "Verify" : "Register"} <span className="text-white font-extrabold not-italic">Identity</span>
              </h1>
              <p className="text-sm font-light text-white/40 leading-relaxed px-4 max-w-[280px] mx-auto">
                {mode === 'login' 
                  ? "Access high-clearance Nexus protocols via authorized credentials."
                  : "Establish your operative profile within the Nexus network."}
              </p>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-2xl text-[10px] font-mono text-red-400 uppercase tracking-widest leading-relaxed flex items-center gap-2 text-center justify-center">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-4">
                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-ember transition-colors" />
                  <input
                    type="email"
                    required
                    placeholder="Identification Email"
                    className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 text-sm focus:outline-none focus:border-ember transition-all placeholder:text-white/20"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-ember transition-colors" />
                  <input
                    type="password"
                    required
                    placeholder="Security Passkey"
                    className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 text-sm focus:outline-none focus:border-ember transition-all placeholder:text-white/20"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                disabled={isAuthenticating}
                type="submit"
                className={`w-full h-16 ${mode === 'register' ? 'bg-ember text-white' : 'bg-white text-black'} font-black uppercase tracking-[0.3em] rounded-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 shadow-lg shadow-black/20`}
              >
                {isAuthenticating ? "Processing..." : mode === 'login' ? "Initialize Sequence" : "Establish Identity"}
              </motion.button>
            </form>

            <div className="flex items-center gap-4 py-2">
              <div className="h-[1px] flex-1 bg-white/10"></div>
              <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest font-bold">Standard Uplink</span>
              <div className="h-[1px] flex-1 bg-white/10"></div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isAuthenticating}
              onClick={handleGoogleLogin}
              className="w-full h-14 border border-white/10 text-white/60 font-bold uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 hover:bg-white/5 transition-all text-xs"
            >
              <LogIn className="w-4 h-4 text-ember" />
              Google Sequence
            </motion.button>

            <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-white/30 uppercase tracking-widest pt-4">
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
          Return to Nexus <ArrowRight className="w-3 h-3 text-ember" />
        </motion.button>
      </div>
    </div>
  );
}
