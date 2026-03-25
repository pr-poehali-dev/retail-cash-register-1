import { useBank } from '@/hooks/useBank';
import LoginPage from '@/components/bank/LoginPage';
import ClientDashboard from '@/components/bank/ClientDashboard';
import OperatorPanel from '@/components/bank/OperatorPanel';

export default function Index() {
  const bank = useBank();

  if (!bank.currentUser) {
    return <LoginPage onLogin={(l, p) => { const u = bank.login(l, p); return !!u; }} />;
  }

  if (bank.currentUser.role === 'client') {
    return (
      <ClientDashboard
        user={bank.currentUser}
        accounts={bank.accounts}
        cards={bank.cards}
        transactions={bank.transactions}
        loans={bank.loans}
        totalBalance={bank.totalBalance}
        onTransfer={bank.transfer}
        onToggleCard={bank.toggleCardStatus}
        onLogout={bank.logout}
      />
    );
  }

  return (
    <OperatorPanel
      user={bank.currentUser}
      clients={bank.clients}
      onLogout={bank.logout}
    />
  );
}
