import { useState } from 'react';
import { Product, CartItem } from '@/types/pos';
import Icon from '@/components/ui/icon';

interface Props {
  products: Product[];
  cart: CartItem[];
  cartTotal: number;
  cartProfit: number;
  onAdd: (p: Product) => void;
  onRemove: (id: string) => void;
  onQtyChange: (id: string, qty: number) => void;
  onClear: () => void;
  onSale: (method: 'cash' | 'card') => void;
}

export default function CashierTab({ products, cart, cartTotal, cartProfit, onAdd, onRemove, onQtyChange, onClear, onSale }: Props) {
  const [search, setSearch] = useState('');
  const [lastSale, setLastSale] = useState<{ total: number; method: string } | null>(null);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.barcode.includes(search)
  );

  const handleSale = (method: 'cash' | 'card') => {
    if (cart.length === 0) return;
    setLastSale({ total: cartTotal, method: method === 'cash' ? 'наличные' : 'карта' });
    onSale(method);
    setTimeout(() => setLastSale(null), 3000);
  };

  return (
    <div className="flex gap-4 h-full" style={{ height: 'calc(100vh - 80px)' }}>
      {/* Product grid */}
      <div className="flex-1 flex flex-col gap-3 overflow-hidden">
        <div className="relative">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск по названию или штрихкоду..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--neon-green)] transition-all"
          />
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-2 xl:grid-cols-3 gap-2 content-start">
          {filtered.map(p => (
            <button
              key={p.id}
              onClick={() => onAdd(p)}
              disabled={p.stock === 0}
              className={`bg-gradient-card border border-border rounded-xl p-3 text-left transition-all hover:border-[var(--neon-green)] hover:glow-green group ${p.stock === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{p.category}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.stock <= 3 ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                  {p.stock} {p.unit}
                </span>
              </div>
              <p className="font-semibold text-sm mt-2 leading-tight">{p.name}</p>
              <p className="text-[var(--neon-green)] font-bold text-lg mt-1">{p.sellPrice.toLocaleString()} ₽</p>
              <p className="text-muted-foreground text-xs">Закупка: {p.costPrice} ₽</p>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-3 text-center py-16 text-muted-foreground">
              <Icon name="SearchX" size={40} className="mx-auto mb-3 opacity-30" />
              <p>Товар не найден</p>
            </div>
          )}
        </div>
      </div>

      {/* Cart */}
      <div className="w-80 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-[var(--neon-green)]" style={{ fontFamily: 'Oswald, sans-serif' }}>КОРЗИНА</h3>
          {cart.length > 0 && (
            <button onClick={onClear} className="text-xs text-muted-foreground hover:text-red-400 transition-colors flex items-center gap-1">
              <Icon name="Trash2" size={12} />
              Очистить
            </button>
          )}
        </div>

        {lastSale && (
          <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-xl p-3 animate-scale-in text-center">
            <Icon name="CheckCircle2" size={20} className="mx-auto mb-1 text-emerald-400" />
            <p className="text-emerald-400 font-bold">Продажа: {lastSale.total.toLocaleString()} ₽</p>
            <p className="text-xs text-muted-foreground">{lastSale.method}</p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto flex flex-col gap-2">
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground py-10">
              <Icon name="ShoppingCart" size={40} className="mb-3 opacity-20" />
              <p className="text-sm">Корзина пуста</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.product.id} className="bg-gradient-card border border-border rounded-xl p-3 animate-slide-in">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium leading-tight flex-1 pr-2">{item.product.name}</p>
                  <button onClick={() => onRemove(item.product.id)} className="text-muted-foreground hover:text-red-400 transition-colors">
                    <Icon name="X" size={14} />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onQtyChange(item.product.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-lg bg-muted hover:bg-secondary flex items-center justify-center transition-colors"
                    >
                      <Icon name="Minus" size={10} />
                    </button>
                    <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                    <button
                      onClick={() => onQtyChange(item.product.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                      className="w-6 h-6 rounded-lg bg-muted hover:bg-secondary flex items-center justify-center transition-colors disabled:opacity-30"
                    >
                      <Icon name="Plus" size={10} />
                    </button>
                  </div>
                  <span className="text-[var(--neon-green)] font-bold text-sm">
                    {(item.product.sellPrice * item.quantity).toLocaleString()} ₽
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Total & checkout */}
        <div className="bg-gradient-card border border-border rounded-xl p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Позиций:</span>
            <span>{cart.reduce((s, i) => s + i.quantity, 0)} шт</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Прибыль:</span>
            <span className="text-[var(--neon-purple)] font-semibold">+{cartProfit.toLocaleString()} ₽</span>
          </div>
          <div className="flex justify-between items-center border-t border-border pt-3">
            <span className="font-bold">ИТОГО:</span>
            <span className="text-2xl font-black gradient-text" style={{ fontFamily: 'Oswald, sans-serif' }}>
              {cartTotal.toLocaleString()} ₽
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleSale('cash')}
              disabled={cart.length === 0}
              className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-[var(--neon-green)] text-[#0a1628] hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
            >
              <Icon name="Banknote" size={16} />
              Наличные
            </button>
            <button
              onClick={() => handleSale('card')}
              disabled={cart.length === 0}
              className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-[var(--neon-purple)] text-white hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
            >
              <Icon name="CreditCard" size={16} />
              Карта
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
