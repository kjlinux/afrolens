import React, { createContext, useState, useEffect, useContext } from 'react';
import * as cartService from '../services/cartService';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const cartItems = await cartService.getCart();
      setCart(cartItems);
    } catch (error) {
      console.error('Erreur chargement panier:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (photo, licenseType = 'standard') => {
    const updatedCart = await cartService.addToCart(photo, licenseType);
    setCart(updatedCart);
    return updatedCart;
  };

  const removeFromCart = async (itemId) => {
    const updatedCart = await cartService.removeFromCart(itemId);
    setCart(updatedCart);
    return updatedCart;
  };

  const updateCartItem = async (itemId, updates) => {
    const updatedCart = await cartService.updateCartItem(itemId, updates);
    setCart(updatedCart);
    return updatedCart;
  };

  const clearCart = async () => {
    await cartService.clearCart();
    setCart([]);
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.price, 0);
  };

  const getItemCount = () => {
    return cart.length;
  };

  const value = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    getTotal,
    getItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export default CartContext;
