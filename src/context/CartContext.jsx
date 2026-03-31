import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Try to restore cart from local storage on mount
    const savedCart = localStorage.getItem('picxkart_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [globalResolution, setGlobalResolution] = useState(() => {
    return localStorage.getItem('picxkart_resolution') || 'High'; // High, Medium, Low
  });

  // Save changes to local storage
  useEffect(() => {
    localStorage.setItem('picxkart_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('picxkart_resolution', globalResolution);
  }, [globalResolution]);

  const addToCart = (item) => {
    setCart((prev) => {
      // Prevent duplicates
      if (prev.some((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const isInCart = (id) => {
    return cart.some((item) => item.id === id);
  };

  // Helper to resolve the best URL based on the global setting natively
  const resolveGlobalUrl = (item) => {
       const resOptions = Object.keys(item.resolutions);
       // The resolutions object differs between Pexels/Pixabay and Video/Photo.
       // Pexels photo: original, large, medium
       // Pixabay photo: original, web
       // Videos: 'hd (1920x1080)', 'sd (640x360)', 'large', 'medium', etc.
       
       if (resOptions.length === 0) return null;

       const resString = resOptions.join(' ').toLowerCase();

       if (globalResolution === 'High') {
           if (item.resolutions['original']) return item.resolutions['original'];
           if (item.resolutions['large']) return item.resolutions['large'];
           // find the one containing 'hd'
           const hdKey = resOptions.find(k => k.toLowerCase().includes('hd'));
           if (hdKey) return item.resolutions[hdKey];
           // default to first
           return item.resolutions[resOptions[0]];
       } 

       if (globalResolution === 'Medium') {
           if (item.resolutions['medium']) return item.resolutions['medium'];
           if (item.resolutions['web']) return item.resolutions['web'];
           // find sd or smaller hd
           const sdKey = resOptions.find(k => k.toLowerCase().includes('sd'));
           if (sdKey) return item.resolutions[sdKey];
           return item.resolutions[resOptions[0]];
       }

       if (globalResolution === 'Low') {
           if (item.resolutions['small']) return item.resolutions['small'];
           const sdKey = resOptions.find(k => k.toLowerCase().includes('sd'));
           if (sdKey) return item.resolutions[sdKey];
           // fallback to last (usually smallest in apis if not mapped properly)
           return item.resolutions[resOptions[resOptions.length - 1]];
       }

       return item.resolutions[resOptions[0]];
  };

  return (
    <CartContext.Provider 
        value={{ 
            cart, 
            addToCart, 
            removeFromCart, 
            clearCart, 
            isInCart,
            globalResolution,
            setGlobalResolution,
            resolveGlobalUrl
        }}
    >
      {children}
    </CartContext.Provider>
  );
};
