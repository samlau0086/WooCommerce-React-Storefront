import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, Search, User, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CartDrawer } from './CartDrawer';

export const Layout: React.FC = () => {
  const { cartCount, setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 relative">
        {/* Search Overlay */}
        {isSearchOpen && (
          <div className="absolute inset-0 bg-white z-40 flex items-center px-4 sm:px-6 lg:px-8">
            <Search className="w-5 h-5 text-gray-400 mr-3" />
            <form onSubmit={handleSearch} className="flex-1 flex items-center">
              <input
                type="text"
                autoFocus
                placeholder="Search products..."
                className="w-full border-none focus:ring-0 text-lg outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="hidden">Search</button>
            </form>
            <button 
              onClick={() => setIsSearchOpen(false)} 
              className="p-2 text-gray-500 hover:text-gray-900 ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button className="p-2 -ml-2 mr-2 md:hidden text-gray-500 hover:text-gray-900">
                <Menu className="w-6 h-6" />
              </button>
              <Link to="/" className="text-xl font-bold tracking-tight">
                WOO<span className="text-blue-600">STORE</span>
              </Link>
              <nav className="hidden md:flex ml-10 space-x-8">
                <Link to="/shop" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
                  Shop
                </Link>
                <Link to="/about" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
                  About
                </Link>
                <Link to="/blog" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
                  Blog
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="w-5 h-5" />
              </button>
              <Link to="/account" className="p-2 text-gray-500 hover:text-gray-900 transition-colors">
                <User className="w-5 h-5" />
              </Link>
              <button 
                className="p-2 text-gray-500 hover:text-gray-900 transition-colors relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-blue-600 rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-1">
              <Link to="/" className="text-xl font-bold tracking-tight">
                WOO<span className="text-blue-600">STORE</span>
              </Link>
              <p className="mt-4 text-sm text-gray-500">
                A headless React storefront for WooCommerce. Fast, modern, and beautiful.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Shop</h3>
              <ul className="mt-4 space-y-4">
                <li><Link to="/shop" className="text-sm text-gray-500 hover:text-gray-900">All Products</Link></li>
                <li><Link to="/shop" className="text-sm text-gray-500 hover:text-gray-900">New Arrivals</Link></li>
                <li><Link to="/shop" className="text-sm text-gray-500 hover:text-gray-900">Sale</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Support</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900">FAQ</a></li>
                <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900">Shipping</a></li>
                <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900">Returns</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Legal</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900">Privacy Policy</a></li>
                <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} WooStore. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <CartDrawer />
    </div>
  );
};
