import { Account, Card, Transaction, Loan } from '@/types/bank';
import Icon from '@/components/ui/icon';

interface Props {
  name: string;
  totalBalance: number;
  accounts: Account[];
  cards: Card[];
  transactions: Transaction[];
  loans: Loan[];
  onTabChange: (tab: string) => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  'ЖКХ': 'Home', 'Зарплата': 'Briefcase', 'Продукты': 'ShoppingCart',
  'Переводы': 'ArrowLeftRight', 'Подписки': 'Tv', 'Кредит': 'Landmark',
  'Прочее': 'MoreHorizontal', 'Питание': 'UtensilsCrossed',
};

const TX_COLOR = (amount: number) => amount > 0 ? '#22c55e' : '#ef4444';

export default function Dashboard({ name, totalBalance, accounts, cards, transactions, loans, onTabChange }: Props) {
  const firstName = name.split(' ')[1] || name.split(' ')[0];
  const recent = transactions.slice(0, 5);
  const activeLoans = loans.filter(l => l.status === 'active');
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Доброе утро' : hour < 18 ? 'Добрый день' : 'Добрый вечер';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero */}
      <div className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d1f3c 0%, #0b2252 50%, #0d1a40 100%)', border: '1px solid rgba(26,111,255,0.2)' }}>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20"
          style={{ background: '#1a6fff', transform: 'translate(30%, -30%)' }} />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{greeting}, {firstName}</p>
            <p className="text-muted-foreground text-xs mb-3">
              {new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <p className="text-sm text-muted-foreground mb-1">Общий баланс (RUB)</p>
            <p className="text-4xl font-bold text-white" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
              {totalBalance.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ₽
            </p>
          </div>
          <div className="flex gap-3">
            {[
              { icon: 'ArrowUpRight', label: 'Перевод', tab: 'transfers', color: '#1a6fff' },
              { icon: 'CreditCard', label: 'Платёж', tab: 'payments', color: '#f5a623' },
              { icon: 'Plus', label: 'Счёт', tab: 'accounts', color: '#22c55e' },
            ].map(({ icon, label, tab, color }) => (
              <button key={tab} onClick={() => onTabChange(tab)}
                className="flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl transition-all hover:scale-105 active:scale-95"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${color}22` }}>
                  <Icon name={icon as Parameters<typeof Icon>[0]['name']} size={18} style={{ color }} />
                </div>
                <span className="text-xs text-white font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Accounts */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white text-sm">Мои счета</h3>
            <button onClick={() => onTabChange('accounts')} className="text-xs hover:text-white transition-colors" style={{ color: '#1a6fff' }}>Все счета</button>
          </div>
          {accounts.slice(0, 3).map(acc => (
            <div key={acc.id} className="flex items-center gap-4 p-4 rounded-xl transition-all hover:border-opacity-30 cursor-pointer"
              style={{ background: 'var(--bank-surface)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: acc.type === 'current' ? 'rgba(26,111,255,0.15)' : acc.type === 'savings' ? 'rgba(245,166,35,0.15)' : 'rgba(34,197,94,0.15)' }}>
                <Icon name={acc.type === 'current' ? 'Wallet' : acc.type === 'savings' ? 'PiggyBank' : 'TrendingUp'} size={18}
                  style={{ color: acc.type === 'current' ? '#1a6fff' : acc.type === 'savings' ? '#f5a623' : '#22c55e' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{acc.name}</p>
                <p className="text-xs text-muted-foreground font-mono">{acc.number.slice(-8).replace(/(\d{4})(\d{4})/, '**** $2')}</p>
              </div>
              {acc.interestRate && (
                <span className="text-xs px-2 py-0.5 rounded-full mr-2" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>
                  {acc.interestRate}% г.
                </span>
              )}
              <div className="text-right">
                <p className="font-semibold text-white text-sm font-mono">
                  {acc.balance.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} {acc.currency === 'RUB' ? '₽' : acc.currency}
                </p>
                <span className="chip status-active text-xs">{acc.status === 'active' ? 'Активен' : 'Заморожен'}</span>
              </div>
            </div>
          ))}

          {/* Quick payments */}
          <div className="flex items-center justify-between mt-2">
            <h3 className="font-semibold text-white text-sm">Быстрые платежи</h3>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: 'Wifi', label: 'Интернет', color: '#1a6fff' },
              { icon: 'Phone', label: 'Телефон', color: '#22c55e' },
              { icon: 'Home', label: 'ЖКХ', color: '#f5a623' },
              { icon: 'Tv', label: 'ТВ', color: '#a855f7' },
            ].map(({ icon, label, color }) => (
              <button key={label} onClick={() => onTabChange('payments')}
                className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all hover:scale-105 active:scale-95"
                style={{ background: 'var(--bank-surface)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${color}18` }}>
                  <Icon name={icon as Parameters<typeof Icon>[0]['name']} size={17} style={{ color }} />
                </div>
                <span className="text-xs text-muted-foreground">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Active loans */}
          {activeLoans.length > 0 && (
            <div className="rounded-xl p-4" style={{ background: 'var(--bank-surface)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white text-sm">Кредиты</h3>
                <button onClick={() => onTabChange('credits')} style={{ color: '#1a6fff', fontSize: 12 }}>Подробнее</button>
              </div>
              {activeLoans.map(loan => {
                const paid = loan.amount - loan.remaining;
                const pct = Math.round(paid / loan.amount * 100);
                return (
                  <div key={loan.id} className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        {loan.type === 'mortgage' ? 'Ипотека' : loan.type === 'consumer' ? 'Потребительский' : 'Авто'}
                      </span>
                      <span className="text-white font-medium">{pct}% погашено</span>
                    </div>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Остаток: {loan.remaining.toLocaleString()} ₽</span>
                      <span style={{ color: '#f5a623' }}>−{loan.monthlyPayment.toLocaleString()} ₽/мес</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Card preview */}
          {cards[0] && (
            <div onClick={() => onTabChange('cards')}
              className="rounded-xl p-4 cursor-pointer relative overflow-hidden card-blue bank-card-shine transition-transform hover:scale-[1.02]"
              style={{ border: '1px solid rgba(255,255,255,0.12)' }}>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <Icon name="Building2" size={18} className="text-white opacity-70" />
                  <span className="text-xs text-white opacity-60 uppercase tracking-wider">{cards[0].type}</span>
                </div>
                <p className="text-white font-mono text-base tracking-widest mb-3">{cards[0].number}</p>
                <div className="flex justify-between text-xs text-white opacity-70">
                  <span>{cards[0].holder}</span>
                  <span>{cards[0].expiry}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent transactions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-white text-sm">Последние операции</h3>
          <button onClick={() => onTabChange('history')} style={{ color: '#1a6fff', fontSize: 12 }}>Вся история</button>
        </div>
        <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bank-surface)', border: '1px solid rgba(255,255,255,0.07)' }}>
          {recent.map((tx, i) => (
            <div key={tx.id} className={`flex items-center gap-4 px-4 py-3 table-row-hover ${i < recent.length - 1 ? 'border-b' : ''}`}
              style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: tx.amount > 0 ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.1)' }}>
                <Icon name={(CATEGORY_ICONS[tx.category] || 'ArrowUpDown') as Parameters<typeof Icon>[0]['name']} size={15}
                  style={{ color: tx.amount > 0 ? '#22c55e' : '#f87171' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{tx.description}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(tx.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })} · {tx.counterparty}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold font-mono" style={{ color: TX_COLOR(tx.amount) }}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()} ₽
                </p>
                <p className="text-xs text-muted-foreground">{tx.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
