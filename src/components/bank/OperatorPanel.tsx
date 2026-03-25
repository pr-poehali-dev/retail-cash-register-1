import { useState } from 'react';
import { User, Client, OperatorTab } from '@/types/bank';
import Icon from '@/components/ui/icon';

interface Props { user: User; clients: Client[]; onLogout: () => void; }

const NAV: { id: OperatorTab; label: string; icon: Parameters<typeof Icon>[0]['name'] }[] = [
  { id: 'clients', label: 'Клиенты', icon: 'Users' },
  { id: 'accounts', label: 'Счета', icon: 'Wallet' },
  { id: 'loans', label: 'Кредиты', icon: 'Landmark' },
  { id: 'operations', label: 'Операции', icon: 'ArrowLeftRight' },
  { id: 'reports', label: 'Отчёты', icon: 'BarChart3' },
];

const STATUS_STYLE: Record<string, string> = { active: 'status-active', blocked: 'status-blocked', vip: 'status-pending' };
const STATUS_LABEL: Record<string, string> = { active: 'Активен', blocked: 'Заблокирован', vip: 'VIP' };

export default function OperatorPanel({ user, clients, onLogout }: Props) {
  const [tab, setTab] = useState<OperatorTab>('clients');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Client | null>(null);

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.inn.includes(search)
  );

  return (
    <div className="bank-bg min-h-screen flex" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 flex flex-col"
        style={{ background: 'rgba(8,10,20,0.97)', borderRight: '1px solid rgba(245,166,35,0.12)' }}>
        <div className="px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #b45309, #f5a623)' }}>
              <Icon name="Headphones" size={17} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-white text-sm" style={{ fontFamily: 'Oswald, sans-serif' }}>СБОЛ.про</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Рабочее место</p>
            </div>
          </div>
        </div>

        <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="p-3 rounded-xl" style={{ background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.15)' }}>
            <p className="text-white text-xs font-medium truncate">{user.name.split(' ').slice(0, 2).join(' ')}</p>
            <p className="text-xs mt-0.5" style={{ color: '#f5a623' }}>{user.position}</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{user.branch}</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-3 space-y-0.5">
          {NAV.map(({ id, label, icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: tab === id ? 'rgba(245,166,35,0.1)' : 'transparent',
                borderLeft: tab === id ? '2px solid #f5a623' : '2px solid transparent',
                color: tab === id ? '#f5a623' : 'rgba(255,255,255,0.4)',
              }}>
              <Icon name={icon} size={16} />
              {label}
            </button>
          ))}
        </nav>

        <div className="px-3 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all hover:opacity-80"
            style={{ color: 'rgba(239,68,68,0.6)' }}>
            <Icon name="LogOut" size={15} />
            Выйти
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex-shrink-0 px-6 py-4 flex items-center justify-between"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(8,10,20,0.7)' }}>
          <div>
            <h1 className="font-bold text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>
              {NAV.find(n => n.id === tab)?.label.toUpperCase()} — РАБОЧЕЕ МЕСТО
            </h1>
            <p className="text-xs text-muted-foreground">
              АС РФС · {new Date().toLocaleString('ru-RU')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl text-xs font-medium"
              style={{ background: 'rgba(245,166,35,0.1)', color: '#f5a623', border: '1px solid rgba(245,166,35,0.25)' }}>
              <Icon name="Circle" size={8} className="inline mr-1.5" style={{ fill: '#f5a623' }} />
              Онлайн
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden flex">
          {/* Clients list */}
          {tab === 'clients' && (
            <div className="flex-1 flex overflow-hidden">
              <div className={`flex flex-col ${selected ? 'w-96' : 'flex-1'} border-r overflow-hidden`}
                style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="p-4 space-y-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="relative">
                    <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input value={search} onChange={e => setSearch(e.target.value)}
                      placeholder="Поиск по ФИО, телефону, ИНН..."
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl text-sm text-white"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Клиентов: {filtered.length}</span>
                    <button className="flex items-center gap-1 text-xs transition-all hover:opacity-80" style={{ color: '#f5a623' }}>
                      <Icon name="UserPlus" size={12} />Новый клиент
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {filtered.map(c => (
                    <button key={c.id} onClick={() => setSelected(selected?.id === c.id ? null : c)}
                      className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all table-row-hover border-b"
                      style={{
                        borderColor: 'rgba(255,255,255,0.04)',
                        background: selected?.id === c.id ? 'rgba(245,166,35,0.06)' : 'transparent',
                      }}>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{
                          background: c.status === 'vip'
                            ? 'linear-gradient(135deg, #b45309, #f5a623)'
                            : c.status === 'blocked'
                              ? 'linear-gradient(135deg, #7f1d1d, #ef4444)'
                              : 'linear-gradient(135deg, #1e3a5f, #1a6fff)',
                        }}>
                        {c.name.split(' ').map(p => p[0]).slice(0, 2).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate font-medium">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.phone}</p>
                      </div>
                      <span className={`chip ${STATUS_STYLE[c.status]}`}>{STATUS_LABEL[c.status]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Client detail */}
              {selected && (
                <div className="flex-1 overflow-y-auto p-6 animate-slide-right space-y-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg"
                        style={{
                          background: selected.status === 'vip'
                            ? 'linear-gradient(135deg, #b45309, #f5a623)'
                            : 'linear-gradient(135deg, #1e3a5f, #1a6fff)',
                        }}>
                        {selected.name.split(' ').map(p => p[0]).slice(0, 2).join('')}
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-white">{selected.name}</h2>
                        <p className="text-sm text-muted-foreground">Клиент с {new Date(selected.since).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-white p-1">
                      <Icon name="X" size={18} />
                    </button>
                  </div>

                  {/* Personal info */}
                  <div className="rounded-2xl p-5" style={{ background: 'var(--bank-surface)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Личные данные</p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'ИНН', value: selected.inn },
                        { label: 'Паспорт', value: selected.passport },
                        { label: 'Телефон', value: selected.phone },
                        { label: 'Email', value: selected.email },
                        { label: 'Адрес', value: selected.address },
                        { label: 'Статус', value: STATUS_LABEL[selected.status] },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                          <p className="text-sm text-white">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Accounts */}
                  <div className="rounded-2xl p-5" style={{ background: 'var(--bank-surface)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Счета ({selected.accounts.length})</p>
                      <button className="text-xs" style={{ color: '#f5a623' }}>+ Открыть счёт</button>
                    </div>
                    {selected.accounts.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Нет счетов</p>
                    ) : selected.accounts.map(acc => (
                      <div key={acc.id} className="flex justify-between items-center py-2.5 border-b last:border-0"
                        style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                        <div>
                          <p className="text-sm text-white">{acc.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{acc.number.slice(-8)}</p>
                        </div>
                        <p className="font-semibold text-white font-mono text-sm">
                          {acc.balance.toLocaleString()} {acc.currency === 'RUB' ? '₽' : acc.currency}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Loans */}
                  {selected.loans.length > 0 && (
                    <div className="rounded-2xl p-5" style={{ background: 'var(--bank-surface)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Кредиты ({selected.loans.length})</p>
                      {selected.loans.map(loan => (
                        <div key={loan.id} className="flex justify-between items-center py-2.5 border-b last:border-0"
                          style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                          <div>
                            <p className="text-sm text-white">
                              {loan.type === 'mortgage' ? 'Ипотека' : loan.type === 'consumer' ? 'Потребительский' : 'Авто'}
                            </p>
                            <p className="text-xs text-muted-foreground">{loan.rate}% · {loan.term} мес.</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-white font-mono">{loan.remaining.toLocaleString()} ₽</p>
                            <span className={`chip ${loan.status === 'active' ? 'status-active' : loan.status === 'closed' ? '' : 'status-blocked'}`}
                              style={loan.status === 'closed' ? { background: 'rgba(107,114,128,0.2)', color: '#6b7280', border: '1px solid rgba(107,114,128,0.3)' } : {}}>
                              {loan.status === 'active' ? 'Активен' : loan.status === 'closed' ? 'Закрыт' : 'Просрочен'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { icon: 'FilePlus', label: 'Открыть счёт', color: '#1a6fff' },
                      { icon: 'CreditCard', label: 'Выпустить карту', color: '#22c55e' },
                      { icon: 'Landmark', label: 'Кредит', color: '#f5a623' },
                      { icon: selected.status === 'blocked' ? 'Unlock' : 'Lock', label: selected.status === 'blocked' ? 'Разблокировать' : 'Заблокировать', color: '#ef4444' },
                    ].map(({ icon, label, color }) => (
                      <button key={label}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all hover:opacity-80"
                        style={{ background: `${color}12`, color, border: `1px solid ${color}30` }}>
                        <Icon name={icon as Parameters<typeof Icon>[0]['name']} size={13} />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Other tabs placeholder */}
          {tab !== 'clients' && (
            <div className="flex-1 flex items-center justify-center p-10">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.2)' }}>
                  <Icon name={NAV.find(n => n.id === tab)?.icon || 'Settings'} size={28} style={{ color: '#f5a623' }} />
                </div>
                <h3 className="text-white font-bold text-lg mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>
                  {NAV.find(n => n.id === tab)?.label.toUpperCase()}
                </h3>
                <p className="text-muted-foreground text-sm">Раздел находится в разработке</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
