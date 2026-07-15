import { motion } from 'framer-motion';
import { Check, X, Star, StarHalf, MessageSquare, Search, Filter } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { cn } from '../../lib/utils';
import { useState } from 'react';

export function AdminReviews() {
  const reviews = useQuery(api.reviews.list, {});
  const approveReview = useMutation(api.reviews.approve);
  const rejectReview = useMutation(api.reviews.reject);
  const toggleFeaturedReview = useMutation(api.reviews.toggleFeatured);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  if (reviews === undefined) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  const filtered = reviews.filter((r) => {
    if (search && !r.customerName.toLowerCase().includes(search.toLowerCase()) && !r.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === 'pending' && r.approved) return false;
    if (filter === 'approved' && !r.approved) return false;
    return true;
  });

  const pendingCount = reviews.filter((r) => !r.approved).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Reviews</h1>
          <p className="text-sm text-text-muted">
            {reviews.length} reviews · {pendingCount} pending
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text" placeholder="Search reviews..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-48 pl-10 pr-4 py-2 rounded-md border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20"
              aria-label="Search reviews"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {(['all', 'pending', 'approved'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-4 py-2 rounded-md text-sm font-semibold capitalize transition-colors',
              filter === f ? 'bg-primary text-white' : 'bg-section text-text-secondary hover:bg-section-alt'
            )}
            aria-pressed={filter === f}
          >
            {f} {f === 'pending' && pendingCount > 0 && `(${pendingCount})`}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-text-muted">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No reviews found</p>
          </div>
        ) : (
          filtered.map((review, idx) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="p-5 rounded-lg border border-border bg-white"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white text-sm font-bold">
                    {review.customerName.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-primary">{review.customerName}</p>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={cn('w-3.5 h-3.5', s <= review.rating ? 'text-accent fill-accent' : 'text-border')}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!review.approved && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => approveReview({ id: review._id as any })}
                      aria-label="Approve review"
                    >
                      <Check className="w-4 h-4" /> Approve
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => rejectReview({ id: review._id as any })}
                    aria-label="Delete review"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <h3 className="font-heading font-bold text-primary mb-1">{review.title}</h3>
              <p className="text-sm text-text-secondary mb-3">{review.content}</p>
              <div className="flex items-center gap-3 text-xs text-text-muted">
                <Badge variant={review.approved ? 'success' : 'warning'} size="sm">
                  {review.approved ? 'Approved' : 'Pending'}
                </Badge>
                <button
                  onClick={() => toggleFeaturedReview({ id: review._id as any })}
                  className={cn(
                    'flex items-center gap-1 px-2 py-1 rounded transition-colors',
                    review.featured ? 'text-accent bg-accent/10' : 'text-text-muted hover:bg-section'
                  )}
                  aria-label={review.featured ? 'Remove featured' : 'Feature review'}
                >
                  <Star className="w-3.5 h-3.5" />
                  {review.featured ? 'Featured' : 'Feature'}
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
