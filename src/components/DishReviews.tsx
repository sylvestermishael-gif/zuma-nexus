import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MessageSquare, Send, User } from 'lucide-react';
import { reviewService, Review } from '../services/reviewService';
import { cn } from '../lib/utils';

interface DishReviewsProps {
  dishId: string;
}

export const DishReviews: React.FC<DishReviewsProps> = ({ dishId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newReview, setNewReview] = useState({
    userName: '',
    rating: 5,
    comment: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);

  useEffect(() => {
    fetchReviews();
  }, [dishId]);

  useEffect(() => {
    if (showForm && formRef.current) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }, [showForm]);

  const fetchReviews = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await reviewService.getReviewsByDish(dishId);
      setReviews(data || []);
    } catch (error: any) {
      console.error("Failed to fetch reviews", error);
      // Don't show index error to users, but it's a likely culprit
      if (error.message?.includes('index')) {
        setError("Database indexing in progress. Reviews may be temporarily unavailable.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!newReview.userName.trim() || !newReview.comment.trim()) {
      setError("Please provide both a name and your observation notes.");
      return;
    }

    setIsSubmitting(true);
    try {
      await reviewService.addReview({
        dishId,
        userName: newReview.userName,
        rating: newReview.rating,
        comment: newReview.comment
      });
      setNewReview({ userName: '', rating: 5, comment: '' });
      setSuccess(true);
      setTimeout(() => {
        setShowForm(false);
        setSuccess(false);
      }, 2000);
      await fetchReviews();
    } catch (error: any) {
      console.error("Failed to submit review", error);
      let message = "Post failed. Please check your connection.";
      try {
        const parsed = JSON.parse(error.message);
        if (parsed.error.includes('permission-denied')) {
          message = "Submission failed: Ensure all fields are filled correctly.";
        }
      } catch (e) { /* fallback */ }
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="mt-12 space-y-8">
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div className="flex items-center gap-4">
          <div className="text-3xl font-display font-medium text-ember">
            {averageRating > 0 ? averageRating.toFixed(1) : '—'}
          </div>
          <div>
            <div className="flex gap-1 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={cn(
                    "w-3 h-3", 
                    i < Math.round(averageRating) ? "text-ember fill-ember" : "text-white/10"
                  )} 
                />
              ))}
            </div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-white/40">
              {reviews.length} Reviews
            </p>
          </div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowForm(!showForm)}
          className={cn(
            "text-[10px] font-mono uppercase tracking-[0.2em] px-6 py-3 rounded-full transition-all duration-300 flex items-center gap-2",
            showForm 
              ? "bg-white/10 text-white border border-white/20" 
              : "bg-ember text-black font-bold border border-ember shadow-[0_0_20px_rgba(242,125,38,0.2)]"
          )}
        >
          {showForm ? 'Cancel' : 'Write a Review'}
        </motion.button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form 
            ref={formRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="space-y-4 overflow-hidden"
          >
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-900/20 border border-red-900/50 rounded-xl text-[10px] font-mono text-red-400 uppercase tracking-widest"
              >
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-emerald-900/20 border border-emerald-900/50 rounded-xl text-[10px] font-mono text-emerald-400 uppercase tracking-widest"
              >
                Success: Review Posted
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                required
                type="text" 
                placeholder="Your Name"
                className="bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-ember text-sm uppercase tracking-widest font-mono"
                value={newReview.userName}
                onChange={e => setNewReview({ ...newReview, userName: e.target.value })}
              />
              <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Rating</span>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button 
                      key={star}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="p-1"
                    >
                      <Star className={cn("w-4 h-4", star <= newReview.rating ? "text-ember fill-ember" : "text-white/20")} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <textarea 
              required
              placeholder="Your review..."
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-ember text-sm font-light leading-relaxed"
              value={newReview.comment}
              onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
            />
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              className="w-full py-4 bg-ember text-black font-bold uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(242,125,38,0.2)]"
            >
              <Send className="w-4 h-4" /> 
              {isSubmitting ? 'Posting...' : 'Post Review'}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-24 bg-white/5 rounded-2xl" />
            ))}
          </div>
        ) : reviews.length > 0 ? (
          reviews.map(review => (
            <motion.div 
              key={review.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-3"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-ember/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-ember" />
                  </div>
                  <div>
                    <h5 className="text-[10px] font-mono uppercase tracking-widest text-white">{review.userName}</h5>
                    <div className="flex gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={cn(
                            "w-2 h-2", 
                            i < review.rating ? "text-ember fill-ember" : "text-white/5"
                          )} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-[8px] font-mono uppercase tracking-widest text-white/20">
                  {review.createdAt?.toDate ? review.createdAt.toDate().toLocaleDateString() : 'Recent'}
                </span>
              </div>
              <p className="text-xs font-light leading-relaxed text-white/70 italic">
                "{review.comment}"
              </p>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
            <MessageSquare className="w-8 h-8 text-white/10 mx-auto mb-4" />
            <p className="text-[10px] font-mono uppercase tracking-widest text-white/30">
              No reviews yet for this dish.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
