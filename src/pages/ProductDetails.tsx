import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product, ProductReview } from '../types';
import { getProductBySlug, getProductReviews, addProductReview } from '../services/api';
import { useCart } from '../context/CartContext';
import { Loader2, ArrowLeft, Minus, Plus, ShoppingCart, Star, User } from 'lucide-react';

export const ProductDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  // Variations state
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});

  // Review form state
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewContent, setNewReviewContent] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const productData = await getProductBySlug(slug);
        setProduct(productData);
        if (productData) {
          const reviewsData = await getProductReviews(productData.id);
          setReviews(reviewsData);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndReviews();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
        <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center justify-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!product) return;
    
    // Check if variations are selected for variable products
    if (product.type === 'variable') {
      const requiredAttributes = product.attributes.filter(a => a.variation);
      const allSelected = requiredAttributes.every(attr => selectedAttributes[attr.name]);
      if (!allSelected) {
        alert('Please select all product options before adding to cart.');
        return;
      }
    }

    addToCart(product, quantity);
  };

  const handleAttributeSelect = (attributeName: string, value: string) => {
    setSelectedAttributes(prev => ({
      ...prev,
      [attributeName]: value
    }));
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !newReviewName.trim() || !newReviewContent.trim()) return;

    setIsSubmittingReview(true);
    try {
      const newReview = await addProductReview(product.id, newReviewName, newReviewRating, newReviewContent);
      setReviews([...reviews, newReview]);
      setNewReviewName('');
      setNewReviewContent('');
      setNewReviewRating(5);
    } catch (error) {
      console.error('Error adding review:', error);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
      </Link>

      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 xl:gap-x-12">
        {/* Product Image */}
        <div className="mb-8 lg:mb-0">
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
            {product.images[0] ? (
              <img
                src={product.images[0].src}
                alt={product.images[0].alt || product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image Available
              </div>
            )}
          </div>
          {/* Thumbnails could go here */}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-6">
            <div className="text-sm text-gray-500 mb-2">
              {product.categories.map(c => c.name).join(', ')}
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl mb-4">
              {product.name}
            </h1>
            <div className="text-2xl font-bold text-gray-900" dangerouslySetInnerHTML={{ __html: product.price_html }} />
          </div>

          <div 
            className="prose prose-sm text-gray-500 mb-8"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />

          {/* Variations */}
          {product.type === 'variable' && product.attributes.filter(a => a.variation).length > 0 && (
            <div className="mb-8 space-y-4">
              {product.attributes.filter(a => a.variation).map(attr => (
                <div key={attr.id}>
                  <label htmlFor={`attr-${attr.name}`} className="block text-sm font-medium text-gray-700 mb-1">
                    {attr.name} <span className="text-red-500">*</span>
                  </label>
                  <select
                    id={`attr-${attr.name}`}
                    value={selectedAttributes[attr.name] || ''}
                    onChange={(e) => handleAttributeSelect(attr.name, e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                  >
                    <option value="">Choose an option</option>
                    {attr.options.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}

          <div className="mt-auto pt-8 border-t border-gray-200">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium text-gray-900">Quantity</span>
              <div className="flex items-center border border-gray-300 rounded-md">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="p-2 hover:bg-gray-100 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="p-2 hover:bg-gray-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2 px-8 py-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-black hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 pt-10 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
        
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-4 mb-10 lg:mb-0">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Write a Review</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4 bg-gray-50 p-6 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReviewRating(star)}
                      className="focus:outline-none"
                    >
                      <Star className={`w-6 h-6 ${star <= newReviewRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="review-name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  id="review-name"
                  required
                  value={newReviewName}
                  onChange={(e) => setNewReviewName(e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-4 py-2 border"
                />
              </div>
              <div>
                <label htmlFor="review-content" className="block text-sm font-medium text-gray-700 mb-1">Review</label>
                <textarea
                  id="review-content"
                  required
                  rows={4}
                  value={newReviewContent}
                  onChange={(e) => setNewReviewContent(e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-4 py-2 border"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmittingReview}
                className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmittingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Review'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-8">
            <div className="space-y-8">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-8 last:border-0">
                    <div className="flex items-center mb-2">
                      <div className="flex items-center mr-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <h4 className="text-sm font-bold text-gray-900">{review.author_name}</h4>
                    </div>
                    <div className="text-sm text-gray-500 mb-3">
                      <time dateTime={review.date}>
                        {new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </time>
                    </div>
                    <div className="prose prose-sm text-gray-700 max-w-none">
                      <p>{review.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No reviews yet. Be the first to review this product!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
