import { Account } from '@/types/bank';
import Icon from '@/components/ui/icon';

interface Props { accounts: Account[]; }

const TYPE_CONFIG = {
  current: { label: 'Текущий', icon: 'Wallet', color: '#1a6fff' },
  savings: { label: 'Накопительный', icon: 'PiggyBank', color: '#f5a623' },
  deposit: { label: 'Вклад', icon: 'TrendingUp', color: '#22c55e' },
  credit: { label: 'Кредитный', icon: 'CreditCard', color: '#a855f7' },
};

export default function AccountsTab({ accounts }: Props) {
  const totalRub = accounts.filter(a => a.currency === 'RUB').reduce((s, a) => s + a.balance, 0);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Всего счетов', value: accounts.length, icon: 'Layers', color: '#1a6fff' },
          { label: 'Активных', value: accounts.filter(a => a.status === 'active').length, icon: 'CheckCircle', color: '#22c55e' },
          { label: 'Общий баланс (RUB)', value: `${totalRub.toLocaleString()} ₽`, icon: 'Banknote', color: '#f5a623', big: true },
        ].map(({ label, value, icon, color, big }) => (
          <div key={label} className="rounded-2xl p-5" style={{ background: 'var(--bank-surface)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">{label}</p>
                <p className={`font-bold text-white ${big ? 'text-xl' : 'text-2xl'}`} style={{ fontFamily: 'IBM Plex Mono, monospace' }}>{value}</p>
              </div>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
                <Icon name={icon as Parameters<typeof Icon>[0]['name']} size={18} style={{ color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {accounts.map(acc => {
          const cfg = TYPE_CONFIG[acc.type];
          return (
            <div key={acc.id} className="rounded-2xl p-5 transition-all hover:border-opacity-30"
              style={{ background: 'var(--bank-surface)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: `${cfg.color}18` }}>
                    <Icon name={cfg.icon as Parameters<typeof Icon>[0]['name']} size={20} style={{ color: cfg.color }} />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{acc.name}</p>
                    <p className="text-xs text-muted-foreground">{cfg.label} · Открыт {new Date(acc.openDate).toLocaleDateString('ru-RU')}</p>
                  </div>
                </div>
                <span className={`chip ${acc.status === 'active' ? 'status-active' : 'status-frozen'}`}>
                  {acc.status === 'active' ? 'Активен' : 'Заморожен'}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Номер счёта</p>
                  <p className="text-sm text-white font-mono">{acc.number.replace(/(\d{8})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4')}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Валюта</p>
                  <p className="text-sm text-white font-semibold">{acc.currency}</p>
                </div>
                {acc.interestRate && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Процентная ставка</p>
                    <p className="text-sm font-semibold" style={{ color: '#22c55e' }}>{acc.interestRate}% годовых</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Баланс</p>
                  <p className="text-xl font-bold text-white font-mono">
                    {acc.balance.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} {acc.currency === 'RUB' ? '₽' : acc.currency}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {[
                  { icon: 'ArrowUpRight', label: 'Перевести', color: '#1a6fff' },
                  { icon: 'FileText', label: 'Выписка', color: '#f5a623' },
                  { icon: acc.status === 'active' ? 'SnowflakeIcon' : 'Play', label: acc.status === 'active' ? 'Заморозить' : 'Разморозить', color: '#6b7280' },
                ].map(({ icon, label, color }) => (
                  <button key={label}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                    style={{ background: `${color}14`, color, border: `1px solid ${color}30` }}>
                    <Icon name={icon as Parameters<typeof Icon>[0]['name']} size={12} />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
