import { Loan } from '@/types/bank';
import Icon from '@/components/ui/icon';

interface Props { loans: Loan[]; }

const LOAN_LABELS: Record<string, string> = {
  mortgage: 'Ипотека', consumer: 'Потребительский', auto: 'Автокредит', business: 'Бизнес',
};
const LOAN_COLORS: Record<string, string> = {
  mortgage: '#1a6fff', consumer: '#f5a623', auto: '#22c55e', business: '#a855f7',
};
const LOAN_ICONS: Record<string, Parameters<typeof Icon>[0]['name']> = {
  mortgage: 'House', consumer: 'ShoppingBag', auto: 'Car', business: 'Briefcase',
};

const CREDIT_OFFERS = [
  { type: 'consumer', label: 'Потребительский', rate: '9.9%', amount: 'до 5 000 000 ₽', term: 'до 7 лет', color: '#f5a623' },
  { type: 'mortgage', label: 'Ипотека', rate: '7.5%', amount: 'до 30 000 000 ₽', term: 'до 30 лет', color: '#1a6fff' },
  { type: 'auto', label: 'Автокредит', rate: '8.9%', amount: 'до 10 000 000 ₽', term: 'до 7 лет', color: '#22c55e' },
];

export default function CreditsTab({ loans }: Props) {
  const active = loans.filter(l => l.status === 'active');
  const closed = loans.filter(l => l.status === 'closed');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Active loans */}
      {active.map(loan => {
        const paid = loan.amount - loan.remaining;
        const pct = Math.round(paid / loan.amount * 100);
        const color = LOAN_COLORS[loan.type];
        return (
          <div key={loan.id} className="rounded-2xl p-6"
            style={{ background: 'var(--bank-surface)', border: `1px solid ${color}30` }}>
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: `${color}18` }}>
                  <Icon name={LOAN_ICONS[loan.type]} size={22} style={{ color }} />
                </div>
                <div>
                  <p className="font-bold text-white">{LOAN_LABELS[loan.type]}</p>
                  <p className="text-xs text-muted-foreground">Открыт {new Date(loan.openDate).toLocaleDateString('ru-RU')} · {loan.rate}% годовых</p>
                </div>
              </div>
              <span className="chip status-active">Активен</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
              {[
                { label: 'Сумма кредита', value: `${loan.amount.toLocaleString()} ₽` },
                { label: 'Остаток долга', value: `${loan.remaining.toLocaleString()} ₽`, accent: true, color },
                { label: 'Ежемес. платёж', value: `${loan.monthlyPayment.toLocaleString()} ₽` },
                { label: 'Следующий платёж', value: new Date(loan.nextPayment).toLocaleDateString('ru-RU'), highlight: true },
              ].map(({ label, value, accent, color: c, highlight }) => (
                <div key={label}>
                  <p className="text-xs text-muted-foreground mb-1">{label}</p>
                  <p className="font-bold text-sm font-mono" style={{ color: accent ? c : highlight ? '#f5a623' : 'white' }}>{value}</p>
                </div>
              ))}
            </div>

            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Погашено</span>
                <span className="text-white font-medium">{pct}% ({paid.toLocaleString()} ₽)</span>
              </div>
              <div className="progress-bar h-2">
                <div className="progress-fill h-2" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}aa)` }} />
              </div>
            </div>

            <div className="flex gap-2 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
                style={{ background: `${color}18`, color, border: `1px solid ${color}35` }}>
                <Icon name="CreditCard" size={14} />
                Внести платёж
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
                style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Icon name="FileText" size={14} />
                График платежей
              </button>
            </div>
          </div>
        );
      })}

      {/* Closed loans */}
      {closed.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Закрытые кредиты</p>
          {closed.map(loan => (
            <div key={loan.id} className="rounded-xl p-4 flex items-center gap-4 opacity-60"
              style={{ background: 'var(--bank-surface)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.1)' }}>
                <Icon name="CheckCircle" size={16} style={{ color: '#22c55e' }} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-white">{LOAN_LABELS[loan.type]} · {loan.amount.toLocaleString()} ₽</p>
                <p className="text-xs text-muted-foreground">Погашен · {loan.rate}% · {loan.term} мес.</p>
              </div>
              <span className="chip" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.25)' }}>Закрыт</span>
            </div>
          ))}
        </div>
      )}

      {/* New credit offers */}
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Предложения по кредитам</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CREDIT_OFFERS.map(offer => (
            <div key={offer.type} className="rounded-2xl p-5 relative overflow-hidden transition-all hover:scale-[1.01]"
              style={{ background: 'var(--bank-surface)', border: `1px solid ${offer.color}25` }}>
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-15"
                style={{ background: offer.color, transform: 'translate(30%, -30%)' }} />
              <div className="relative z-10">
                <p className="text-xs text-muted-foreground mb-3">{offer.label}</p>
                <p className="text-3xl font-bold mb-1" style={{ color: offer.color, fontFamily: 'IBM Plex Mono, monospace' }}>{offer.rate}</p>
                <p className="text-xs text-white mb-0.5">{offer.amount}</p>
                <p className="text-xs text-muted-foreground mb-4">{offer.term}</p>
                <button className="w-full py-2 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                  style={{ background: `${offer.color}18`, color: offer.color, border: `1px solid ${offer.color}35` }}>
                  Подать заявку
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
