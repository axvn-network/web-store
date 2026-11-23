'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CustomerUser, CustomerAddress } from '@/lib/customerDb';

interface CustomerContextType {
  user: CustomerUser | null;
  loading: boolean;
  login: (userData: CustomerUser) => void;
  logout: () => void;
  updateUser: (fields: Partial<CustomerUser>) => void;
}

const CustomerContext = createContext<CustomerContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
});

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('betashop_customer');
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // Auto sign-in demo default customer (Anh Nguyễn Văn An) for rich user experience
        const defaultUser: CustomerUser = {
          id: 'usr-01',
          name: 'Nguyễn Văn An',
          email: 'an.nguyen@gmail.com',
          emailVerified: true,
          phone: '0988123456',
          phoneVerified: true,
          image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          role: 'customer',
          status: 'active',
          tier: 'GOLD',
          totalSpent: 12500000,
          points: 1250,
          twoFactorEnabled: false,
          linkedAccounts: [
            { provider: 'google', providerId: 'google-10982391283', connectedAt: '01/10/2026' },
            { provider: 'phone', providerId: '0988123456', connectedAt: '01/10/2026' },
          ],
          createdAt: '01/10/2026 09:30',
        };
        setUser(defaultUser);
        localStorage.setItem('betashop_customer', JSON.stringify(defaultUser));
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData: CustomerUser) => {
    setUser(userData);
    localStorage.setItem('betashop_customer', JSON.stringify(userData));
    // Set cookie for middleware
    if (typeof document !== 'undefined') {
      document.cookie = `betashop_user_id=${userData.id}; path=/; max-age=2592000`;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('betashop_customer');
    if (typeof document !== 'undefined') {
      document.cookie = 'betashop_user_id=; path=/; max-age=0';
    }
  };

  const updateUser = (fields: Partial<CustomerUser>) => {
    if (!user) return;
    const updated = { ...user, ...fields };
    setUser(updated);
    localStorage.setItem('betashop_customer', JSON.stringify(updated));
  };

  return (
    <CustomerContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  return useContext(CustomerContext);
}
