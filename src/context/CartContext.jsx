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
      console.error('Erreur chargement panier:', error);
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
    // Le nouveau service attend un index (number), pas un itemId
    // Trouver l'index de l'item
    const index = cart.findIndex((item) => item.id === itemId || item.photo_id === itemId);
    if (index === -1) {
      throw new Error('Item non trouvé dans le panier');
    }
    const cartData = await cartService.removeFromCart(index);
    setCart(cartData.items || []);
    return cartData.items || [];
  };

  const updateCartItem = async (itemId, updates) => {
    // Le nouveau service attend un index (number) et un objet avec license_type
    const index = cart.findIndex((item) => item.id === itemId || item.photo_id === itemId);
    if (index === -1) {
      throw new Error('Item non trouvé dans le panier');
    }
    const cartData = await cartService.updateCartItem(index, updates.license_type || updates.licenseType);
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
