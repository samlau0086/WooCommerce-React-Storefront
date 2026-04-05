import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, 1);
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
      <Link to={`/product/${product.slug}`} className="relative aspect-square overflow-hidden bg-gray-100">
        {product.images[0] ? (
          <img
            src={product.images[0].src}
            alt={product.images[0].alt || product.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        {product.on_sale && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            SALE
          </div>
        )}
      </Link>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="text-xs text-gray-500 mb-1">
          {product.categories.map(c => c.name).join(', ')}
        </div>
        <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
          <Link to={`/product/${product.slug}`}>
            {product.name}
          </Link>
        </h3>
        
        <div className="mt-auto flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-900" dangerouslySetInnerHTML={{ __html: product.price_html }} />
          
          <button
            onClick={handleAddToCart}
            className="p-2 bg-gray-100 text-gray-900 rounded-full hover:bg-black hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
