import { Product, BlogPost, Comment, ProductReview } from '../types';

const API_URL = import.meta.env.VITE_WP_API_URL || '';
const CONSUMER_KEY = import.meta.env.VITE_WC_CONSUMER_KEY || '';
const CONSUMER_SECRET = import.meta.env.VITE_WC_CONSUMER_SECRET || '';

// Helper to construct WooCommerce API URLs with authentication
const getWcUrl = (endpoint: string, params: Record<string, string> = {}) => {
  if (!API_URL) throw new Error('VITE_WP_API_URL is not defined');
  
  const url = new URL(`${API_URL}/wp-json/wc/v3/${endpoint}`);
  url.searchParams.append('consumer_key', CONSUMER_KEY);
  url.searchParams.append('consumer_secret', CONSUMER_SECRET);
  
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  
  return url.toString();
};

// Helper to construct WordPress API URLs
const getWpUrl = (endpoint: string, params: Record<string, string> = {}) => {
  if (!API_URL) throw new Error('VITE_WP_API_URL is not defined');
  
  const url = new URL(`${API_URL}/wp-json/wp/v2/${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  
  return url.toString();
};

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(getWcUrl('products'));
    if (!response.ok) throw new Error('Failed to fetch products');
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  try {
    const response = await fetch(getWcUrl('products', { slug }));
    if (!response.ok) throw new Error('Failed to fetch product');
    const products = await response.json();
    return products.length > 0 ? products[0] : null;
  } catch (error) {
    console.error(`Error fetching product ${slug}:`, error);
    return null;
  }
};

export const getCategories = async () => {
  try {
    const response = await fetch(getWcUrl('products/categories'));
    if (!response.ok) throw new Error('Failed to fetch categories');
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const getPosts = async (): Promise<BlogPost[]> => {
  try {
    const response = await fetch(getWpUrl('posts', { _embed: '1' }));
    if (!response.ok) throw new Error('Failed to fetch posts');
    const posts = await response.json();
    
    // Map the _embedded featured media to our featured_image_url property
    return posts.map((post: any) => {
      let featured_image_url = undefined;
      if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]) {
        featured_image_url = post._embedded['wp:featuredmedia'][0].source_url;
      }
      return { ...post, featured_image_url };
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const response = await fetch(getWpUrl('posts', { slug, _embed: '1' }));
    if (!response.ok) throw new Error('Failed to fetch post');
    const posts = await response.json();
    
    if (posts.length === 0) return null;
    
    const post = posts[0];
    let featured_image_url = undefined;
    if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]) {
      featured_image_url = post._embedded['wp:featuredmedia'][0].source_url;
    }
    
    return { ...post, featured_image_url };
  } catch (error) {
    console.error(`Error fetching post ${slug}:`, error);
    return null;
  }
};

export const getCommentsByPostId = async (postId: number): Promise<Comment[]> => {
  try {
    const response = await fetch(getWpUrl('comments', { post: postId.toString() }));
    if (!response.ok) throw new Error('Failed to fetch comments');
    const comments = await response.json();
    
    // Map WP comment structure to our Comment interface
    return comments.map((c: any) => ({
      id: c.id,
      post_id: c.post,
      author_name: c.author_name,
      content: c.content.rendered.replace(/<[^>]+>/g, ''), // Strip HTML tags for simple display
      date: c.date
    }));
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error);
    return [];
  }
};

export const addComment = async (postId: number, author_name: string, content: string): Promise<Comment> => {
  try {
    const response = await fetch(getWpUrl('comments'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        post: postId,
        author_name,
        content
      })
    });
    
    if (!response.ok) throw new Error('Failed to add comment');
    const c = await response.json();
    
    return {
      id: c.id,
      post_id: c.post,
      author_name: c.author_name,
      content: c.content.rendered.replace(/<[^>]+>/g, ''),
      date: c.date
    };
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

export const getProductReviews = async (productId: number): Promise<ProductReview[]> => {
  try {
    const response = await fetch(getWcUrl('products/reviews', { product: productId.toString() }));
    if (!response.ok) throw new Error('Failed to fetch product reviews');
    const reviews = await response.json();
    
    // Map WC review structure to our ProductReview interface
    return reviews.map((r: any) => ({
      id: r.id,
      product_id: r.product_id,
      author_name: r.reviewer,
      rating: r.rating,
      content: r.review.replace(/<[^>]+>/g, ''), // Strip HTML tags
      date: r.date_created
    }));
  } catch (error) {
    console.error(`Error fetching reviews for product ${productId}:`, error);
    return [];
  }
};

export const addProductReview = async (productId: number, author_name: string, rating: number, content: string): Promise<ProductReview> => {
  try {
    const response = await fetch(getWcUrl('products/reviews'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: productId,
        reviewer: author_name,
        reviewer_email: 'customer@example.com', // Required by WC API usually
        review: content,
        rating: rating
      })
    });
    
    if (!response.ok) throw new Error('Failed to add product review');
    const r = await response.json();
    
    return {
      id: r.id,
      product_id: r.product_id,
      author_name: r.reviewer,
      rating: r.rating,
      content: r.review.replace(/<[^>]+>/g, ''),
      date: r.date_created
    };
  } catch (error) {
    console.error('Error adding product review:', error);
    throw error;
  }
};
