export interface Product {
  id: string;
  name: string;
  barcode: string;
  category: string;
  costPrice: number;
  sellPrice: number;
  stock: number;
  unit: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface SaleRecord {
  id: string;
  date: string;
  items: { name: string; quantity: number; price: number; costPrice: number }[];
  total: number;
  profit: number;
  paymentMethod: 'cash' | 'card';
}

export type Tab = 'cashier' | 'products' | 'reports' | 'history' | 'settings';
