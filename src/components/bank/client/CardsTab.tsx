import { Card, Account } from '@/types/bank';
import Icon from '@/components/ui/icon';

interface Props { cards: Card[]; accounts: Account[]; onToggle: (id: string) => void; }

const DESIGN_CLASS: Record<string, string> = { blue: 'card-blue', gold: 'card-gold', dark: 'card-dark', green: 'card-green' };

export default function CardsTab({ cards, accounts, onToggle }: Props) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {cards.map(card => {
          const acc = accounts.find(a => a.id === card.accountId);
          return (
            <div key={card.id} className="space-y-3">
              {/* Card visual */}
              <div className={`relative rounded-2xl p-5 overflow-hidden bank-card-shine ${DESIGN_CLASS[card.design]}`}
                style={{ border: '1px solid rgba(255,255,255,0.1)', aspectRatio: '1.586' }}>
                {card.status === 'frozen' && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20 rounded-2xl">
                    <div className="text-center">
                      <Icon name="Snowflake" size={28} className="text-blue-400 mx-auto mb-1" />
                      <p className="text-blue-300 text-sm font-medium">Карта заморожена</p>
                    </div>
                  </div>
                )}
                <div className="relative z-10 flex flex-col justify-between h-full">
                  <div className="flex justify-between items-start">
                    <Icon name="Building2" size={20} className="text-white opacity-70" />
                    <div className="text-right">
                      <p className="text-white text-xs opacity-60 uppercase tracking-wider">{card.type}</p>
                      {card.type === 'visa' && <div className="text-white font-bold text-sm italic">VISA</div>}
                      {card.type === 'mastercard' && <div className="text-white font-bold text-xs">MasterCard</div>}
                      {card.type === 'mir' && <div className="text-white font-bold text-sm">МИР</div>}
                    </div>
                  </div>
                  <div>
                    <p className="text-white font-mono tracking-widest text-lg mb-2">{card.number}</p>
                    <div className="flex justify-between">
                      <div>
                        <p className="text-white opacity-50 text-xs mb-0.5">Держатель</p>
                        <p className="text-white text-sm font-medium tracking-wide">{card.holder}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white opacity-50 text-xs mb-0.5">Срок</p>
                        <p className="text-white text-sm font-medium">{card.expiry}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card info */}
              <div className="rounded-xl p-4 space-y-2" style={{ background: 'var(--bank-surface)', border: '1px solid rgba(255,255,255,0.07)' }}>
                {acc && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Баланс</span>
                    <span className="text-white font-semibold font-mono">
                      {acc.balance.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ₽
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Привязан к</span>
                  <span className="text-white text-xs font-mono">{acc?.name || '—'}</span>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span className="text-muted-foreground">Статус</span>
                  <span className={`chip ${card.status === 'active' ? 'status-active' : card.status === 'frozen' ? 'status-frozen' : 'status-blocked'}`}>
                    {card.status === 'active' ? 'Активна' : card.status === 'frozen' ? 'Заморожена' : 'Заблокирована'}
                  </span>
                </div>
                <div className="flex gap-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <button
                    onClick={() => onToggle(card.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                    style={{
                      background: card.status === 'active' ? 'rgba(59,130,246,0.12)' : 'rgba(34,197,94,0.12)',
                      color: card.status === 'active' ? '#60a5fa' : '#22c55e',
                      border: `1px solid ${card.status === 'active' ? 'rgba(59,130,246,0.3)' : 'rgba(34,197,94,0.3)'}`,
                    }}>
                    <Icon name={card.status === 'active' ? 'Snowflake' : 'Play'} size={12} />
                    {card.status === 'active' ? 'Заморозить' : 'Разморозить'}
                  </button>
                  <button className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                    style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' }}>
                    <Icon name="X" size={12} />
                    Блок
                  </button>
                  <button className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                    style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <Icon name="MoreHorizontal" size={12} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Add card */}
        <button className="rounded-2xl flex flex-col items-center justify-center gap-3 transition-all hover:opacity-80 hover:scale-[1.01] active:scale-[0.99]"
          style={{ border: '2px dashed rgba(255,255,255,0.12)', minHeight: 180, background: 'rgba(255,255,255,0.02)' }}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(26,111,255,0.12)' }}>
            <Icon name="Plus" size={22} style={{ color: '#1a6fff' }} />
          </div>
          <div className="text-center">
            <p className="text-white text-sm font-medium">Заказать карту</p>
            <p className="text-muted-foreground text-xs mt-0.5">Виртуальная или физическая</p>
          </div>
        </button>
      </div>
    </div>
  );
}
