import { SaleRecord } from '@/types/pos';
import Icon from '@/components/ui/icon';

interface Props {
  sales: SaleRecord[];
}

export default function ReportsTab({ sales }: Props) {
  const today = new Date().toDateString();
  const todaySales = sales.filter(s => new Date(s.date).toDateString() === today);

  const totalRevenue = sales.reduce((s, r) => s + r.total, 0);
  const totalProfit = sales.reduce((s, r) => s + r.profit, 0);
  const todayRevenue = todaySales.reduce((s, r) => s + r.total, 0);
  const todayProfit = todaySales.reduce((s, r) => s + r.profit, 0);

  const cashSales = sales.filter(s => s.paymentMethod === 'cash');
  const cardSales = sales.filter(s => s.paymentMethod === 'card');
  const cashTotal = cashSales.reduce((s, r) => s + r.total, 0);
  const cardTotal = cardSales.reduce((s, r) => s + r.total, 0);

  // Top products
  const productMap: Record<string, { qty: number; revenue: number; profit: number }> = {};
  sales.forEach(s => s.items.forEach(i => {
    if (!productMap[i.name]) productMap[i.name] = { qty: 0, revenue: 0, profit: 0 };
    productMap[i.name].qty += i.quantity;
    productMap[i.name].revenue += i.price * i.quantity;
    productMap[i.name].profit += (i.price - i.costPrice) * i.quantity;
  }));
  const topProducts = Object.entries(productMap)
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const avgMargin = totalRevenue > 0 ? Math.round(totalProfit / totalRevenue * 100) : 0;

  const StatCard = ({ icon, label, value, sub, color }: { icon: Parameters<typeof Icon>[0]['name']; label: string; value: string; sub?: string; color: string }) => (
    <div className="bg-gradient-card border border-border rounded-2xl p-5 relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-10`} style={{ background: color }} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground text-sm mb-1">{label}</p>
          <p className="text-2xl font-black" style={{ fontFamily: 'Oswald, sans-serif', color }}>{value}</p>
          {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
        </div>
        <div className="p-2.5 rounded-xl" style={{ background: `${color}20` }}>
          <Icon name={icon} size={20} style={{ color }} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon="TrendingUp" label="Выручка (всего)" value={`${totalRevenue.toLocaleString()} ₽`} sub={`Сегодня: ${todayRevenue.toLocaleString()} ₽`} color="var(--neon-green)" />
        <StatCard icon="Sparkles" label="Прибыль (всего)" value={`${totalProfit.toLocaleString()} ₽`} sub={`Сегодня: ${todayProfit.toLocaleString()} ₽`} color="var(--neon-purple)" />
        <StatCard icon="ShoppingBag" label="Продаж всего" value={`${sales.length}`} sub={`Сегодня: ${todaySales.length}`} color="var(--neon-blue)" />
        <StatCard icon="Percent" label="Средняя маржа" value={`${avgMargin}%`} sub="от выручки" color="var(--neon-orange)" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Payment split */}
        <div className="bg-gradient-card border border-border rounded-2xl p-5">
          <h3 className="font-bold mb-4 text-sm text-muted-foreground uppercase tracking-wider">Способы оплаты</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="flex items-center gap-2"><Icon name="Banknote" size={14} className="text-[var(--neon-green)]" /> Наличные</span>
                <span className="font-bold">{cashTotal.toLocaleString()} ₽ <span className="text-muted-foreground font-normal">({cashSales.length} чек)</span></span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-[var(--neon-green)] rounded-full transition-all" style={{ width: totalRevenue > 0 ? `${cashTotal / totalRevenue * 100}%` : '0%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="flex items-center gap-2"><Icon name="CreditCard" size={14} className="text-[var(--neon-purple)]" /> Карта</span>
                <span className="font-bold">{cardTotal.toLocaleString()} ₽ <span className="text-muted-foreground font-normal">({cardSales.length} чек)</span></span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-[var(--neon-purple)] rounded-full transition-all" style={{ width: totalRevenue > 0 ? `${cardTotal / totalRevenue * 100}%` : '0%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Top products */}
        <div className="bg-gradient-card border border-border rounded-2xl p-5">
          <h3 className="font-bold mb-4 text-sm text-muted-foreground uppercase tracking-wider">Топ товаров по выручке</h3>
          {topProducts.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground text-sm">Нет данных</div>
          ) : (
            <div className="space-y-2">
              {topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="text-xs font-bold w-5 text-muted-foreground">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.qty} шт</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[var(--neon-green)]">{p.revenue.toLocaleString()} ₽</p>
                    <p className="text-xs text-[var(--neon-purple)]">+{p.profit.toLocaleString()} ₽</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {sales.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          <Icon name="BarChart3" size={48} className="mx-auto mb-3 opacity-20" />
          <p>Проведите первую продажу, чтобы увидеть отчёты</p>
        </div>
      )}
    </div>
  );
}