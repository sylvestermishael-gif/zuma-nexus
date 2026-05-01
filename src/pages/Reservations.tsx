import { useState } from 'react';
import type { FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, Users, ChevronRight, CheckCircle, Flame, CreditCard, ShieldCheck } from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import { usePaystackPayment } from 'react-paystack';

const SEAT_PRICE = 5000;

export default function Reservations() {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    guests: '2',
    name: '',
    email: '',
    notes: '',
    occasion: 'none'
  });

  const guestsOptions = ['1', '2', '3', '4', '5', '6', '7+'];
  const timeOptions = ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'];

  const getGuestCount = () => {
    const val = formData.guests;
    return val === '7+' ? 7 : parseInt(val);
  };

  const totalAmount = getGuestCount() * SEAT_PRICE;

  const config = {
    reference: (new Date()).getTime().toString(),
    email: formData.email || 'guest@zumahearth.com',
    amount: totalAmount * 100, // Kobo
    publicKey: (import.meta as any).env.VITE_PAYSTACK_PUBLIC_KEY || '',
  };

  const initializePayment = usePaystackPayment(config);

  const handlePaymentSuccess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setStep(3);
      setIsProcessing(false);
    }, 1500);
  };

  const handlePaymentClose = () => {
    setIsProcessing(false);
  };

  const handleComplete = (e: FormEvent) => {
    e.preventDefault();
    
    if (!config.publicKey || config.publicKey === 'pk_test_placeholder') {
      alert("Payment System Offline: VITE_PAYSTACK_PUBLIC_KEY is not configured in environment settings.");
      setIsProcessing(false);
      return;
    }

    setIsProcessing(true);
    try {
      initializePayment({ 
        onSuccess: handlePaymentSuccess, 
        onClose: handlePaymentClose 
      });
    } catch (err) {
      console.error("Payment Initialization Error:", err);
      alert("Nexus Protocol Failure: Could not initialize payment gateway.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-obsidian relative overflow-hidden font-sans">
      {/* Background Atmosphere */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-orange-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-ember mb-4 block">Temporal Alignment</span>
          <h1 className="text-5xl md:text-7xl font-light italic tracking-tighter uppercase mb-6 decoration-ember/20 underline underline-offset-8">
            The <span className="font-bold not-italic text-white/90">Induction.</span>
          </h1>
          <p className="text-white/40 text-[10px] font-mono uppercase tracking-widest">Reservation is mandated for the hearth experience</p>
        </div>

        <div className="glass-effect rounded-[2.5rem] overflow-hidden shadow-2xl relative border-white/10">
          {/* Progress Bar */}
          <div className="h-1 w-full bg-white/5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(step / 3) * 100}%` }}
              className="h-full bg-ember"
            />
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 md:p-12"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div>
                      <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-ember mb-4">
                        <Users className="w-4 h-4" /> Guest Count
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {guestsOptions.map(opt => (
                          <button
                            key={opt}
                            onClick={() => setFormData({ ...formData, guests: opt })}
                            className={cn(
                              "py-3 rounded-xl border text-xs font-mono transition-all",
                              formData.guests === opt ? "bg-white text-black border-white shadow-xl" : "bg-white/5 border-white/10 text-white/50 hover:border-white/30"
                            )}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-ember mb-4">
                        <Calendar className="w-4 h-4" /> Date Selection
                      </label>
                      <input 
                        type="date" 
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-ember transition-colors"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-ember mb-4">
                      <Clock className="w-4 h-4" /> Evening Slot
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {timeOptions.map(time => (
                        <button
                          key={time}
                          onClick={() => setFormData({ ...formData, time: time })}
                          className={cn(
                            "py-3 rounded-xl border text-sm font-mono transition-all text-center",
                            formData.time === time ? "bg-ember border-ember text-black" : "border-white/10 text-white/50 hover:border-white/30"
                          )}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-12 flex justify-end">
                  <button
                    disabled={!formData.date || !formData.time}
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 px-10 py-5 bg-ember text-black font-bold uppercase tracking-widest hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
                  >
                    Next Step <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 md:p-12 overflow-y-auto max-h-[70vh]"
              >
                <div className="mb-10 p-6 glass-effect rounded-3xl border-ember/20 border flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-ember block mb-1">Reservation Value</span>
                    <div className="text-2xl font-mono text-white tracking-tighter">
                      {formatCurrency(totalAmount)}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block mb-1">Allocation</span>
                    <div className="text-xs font-mono text-white/60">
                      {formData.guests} Seats × {formatCurrency(SEAT_PRICE)}
                    </div>
                  </div>
                </div>

                <form onSubmit={handleComplete} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 ml-2">Full Identity</label>
                       <input 
                         required
                         type="text" 
                         placeholder="Name" 
                         className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-ember"
                         value={formData.name}
                         onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 ml-2">Communication Channel</label>
                       <input 
                         required
                         type="email" 
                         placeholder="Email Address" 
                         className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-ember"
                         value={formData.email}
                         onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                       />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 ml-2">Dietary Notes / Requests</label>
                    <textarea 
                      rows={4}
                      placeholder="Specify allergens or special requirements..." 
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-ember resize-none"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>

                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start gap-3">
                    <ShieldCheck className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                    <p className="text-[10px] text-blue-200/60 leading-relaxed font-mono uppercase tracking-wider">
                      Securing your seat requires full advance settlement via encrypted protocol. Refund window closes 24h prior to induction.
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-8">
                    <button type="button" onClick={() => setStep(1)} className="text-white/40 font-mono text-[10px] uppercase tracking-widest hover:text-white transition-colors">Go Back</button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="px-10 py-5 bg-white text-black font-bold uppercase tracking-widest hover:bg-ember transition-all flex items-center gap-3 disabled:opacity-50"
                    >
                      {isProcessing ? 'Synchronizing...' : (
                        <>
                          <CreditCard className="w-4 h-4" />
                          Complete Induction
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-12 md:p-20 text-center"
              >
                <div className="w-20 h-20 bg-ember/20 border border-ember rounded-full flex items-center justify-center mx-auto mb-8">
                  <CheckCircle className="w-8 h-8 text-ember" />
                </div>
                <h2 className="text-4xl font-light italic uppercase tracking-tighter mb-4">Journey Initialized</h2>
                <p className="text-white/40 text-[10px] uppercase tracking-widest mb-10 max-w-sm mx-auto leading-relaxed">
                  Your seat at the hearth is secured for {formData.date} at {formData.time}. A verification pulse has been sent.
                </p>
                <div className="p-8 glass-effect rounded-3xl max-w-sm mx-auto text-left mb-12 border-dashed">
                   <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-mono uppercase text-white/40">Reference</span>
                      <span className="text-xs font-mono text-ember uppercase">ZH-{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                   </div>
                   <div className="space-y-2 text-sm font-mono uppercase tracking-widest text-white/80">
                      <div>{formData.guests} Guests</div>
                      <div>{formData.name}</div>
                   </div>
                </div>
                <button
                   onClick={() => window.location.href = '/'}
                   className="text-ember font-mono text-xs uppercase tracking-[0.2em] hover:text-white transition-colors"
                >
                  Return to Matrix
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Polices */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 px-6 opacity-40 hover:opacity-100 transition-opacity">
           <div className="flex gap-4">
              <Flame className="w-5 h-5 text-ember shrink-0" />
              <div>
                <h5 className="text-[10px] font-mono uppercase tracking-widest text-white mb-2">Heat Protocol</h5>
                <p className="text-xs font-light leading-relaxed">We require arrival 15 minutes prior to induction. Tardiness results in cooling of the primordial base.</p>
              </div>
           </div>
           <div className="flex gap-4">
              <Users className="w-5 h-5 text-ember shrink-0" />
              <div>
                <h5 className="text-[10px] font-mono uppercase tracking-widest text-white mb-2">Dress Constraint</h5>
                <p className="text-xs font-light leading-relaxed">Attire should reflect the refinement of Abuja: Architectural, sharp, or monochromatic.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
