import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

export const Account: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showLostPassword, setShowLostPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [registerMessage, setRegisterMessage] = useState('');

  const handleTabChange = (tab: 'login' | 'register') => {
    setActiveTab(tab);
    setRegisterMessage('');
    setShowLostPassword(false);
    setResetSuccess(false);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Login successful! (Mock)');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Registration successful! (Mock)');
  };

  const handleLostPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (resetEmail === 'user@example.com') {
      setResetSuccess(true);
    } else {
      setShowLostPassword(false);
      setActiveTab('register');
      setRegisterMessage('Email does not exist, please register.');
      setResetEmail('');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-md mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">My Account</h1>
        
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          {!showLostPassword ? (
            <>
              <div className="flex border-b border-gray-200">
                <button 
                  className={`flex-1 py-4 text-center font-medium text-sm transition-colors ${activeTab === 'login' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'bg-gray-50 text-gray-500 hover:text-gray-700'}`}
                  onClick={() => handleTabChange('login')}
                >
                  Login
                </button>
                <button 
                  className={`flex-1 py-4 text-center font-medium text-sm transition-colors ${activeTab === 'register' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'bg-gray-50 text-gray-500 hover:text-gray-700'}`}
                  onClick={() => handleTabChange('register')}
                >
                  Register
                </button>
              </div>

              <div className="p-6">
                {activeTab === 'login' ? (
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
                ) : (
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
                      <button type="submit" className="w-full bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors font-medium">Register</button>
                    </div>
                  </form>
                )}
              </div>
            </>
          ) : (
            <div className="p-6">
              {resetSuccess ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Check your email</h3>
                  <p className="text-sm text-gray-500 mb-6">A password recover link has been sent to your email.</p>
                  <button 
                    onClick={() => handleTabChange('login')} 
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
        </div>
      </div>
    </div>
  );
};
