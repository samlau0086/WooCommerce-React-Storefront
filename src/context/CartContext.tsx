import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  couponCode: string | null;
  discountAmount: number;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('woo_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState<string | null>(() => {
    return localStorage.getItem('woo_coupon') || null;
  });
  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => {
    localStorage.setItem('woo_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (couponCode) {
      localStorage.setItem('woo_coupon', couponCode);
    } else {
      localStorage.removeItem('woo_coupon');
    }
  }, [couponCode]);

  // Recalculate discount when cart changes
  useEffect(() => {
    if (couponCode) {
      // Re-apply logic to update discount amount based on new cart total
      const subtotal = cart.reduce((total, item) => {
        const price = parseFloat(item.product.price);
        return total + price * item.quantity;
      }, 0);
      
      if (subtotal === 0) {
        setDiscountAmount(0);
      } else if (couponCode === 'SAVE10') {
        setDiscountAmount(subtotal * 0.1);
      } else if (couponCode === 'SAVE20') {
        setDiscountAmount(Math.min(subtotal, 20));
      } else {
        setDiscountAmount(0);
      }
    } else {
      setDiscountAmount(0);
    }
  }, [cart, couponCode]);

  const addToCart = (product: Product, quantity: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    removeCoupon();
  };

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    // Mock API call for coupon validation
    return new Promise((resolve) => {
      setTimeout(() => {
        const upperCode = code.toUpperCase();
        if (upperCode === 'SAVE10') {
          setCouponCode(upperCode);
          resolve({ success: true, message: '10% discount applied!' });
        } else if (upperCode === 'SAVE20') {
          setCouponCode(upperCode);
          resolve({ success: true, message: '$20 discount applied!' });
        } else {
          resolve({ success: false, message: 'Invalid or expired coupon code.' });
        }
      }, 500);
    });
  };

  const removeCoupon = () => {
    setCouponCode(null);
    setDiscountAmount(0);
  };

  const cartSubtotal = cart.reduce((total, item) => {
    const price = parseFloat(item.product.price);
    return total + price * item.quantity;
  }, 0);

  const cartTotal = Math.max(0, cartSubtotal - discountAmount);

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        couponCode,
        discountAmount,
        applyCoupon,
        removeCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
