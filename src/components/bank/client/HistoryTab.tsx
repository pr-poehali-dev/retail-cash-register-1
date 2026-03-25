import { useState } from 'react';
import { Transaction } from '@/types/bank';
import Icon from '@/components/ui/icon';

interface Props { transactions: Transaction[]; }

const CATEGORY_ICONS: Record<string, Parameters<typeof Icon>[0]['name']> = {
  'ЖКХ': 'Home', 'Зарплата': 'Briefcase', 'Продукты': 'ShoppingCart',
  'Переводы': 'ArrowLeftRight', 'Подписки': 'Tv', 'Кредит': 'Landmark',
  'Прочее': 'MoreHorizontal', 'Питание': 'UtensilsCrossed',
};

const CATEGORIES = ['Все', 'Зарплата', 'Продукты', 'Переводы', 'ЖКХ', 'Подписки', 'Питание', 'Прочее'];

export default function HistoryTab({ transactions }: Props) {
  const [filter, setFilter] = useState('Все');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');

  const filtered = transactions.filter(tx => {
    if (filter !== 'Все' && tx.category !== filter) return false;
    if (typeFilter === 'income' && tx.amount <= 0) return false;
    if (typeFilter === 'expense' && tx.amount >= 0) return false;
    if (search && !tx.description.toLowerCase().includes(search.toLowerCase()) && !(tx.counterparty || '').toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalIn = filtered.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalOut = filtered.filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0);

  const grouped = filtered.reduce<Record<string, Transaction[]>>((acc, tx) => {
    const d = new Date(tx.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
    if (!acc[d]) acc[d] = [];
    acc[d].push(tx);
    return acc;
  }, {});

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl p-4" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
          <p className="text-xs text-muted-foreground mb-1">Поступления</p>
          <p className="text-xl font-bold font-mono" style={{ color: '#22c55e' }}>+{totalIn.toLocaleString()} ₽</p>
        </div>
        <div className="rounded-xl p-4" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <p className="text-xs text-muted-foreground mb-1">Расходы</p>
          <p className="text-xl font-bold font-mono" style={{ color: '#f87171' }}>{totalOut.toLocaleString()} ₽</p>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Поиск по операциям..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-muted-foreground"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['all', 'income', 'expense'] as const).map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: typeFilter === t ? (t === 'income' ? 'rgba(34,197,94,0.2)' : t === 'expense' ? 'rgba(239,68,68,0.15)' : 'rgba(26,111,255,0.2)') : 'rgba(255,255,255,0.05)',
                color: typeFilter === t ? (t === 'income' ? '#22c55e' : t === 'expense' ? '#f87171' : '#4d93ff') : 'rgba(255,255,255,0.5)',
                border: `1px solid ${typeFilter === t ? (t === 'income' ? 'rgba(34,197,94,0.4)' : t === 'expense' ? 'rgba(239,68,68,0.3)' : 'rgba(26,111,255,0.4)') : 'rgba(255,255,255,0.08)'}`,
              }}>
              {t === 'all' ? 'Все' : t === 'income' ? '↑ Доходы' : '↓ Расходы'}
            </button>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all"
              style={{
                background: filter === cat ? 'rgba(26,111,255,0.18)' : 'rgba(255,255,255,0.04)',
                color: filter === cat ? '#4d93ff' : 'rgba(255,255,255,0.4)',
                border: `1px solid ${filter === cat ? 'rgba(26,111,255,0.35)' : 'rgba(255,255,255,0.07)'}`,
              }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grouped transactions */}
      <div className="space-y-5">
        {Object.entries(grouped).map(([date, txs]) => (
          <div key={date}>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 px-1">{date}</p>
            <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bank-surface)', border: '1px solid rgba(255,255,255,0.07)' }}>
              {txs.map((tx, i) => (
                <div key={tx.id} className={`flex items-center gap-4 px-4 py-3.5 table-row-hover cursor-pointer ${i < txs.length - 1 ? 'border-b' : ''}`}
                  style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: tx.amount > 0 ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.1)' }}>
                    <Icon name={CATEGORY_ICONS[tx.category] || 'ArrowUpDown'} size={16}
                      style={{ color: tx.amount > 0 ? '#22c55e' : '#f87171' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate font-medium">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(tx.date).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })} · {tx.counterparty || tx.category}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold font-mono" style={{ color: tx.amount > 0 ? '#22c55e' : '#f87171' }}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()} ₽
                    </p>
                    <span className="chip status-active text-xs">{tx.status === 'completed' ? 'Выполнено' : 'В ожидании'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Icon name="SearchX" size={40} className="mx-auto mb-3 text-muted-foreground opacity-30" />
            <p className="text-muted-foreground text-sm">Операции не найдены</p>
          </div>
        )}
      </div>
    </div>
  );
}
