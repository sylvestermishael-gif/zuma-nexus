import { motion, AnimatePresence } from 'motion/react';
import { LogIn, ShieldCheck, Flame, ArrowRight, AlertCircle, Mail, Lock, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { sendEmailVerification } from 'firebase/auth';

export default function Login() {
  const { signInWithGoogle, signUp, logIn, resetPassword, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  
  // Auth State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');

  // Redirect if already logged in and verified
  useEffect(() => {
    if (user && user.emailVerified && !isAuthenticating) {
      const from = (location.state as any)?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [user, navigate, location, isAuthenticating]);

  // Polling for email verification
  useEffect(() => {
    let interval: number;
    if (user && !user.emailVerified) {
      interval = window.setInterval(async () => {
        try {
          await user.reload();
          if (user.emailVerified) {
            const from = (location.state as any)?.from?.pathname || "/";
            navigate(from, { replace: true });
          }
        } catch (err) {
          console.error("Error reloading user status:", err);
        }
      }, 3000); // Check every 3 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [user, navigate, location.state]);

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
    if (isAuthenticating || !email) return;
    if (mode !== 'forgot' && !password) return;

    setIsAuthenticating(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === 'register') {
        await signUp(email, password);
      } else if (mode === 'login') {
        await logIn(email, password);
      } else {
        await resetPassword(email);
        setSuccess("Recovery link sent. Please check your inbox.");
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
      alert("Verification email sent. Please check your inbox.");
    } catch (err: any) {
      handleAuthError(err);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleAuthError = (err: any) => {
    if (err.code === 'auth/popup-closed-by-user') {
      setError("Login failed: The verification window was closed.");
    } else if (err.code === 'auth/invalid-credential') {
      setError("Incorrect email or password. Please try again.");
    } else if (err.code === 'auth/email-already-in-use' || err.message?.includes('auth/email-already-in-use')) {
      setError("This email is already in use. Try signing in instead.");
    } else if (err.code === 'auth/weak-password' || err.message?.includes('password-does-not-meet-requirements')) {
      setError("Password is too short. Please use at least 6 characters.");
    } else if (err.message?.includes('-26') || err.code === 'internal-error') {
      setError("Connection delay: Please wait a moment and try again.");
    } else {
      setError(err.message || "An unexpected error occurred. Please try again.");
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
              <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-ember block">Email Verification</span>
              <h1 className="text-3xl font-display font-medium uppercase italic tracking-tighter">
                Check Your <span className="text-white">Email</span>
              </h1>
              <p className="text-xs text-white/40 leading-relaxed">
                We've sent a verification link to <span className="text-white italic">{user.email}</span>. 
                Please click the link to confirm your account.
              </p>
            </div>

            <div className="space-y-3">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.reload()}
                className="w-full h-14 bg-white text-black font-bold uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 text-xs"
              >
                <RefreshCw className="w-4 h-4" /> I've Verified
              </motion.button>
              
              <button
                disabled={isAuthenticating}
                onClick={handleResendVerification}
                className="w-full h-14 border border-white/10 text-white/60 font-bold uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 hover:bg-white/5 transition-all text-[10px] disabled:opacity-50"
              >
                {isAuthenticating ? "Sending..." : "Resend Link"}
              </button>

              <button
                onClick={() => logout()}
                className="w-full py-2 text-[8px] font-mono uppercase tracking-widest text-white/20 hover:text-white transition-colors"
              >
                Logout
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
                onClick={() => { setMode('login'); setError(null); setSuccess(null); }}
                className={`flex-1 py-3 text-[10px] font-mono uppercase tracking-[0.2em] rounded-xl transition-all ${mode === 'login' ? 'bg-white text-black font-bold' : 'text-white/40 hover:text-white'}`}
              >
                Sign In
              </button>
              <button 
                onClick={() => { setMode('register'); setError(null); setSuccess(null); }}
                className={`flex-1 py-3 text-[10px] font-mono uppercase tracking-[0.2em] rounded-xl transition-all ${mode === 'register' ? 'bg-ember text-white font-bold' : 'text-white/40 hover:text-white'}`}
              >
                Sign Up
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-ember block mb-2">Member Portal</span>
              <h1 className="text-4xl font-display font-medium uppercase italic tracking-tighter leading-none">
                {mode === 'login' ? "Welcome" : mode === 'register' ? "Join" : "Account"} <span className="text-white font-extrabold not-italic">{mode === 'login' ? "Back" : mode === 'register' ? "Us" : "Recovery"}</span>
              </h1>
              <p className="text-sm font-light text-white/40 leading-relaxed px-4 max-w-[280px] mx-auto">
                {mode === 'login' 
                  ? "Sign in to access your account and reservations."
                  : mode === 'register'
                    ? "Create an account to start your culinary journey."
                    : "Enter your email to receive a password reset link."}
              </p>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-2xl text-[10px] font-mono text-red-400 uppercase tracking-widest leading-relaxed flex items-center gap-2 text-center justify-center">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-4 bg-emerald-900/20 border border-emerald-900/50 rounded-2xl text-[10px] font-mono text-emerald-400 uppercase tracking-widest leading-relaxed flex items-center gap-2 text-center justify-center">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{success}</span>
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
                    placeholder="Email Address"
                    className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 text-sm focus:outline-none focus:border-ember transition-all placeholder:text-white/20"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {mode !== 'forgot' && (
                  <div className="relative group">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-ember transition-colors" />
                    <input
                      type="password"
                      required
                      placeholder="Password"
                      className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 text-sm focus:outline-none focus:border-ember transition-all placeholder:text-white/20"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {mode === 'login' && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setError(null); setSuccess(null); }}
                    className="text-[10px] font-mono uppercase tracking-widest text-white/30 hover:text-ember transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              {mode === 'forgot' && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setError(null); setSuccess(null); }}
                    className="text-[10px] font-mono uppercase tracking-widest text-ember hover:text-white transition-colors"
                  >
                    Back to Sign In
                  </button>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                disabled={isAuthenticating}
                type="submit"
                className={`w-full h-16 ${mode === 'register' ? 'bg-ember text-white' : 'bg-white text-black'} font-black uppercase tracking-[0.3em] rounded-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 shadow-lg shadow-black/20`}
              >
                {isAuthenticating ? "Loading..." : mode === 'login' ? "Sign In" : mode === 'register' ? "Sign Up" : "Send Reset Link"}
              </motion.button>
            </form>

            <div className="flex items-center gap-4 py-2">
              <div className="h-[1px] flex-1 bg-white/10"></div>
              <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest font-bold">Or Continue With</span>
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
              Sign In with Google
            </motion.button>

            <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-white/30 uppercase tracking-widest pt-4">
              <ShieldCheck className="w-3 h-3" />
              <span>Safe & Secure Connection</span>
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
          Return Home <ArrowRight className="w-3 h-3 text-ember" />
        </motion.button>
      </div>
    </div>
  );
}
