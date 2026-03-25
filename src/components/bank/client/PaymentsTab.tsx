import { useState } from 'react';
import { Account } from '@/types/bank';
import Icon from '@/components/ui/icon';

interface Props { accounts: Account[]; }

const PAYMENT_CATEGORIES = [
  { id: 'telecom', label: 'Связь и интернет', color: '#1a6fff', items: [
    { name: 'МТС', icon: 'Phone' }, { name: 'Билайн', icon: 'Phone' }, { name: 'МегаФон', icon: 'Phone' },
    { name: 'Ростелеком', icon: 'Wifi' }, { name: 'Дом.ру', icon: 'Wifi' },
  ]},
  { id: 'utilities', label: 'ЖКХ', color: '#22c55e', items: [
    { name: 'МосЭнерго', icon: 'Zap' }, { name: 'Газпром', icon: 'Flame' }, { name: 'Водоканал', icon: 'Droplets' },
    { name: 'Квартплата', icon: 'Home' },
  ]},
  { id: 'gov', label: 'Госуслуги', color: '#a855f7', items: [
    { name: 'ФНС Налоги', icon: 'Landmark' }, { name: 'ГИБДД Штрафы', icon: 'Car' }, { name: 'Пенсионный фонд', icon: 'UserCheck' },
  ]},
  { id: 'subscriptions', label: 'Подписки', color: '#f5a623', items: [
    { name: 'Яндекс Плюс', icon: 'Play' }, { name: 'VK Музыка', icon: 'Music' }, { name: 'Okko', icon: 'Tv' },
  ]},
];

export default function PaymentsTab({ accounts }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [fromAcc, setFromAcc] = useState(accounts[0]?.id || '');
  const [done, setDone] = useState(false);

  const handlePay = () => {
    if (!selected || !amount) return;
    setDone(true);
    setTimeout(() => { setDone(false); setSelected(null); setAmount(''); setPhone(''); }, 3000);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {done && (
        <div className="rounded-xl p-4 flex items-center gap-3 animate-scale-in"
          style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
          <Icon name="CheckCircle2" size={18} style={{ color: '#22c55e' }} />
          <div>
            <p className="text-sm font-medium text-white">Платёж выполнен успешно</p>
            <p className="text-xs text-muted-foreground">Средства поступят в течение 1-2 минут</p>
          </div>
        </div>
      )}

      {PAYMENT_CATEGORIES.map(cat => (
        <div key={cat.id}>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: cat.color }} />
            {cat.label}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {cat.items.map(item => (
              <button key={item.name}
                onClick={() => setSelected(selected === item.name ? null : item.name)}
                className="flex flex-col items-center gap-2 p-3 rounded-xl text-center transition-all hover:scale-[1.02] active:scale-[0.99]"
                style={{
                  background: selected === item.name ? `${cat.color}18` : 'var(--bank-surface)',
                  border: `1px solid ${selected === item.name ? `${cat.color}50` : 'rgba(255,255,255,0.07)'}`,
                }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${cat.color}15` }}>
                  <Icon name={item.icon as Parameters<typeof Icon>[0]['name']} size={18} style={{ color: cat.color }} />
                </div>
                <p className="text-xs text-muted-foreground leading-tight">{item.name}</p>
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Payment form */}
      {selected && (
        <div className="rounded-2xl p-5 space-y-4 animate-scale-in"
          style={{ background: 'var(--bank-surface2)', border: '1px solid rgba(26,111,255,0.25)' }}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">Оплата: {selected}</h3>
            <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-white">
              <Icon name="X" size={16} />
            </button>
          </div>

          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">Номер лицевого счёта / телефон</label>
            <input value={phone} onChange={e => setPhone(e.target.value)}
              placeholder="+7 999 000-00-00 или 12345678"
              className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-muted-foreground"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">Списать со счёта</label>
              <select value={fromAcc} onChange={e => setFromAcc(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm text-white"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                {accounts.map(a => <option key={a.id} value={a.id} style={{ background: '#111827' }}>{a.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">Сумма (₽)</label>
              <input value={amount} onChange={e => setAmount(e.target.value)} type="number" min="1"
                placeholder="0.00"
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-muted-foreground font-mono font-bold"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} />
            </div>
          </div>
          <div className="flex gap-2">
            {[100, 300, 500, 1000].map(n => (
              <button key={n} onClick={() => setAmount(String(n))}
                className="px-3 py-1.5 rounded-lg text-xs transition-all hover:opacity-80"
                style={{ background: 'rgba(26,111,255,0.1)', color: '#4d93ff', border: '1px solid rgba(26,111,255,0.2)' }}>
                {n}
              </button>
            ))}
          </div>
          <button onClick={handlePay} disabled={!amount || !phone}
            className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #1a6fff, #0d4db5)' }}>
            <Icon name="Zap" size={15} />
            Оплатить {amount ? `${Number(amount).toLocaleString()} ₽` : ''}
          </button>
        </div>
      )}
    </div>
  );
}
