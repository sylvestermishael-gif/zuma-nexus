import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ShoppingBag, X, Plus, Minus, Info } from 'lucide-react';
import { MENU_DATA, Dish } from '../constants';
import { cn, formatCurrency } from '../lib/utils';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { DishReviews } from '../components/DishReviews';

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { cart, addToCart, removeFromCart, updateQuantity, total } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  const categories = ['all', 'primordial', 'elemental', 'afterglow', 'libations'];

  const categoryColors: Record<string, { top: string, bottom: string }> = {
    all: { top: 'bg-orange-900/10', bottom: 'bg-blue-900/5' },
    primordial: { top: 'bg-orange-600/20', bottom: 'bg-red-900/10' },
    elemental: { top: 'bg-blue-600/20', bottom: 'bg-cyan-900/10' },
    afterglow: { top: 'bg-purple-600/20', bottom: 'bg-pink-900/10' },
    libations: { top: 'bg-emerald-600/20', bottom: 'bg-green-900/10' },
  };

  const filteredDishes = MENU_DATA.filter((dish) => {
    const matchesCategory = activeCategory === 'all' || dish.category === activeCategory;
    const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         dish.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenDish = (dish: Dish) => {
    setSelectedDish(dish);
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-obsidian relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className={cn(
          "absolute top-[10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] transition-all duration-1000",
          categoryColors[activeCategory]?.top || categoryColors.all.top
        )}></div>
        <div className={cn(
          "absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] transition-all duration-1000",
          categoryColors[activeCategory]?.bottom || categoryColors.all.bottom
        )}></div>
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-12 relative z-10">
        <span className="text-[10px] font-mono uppercase tracking-[0.6em] text-ember mb-4 block text-center">Culinary Archives</span>
        <h1 className="text-6xl md:text-8xl font-light italic text-center uppercase tracking-tighter mb-12 decoration-ember/20 underline underline-offset-8">
          The <span className="font-bold not-italic text-white/90">Sequence.</span>
        </h1>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 mb-16 px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all border",
                  activeCategory === cat 
                    ? "bg-white text-black border-white shadow-xl scale-105" 
                    : "bg-white/5 border-white/10 text-white/40 hover:border-white/30 hover:text-white"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-ember transition-colors" />
            <input
              type="text"
              placeholder="Search dishes..."
              className="w-full bg-white/5 border border-white/10 pl-14 pr-6 py-4 rounded-full focus:outline-none focus:border-ember transition-all text-xs tracking-widest uppercase placeholder:text-white/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 mb-20 relative z-10">
        {filteredDishes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDishes.map((dish) => (
              <motion.div
                key={dish.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="group glass-effect rounded-[2.5rem] overflow-hidden hover:bg-white/10 transition-all duration-500 flex flex-col border-white/5"
              >
                <div className="relative aspect-[4/3] overflow-hidden p-4">
                  <div className="w-full h-full rounded-[2rem] overflow-hidden relative">
                    <div className={cn(
                      "absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity",
                      dish.category === 'primordial' ? "bg-orange-900" :
                      dish.category === 'elemental' ? "bg-blue-900" :
                      dish.category === 'afterglow' ? "bg-purple-900" : "bg-emerald-900"
                    )} />
                    <img 
                      src={dish.image} 
                      alt={dish.name} 
                      className="w-full h-full object-cover grayscale mix-blend-overlay group-hover:grayscale-0 group-hover:mix-blend-normal transition-all duration-1000 group-hover:scale-110" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="absolute top-8 right-8 flex gap-2">
                    {dish.tags.map(tag => (
                       <span key={tag} className="px-3 py-1 bg-black/60 backdrop-blur-md text-[8px] font-black uppercase tracking-[0.2em] border border-white/10 rounded-full text-ember">{tag}</span>
                    ))}
                  </div>
                </div>
                
                <div className="p-8 pt-2 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-light italic uppercase tracking-tight leading-tight group-hover:text-ember transition-colors">{dish.name}</h3>
                    <span className="font-mono text-ember text-xl font-medium tracking-tighter">{formatCurrency(dish.price)}</span>
                  </div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 leading-relaxed mb-10 line-clamp-2">
                    {dish.description}
                  </p>
                  
                  <div className="mt-auto flex gap-4">
                    <button
                      onClick={() => addToCart(dish)}
                      className="flex-1 bg-white text-black hover:bg-ember transition-all py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl"
                    >
                      <Plus className="w-4 h-4" /> Add to Circuit
                    </button>
                    <button 
                      onClick={() => handleOpenDish(dish)}
                      className="w-16 h-16 bg-white/5 border border-white/10 flex items-center justify-center rounded-2xl hover:border-ember hover:text-ember transition-all group/info"
                    >
                      <Info className="w-5 h-5 group-hover/info:scale-110" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-40 glass-effect rounded-[3rem] border-dashed border-white/10">
            <Search className="w-12 h-12 text-white/10 mx-auto mb-6" />
            <h3 className="text-xl font-light italic uppercase tracking-tighter text-white/40">No components found in this sector.</h3>
            <button 
              onClick={() => {setActiveCategory('all'); setSearchQuery('');}}
              className="mt-6 text-ember uppercase text-[10px] font-mono tracking-widest hover:underline"
            >
              Reset Search Matrix
            </button>
          </div>
        )}
      </div>

      {/* Cart Button */}
      {cart.length > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-10 right-10 z-[60] w-16 h-16 bg-ember text-black rounded-full flex items-center justify-center ember-glow hover:scale-110 transition-transform"
        >
          <ShoppingBag className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 bg-white text-[10px] w-6 h-6 rounded-full flex items-center justify-center font-bold">
            {cart.reduce((acc, i) => acc + i.quantity, 0)}
          </span>
        </button>
      )}

      {/* Cart Drawer Overlay */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70]" 
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-obsidian z-[80] shadow-2xl p-8 border-l border-white/10"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-display font-medium uppercase italic tracking-tight">Your Selection</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white/10 rounded-full"><X className="w-6 h-6" /></button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-6 mb-10 h-[60vh] pr-4 scrollbar-hide">
                {cart.map((item) => (
                  <div key={item.dish.id} className="flex gap-4 items-center">
                    <div className="w-20 h-20 rounded-lg overflow-hidden border border-white/10 shrink-0">
                      <img src={item.dish.image} className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" alt="" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-display font-medium uppercase tracking-tight mb-1">{item.dish.name}</h4>
                      <p className="text-xs text-white/50">{formatCurrency(item.dish.price)}</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white/5 p-1 rounded-lg">
                      <button onClick={() => updateQuantity(item.dish.id, -1)} className="p-1 hover:text-ember"><Minus className="w-3 h-3" /></button>
                      <span className="text-xs font-mono">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.dish.id, 1)} className="p-1 hover:text-ember"><Plus className="w-3 h-3" /></button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-8 bg-obsidian border-t border-white/10">
                <div className="flex justify-between items-center mb-6 text-sm font-mono uppercase tracking-[0.2em]">
                  <span className="text-white/50">Total</span>
                  <span className="text-ember text-xl font-bold">{formatCurrency(total)}</span>
                </div>
                <Link
                  to="/order"
                  className="w-full bg-ember text-black text-center py-5 font-bold uppercase tracking-[0.3em] hover:bg-white transition-all block"
                >
                  Confirm Order
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Dish Detail Modal */}
      <AnimatePresence>
        {selectedDish && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDish(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md" 
            />
            <motion.div
              layoutId={selectedDish.id}
              className="relative w-full max-w-4xl bg-obsidian border border-white/10 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col md:flex-row"
            >
              <button 
                onClick={() => setSelectedDish(null)}
                className="absolute top-6 right-6 z-20 w-10 h-10 bg-black/50 backdrop-blur-md flex items-center justify-center rounded-full border border-white/10 hover:bg-ember hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex flex-col md:flex-row w-full overflow-y-auto md:overflow-visible">
                <div className="md:w-1/2 h-64 md:h-[auto] sticky top-0 md:relative">
                  <img src={selectedDish.image} className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" alt="" />
                </div>
                <div className="md:w-1/2 p-10 pb-20 flex flex-col md:max-h-[90vh] md:overflow-y-auto scrollbar-hide">
                  <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-ember mb-4 block">{selectedDish.category}</span>
                  <h2 className="text-4xl font-display font-medium uppercase italic tracking-tighter mb-4 leading-tight">{selectedDish.name}</h2>
                  <p className="text-2xl font-mono text-white/80 mb-8">{formatCurrency(selectedDish.price)}</p>
                  
                  <div className="space-y-6 mb-12">
                    <div>
                      <h4 className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-2">The Base</h4>
                      <p className="text-white/70 font-light leading-relaxed">{selectedDish.description}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      addToCart(selectedDish);
                      setSelectedDish(null);
                    }}
                    className="w-full bg-ember text-black py-5 font-bold uppercase tracking-[0.3em] hover:bg-white transition-all"
                  >
                    Add to Order
                  </button>

                  <DishReviews dishId={selectedDish.id} />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
