export interface Product {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  date_created: string;
  date_modified: string;
  type: string;
  status: string;
  featured: boolean;
  catalog_visibility: string;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  date_on_sale_from: string | null;
  date_on_sale_to: string | null;
  price_html: string;
  on_sale: boolean;
  purchasable: boolean;
  total_sales: number;
  virtual: boolean;
  downloadable: boolean;
  downloads: any[];
  download_limit: number;
  download_expiry: number;
  external_url: string;
  button_text: string;
  tax_status: string;
  tax_class: string;
  manage_stock: boolean;
  stock_quantity: number | null;
  stock_status: string;
  backorders: string;
  backorders_allowed: boolean;
  backordered: boolean;
  sold_individually: boolean;
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  shipping_required: boolean;
  shipping_taxable: boolean;
  shipping_class: string;
  shipping_class_id: number;
  reviews_allowed: boolean;
  average_rating: string;
  rating_count: number;
  related_ids: number[];
  upsell_ids: number[];
  cross_sell_ids: number[];
  parent_id: number;
  purchase_note: string;
  categories: {
    id: number;
    name: string;
    slug: string;
  }[];
  tags: any[];
  images: {
    id: number;
    date_created: string;
    date_created_gmt: string;
    date_modified: string;
    date_modified_gmt: string;
    src: string;
    name: string;
    alt: string;
  }[];
  attributes: {
    id: number;
    name: string;
    position: number;
    visible: boolean;
    variation: boolean;
    options: string[];
  }[];
  default_attributes: any[];
  variations: number[];
  grouped_products: number[];
  menu_order: number;
  meta_data: any[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface BlogPost {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  slug: string;
  date: string;
  featured_image_url?: string;
}

export interface Comment {
  id: number;
  post_id: number;
  author_name: string;
  content: string;
  date: string;
}

export interface ProductReview {
  id: number;
  product_id: number;
  author_name: string;
  rating: number;
  content: string;
  date: string;
}

export interface PaymentGateway {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  method_title: string;
  method_description: string;
}
