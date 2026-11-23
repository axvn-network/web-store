'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/data/storeData';

export interface CartItem {
  product: Product;
  quantity: number;
}

const CART_STORAGE_KEY = 'betashop_cart';

export function getCartItems(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading cart from localStorage', e);
    return [];
  }
}

export function saveCartItems(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('cart-updated'));
  } catch (e) {
    console.error('Error saving cart to localStorage', e);
  }
}

export function addToCart(product: Product, quantity = 1): void {
  const items = getCartItems();
  const existingIndex = items.findIndex((i) => String(i.product.id) === String(product.id));

  if (existingIndex > -1) {
    items[existingIndex].quantity += quantity;
  } else {
    items.push({ product, quantity });
  }

  saveCartItems(items);
}

export function removeFromCart(productId: string | number): void {
  const items = getCartItems().filter((i) => String(i.product.id) !== String(productId));
  saveCartItems(items);
}

export function updateCartQuantity(productId: string | number, quantity: number): void {
  const items = getCartItems();
  const existing = items.find((i) => String(i.product.id) === String(productId));
  if (existing) {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    existing.quantity = quantity;
    saveCartItems(items);
  }
}

export function clearCart(): void {
  saveCartItems([]);
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const refreshCart = () => {
    setItems(getCartItems());
  };

  useEffect(() => {
    refreshCart();
    setIsLoaded(true);

    const handleUpdate = () => {
      refreshCart();
    };

    window.addEventListener('cart-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('cart-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return {
    items,
    isLoaded,
    totalCount,
    totalPrice,
    addToCart: (product: Product, qty?: number) => {
      addToCart(product, qty);
      refreshCart();
    },
    removeFromCart: (id: string | number) => {
      removeFromCart(id);
      refreshCart();
    },
    updateQuantity: (id: string | number, qty: number) => {
      updateCartQuantity(id, qty);
      refreshCart();
    },
    clearCart: () => {
      clearCart();
      refreshCart();
    },
  };
}
