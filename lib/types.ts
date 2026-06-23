// lib/types.ts — shared types for Customer Portal

export interface Supplier {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  categories: string[];
  rating: number;
  deliveryTime: string;
  location: string;
  productsCount: number;
}

export interface Product {
  id: string;
  supplierId: string;
  supplierName: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  imageUrl: string;
  category: string;
  inStock: boolean;
  minOrderQty: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  poCode: string;
  supplierId: string;
  supplierName: string;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  items: OrderItem[];
  totalCost: number;
  createdAt: string;
  expectedDelivery: string;
  deliveryAddress: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}
