import React, { createContext, useState, useContext, useEffect } from 'react';
import { isAuthenticated } from '../lib/auth';
import { getCart } from '../lib/cart';
import { getGuestCart } from '../lib/guestCart';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  
  const [isVatInc, setIsVatInc] = useState(() => {
    const savedVat = localStorage.getItem('isVatInc');
    return savedVat !== null ? JSON.parse(savedVat) : true;
  });

  const toggleVat = () => {
    setIsVatInc(prev => {
      const newState = !prev;
      localStorage.setItem('isVatInc', JSON.stringify(newState));
      return newState;
    });
  };

  const updateCartCount = (newCount) => setCartCount(newCount);

  const syncCartCount = async () => {
    if (isAuthenticated()) {
      try {
        const response = await getCart();
        if (response?.cart?.items) {
          setCartCount(response.cart.items.length);
        }
      } catch {
        setCartCount(0);
      }
    } else {
      setCartCount(getGuestCart().length);
    }
  };

  // Sync on mount
  useEffect(() => { syncCartCount(); }, []);

  // Sync on login/logout (auth.js dispatches "authChange")
  useEffect(() => {
    const handler = () => syncCartCount();
    window.addEventListener('authChange', handler);
    return () => window.removeEventListener('authChange', handler);
  }, []);

  return (
    <CartContext.Provider value={{ 
      cartCount, 
      updateCartCount, 
      fetchCartCount: syncCartCount, 
      isVatInc, 
      toggleVat 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);