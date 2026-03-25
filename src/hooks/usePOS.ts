import { useState, useCallback } from 'react';
import { Product, CartItem, SaleRecord } from '@/types/pos';

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Молоко 1л', barcode: '4600001', category: 'Молочное', costPrice: 65, sellPrice: 89, stock: 24, unit: 'шт' },
  { id: '2', name: 'Хлеб белый', barcode: '4600002', category: 'Хлебобулочные', costPrice: 28, sellPrice: 45, stock: 15, unit: 'шт' },
  { id: '3', name: 'Сыр российский 200г', barcode: '4600003', category: 'Молочное', costPrice: 120, sellPrice: 175, stock: 8, unit: 'шт' },
  { id: '4', name: 'Кофе растворимый', barcode: '4600004', category: 'Напитки', costPrice: 210, sellPrice: 299, stock: 12, unit: 'шт' },
  { id: '5', name: 'Шоколад молочный', barcode: '4600005', category: 'Кондитерское', costPrice: 55, sellPrice: 89, stock: 30, unit: 'шт' },
];

export function usePOS() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [sales, setSales] = useState<SaleRecord[]>([]);

  const addToCart = useCallback((product: Product) => {
    if (product.stock <= 0) return;
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(i => i.product.id !== productId));
  }, []);

  const updateCartQty = useCallback((productId: string, qty: number) => {
    setCart(prev => {
      if (qty <= 0) return prev.filter(i => i.product.id !== productId);
      const item = prev.find(i => i.product.id === productId);
      if (item && qty > item.product.stock) return prev;
      return prev.map(i => i.product.id === productId ? { ...i, quantity: qty } : i);
    });
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const completeSale = useCallback((paymentMethod: 'cash' | 'card') => {
    if (cart.length === 0) return null;
    const total = cart.reduce((s, i) => s + i.product.sellPrice * i.quantity, 0);
    const profit = cart.reduce((s, i) => s + (i.product.sellPrice - i.product.costPrice) * i.quantity, 0);

    const record: SaleRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      items: cart.map(i => ({ name: i.product.name, quantity: i.quantity, price: i.product.sellPrice, costPrice: i.product.costPrice })),
      total,
      profit,
      paymentMethod,
    };

    setProducts(prev => prev.map(p => {
      const cartItem = cart.find(i => i.product.id === p.id);
      if (cartItem) return { ...p, stock: p.stock - cartItem.quantity };
      return p;
    }));

    setSales(prev => [record, ...prev]);
    setCart([]);
    return record;
  }, [cart]);

  const addProduct = useCallback((product: Omit<Product, 'id'>) => {
    setProducts(prev => [...prev, { ...product, id: Date.now().toString() }]);
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const cartTotal = cart.reduce((s, i) => s + i.product.sellPrice * i.quantity, 0);
  const cartProfit = cart.reduce((s, i) => s + (i.product.sellPrice - i.product.costPrice) * i.quantity, 0);

  return {
    products, cart, sales,
    addToCart, removeFromCart, updateCartQty, clearCart, completeSale,
    addProduct, updateProduct, deleteProduct,
    cartTotal, cartProfit,
  };
}
