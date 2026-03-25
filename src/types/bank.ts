export type UserRole = 'client' | 'operator' | 'admin';
export type AccountType = 'current' | 'savings' | 'deposit' | 'credit';
export type CardStatus = 'active' | 'frozen' | 'blocked';
export type TxType = 'credit' | 'debit' | 'transfer' | 'payment';
export type LoanStatus = 'active' | 'closed' | 'overdue' | 'pending';
export type ClientTab = 'dashboard' | 'accounts' | 'cards' | 'transfers' | 'payments' | 'history' | 'credits';
export type OperatorTab = 'clients' | 'accounts' | 'loans' | 'operations' | 'reports';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  login: string;
  phone: string;
  email: string;
  inn?: string;
  branch?: string;
  position?: string;
}

export interface Account {
  id: string;
  ownerId: string;
  number: string;
  type: AccountType;
  currency: 'RUB' | 'USD' | 'EUR';
  balance: number;
  openDate: string;
  status: 'active' | 'frozen' | 'closed';
  interestRate?: number;
  name: string;
}

export interface Card {
  id: string;
  accountId: string;
  number: string;
  holder: string;
  expiry: string;
  type: 'visa' | 'mastercard' | 'mir';
  status: CardStatus;
  limit?: number;
  design: 'blue' | 'gold' | 'dark' | 'green';
}

export interface Transaction {
  id: string;
  accountId: string;
  date: string;
  type: TxType;
  amount: number;
  currency: 'RUB' | 'USD' | 'EUR';
  description: string;
  counterparty?: string;
  status: 'completed' | 'pending' | 'failed';
  category: string;
}

export interface Loan {
  id: string;
  clientId: string;
  type: 'consumer' | 'mortgage' | 'auto' | 'business';
  amount: number;
  remaining: number;
  rate: number;
  term: number;
  monthlyPayment: number;
  nextPayment: string;
  status: LoanStatus;
  openDate: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  inn: string;
  passport: string;
  address: string;
  status: 'active' | 'blocked' | 'vip';
  since: string;
  accounts: Account[];
  cards: Card[];
  loans: Loan[];
}
