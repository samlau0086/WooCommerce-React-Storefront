import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Minus, Plus, X, ShoppingBag, ArrowRight, Tag, Loader2 } from 'lucide-react';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, couponCode, discountAmount, applyCoupon, removeCoupon } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [couponMessage, setCouponMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

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

  const cartSubtotal = cartTotal + discountAmount;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-6" />
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link 
          to="/" 
          className="inline-flex items-center justify-center px-8 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-black hover:bg-gray-800 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Shopping Cart</h1>
      
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        <div className="lg:col-span-8">
          <ul className="border-t border-b border-gray-200 divide-y divide-gray-200">
            {cart.map((item) => (
              <li key={item.product.id} className="flex py-6 sm:py-10">
                <div className="flex-shrink-0">
                  {item.product.images[0] ? (
                    <img
                      src={item.product.images[0].src}
                      alt={item.product.images[0].alt || item.product.name}
                      className="w-24 h-24 rounded-md object-cover object-center sm:w-32 sm:h-32"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-md bg-gray-100 flex items-center justify-center text-gray-400">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                  )}
                </div>

                <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                  <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                    <div>
                      <div className="flex justify-between">
                        <h3 className="text-sm">
                          <Link to={`/product/${item.product.slug}`} className="font-medium text-gray-700 hover:text-gray-800">
                            {item.product.name}
                          </Link>
                        </h3>
                      </div>
                      <div className="mt-1 flex text-sm">
                        <p className="text-gray-500">{item.product.categories.map(c => c.name).join(', ')}</p>
                      </div>
                      <p className="mt-1 text-sm font-medium text-gray-900">${parseFloat(item.product.price).toFixed(2)}</p>
                    </div>

                    <div className="mt-4 sm:mt-0 sm:pr-9 flex items-center">
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="absolute top-0 right-0">
                        <button 
                          onClick={() => removeFromCart(item.product.id)}
                          className="-m-2 p-2 inline-flex text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <span className="sr-only">Remove</span>
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <p className="mt-4 flex text-sm text-gray-700 space-x-2">
                    <span>Total: ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16 bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-4">
          <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
          
          <dl className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <dt className="text-sm text-gray-600">Subtotal</dt>
              <dd className="text-sm font-medium text-gray-900">${cartSubtotal.toFixed(2)}</dd>
            </div>

            {/* Coupon Section */}
            <div className="border-t border-gray-200 pt-4">
              {couponCode ? (
                <div className="flex items-center justify-between bg-green-50 p-3 rounded-md border border-green-200">
                  <div className="flex items-center">
                    <Tag className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-green-800">{couponCode}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-green-800 mr-3">-${discountAmount.toFixed(2)}</span>
                    <button 
                      onClick={removeCoupon}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="mt-2">
                  <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-2">
                    Discount code
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      id="coupon"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm px-3 py-2 border"
                      placeholder="e.g. SAVE10"
                    />
                    <button
                      type="submit"
                      disabled={isApplying || !couponInput.trim()}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 transition-colors"
                    >
                      {isApplying ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                    </button>
                  </div>
                  {couponMessage && (
                    <p className={`mt-2 text-sm ${couponMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                      {couponMessage.text}
                    </p>
                  )}
                </form>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <dt className="flex items-center text-sm text-gray-600">
                <span>Shipping estimate</span>
              </dt>
              <dd className="text-sm font-medium text-gray-900">Calculated at checkout</dd>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <dt className="flex text-sm text-gray-600">
                <span>Tax estimate</span>
              </dt>
              <dd className="text-sm font-medium text-gray-900">Calculated at checkout</dd>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <dt className="text-base font-medium text-gray-900">Order total</dt>
              <dd className="text-base font-medium text-gray-900">${cartTotal.toFixed(2)}</dd>
            </div>
          </dl>

          <div className="mt-6">
            <Link
              to="/checkout"
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-black hover:bg-gray-800 transition-colors"
            >
              Checkout <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
