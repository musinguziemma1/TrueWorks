import { create } from 'zustand';
import { Product } from './types';
import toast from 'react-hot-toast';

interface WishlistStore {
  items: Product[];
  toggle: (product: Product) => void;
  isWishlisted: (id: string) => boolean;
  remove: (id: string) => void;
  clear: () => void;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: JSON.parse(localStorage.getItem('tw_wishlist') || '[]'),

  toggle: (product) => {
    const items = get().items;
    const exists = items.find((i) => i._id === product._id);
    let newItems: Product[];
    if (exists) {
      newItems = items.filter((i) => i._id !== product._id);
      toast.success('Removed from wishlist');
    } else {
      newItems = [...items, product];
      toast.success('Added to wishlist');
    }
    localStorage.setItem('tw_wishlist', JSON.stringify(newItems));
    set({ items: newItems });
  },

  isWishlisted: (id) => get().items.some((i) => i._id === id),

  remove: (id) => {
    const items = get().items.filter((i) => i._id !== id);
    localStorage.setItem('tw_wishlist', JSON.stringify(items));
    set({ items });
  },

  clear: () => {
    localStorage.setItem('tw_wishlist', '[]');
    set({ items: [] });
  },
}));
