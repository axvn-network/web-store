'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/data/storeData';

const WISHLIST_STORAGE_KEY = 'betashop_wishlist';

export function getWishlistItems(): Product[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading wishlist', e);
    return [];
  }
}

export function saveWishlistItems(items: Product[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('wishlist-updated'));
  } catch (e) {
    console.error('Error saving wishlist', e);
  }
}

export function toggleWishlist(product: Product): boolean {
  const items = getWishlistItems();
  const index = items.findIndex((p) => String(p.id) === String(product.id));

  let added = false;
  if (index > -1) {
    items.splice(index, 1);
    added = false;
  } else {
    items.push(product);
    added = true;
  }

  saveWishlistItems(items);
  return added;
}

export function isInWishlist(productId: string | number): boolean {
  const items = getWishlistItems();
  return items.some((p) => String(p.id) === String(productId));
}

export function useWishlist() {
  const [items, setItems] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const refreshWishlist = () => {
    setItems(getWishlistItems());
  };

  useEffect(() => {
    refreshWishlist();
    setIsLoaded(true);

    const handleUpdate = () => {
      refreshWishlist();
    };

    window.addEventListener('wishlist-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('wishlist-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return {
    items,
    isLoaded,
    totalCount: items.length,
    toggleWishlist: (product: Product) => {
      const res = toggleWishlist(product);
      refreshWishlist();
      return res;
    },
    isFavorite: (productId: string | number) => {
      return items.some((p) => String(p.id) === String(productId));
    },
    removeFromWishlist: (productId: string | number) => {
      const updated = items.filter((p) => String(p.id) !== String(productId));
      saveWishlistItems(updated);
      refreshWishlist();
    },
    clearWishlist: () => {
      saveWishlistItems([]);
      refreshWishlist();
    },
  };
}
