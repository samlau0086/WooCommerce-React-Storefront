import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Product } from '../types';
import { getProducts, getCategories } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { Loader2, Filter, X } from 'lucide-react';

export const Shop: React.FC = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{id: number, name: string, slug: string}[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState<string>('');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData as any);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = products.filter(product => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const nameMatch = product.name.toLowerCase().includes(query);
      const descMatch = product.description.toLowerCase().includes(query);
      if (!nameMatch && !descMatch) {
        return false;
      }
    }

    if (selectedCategory && !product.categories.some(c => c.slug === selectedCategory)) {
      return false;
    }
    
    if (priceRange) {
      const price = parseFloat(product.price);
      if (priceRange === 'under-50' && price >= 50) return false;
      if (priceRange === '50-100' && (price < 50 || price > 100)) return false;
      if (priceRange === 'over-100' && price <= 100) return false;
    }
    
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Shop</h1>
          {searchQuery && (
            <p className="mt-2 text-sm text-gray-500">
              Showing search results for <span className="font-semibold text-gray-900">"{searchQuery}"</span>
            </p>
          )}
        </div>
        <button 
          className="lg:hidden flex items-center text-gray-600 hover:text-gray-900"
          onClick={() => setIsMobileFiltersOpen(true)}
        >
          <Filter className="w-5 h-5 mr-2" />
          Filters
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters (Desktop) */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Filters</h2>
            
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="cat-all"
                    type="radio"
                    name="category"
                    checked={selectedCategory === ''}
                    onChange={() => setSelectedCategory('')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="cat-all" className="ml-3 text-sm text-gray-600">All Categories</label>
                </div>
                {categories.map(category => (
                  <div key={category.id} className="flex items-center">
                    <input
                      id={`cat-${category.slug}`}
                      type="radio"
                      name="category"
                      checked={selectedCategory === category.slug}
                      onChange={() => setSelectedCategory(category.slug)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor={`cat-${category.slug}`} className="ml-3 text-sm text-gray-600">{category.name}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="price-all"
                    type="radio"
                    name="price"
                    checked={priceRange === ''}
                    onChange={() => setPriceRange('')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="price-all" className="ml-3 text-sm text-gray-600">Any Price</label>
                </div>
                <div className="flex items-center">
                  <input
                    id="price-1"
                    type="radio"
                    name="price"
                    checked={priceRange === 'under-50'}
                    onChange={() => setPriceRange('under-50')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="price-1" className="ml-3 text-sm text-gray-600">Under $50</label>
                </div>
                <div className="flex items-center">
                  <input
                    id="price-2"
                    type="radio"
                    name="price"
                    checked={priceRange === '50-100'}
                    onChange={() => setPriceRange('50-100')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="price-2" className="ml-3 text-sm text-gray-600">$50 - $100</label>
                </div>
                <div className="flex items-center">
                  <input
                    id="price-3"
                    type="radio"
                    name="price"
                    checked={priceRange === 'over-100'}
                    onChange={() => setPriceRange('over-100')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="price-3" className="ml-3 text-sm text-gray-600">Over $100</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filters Modal */}
        {isMobileFiltersOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setIsMobileFiltersOpen(false)} />
            <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl py-4 pb-12 flex flex-col overflow-y-auto">
              <div className="px-4 flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button onClick={() => setIsMobileFiltersOpen(false)} className="text-gray-400 hover:text-gray-500">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="px-4 border-t border-gray-200 pt-6 mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="mobile-cat-all"
                      type="radio"
                      name="mobile-category"
                      checked={selectedCategory === ''}
                      onChange={() => setSelectedCategory('')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="mobile-cat-all" className="ml-3 text-sm text-gray-600">All Categories</label>
                  </div>
                  {categories.map(category => (
                    <div key={category.id} className="flex items-center">
                      <input
                        id={`mobile-cat-${category.slug}`}
                        type="radio"
                        name="mobile-category"
                        checked={selectedCategory === category.slug}
                        onChange={() => setSelectedCategory(category.slug)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor={`mobile-cat-${category.slug}`} className="ml-3 text-sm text-gray-600">{category.name}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-4 border-t border-gray-200 pt-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="mobile-price-all"
                      type="radio"
                      name="mobile-price"
                      checked={priceRange === ''}
                      onChange={() => setPriceRange('')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="mobile-price-all" className="ml-3 text-sm text-gray-600">Any Price</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="mobile-price-1"
                      type="radio"
                      name="mobile-price"
                      checked={priceRange === 'under-50'}
                      onChange={() => setPriceRange('under-50')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="mobile-price-1" className="ml-3 text-sm text-gray-600">Under $50</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="mobile-price-2"
                      type="radio"
                      name="mobile-price"
                      checked={priceRange === '50-100'}
                      onChange={() => setPriceRange('50-100')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="mobile-price-2" className="ml-3 text-sm text-gray-600">$50 - $100</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="mobile-price-3"
                      type="radio"
                      name="mobile-price"
                      checked={priceRange === 'over-100'}
                      onChange={() => setPriceRange('over-100')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="mobile-price-3" className="ml-3 text-sm text-gray-600">Over $100</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found matching your criteria.</p>
              <button 
                onClick={() => { setSelectedCategory(''); setPriceRange(''); }}
                className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
