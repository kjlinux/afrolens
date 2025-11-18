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
      const cartData = await cartService.getCart();
      // Le nouveau service retourne un objet CartData avec items, subtotal, etc.
      setCart(cartData.items || []);
    } catch (error) {
      console.error('Erreur lors de la récupération du panier:', error);
      // En cas d'erreur, définir un panier vide
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (photo, licenseType = 'standard') => {
    // Le nouveau service attend photoId (string) et non l'objet photo complet
    const cartData = await cartService.addToCart(photo.id || photo, licenseType);
    setCart(cartData.items || []);
    return cartData.items || [];
  };

  const removeFromCart = async (itemId) => {
    // Le service attend un UUID de l'item
    const cartData = await cartService.removeFromCart(itemId);
    setCart(cartData.items || []);
    return cartData.items || [];
  };

  const updateCartItem = async (itemId, updates) => {
    // Le service attend un UUID de l'item et le nouveau license_type
    const cartData = await cartService.updateCartItem(itemId, updates.license_type || updates.licenseType);
    setCart(cartData.items || []);
    return cartData.items || [];
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
