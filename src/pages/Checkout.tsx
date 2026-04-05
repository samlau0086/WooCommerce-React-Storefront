import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CheckCircle2, Tag, CreditCard, Loader2 } from 'lucide-react';
import { getPaymentGateways } from '../services/api';
import { PaymentGateway } from '../types';

export const Checkout: React.FC = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Payment Gateways
  const [paymentGateways, setPaymentGateways] = useState<PaymentGateway[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [isLoadingGateways, setIsLoadingGateways] = useState(true);

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState({ type: '', text: '' });

  // Auth forms state
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showLostPassword, setShowLostPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [registerMessage, setRegisterMessage] = useState('');

  useEffect(() => {
    const fetchGateways = async () => {
      setIsLoadingGateways(true);
      try {
        const gateways = await getPaymentGateways();
        setPaymentGateways(gateways);
        if (gateways.length > 0) {
          setSelectedPaymentMethod(gateways[0].id);
        }
      } catch (error) {
        console.error('Error loading payment gateways:', error);
      } finally {
        setIsLoadingGateways(false);
      }
    };

    fetchGateways();
  }, []);

  const handleToggleLogin = () => {
    setShowLogin(!showLogin);
    setShowRegister(false);
    setShowLostPassword(false);
    setResetSuccess(false);
    setRegisterMessage('');
  };

  const handleToggleRegister = () => {
    setShowRegister(!showRegister);
    setShowLogin(false);
    setShowLostPassword(false);
    setResetSuccess(false);
    setRegisterMessage('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Login successful! (Mock)');
    setShowLogin(false);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Registration successful! (Mock)');
    setShowRegister(false);
  };

  const handleLostPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (resetEmail === 'user@example.com') {
      setResetSuccess(true);
    } else {
      setShowLostPassword(false);
      setShowLogin(false);
      setShowRegister(true);
      setRegisterMessage('Email does not exist, please register.');
      setResetEmail('');
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    
    // Mock coupon logic
    if (couponCode.toUpperCase() === 'SAVE20') {
      setDiscount(cartTotal * 0.2);
      setCouponMessage({ type: 'success', text: 'Coupon applied successfully! (20% off)' });
    } else {
      setDiscount(0);
      setCouponMessage({ type: 'error', text: 'Invalid coupon code.' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call for checkout
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      clearCart();
    }, 1500);
  };

  const finalTotal = Math.max(0, cartTotal - discount);

  if (isSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 sm:px-6 lg:px-8 text-center">
        <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Order Confirmed!</h1>
        <p className="text-lg text-gray-600 mb-8">
          Thank you for your purchase. We've received your order and will begin processing it right away.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center justify-center px-8 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-black hover:bg-gray-800 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Checkout</h1>
        <p className="text-gray-500 mb-8">Your cart is empty. Please add some items before checking out.</p>
        <button 
          onClick={() => navigate('/')}
          className="inline-flex items-center justify-center px-8 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-black hover:bg-gray-800 transition-colors"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-24 sm:px-6 lg:px-8">
        
        {/* Login / Register Prompt */}
        <div className="mb-4 bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="font-medium">Returning customer?</span>{' '}
            <button onClick={handleToggleLogin} className="underline hover:text-blue-600 font-semibold">
              Click here to login
            </button>
          </div>
          <div>
            <span className="font-medium">New here?</span>{' '}
            <button onClick={handleToggleRegister} className="underline hover:text-blue-600 font-semibold">
              Create an account
            </button>
          </div>
        </div>

        {/* Inline Login Form */}
        {showLogin && !showLostPassword && (
          <div className="mb-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Login to your account</h3>
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email address <span className="text-red-500">*</span></label>
                <input type="email" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-4 py-2 border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password <span className="text-red-500">*</span></label>
                <input type="password" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-4 py-2 border" />
              </div>
              <div className="flex items-center justify-between pt-2">
                <button type="submit" className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors font-medium">Login</button>
                <button type="button" onClick={() => setShowLostPassword(true)} className="text-sm text-blue-600 hover:text-blue-500">Lost your password?</button>
              </div>
            </form>
          </div>
        )}

        {/* Inline Lost Password Form */}
        {showLogin && showLostPassword && (
          <div className="mb-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm max-w-md">
            {resetSuccess ? (
              <div className="text-center py-4">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Check your email</h3>
                <p className="text-sm text-gray-500 mb-6">A password recover link has been sent to your email.</p>
                <button 
                  onClick={() => { setShowLostPassword(false); setResetSuccess(false); setShowLogin(true); }} 
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  Return to login
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Lost your password?</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Please enter your username or email address. You will receive a link to create a new password via email.
                  <br/><span className="text-xs text-blue-500">(Hint: use user@example.com for success)</span>
                </p>
                <form onSubmit={handleLostPasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email address</label>
                    <input 
                      type="email" 
                      required 
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-4 py-2 border" 
                    />
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <button type="submit" className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors font-medium">Reset password</button>
                    <button type="button" onClick={() => setShowLostPassword(false)} className="text-sm text-blue-600 hover:text-blue-500">Back to login</button>
                  </div>
                </form>
              </>
            )}
          </div>
        )}

        {/* Inline Register Form */}
        {showRegister && (
          <div className="mb-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Create a new account</h3>
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {registerMessage && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm mb-4">
                  {registerMessage}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">Email address <span className="text-red-500">*</span></label>
                <input type="email" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-4 py-2 border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password <span className="text-red-500">*</span></label>
                <input type="password" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-4 py-2 border" />
              </div>
              <p className="text-xs text-gray-500">Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our privacy policy.</p>
              <div className="pt-2">
                <button type="submit" className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors font-medium">Register</button>
              </div>
            </form>
          </div>
        )}

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          
          {/* Checkout Form */}
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-8">Billing & Shipping Details</h2>
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
              
              {/* Contact Info: Email & Phone at the top */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                  <div className="mt-1">
                    <input type="email" id="email" name="email" required className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-4 py-2 border" />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone number</label>
                  <div className="mt-1">
                    <input type="tel" id="phone" name="phone" required className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-4 py-2 border" />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 mt-6"></div>

              {/* Name & Address */}
              <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <div>
                  <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">First name</label>
                  <div className="mt-1">
                    <input type="text" id="first-name" name="first-name" required className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-4 py-2 border" />
                  </div>
                </div>
                <div>
                  <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">Last name</label>
                  <div className="mt-1">
                    <input type="text" id="last-name" name="last-name" required className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-4 py-2 border" />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                <div className="mt-1">
                  <input type="text" id="address" name="address" required className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-4 py-2 border" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4">
                <div className="sm:col-span-1">
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                  <div className="mt-1">
                    <input type="text" id="city" name="city" required className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-4 py-2 border" />
                  </div>
                </div>
                <div className="sm:col-span-1">
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">State / Province</label>
                  <div className="mt-1">
                    <input type="text" id="state" name="state" required className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-4 py-2 border" />
                  </div>
                </div>
                <div className="sm:col-span-1">
                  <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700">Postal code</label>
                  <div className="mt-1">
                    <input type="text" id="postal-code" name="postal-code" required className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-4 py-2 border" />
                  </div>
                </div>
              </div>

              <div className="mt-10 border-t border-gray-200 pt-10">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h2>
                
                {isLoadingGateways ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    <span className="ml-2 text-gray-500">Loading payment methods...</span>
                  </div>
                ) : paymentGateways.length > 0 ? (
                  <div className="space-y-4">
                    {paymentGateways.map((gateway) => (
                      <div key={gateway.id} className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedPaymentMethod === gateway.id ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`} onClick={() => setSelectedPaymentMethod(gateway.id)}>
                        <div className="flex items-center">
                          <input
                            id={`payment-${gateway.id}`}
                            name="payment_method"
                            type="radio"
                            value={gateway.id}
                            checked={selectedPaymentMethod === gateway.id}
                            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                            className="h-4 w-4 text-black focus:ring-black border-gray-300"
                          />
                          <label htmlFor={`payment-${gateway.id}`} className="ml-3 flex items-center cursor-pointer">
                            <span className="block text-sm font-medium text-gray-900">
                              {gateway.title}
                            </span>
                          </label>
                        </div>
                        {selectedPaymentMethod === gateway.id && gateway.description && (
                          <div className="mt-3 ml-7 text-sm text-gray-500" dangerouslySetInnerHTML={{ __html: gateway.description }} />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-yellow-50 p-4 border border-yellow-200 rounded-md text-sm text-yellow-700 flex items-start">
                    <CreditCard className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                    <p>No payment methods are available. Please configure them in your WooCommerce settings.</p>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="mt-10 lg:mt-0">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-8">Order Summary</h2>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <ul className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <li key={item.product.id} className="flex py-6 px-4 sm:px-6">
                    <div className="flex-shrink-0">
                      {item.product.images[0] ? (
                        <img src={item.product.images[0].src} alt={item.product.name} className="w-16 h-16 rounded-md object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-16 h-16 rounded-md bg-gray-100" />
                      )}
                    </div>
                    <div className="ml-4 flex-1 flex flex-col">
                      <div>
                        <div className="flex justify-between text-sm font-medium text-gray-900">
                          <h3>{item.product.name}</h3>
                          <p>${(parseFloat(item.product.price) * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex-1 flex items-end justify-between text-sm">
                        <p className="text-gray-500">Qty {item.quantity}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              
              {/* Coupon Section */}
              <div className="border-t border-gray-200 py-6 px-4 sm:px-6 bg-gray-50">
                <form onSubmit={handleApplyCoupon} className="flex gap-3">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Tag className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Coupon code (try SAVE20)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-4 py-2 border"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-gray-200 text-gray-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors"
                  >
                    Apply
                  </button>
                </form>
                {couponMessage.text && (
                  <p className={`mt-2 text-sm ${couponMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {couponMessage.text}
                  </p>
                )}
              </div>

              <dl className="border-t border-gray-200 py-6 px-4 space-y-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Subtotal</dt>
                  <dd className="text-sm font-medium text-gray-900">${cartTotal.toFixed(2)}</dd>
                </div>
                
                {discount > 0 && (
                  <div className="flex items-center justify-between text-green-600">
                    <dt className="text-sm">Discount</dt>
                    <dd className="text-sm font-medium">-${discount.toFixed(2)}</dd>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Shipping</dt>
                  <dd className="text-sm font-medium text-gray-900">Free</dd>
                </div>
                
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="text-base font-medium text-gray-900">Total</dt>
                  <dd className="text-base font-medium text-gray-900">${finalTotal.toFixed(2)}</dd>
                </div>
              </dl>

              <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={isSubmitting || paymentGateways.length === 0}
                  className="w-full bg-black border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
