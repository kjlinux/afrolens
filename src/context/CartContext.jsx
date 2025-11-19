import React, { createContext, useState, useEffect, useContext } from 'react';
import * as cartService from '../services/cartService';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  // Mapper les items de l'API vers le format attendu par les composants
  const mapCartItems = (items) => {
    return (items || []).map(item => ({
      // L'id est l'UUID unique de l'item dans le panier (pour removeFromCart, updateCartItem)
      id: item.id,
      // photo_id est l'ID de la photo
      photo_id: item.photo_id,
      title: item.photo_title || 'Sans titre',
      preview_url: item.photo_thumbnail,
      photographer_name: item.photographer_name,
      photographer_id: item.photographer_id,
      license_type: item.license_type,
      price: item.price,
      price_standard: item.price,
      price_extended: item.license_type === 'extended' ? item.price : null
    }));
  };

  const loadCart = async () => {
    try {
      const cartData = await cartService.getCart();
      setCart(mapCartItems(cartData.items));
    } catch (error) {
      console.error('Erreur lors de la récupération du panier:', error);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (photo, licenseType = 'standard') => {
    const cartData = await cartService.addToCart(photo.id || photo, licenseType);
    const mappedItems = mapCartItems(cartData.items);
    setCart(mappedItems);
    return mappedItems;
  };

  const removeFromCart = async (itemId) => {
    const cartData = await cartService.removeFromCart(itemId);
    const mappedItems = mapCartItems(cartData.items);
    setCart(mappedItems);
    return mappedItems;
  };

  const updateCartItem = async (itemId, updates) => {
    const cartData = await cartService.updateCartItem(itemId, updates.license_type || updates.licenseType);
    const mappedItems = mapCartItems(cartData.items);
    setCart(mappedItems);
    return mappedItems;
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
