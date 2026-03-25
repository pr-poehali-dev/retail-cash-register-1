import { useState, useEffect } from 'react';
import { Tab } from '@/types/pos';
import { usePOS } from '@/hooks/usePOS';
import CashierTab from '@/components/pos/CashierTab';
import ProductsTab from '@/components/pos/ProductsTab';
import ReportsTab from '@/components/pos/ReportsTab';
import HistoryTab from '@/components/pos/HistoryTab';
import SettingsTab from '@/components/pos/SettingsTab';
import Icon from '@/components/ui/icon';

const NAV: { id: Tab; label: string; icon: Parameters<typeof Icon>[0]['name'] }[] = [
  { id: 'cashier', label: 'Касса', icon: 'ShoppingCart' },
  { id: 'products', label: 'Товары', icon: 'Package' },
  { id: 'reports', label: 'Отчёты', icon: 'BarChart3' },
  { id: 'history', label: 'История', icon: 'History' },
  { id: 'settings', label: 'Настройки', icon: 'Settings' },
];

export default function Index() {
  const [tab, setTab] = useState<Tab>('cashier');
  const [f9Open, setF9Open] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const pos = usePOS();

  const lowStock = pos.products.filter(p => p.stock <= 3 && p.stock > 0).length;
  const outStock = pos.products.filter(p => p.stock === 0).length;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'F9') { e.preventDefault(); setF9Open(v => !v); }
      if (e.key === 'Escape') setF9Open(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = currentTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  const dateStr = currentTime.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="mesh-bg min-h-screen flex" style={{ fontFamily: 'Golos Text, sans-serif' }}>
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-card border-r border-border flex flex-col">
        <div className="px-5 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--neon-green)] to-[var(--neon-purple)] flex items-center justify-center animate-pulse-glow">
              <Icon name="Zap" size={18} className="text-[#0a1628]" />
            </div>
            <div>
              <p className="font-black text-sm leading-none gradient-text" style={{ fontFamily: 'Oswald, sans-serif' }}>КАССАПРО</p>
              <p className="text-xs text-muted-foreground mt-0.5">Розничная касса</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === id
                  ? 'nav-active text-[var(--neon-green)]'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
            >
              <Icon name={icon} size={18} />
              {label}
              {id === 'products' && (lowStock > 0 || outStock > 0) && (
                <span className="ml-auto text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full font-bold">
                  {outStock || lowStock}
                </span>
              )}
              {id === 'cashier' && pos.cart.length > 0 && (
                <span className="ml-auto text-xs bg-[var(--neon-green)]/20 text-[var(--neon-green)] px-1.5 py-0.5 rounded-full font-bold">
                  {pos.cart.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-border space-y-2">
          <div className="bg-muted/50 rounded-xl px-3 py-2.5 flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Товаров</span>
            <span className="text-xs font-bold">{pos.products.length}</span>
          </div>
          <div className="bg-muted/50 rounded-xl px-3 py-2.5 flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Продаж</span>
            <span className="text-xs font-bold text-[var(--neon-green)]">{pos.sales.length}</span>
          </div>
          <button
            onClick={() => setF9Open(true)}
            className="w-full bg-muted/30 rounded-xl px-3 py-2 flex justify-between items-center hover:bg-muted/60 transition-colors"
          >
            <span className="text-xs text-muted-foreground">Система</span>
            <kbd className="text-xs bg-muted border border-border px-1.5 py-0.5 rounded font-mono text-[var(--neon-green)]">F9</kbd>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border px-6 py-3.5 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="font-bold text-base" style={{ fontFamily: 'Oswald, sans-serif' }}>
              {NAV.find(n => n.id === tab)?.label.toUpperCase()}
            </h1>
            <p className="text-xs text-muted-foreground capitalize">{dateStr}</p>
          </div>
          <div className="flex items-center gap-4">
            {(lowStock > 0 || outStock > 0) && (
              <div className="flex items-center gap-2 text-orange-400 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-xl text-xs">
                <Icon name="AlertTriangle" size={13} />
                {outStock > 0 ? `Нет на складе: ${outStock}` : `Мало остатков: ${lowStock}`}
              </div>
            )}
            <div className="text-right">
              <p className="font-bold text-[var(--neon-green)] text-base" style={{ fontFamily: 'Oswald, sans-serif' }}>{timeStr}</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--neon-blue)] to-[var(--neon-purple)] flex items-center justify-center">
              <Icon name="User" size={14} className="text-white" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5">
          {tab === 'cashier' && (
            <CashierTab
              products={pos.products}
              cart={pos.cart}
              cartTotal={pos.cartTotal}
              cartProfit={pos.cartProfit}
              onAdd={pos.addToCart}
              onRemove={pos.removeFromCart}
              onQtyChange={pos.updateCartQty}
              onClear={pos.clearCart}
              onSale={pos.completeSale}
            />
          )}
          {tab === 'products' && (
            <ProductsTab
              products={pos.products}
              onAdd={pos.addProduct}
              onUpdate={pos.updateProduct}
              onDelete={pos.deleteProduct}
            />
          )}
          {tab === 'reports' && <ReportsTab sales={pos.sales} />}
          {tab === 'history' && <HistoryTab sales={pos.sales} />}
          {tab === 'settings' && <SettingsTab />}
        </main>
      </div>

      {/* F9 Dialog */}
      {f9Open && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setF9Open(false)}
        >
          <div
            className="bg-card border border-[var(--neon-green)]/30 rounded-3xl p-8 w-full max-w-sm animate-scale-in glow-green text-center"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--neon-green)] to-[var(--neon-purple)] flex items-center justify-center mx-auto mb-5 glow-green">
              <Icon name="Zap" size={28} className="text-[#0a1628]" />
            </div>
            <h2 className="text-2xl font-black gradient-text mb-1" style={{ fontFamily: 'Oswald, sans-serif' }}>
              КАССАПРО
            </h2>
            <p className="text-muted-foreground text-sm mb-6">Розничная касса v1.0</p>

            <div className="bg-muted/50 rounded-2xl p-4 space-y-2.5 text-left mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Товаров в базе</span>
                <span className="font-bold">{pos.products.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Продаж за сессию</span>
                <span className="font-bold text-[var(--neon-green)]">{pos.sales.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Выручка за сессию</span>
                <span className="font-bold text-[var(--neon-green)]">
                  {pos.sales.reduce((s, r) => s + r.total, 0).toLocaleString()} ₽
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Прибыль за сессию</span>
                <span className="font-bold text-[var(--neon-purple)]">
                  +{pos.sales.reduce((s, r) => s + r.profit, 0).toLocaleString()} ₽
                </span>
              </div>
              <div className="flex justify-between text-sm border-t border-border pt-2.5">
                <span className="text-muted-foreground">Мало на складе</span>
                <span className={`font-bold ${lowStock > 0 ? 'text-orange-400' : 'text-emerald-400'}`}>
                  {lowStock} товар(а)
                </span>
              </div>
            </div>

            <button
              onClick={() => setF9Open(false)}
              className="w-full py-3 rounded-xl font-bold text-sm bg-[var(--neon-green)] text-[#0a1628] hover:opacity-90 transition-all active:scale-[0.99]"
            >
              Закрыть (Escape)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
