import { useState } from 'react';
import { User, Account, Card, Transaction, Loan, ClientTab } from '@/types/bank';
import Icon from '@/components/ui/icon';
import Dashboard from './client/Dashboard';
import AccountsTab from './client/AccountsTab';
import CardsTab from './client/CardsTab';
import TransfersTab from './client/TransfersTab';
import PaymentsTab from './client/PaymentsTab';
import HistoryTab from './client/HistoryTab';
import CreditsTab from './client/CreditsTab';

interface Props {
  user: User;
  accounts: Account[];
  cards: Card[];
  transactions: Transaction[];
  loans: Loan[];
  totalBalance: number;
  onTransfer: (from: string, to: string, amount: number, desc: string) => void;
  onToggleCard: (id: string) => void;
  onLogout: () => void;
}

const NAV: { id: ClientTab; label: string; icon: Parameters<typeof Icon>[0]['name'] }[] = [
  { id: 'dashboard', label: 'Главная', icon: 'LayoutDashboard' },
  { id: 'accounts', label: 'Счета', icon: 'Wallet' },
  { id: 'cards', label: 'Карты', icon: 'CreditCard' },
  { id: 'transfers', label: 'Переводы', icon: 'ArrowLeftRight' },
  { id: 'payments', label: 'Платежи', icon: 'Receipt' },
  { id: 'history', label: 'История', icon: 'History' },
  { id: 'credits', label: 'Кредиты', icon: 'Landmark' },
];

export default function ClientDashboard({ user, accounts, cards, transactions, loans, totalBalance, onTransfer, onToggleCard, onLogout }: Props) {
  const [tab, setTab] = useState<ClientTab>('dashboard');
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bank-bg min-h-screen flex" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 flex flex-col"
        style={{ background: 'rgba(10,14,26,0.95)', borderRight: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)' }}>
        {/* Logo */}
        <div className="px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #1a6fff, #0d4db5)' }}>
              <Icon name="Building2" size={18} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-white text-sm" style={{ fontFamily: 'Oswald, sans-serif' }}>СБОЛ.про</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Личный кабинет</p>
            </div>
          </div>
        </div>

        {/* User info */}
        <div className="px-4 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #1a6fff88, #1a6fff)' }}>
              {user.name.split(' ').map(p => p[0]).slice(0, 2).join('')}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-medium truncate">{user.name.split(' ').slice(0, 2).join(' ')}</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Клиент</p>
            </div>
          </div>
        </div>

        {/* Balance widget */}
        <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Общий баланс</p>
          <p className="text-white font-bold text-lg" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
            {totalBalance.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ₽
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {NAV.map(({ id, label, icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === id ? 'nav-active-bank' : ''}`}
              style={{ color: tab === id ? '#4d93ff' : 'rgba(255,255,255,0.45)' }}>
              <Icon name={icon} size={17} />
              {label}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 space-y-1" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all hover:opacity-80"
            style={{ color: 'rgba(255,255,255,0.35)' }}>
            <Icon name="Settings" size={16} />
            Настройки
          </button>
          <button onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all hover:opacity-80"
            style={{ color: 'rgba(239,68,68,0.7)' }}>
            <Icon name="LogOut" size={16} />
            Выйти
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 px-6 py-4 flex items-center justify-between"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(10,14,26,0.6)', backdropFilter: 'blur(12px)' }}>
          <div>
            <h1 className="font-bold text-white text-base" style={{ fontFamily: 'Oswald, sans-serif' }}>
              {NAV.find(n => n.id === tab)?.label.toUpperCase()}
            </h1>
            <p className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl transition-all hover:opacity-80"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Icon name="Bell" size={16} style={{ color: 'rgba(255,255,255,0.5)' }} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
            </button>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ background: 'linear-gradient(135deg, #1a6fff88, #1a6fff)' }}>
                {user.name[0]}
              </div>
              <span className="text-sm text-white">{user.name.split(' ')[1]}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {tab === 'dashboard' && <Dashboard name={user.name} totalBalance={totalBalance} accounts={accounts} cards={cards} transactions={transactions} loans={loans} onTabChange={id => setTab(id as ClientTab)} />}
          {tab === 'accounts' && <AccountsTab accounts={accounts} />}
          {tab === 'cards' && <CardsTab cards={cards} accounts={accounts} onToggle={onToggleCard} />}
          {tab === 'transfers' && <TransfersTab accounts={accounts} onTransfer={onTransfer} />}
          {tab === 'payments' && <PaymentsTab accounts={accounts} />}
          {tab === 'history' && <HistoryTab transactions={transactions} />}
          {tab === 'credits' && <CreditsTab loans={loans} />}
        </main>
      </div>
    </div>
  );
}
