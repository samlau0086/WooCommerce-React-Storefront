import { Product, BlogPost, Comment, ProductReview } from '../types';

// Mock data based on WooCommerce REST API structure
const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Premium Cotton T-Shirt',
    slug: 'premium-cotton-t-shirt',
    permalink: 'https://example.com/product/premium-cotton-t-shirt/',
    date_created: '2023-01-01T12:00:00',
    date_modified: '2023-01-01T12:00:00',
    type: 'variable',
    status: 'publish',
    featured: true,
    catalog_visibility: 'visible',
    description: '<p>This is a premium cotton t-shirt, perfect for everyday wear. It is soft, comfortable, and durable.</p>',
    short_description: '<p>Premium cotton t-shirt for everyday wear.</p>',
    sku: 'TSHIRT-001',
    price: '25.00',
    regular_price: '25.00',
    sale_price: '',
    date_on_sale_from: null,
    date_on_sale_to: null,
    price_html: '<span class="woocommerce-Price-amount amount"><bdi><span class="woocommerce-Price-currencySymbol">&#36;</span>25.00</bdi></span>',
    on_sale: false,
    purchasable: true,
    total_sales: 150,
    virtual: false,
    downloadable: false,
    downloads: [],
    download_limit: -1,
    download_expiry: -1,
    external_url: '',
    button_text: '',
    tax_status: 'taxable',
    tax_class: '',
    manage_stock: true,
    stock_quantity: 100,
    stock_status: 'instock',
    backorders: 'no',
    backorders_allowed: false,
    backordered: false,
    sold_individually: false,
    weight: '0.2',
    dimensions: { length: '10', width: '10', height: '2' },
    shipping_required: true,
    shipping_taxable: true,
    shipping_class: '',
    shipping_class_id: 0,
    reviews_allowed: true,
    average_rating: '4.5',
    rating_count: 12,
    related_ids: [2, 3],
    upsell_ids: [],
    cross_sell_ids: [],
    parent_id: 0,
    purchase_note: '',
    categories: [{ id: 9, name: 'Clothing', slug: 'clothing' }, { id: 14, name: 'T-shirts', slug: 't-shirts' }],
    tags: [],
    images: [{
      id: 101,
      date_created: '2023-01-01T12:00:00',
      date_created_gmt: '2023-01-01T12:00:00',
      date_modified: '2023-01-01T12:00:00',
      date_modified_gmt: '2023-01-01T12:00:00',
      src: 'https://picsum.photos/seed/tshirt/800/800',
      name: 'tshirt.jpg',
      alt: 'Premium Cotton T-Shirt'
    }],
    attributes: [
      { id: 1, name: 'Color', position: 0, visible: true, variation: true, options: ['Black', 'White', 'Navy'] },
      { id: 2, name: 'Size', position: 1, visible: true, variation: true, options: ['S', 'M', 'L', 'XL'] }
    ],
    default_attributes: [],
    variations: [],
    grouped_products: [],
    menu_order: 0,
    meta_data: []
  },
  {
    id: 2,
    name: 'Classic Denim Jacket',
    slug: 'classic-denim-jacket',
    permalink: 'https://example.com/product/classic-denim-jacket/',
    date_created: '2023-01-02T12:00:00',
    date_modified: '2023-01-02T12:00:00',
    type: 'simple',
    status: 'publish',
    featured: false,
    catalog_visibility: 'visible',
    description: '<p>A timeless classic denim jacket that goes with everything.</p>',
    short_description: '<p>Timeless classic denim jacket.</p>',
    sku: 'JACKET-001',
    price: '75.00',
    regular_price: '85.00',
    sale_price: '75.00',
    date_on_sale_from: null,
    date_on_sale_to: null,
    price_html: '<del><span class="woocommerce-Price-amount amount"><bdi><span class="woocommerce-Price-currencySymbol">&#36;</span>85.00</bdi></span></del> <ins><span class="woocommerce-Price-amount amount"><bdi><span class="woocommerce-Price-currencySymbol">&#36;</span>75.00</bdi></span></ins>',
    on_sale: true,
    purchasable: true,
    total_sales: 45,
    virtual: false,
    downloadable: false,
    downloads: [],
    download_limit: -1,
    download_expiry: -1,
    external_url: '',
    button_text: '',
    tax_status: 'taxable',
    tax_class: '',
    manage_stock: true,
    stock_quantity: 20,
    stock_status: 'instock',
    backorders: 'no',
    backorders_allowed: false,
    backordered: false,
    sold_individually: false,
    weight: '0.8',
    dimensions: { length: '15', width: '12', height: '5' },
    shipping_required: true,
    shipping_taxable: true,
    shipping_class: '',
    shipping_class_id: 0,
    reviews_allowed: true,
    average_rating: '4.8',
    rating_count: 8,
    related_ids: [1, 3],
    upsell_ids: [],
    cross_sell_ids: [],
    parent_id: 0,
    purchase_note: '',
    categories: [{ id: 9, name: 'Clothing', slug: 'clothing' }, { id: 15, name: 'Jackets', slug: 'jackets' }],
    tags: [],
    images: [{
      id: 102,
      date_created: '2023-01-02T12:00:00',
      date_created_gmt: '2023-01-02T12:00:00',
      date_modified: '2023-01-02T12:00:00',
      date_modified_gmt: '2023-01-02T12:00:00',
      src: 'https://picsum.photos/seed/jacket/800/800',
      name: 'jacket.jpg',
      alt: 'Classic Denim Jacket'
    }],
    attributes: [
      { id: 2, name: 'Size', position: 0, visible: true, variation: true, options: ['S', 'M', 'L'] }
    ],
    default_attributes: [],
    variations: [],
    grouped_products: [],
    menu_order: 0,
    meta_data: []
  },
  {
    id: 3,
    name: 'Leather Minimalist Wallet',
    slug: 'leather-minimalist-wallet',
    permalink: 'https://example.com/product/leather-minimalist-wallet/',
    date_created: '2023-01-03T12:00:00',
    date_modified: '2023-01-03T12:00:00',
    type: 'simple',
    status: 'publish',
    featured: true,
    catalog_visibility: 'visible',
    description: '<p>Handcrafted leather wallet with a minimalist design. Holds up to 6 cards and cash.</p>',
    short_description: '<p>Handcrafted leather minimalist wallet.</p>',
    sku: 'WALLET-001',
    price: '45.00',
    regular_price: '45.00',
    sale_price: '',
    date_on_sale_from: null,
    date_on_sale_to: null,
    price_html: '<span class="woocommerce-Price-amount amount"><bdi><span class="woocommerce-Price-currencySymbol">&#36;</span>45.00</bdi></span>',
    on_sale: false,
    purchasable: true,
    total_sales: 210,
    virtual: false,
    downloadable: false,
    downloads: [],
    download_limit: -1,
    download_expiry: -1,
    external_url: '',
    button_text: '',
    tax_status: 'taxable',
    tax_class: '',
    manage_stock: true,
    stock_quantity: 50,
    stock_status: 'instock',
    backorders: 'no',
    backorders_allowed: false,
    backordered: false,
    sold_individually: false,
    weight: '0.1',
    dimensions: { length: '4', width: '3', height: '0.5' },
    shipping_required: true,
    shipping_taxable: true,
    shipping_class: '',
    shipping_class_id: 0,
    reviews_allowed: true,
    average_rating: '4.9',
    rating_count: 35,
    related_ids: [1, 2],
    upsell_ids: [],
    cross_sell_ids: [],
    parent_id: 0,
    purchase_note: '',
    categories: [{ id: 10, name: 'Accessories', slug: 'accessories' }],
    tags: [],
    images: [{
      id: 103,
      date_created: '2023-01-03T12:00:00',
      date_created_gmt: '2023-01-03T12:00:00',
      date_modified: '2023-01-03T12:00:00',
      date_modified_gmt: '2023-01-03T12:00:00',
      src: 'https://picsum.photos/seed/wallet/800/800',
      name: 'wallet.jpg',
      alt: 'Leather Minimalist Wallet'
    }],
    attributes: [
      { id: 1, name: 'Color', position: 0, visible: true, variation: true, options: ['Brown', 'Black'] }
    ],
    default_attributes: [],
    variations: [],
    grouped_products: [],
    menu_order: 0,
    meta_data: []
  },
  {
    id: 4,
    name: 'Wireless Noise-Cancelling Headphones',
    slug: 'wireless-noise-cancelling-headphones',
    permalink: 'https://example.com/product/wireless-noise-cancelling-headphones/',
    date_created: '2023-01-04T12:00:00',
    date_modified: '2023-01-04T12:00:00',
    type: 'simple',
    status: 'publish',
    featured: false,
    catalog_visibility: 'visible',
    description: '<p>Experience pure sound with these advanced noise-cancelling wireless headphones. Up to 30 hours of battery life.</p>',
    short_description: '<p>Advanced noise-cancelling wireless headphones.</p>',
    sku: 'TECH-001',
    price: '199.99',
    regular_price: '249.99',
    sale_price: '199.99',
    date_on_sale_from: null,
    date_on_sale_to: null,
    price_html: '<del><span class="woocommerce-Price-amount amount"><bdi><span class="woocommerce-Price-currencySymbol">&#36;</span>249.99</bdi></span></del> <ins><span class="woocommerce-Price-amount amount"><bdi><span class="woocommerce-Price-currencySymbol">&#36;</span>199.99</bdi></span></ins>',
    on_sale: true,
    purchasable: true,
    total_sales: 85,
    virtual: false,
    downloadable: false,
    downloads: [],
    download_limit: -1,
    download_expiry: -1,
    external_url: '',
    button_text: '',
    tax_status: 'taxable',
    tax_class: '',
    manage_stock: true,
    stock_quantity: 15,
    stock_status: 'instock',
    backorders: 'no',
    backorders_allowed: false,
    backordered: false,
    sold_individually: false,
    weight: '0.5',
    dimensions: { length: '8', width: '7', height: '3' },
    shipping_required: true,
    shipping_taxable: true,
    shipping_class: '',
    shipping_class_id: 0,
    reviews_allowed: true,
    average_rating: '4.7',
    rating_count: 22,
    related_ids: [3],
    upsell_ids: [],
    cross_sell_ids: [],
    parent_id: 0,
    purchase_note: '',
    categories: [{ id: 11, name: 'Electronics', slug: 'electronics' }],
    tags: [],
    images: [{
      id: 104,
      date_created: '2023-01-04T12:00:00',
      date_created_gmt: '2023-01-04T12:00:00',
      date_modified: '2023-01-04T12:00:00',
      date_modified_gmt: '2023-01-04T12:00:00',
      src: 'https://picsum.photos/seed/headphones/800/800',
      name: 'headphones.jpg',
      alt: 'Wireless Noise-Cancelling Headphones'
    }],
    attributes: [
      { id: 1, name: 'Color', position: 0, visible: true, variation: true, options: ['Black', 'Silver'] }
    ],
    default_attributes: [],
    variations: [],
    grouped_products: [],
    menu_order: 0,
    meta_data: []
  }
];

export const getProducts = async (): Promise<Product[]> => {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProducts);
    }, 500);
  });
};

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = mockProducts.find(p => p.slug === slug);
      resolve(product || null);
    }, 300);
  });
};

export const getCategories = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const categories = mockProducts.flatMap(p => p.categories);
      // Get unique categories
      const uniqueCategories = Array.from(new Map(categories.map(c => [c.id, c])).values());
      resolve(uniqueCategories);
    }, 300);
  });
};

const mockPosts: BlogPost[] = [
  {
    id: 1,
    title: { rendered: 'The Ultimate Guide to Minimalist Wardrobes' },
    content: { rendered: '<p>Minimalism isn’t just a design aesthetic; it’s a lifestyle choice that can bring clarity and peace to your daily routine. In this guide, we explore how to build a versatile wardrobe with fewer, higher-quality pieces.</p><h2>Start with the Basics</h2><p>Every great wardrobe starts with a solid foundation. Think classic t-shirts, a reliable pair of denim, and versatile outerwear.</p>' },
    excerpt: { rendered: '<p>Discover how to build a versatile wardrobe with fewer, higher-quality pieces.</p>' },
    slug: 'ultimate-guide-minimalist-wardrobes',
    date: '2023-10-15T08:00:00',
    featured_image_url: 'https://picsum.photos/seed/wardrobe/800/400'
  },
  {
    id: 2,
    title: { rendered: 'Top 5 Tech Gadgets for Productivity in 2024' },
    content: { rendered: '<p>Staying productive in a fast-paced world requires the right tools. Here are our top 5 tech gadgets that will help you stay focused and efficient.</p><ul><li>Noise-cancelling headphones</li><li>Ergonomic keyboards</li><li>Smart notebooks</li></ul>' },
    excerpt: { rendered: '<p>Here are our top 5 tech gadgets that will help you stay focused and efficient this year.</p>' },
    slug: 'top-5-tech-gadgets-productivity-2024',
    date: '2023-11-02T10:30:00',
    featured_image_url: 'https://picsum.photos/seed/tech/800/400'
  },
  {
    id: 3,
    title: { rendered: 'Why Sustainable Fashion Matters' },
    content: { rendered: '<p>The fashion industry is one of the largest polluters globally. By choosing sustainable brands and materials, we can reduce our environmental footprint.</p><p>Look for organic cotton, recycled materials, and transparent supply chains.</p>' },
    excerpt: { rendered: '<p>By choosing sustainable brands and materials, we can reduce our environmental footprint.</p>' },
    slug: 'why-sustainable-fashion-matters',
    date: '2023-11-20T14:15:00',
    featured_image_url: 'https://picsum.photos/seed/sustainable/800/400'
  }
];

export const getPosts = async (): Promise<BlogPost[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockPosts);
    }, 400);
  });
};

export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const post = mockPosts.find(p => p.slug === slug);
      resolve(post || null);
    }, 300);
  });
};

let mockComments: Comment[] = [
  {
    id: 1,
    post_id: 1,
    author_name: 'Jane Doe',
    content: 'This is a fantastic guide! I have been trying to minimize my wardrobe for months.',
    date: '2023-10-16T09:30:00'
  },
  {
    id: 2,
    post_id: 1,
    author_name: 'John Smith',
    content: 'Great tips. Quality over quantity is definitely the way to go.',
    date: '2023-10-17T14:20:00'
  }
];

export const getCommentsByPostId = async (postId: number): Promise<Comment[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockComments.filter(c => c.post_id === postId));
    }, 300);
  });
};

export const addComment = async (postId: number, author_name: string, content: string): Promise<Comment> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newComment: Comment = {
        id: mockComments.length > 0 ? Math.max(...mockComments.map(c => c.id)) + 1 : 1,
        post_id: postId,
        author_name,
        content,
        date: new Date().toISOString()
      };
      mockComments = [...mockComments, newComment];
      resolve(newComment);
    }, 400);
  });
};

let mockProductReviews: ProductReview[] = [
  {
    id: 1,
    product_id: 1,
    author_name: 'Alice',
    rating: 5,
    content: 'Excellent quality and fits perfectly!',
    date: '2023-05-10T10:00:00'
  },
  {
    id: 2,
    product_id: 1,
    author_name: 'Bob',
    rating: 4,
    content: 'Good shirt, but the color is slightly darker than the picture.',
    date: '2023-06-15T14:30:00'
  }
];

export const getProductReviews = async (productId: number): Promise<ProductReview[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProductReviews.filter(r => r.product_id === productId));
    }, 300);
  });
};

export const addProductReview = async (productId: number, author_name: string, rating: number, content: string): Promise<ProductReview> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newReview: ProductReview = {
        id: mockProductReviews.length > 0 ? Math.max(...mockProductReviews.map(r => r.id)) + 1 : 1,
        product_id: productId,
        author_name,
        rating,
        content,
        date: new Date().toISOString()
      };
      mockProductReviews = [...mockProductReviews, newReview];
      resolve(newReview);
    }, 400);
  });
};
