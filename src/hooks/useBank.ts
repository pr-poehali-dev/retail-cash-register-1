import { useState, useCallback } from 'react';
import { User, Account, Card, Transaction, Loan, Client } from '@/types/bank';

const USERS: User[] = [
  { id: 'u1', role: 'client', name: 'Иванов Алексей Петрович', login: 'ivanov', phone: '+7 999 123-45-67', email: 'ivanov@mail.ru', inn: '771234567890' },
  { id: 'u2', role: 'operator', name: 'Смирнова Анна Викторовна', login: 'operator', phone: '+7 495 000-00-01', email: 'smirnova@sbol.ru', branch: 'Москва, Центральный', position: 'Старший операционист' },
  { id: 'u3', role: 'admin', name: 'Петров Сергей Иванович', login: 'admin', phone: '+7 495 000-00-00', email: 'petrov@sbol.ru', branch: 'Головной офис', position: 'Администратор АС' },
];

const ACCOUNTS: Account[] = [
  { id: 'a1', ownerId: 'u1', number: '40817810000000001234', type: 'current', currency: 'RUB', balance: 284_750.50, openDate: '2021-03-15', status: 'active', name: 'Текущий счёт' },
  { id: 'a2', ownerId: 'u1', number: '40817810000000005678', type: 'savings', currency: 'RUB', balance: 1_250_000, openDate: '2022-08-01', status: 'active', interestRate: 12.5, name: 'Накопительный' },
  { id: 'a3', ownerId: 'u1', number: '40817840000000009012', type: 'deposit', currency: 'USD', balance: 5_200, openDate: '2023-01-10', status: 'active', interestRate: 4.2, name: 'Вклад в USD' },
];

const CARDS: Card[] = [
  { id: 'c1', accountId: 'a1', number: '4276 **** **** 7821', holder: 'ALEXEY IVANOV', expiry: '09/27', type: 'visa', status: 'active', design: 'blue' },
  { id: 'c2', accountId: 'a2', number: '5469 **** **** 3307', holder: 'ALEXEY IVANOV', expiry: '11/26', type: 'mastercard', status: 'active', design: 'gold' },
  { id: 'c3', accountId: 'a1', number: '2200 **** **** 0941', holder: 'ALEXEY IVANOV', expiry: '03/28', type: 'mir', status: 'frozen', design: 'dark' },
];

const TRANSACTIONS: Transaction[] = [
  { id: 't1', accountId: 'a1', date: '2026-03-25T10:30:00', type: 'debit', amount: -3_200, currency: 'RUB', description: 'Оплата ЖКХ', counterparty: 'МосЭнерго', status: 'completed', category: 'ЖКХ' },
  { id: 't2', accountId: 'a1', date: '2026-03-24T18:45:00', type: 'credit', amount: 95_000, currency: 'RUB', description: 'Заработная плата', counterparty: 'ООО "Технологии"', status: 'completed', category: 'Зарплата' },
  { id: 't3', accountId: 'a1', date: '2026-03-24T12:10:00', type: 'debit', amount: -8_540, currency: 'RUB', description: 'Покупка в супермаркете', counterparty: 'Перекрёсток', status: 'completed', category: 'Продукты' },
  { id: 't4', accountId: 'a1', date: '2026-03-23T09:00:00', type: 'transfer', amount: -25_000, currency: 'RUB', description: 'Перевод Марии И.', counterparty: '+7 916 555-44-33', status: 'completed', category: 'Переводы' },
  { id: 't5', accountId: 'a1', date: '2026-03-22T20:15:00', type: 'debit', amount: -1_299, currency: 'RUB', description: 'Spotify Premium', counterparty: 'Spotify', status: 'completed', category: 'Подписки' },
  { id: 't6', accountId: 'a1', date: '2026-03-21T14:30:00', type: 'debit', amount: -45_000, currency: 'RUB', description: 'Погашение кредита', counterparty: 'СБОЛ.про', status: 'completed', category: 'Кредит' },
  { id: 't7', accountId: 'a1', date: '2026-03-20T11:00:00', type: 'credit', amount: 12_500, currency: 'RUB', description: 'Возврат от ФНС', counterparty: 'ФНС России', status: 'completed', category: 'Прочее' },
  { id: 't8', accountId: 'a1', date: '2026-03-19T16:20:00', type: 'debit', amount: -5_400, currency: 'RUB', description: 'Ресторан', counterparty: 'Кафе Пушкин', status: 'completed', category: 'Питание' },
];

const LOANS: Loan[] = [
  { id: 'l1', clientId: 'u1', type: 'mortgage', amount: 5_500_000, remaining: 4_820_000, rate: 8.5, term: 240, monthlyPayment: 47_320, nextPayment: '2026-04-01', status: 'active', openDate: '2022-04-01' },
  { id: 'l2', clientId: 'u1', type: 'consumer', amount: 300_000, remaining: 0, rate: 14.9, term: 36, monthlyPayment: 10_400, nextPayment: '', status: 'closed', openDate: '2023-01-15' },
];

const CLIENTS: Client[] = [
  { id: 'cl1', name: 'Иванов Алексей Петрович', phone: '+7 999 123-45-67', email: 'ivanov@mail.ru', inn: '771234567890', passport: '4500 123456', address: 'г. Москва, ул. Ленина, д. 15, кв. 42', status: 'active', since: '2021-03-15', accounts: ACCOUNTS, cards: CARDS, loans: LOANS },
  { id: 'cl2', name: 'Сидорова Елена Михайловна', phone: '+7 916 234-56-78', email: 'sidorova@gmail.com', inn: '771234567891', passport: '4501 234567', address: 'г. Москва, ул. Тверская, д. 8', status: 'vip', since: '2019-06-20', accounts: [], cards: [], loans: [] },
  { id: 'cl3', name: 'Козлов Дмитрий Александрович', phone: '+7 903 345-67-89', email: 'kozlov@yandex.ru', inn: '771234567892', passport: '4502 345678', address: 'г. Москва, пр. Мира, д. 100', status: 'active', since: '2020-11-05', accounts: [], cards: [], loans: [] },
  { id: 'cl4', name: 'Новикова Ольга Сергеевна', phone: '+7 926 456-78-90', email: 'novikova@mail.ru', inn: '771234567893', passport: '4503 456789', address: 'г. Москва, ул. Арбат, д. 22', status: 'blocked', since: '2022-02-14', accounts: [], cards: [], loans: [] },
];

export function useBank() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<Account[]>(ACCOUNTS);
  const [cards, setCards] = useState<Card[]>(CARDS);
  const [transactions, setTransactions] = useState<Transaction[]>(TRANSACTIONS);
  const [loans] = useState<Loan[]>(LOANS);
  const [clients] = useState<Client[]>(CLIENTS);

  const login = useCallback((loginStr: string, _pass: string): User | null => {
    const user = USERS.find(u => u.login === loginStr);
    if (user) { setCurrentUser(user); return user; }
    return null;
  }, []);

  const logout = useCallback(() => setCurrentUser(null), []);

  const transfer = useCallback((fromId: string, toNumber: string, amount: number, desc: string) => {
    setAccounts(prev => prev.map(a => a.id === fromId ? { ...a, balance: a.balance - amount } : a));
    const tx: Transaction = {
      id: Date.now().toString(),
      accountId: fromId,
      date: new Date().toISOString(),
      type: 'transfer',
      amount: -amount,
      currency: 'RUB',
      description: desc || 'Перевод',
      counterparty: toNumber,
      status: 'completed',
      category: 'Переводы',
    };
    setTransactions(prev => [tx, ...prev]);
  }, []);

  const toggleCardStatus = useCallback((cardId: string) => {
    setCards(prev => prev.map(c => c.id === cardId
      ? { ...c, status: c.status === 'active' ? 'frozen' : 'active' }
      : c
    ));
  }, []);

  const myAccounts = currentUser ? accounts.filter(a => a.ownerId === currentUser.id) : [];
  const myCards = currentUser ? cards.filter(c => myAccounts.some(a => a.id === c.accountId)) : [];
  const myTransactions = currentUser ? transactions.filter(t => myAccounts.some(a => a.id === t.accountId)) : [];
  const myLoans = currentUser ? loans.filter(l => l.clientId === currentUser.id) : [];
  const totalBalance = myAccounts.filter(a => a.currency === 'RUB').reduce((s, a) => s + a.balance, 0);

  return {
    currentUser, login, logout,
    accounts: myAccounts, cards: myCards, transactions: myTransactions, loans: myLoans, clients,
    totalBalance, transfer, toggleCardStatus,
  };
}
