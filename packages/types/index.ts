export enum OrderStatus {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELED',
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  primaryColor: string;
  address?: string;
  phone?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
  products: Product[];
}

export interface Order {
  id: string;
  shortId: number;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  customer: Customer;
  deliveryType: string;
  address?: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
}
