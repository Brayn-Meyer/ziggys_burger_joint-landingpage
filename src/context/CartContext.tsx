import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MenuEntry } from '@/siteConfig';

export interface CartItem {
  item: MenuEntry;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
  note: string;
  customerName: string;                // 👈 added
  addItem: (item: MenuEntry) => void;
  removeItem: (itemName: string) => void;
  updateQuantity: (itemName: string, quantity: number) => void;
  clearCart: () => void;
  setNote: (note: string) => void;
  setCustomerName: (name: string) => void; // 👈 added
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const parsePrice = (priceStr: string): number => {
  if (!priceStr) return 0;
  const cleaned = priceStr.replace(/[^0-9.]/g, '');
  return parseFloat(cleaned) || 0;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  // Cart items (with validation)
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('cart');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.filter((entry: any) =>
            entry &&
            entry.item &&
            typeof entry.item.price === 'string' &&
            typeof entry.quantity === 'number' &&
            entry.quantity > 0
          );
        }
      } catch { /* ignore */ }
    }
    return [];
  });

  const [note, setNote] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('cartNote') || '';
  });

  // 👇 Customer name state
  const [customerName, setCustomerName] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('customerName') || '';
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('cartNote', note);
  }, [note]);

  useEffect(() => {
    localStorage.setItem('customerName', customerName);
  }, [customerName]);

  const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => {
    const price = parsePrice(i.item?.price || '');
    return sum + price * i.quantity;
  }, 0);

  const addItem = (item: MenuEntry) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.item.name === item.name);
      if (existing) {
        return prev.map((i) =>
          i.item.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const removeItem = (itemName: string) => {
    setItems((prev) => prev.filter((i) => i.item.name !== itemName));
  };

  const updateQuantity = (itemName: string, quantity: number) => {
    if (quantity <= 0) { removeItem(itemName); return; }
    setItems((prev) =>
      prev.map((i) => (i.item.name === itemName ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
    setNote('');
    // Optionally keep name, or clear it too? We'll keep it.
    // setCustomerName('');
  };

  const value = {
    items,
    totalQuantity,
    totalPrice,
    note,
    customerName,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setNote,
    setCustomerName,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCartContext must be used within CartProvider');
  return context;
};