import { useState } from 'react';
import { SaleRecord } from '@/types/pos';
import Icon from '@/components/ui/icon';

interface Props {
  sales: SaleRecord[];
}

export default function HistoryTab({ sales }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
      ' ' + d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-3">
      {sales.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Icon name="History" size={48} className="mx-auto mb-3 opacity-20" />
          <p className="text-sm">История продаж пуста</p>
        </div>
      ) : (
        <>
          <div className="text-sm text-muted-foreground">Всего записей: {sales.length}</div>
          {sales.map((sale) => (
            <div key={sale.id} className="bg-gradient-card border border-border rounded-2xl overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === sale.id ? null : sale.id)}
                className="w-full px-5 py-4 flex items-center gap-4 hover:bg-muted/20 transition-colors"
              >
                <div className={`p-2 rounded-xl ${sale.paymentMethod === 'cash' ? 'bg-emerald-500/20' : 'bg-purple-500/20'}`}>
                  <Icon
                    name={sale.paymentMethod === 'cash' ? 'Banknote' : 'CreditCard'}
                    size={16}
                    className={sale.paymentMethod === 'cash' ? 'text-emerald-400' : 'text-purple-400'}
                  />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-sm">{formatDate(sale.date)}</p>
                  <p className="text-xs text-muted-foreground">{sale.items.length} товар(а) · {sale.paymentMethod === 'cash' ? 'Наличные' : 'Карта'}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[var(--neon-green)]">{sale.total.toLocaleString()} ₽</p>
                  <p className="text-xs text-[var(--neon-purple)]">+{sale.profit.toLocaleString()} ₽</p>
                </div>
                <Icon name={expanded === sale.id ? 'ChevronUp' : 'ChevronDown'} size={16} className="text-muted-foreground ml-2" />
              </button>

              {expanded === sale.id && (
                <div className="px-5 pb-4 border-t border-border/50 animate-fade-in">
                  <table className="w-full mt-3">
                    <thead>
                      <tr>
                        <th className="text-left text-xs text-muted-foreground pb-2">Товар</th>
                        <th className="text-right text-xs text-muted-foreground pb-2">Кол-во</th>
                        <th className="text-right text-xs text-muted-foreground pb-2">Цена</th>
                        <th className="text-right text-xs text-muted-foreground pb-2">Сумма</th>
                        <th className="text-right text-xs text-muted-foreground pb-2">Прибыль</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sale.items.map((item, i) => (
                        <tr key={i} className="border-t border-border/30">
                          <td className="py-2 text-sm">{item.name}</td>
                          <td className="py-2 text-sm text-right text-muted-foreground">{item.quantity}</td>
                          <td className="py-2 text-sm text-right text-muted-foreground">{item.price.toLocaleString()} ₽</td>
                          <td className="py-2 text-sm text-right font-semibold">{(item.price * item.quantity).toLocaleString()} ₽</td>
                          <td className="py-2 text-sm text-right text-[var(--neon-purple)]">
                            +{((item.price - item.costPrice) * item.quantity).toLocaleString()} ₽
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t border-border">
                        <td colSpan={3} className="pt-3 text-sm font-bold">Итого</td>
                        <td className="pt-3 text-right font-bold text-[var(--neon-green)]">{sale.total.toLocaleString()} ₽</td>
                        <td className="pt-3 text-right font-bold text-[var(--neon-purple)]">+{sale.profit.toLocaleString()} ₽</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
