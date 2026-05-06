import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import type { FormEvent } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, MapPin, CreditCard, ChevronRight, PackageCheck, ArrowRight, Mail, ShieldAlert } from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import { usePaystackPayment } from 'react-paystack';

export default function Order() {
  const { cart, total, clearCart } = useCart();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: user?.email || '',
    address: '',
    phone: '',
    payment: 'card'
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { state: { from: { pathname: '/order' } } });
    }
  }, [user, loading, navigate]);

  const [isOrdering, setIsOrdering] = useState(false);

  if (loading) {
    return (
      <div className="pt-40 pb-20 text-center min-h-screen bg-black flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-2 border-ember border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[10px] font-mono uppercase tracking-widest text-white/40">Loading Your Account...</p>
      </div>
    );
  }

  if (!user) return null;

  const deliveryFee = 7500;
  const grandTotal = total + deliveryFee;

  const config = {
    reference: (new Date()).getTime().toString(),
    email: formData.email || user?.email || 'guest@zumahearth.com',
    amount: grandTotal * 100, // Paystack expects amount in Kobo
    publicKey: (import.meta as any).env.VITE_PAYSTACK_PUBLIC_KEY || '',
  };

  const onSuccess = (reference: any) => {
    setIsOrdering(true);
    // Simulate order processing after successful payment
    setTimeout(() => {
      const orderId = reference.reference;
      clearCart();
      navigate(`/track/${orderId}`);
    }, 2000);
  };

  const onClose = () => {
    setIsOrdering(false);
    console.log('Payment closed');
  };

  const initializePayment = usePaystackPayment(config);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (formData.payment === 'card') {
      if (!config.publicKey || config.publicKey === 'pk_test_placeholder') {
        alert("Payment System Offline: Please contact support or use a different payment method.");
        setIsOrdering(false);
        return;
      }

      setIsOrdering(true);
      try {
        initializePayment({ onSuccess, onClose });
      } catch (err) {
        console.error("Payment Initialization Error:", err);
        alert("Payment process failed. Please try again or use a different card.");
        setIsOrdering(false);
      }
    } else {
      // For local payments or other methods
      setIsOrdering(true);
      setTimeout(() => {
        const orderId = Math.random().toString(36).substr(2, 9).toUpperCase();
        clearCart();
        navigate(`/track/${orderId}`);
      }, 2000);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="pt-40 pb-20 text-center px-6 min-h-screen bg-black">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
          <ShoppingBag className="w-8 h-8 text-white/20" />
        </div>
        <h2 className="text-3xl font-display font-medium uppercase italic tracking-tighter mb-4">Your Cart is Empty</h2>
        <p className="text-white/50 mb-10 max-w-sm mx-auto leading-relaxed">
          Your culinary selection is currently empty. Visit our menu to add some of our signature dishes.
        </p>
        <button
          onClick={() => navigate('/menu')}
          className="px-10 py-5 bg-ember text-black font-bold uppercase tracking-widest hover:bg-white transition-all ember-glow"
        >
          Explore Menu
        </button>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 min-h-screen bg-obsidian relative overflow-hidden font-sans">
      {/* Background Atmosphere */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-orange-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Left: Summary */}
          <div className="space-y-16">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-ember mb-6 block">Order Summary</span>
              <h1 className="text-6xl md:text-8xl font-light italic tracking-tighter uppercase mb-6 decoration-ember/20 underline underline-offset-8">
                Your <span className="font-bold not-italic text-white/90">Order.</span>
              </h1>
              <p className="text-white/40 text-[10px] font-mono uppercase tracking-widest">Review your items before checkout</p>
            </div>

            <div className="space-y-8">
              {cart.map((item) => (
                <div key={item.dish.id} className="flex gap-8 items-center p-6 glass-effect rounded-[2rem] border-white/5 shadow-xl group hover:bg-white/10 transition-all duration-500">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 shrink-0 border border-white/10">
                    <img src={item.dish.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-light italic uppercase tracking-tight mb-2">{item.dish.name}</h4>
                    <p className="text-[10px] uppercase tracking-widest text-white/30 font-mono">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-lg font-mono text-ember font-medium tracking-tighter">
                    {formatCurrency(item.dish.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-10 border-t border-white/10 space-y-6">
               <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-[0.4em] text-white/40">
                  <span>Subtotal</span>
                  <span className="text-white/60">{formatCurrency(total)}</span>
               </div>
               <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-[0.4em] text-white/40">
                  <span>Delivery Fee</span>
                  <span className="text-white/60">{formatCurrency(7500)}</span>
               </div>
               <div className="flex justify-between items-end pt-8">
                  <span className="text-xs font-mono uppercase tracking-[0.6em] text-ember font-bold">Total Amount</span>
                  <span className="text-5xl font-mono text-white tracking-tighter decoration-ember/20 underline underline-offset-8">
                    {formatCurrency(total + 7500)}
                  </span>
               </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="glass-effect p-12 md:p-16 rounded-[3rem] h-fit border-white/5 sticky top-32 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5">
               <PackageCheck className="w-40 h-40 text-ember" />
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-12 relative z-10">
              <div className="space-y-10">
                <div>
                  <label className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.4em] text-ember mb-6">
                    <Mail className="w-3 h-3" /> Email Address
                  </label>
                  <input 
                    required
                    type="email" 
                    placeholder="Enter your email" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:outline-none focus:border-ember transition-all placeholder:text-white/10 font-mono text-[10px] uppercase tracking-widest"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.4em] text-ember mb-6">
                    <MapPin className="w-3 h-3" /> Delivery Address
                  </label>
                  <input 
                    required
                    type="text" 
                    placeholder="Street, City, Area" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:outline-none focus:border-ember transition-all placeholder:text-white/10 font-mono text-[10px] uppercase tracking-widest"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.4em] text-ember mb-6">
                    <CreditCard className="w-3 h-3" /> Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {['card', 'zuma-pay'].map(m => (
                       <button
                         key={m}
                         type="button"
                         onClick={() => setFormData({ ...formData, payment: m })}
                         className={cn(
                           "py-5 rounded-2xl border text-[8px] font-mono uppercase tracking-[0.3em] transition-all",
                           formData.payment === m ? 'bg-white text-black border-white shadow-xl' : 'border-white/10 bg-white/5 text-white/40 hover:border-white/30'
                         )}
                       >
                         {m === 'zuma-pay' ? 'Zuma Pay' : 'Card'}
                       </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.4em] text-ember mb-6">
                     Phone Number
                  </label>
                  <input 
                    required
                    type="tel" 
                    placeholder="Enter your phone number" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:outline-none focus:border-ember transition-all placeholder:text-white/10 font-mono text-[10px] uppercase tracking-widest"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <button
                  disabled={isOrdering}
                  className="w-full py-6 bg-white text-black font-bold uppercase tracking-[0.4em] hover:bg-ember transition-all shadow-2xl flex items-center justify-center gap-4 group rounded-2xl text-[10px]"
                >
                  {isOrdering ? (
                    <>Processing...</>
                  ) : (
                    <>Complete Order <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" /></>
                  )}
                </button>
                <p className="text-center text-[8px] font-mono text-white/20 uppercase tracking-[0.4em]">
                   Securely processed and encrypted
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
