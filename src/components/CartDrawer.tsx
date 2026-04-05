import React, { useState } from 'react';
import { X, Minus, Plus, ShoppingBag, Tag, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal, couponCode, discountAmount, applyCoupon, removeCoupon } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [couponMessage, setCouponMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!isCartOpen) return null;

  const cartSubtotal = cartTotal + discountAmount;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setIsApplying(true);
    setCouponMessage(null);
    
    try {
      const result = await applyCoupon(couponInput);
      setCouponMessage({
        text: result.message,
        type: result.success ? 'success' : 'error'
      });
      if (result.success) {
        setCouponInput('');
      }
    } catch (error) {
      setCouponMessage({ text: 'An error occurred. Please try again.', type: 'error' });
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />
      <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Your Cart
          </h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
              <ShoppingBag className="w-12 h-12 text-gray-300" />
              <p>Your cart is currently empty.</p>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-6">
              {cart.map((item) => (
                <li key={item.product.id} className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                    {item.product.images[0] ? (
                      <img 
                        src={item.product.images[0].src} 
                        alt={item.product.images[0].alt || item.product.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                        <Link to={`/product/${item.product.slug}`} onClick={() => setIsCartOpen(false)}>
                          {item.product.name}
                        </Link>
                      </h3>
                      <button 
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      ${parseFloat(item.product.price).toFixed(2)}
                    </div>
                    <div className="mt-auto flex items-center gap-3">
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-4 bg-gray-50">
            {/* Coupon Section */}
            <div className="pb-4 border-b border-gray-200">
              {couponCode ? (
                <div className="flex items-center justify-between bg-green-50 p-2 rounded-md border border-green-200">
                  <div className="flex items-center">
                    <Tag className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-green-800">{couponCode}</span>
                  </div>
                  <button 
                    onClick={removeCoupon}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex flex-col gap-2">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm px-3 py-2 border"
                      placeholder="Discount code"
                    />
                    <button
                      type="submit"
                      disabled={isApplying || !couponInput.trim()}
                      className="inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-50 transition-colors"
                    >
                      {isApplying ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                    </button>
                  </div>
                  {couponMessage && (
                    <p className={`text-xs ${couponMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                      {couponMessage.text}
                    </p>
                  )}
                </form>
              )}
            </div>

            <div className="flex justify-between text-sm font-medium text-gray-900">
              <p>Subtotal</p>
              <p>${cartSubtotal.toFixed(2)}</p>
            </div>
            {couponCode && discountAmount > 0 && (
              <div className="flex justify-between text-sm font-medium text-green-600">
                <p>Discount ({couponCode})</p>
                <p>-${discountAmount.toFixed(2)}</p>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2">
              <p>Total</p>
              <p>${cartTotal.toFixed(2)}</p>
            </div>
            <p className="text-xs text-gray-500">Shipping and taxes calculated at checkout.</p>
            <div className="mt-4 flex flex-col gap-3">
              <Link
                to="/cart"
                className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                onClick={() => setIsCartOpen(false)}
              >
                View Cart
              </Link>
              <Link
                to="/checkout"
                className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-black hover:bg-gray-800 transition-colors"
                onClick={() => setIsCartOpen(false)}
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
