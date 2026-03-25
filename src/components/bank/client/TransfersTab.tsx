import { useState } from 'react';
import { Account } from '@/types/bank';
import Icon from '@/components/ui/icon';

interface Props { accounts: Account[]; onTransfer: (from: string, to: string, amount: number, desc: string) => void; }

const QUICK_CONTACTS = [
  { name: 'Мария И.', phone: '+7 916 555-44-33', initials: 'МИ', color: '#a855f7' },
  { name: 'Папа', phone: '+7 903 111-22-33', initials: 'ПА', color: '#1a6fff' },
  { name: 'Иван К.', phone: '+7 926 777-88-99', initials: 'ИК', color: '#22c55e' },
  { name: 'Офис ООО', phone: '+7 495 333-44-55', initials: 'ОО', color: '#f5a623' },
];

export default function TransfersTab({ accounts, onTransfer }: Props) {
  const [from, setFrom] = useState(accounts[0]?.id || '');
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');
  const [step, setStep] = useState<'form' | 'confirm' | 'done'>('form');

  const fromAcc = accounts.find(a => a.id === from);
  const amountNum = parseFloat(amount.replace(/\s/g, '').replace(',', '.')) || 0;
  const isValid = from && to && amountNum > 0 && fromAcc && amountNum <= fromAcc.balance;

  const handleConfirm = () => {
    onTransfer(from, to, amountNum, desc || 'Перевод');
    setStep('done');
  };

  const reset = () => { setTo(''); setAmount(''); setDesc(''); setStep('form'); };

  return (
    <div className="space-y-5 animate-fade-in max-w-2xl">
      {step === 'done' ? (
        <div className="rounded-2xl p-10 text-center animate-scale-in"
          style={{ background: 'var(--bank-surface)', border: '1px solid rgba(34,197,94,0.3)' }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-ring"
            style={{ background: 'rgba(34,197,94,0.15)' }}>
            <Icon name="CheckCircle2" size={32} style={{ color: '#22c55e' }} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>ПЕРЕВОД ВЫПОЛНЕН</h3>
          <p className="text-muted-foreground text-sm mb-1">Сумма: <span className="text-white font-bold">{amountNum.toLocaleString()} ₽</span></p>
          <p className="text-muted-foreground text-sm mb-6">Получатель: <span className="text-white">{to}</span></p>
          <button onClick={reset} className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-80"
            style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}>
            Новый перевод
          </button>
        </div>
      ) : step === 'confirm' ? (
        <div className="rounded-2xl p-6 animate-scale-in"
          style={{ background: 'var(--bank-surface)', border: '1px solid rgba(245,166,35,0.3)' }}>
          <div className="flex items-center gap-2 mb-5">
            <Icon name="AlertTriangle" size={18} style={{ color: '#f5a623' }} />
            <h3 className="font-bold text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>ПОДТВЕРЖДЕНИЕ ПЕРЕВОДА</h3>
          </div>
          <div className="space-y-3 mb-6">
            {[
              { label: 'Со счёта', value: fromAcc?.name || '' },
              { label: 'Получатель', value: to },
              { label: 'Сумма', value: `${amountNum.toLocaleString()} ₽`, accent: true },
              { label: 'Назначение', value: desc || 'Перевод' },
              { label: 'Комиссия', value: '0 ₽' },
            ].map(({ label, value, accent }) => (
              <div key={label} className="flex justify-between py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="text-muted-foreground text-sm">{label}</span>
                <span className={`text-sm font-medium ${accent ? 'text-xl font-bold' : 'text-white'}`}
                  style={accent ? { color: '#f5a623', fontFamily: 'IBM Plex Mono, monospace' } : {}}>
                  {value}
                </span>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep('form')} className="flex-1 py-3 rounded-xl text-sm font-medium border transition-all hover:opacity-80"
              style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)' }}>
              Назад
            </button>
            <button onClick={handleConfirm} className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #1a6fff, #0d4db5)' }}>
              Подтвердить перевод
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Quick contacts */}
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Недавние получатели</p>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {QUICK_CONTACTS.map(c => (
                <button key={c.name} onClick={() => setTo(c.phone)}
                  className="flex flex-col items-center gap-1.5 min-w-[60px] transition-all hover:opacity-80">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ background: `linear-gradient(135deg, ${c.color}88, ${c.color})` }}>
                    {c.initials}
                  </div>
                  <p className="text-xs text-muted-foreground whitespace-nowrap">{c.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="rounded-2xl p-6 space-y-4" style={{ background: 'var(--bank-surface)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">Со счёта</label>
              <select value={from} onChange={e => setFrom(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm text-white transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                {accounts.map(a => (
                  <option key={a.id} value={a.id} style={{ background: '#111827' }}>
                    {a.name} · {a.balance.toLocaleString()} {a.currency === 'RUB' ? '₽' : a.currency}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">Номер карты / телефон / счёт</label>
              <input value={to} onChange={e => setTo(e.target.value)}
                placeholder="+7 999 000-00-00 или 2200 0000 0000 0000"
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-muted-foreground transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} />
            </div>

            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">Сумма (₽)</label>
              <input value={amount} onChange={e => setAmount(e.target.value)}
                placeholder="0.00" type="number" min="1"
                className="w-full px-4 py-3 rounded-xl text-2xl font-bold text-white placeholder-muted-foreground transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'IBM Plex Mono, monospace' }} />
              {fromAcc && (
                <p className="text-xs text-muted-foreground mt-1">
                  Доступно: {fromAcc.balance.toLocaleString()} ₽
                  <button onClick={() => setAmount(String(fromAcc.balance))} className="ml-2 underline" style={{ color: '#1a6fff' }}>Всё</button>
                </p>
              )}
            </div>

            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">Назначение (необязательно)</label>
              <input value={desc} onChange={e => setDesc(e.target.value)}
                placeholder="За что перевод..."
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-muted-foreground transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} />
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[1000, 5000, 10000, 50000].map(n => (
                <button key={n} onClick={() => setAmount(String(n))}
                  className="py-2 rounded-xl text-sm transition-all hover:opacity-80"
                  style={{ background: 'rgba(26,111,255,0.1)', color: '#4d93ff', border: '1px solid rgba(26,111,255,0.2)' }}>
                  {n.toLocaleString()}
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep('confirm')}
              disabled={!isValid}
              className="w-full py-3.5 rounded-xl font-bold text-white text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: isValid ? 'linear-gradient(135deg, #1a6fff, #0d4db5)' : 'rgba(255,255,255,0.08)' }}>
              <Icon name="ArrowUpRight" size={16} />
              Перевести {amountNum > 0 ? `${amountNum.toLocaleString()} ₽` : ''}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
