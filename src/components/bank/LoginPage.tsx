import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface Props {
  onLogin: (login: string, pass: string) => boolean;
}

const DEMO_ACCOUNTS = [
  { login: 'ivanov', pass: '1234', label: 'Клиент', desc: 'Иванов А.П.', color: '#1a6fff', icon: 'User' },
  { login: 'operator', pass: '1234', label: 'Операционист', desc: 'Смирнова А.В.', color: '#f5a623', icon: 'Headphones' },
  { login: 'admin', pass: '1234', label: 'Администратор', desc: 'Петров С.И.', color: '#a855f7', icon: 'ShieldCheck' },
];

export default function LoginPage({ onLogin }: Props) {
  const [login, setLogin] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      const ok = onLogin(login, pass);
      if (!ok) setError('Неверный логин или пароль');
      setLoading(false);
    }, 800);
  };

  const handleDemo = (l: string, p: string) => {
    setLogin(l); setPass(p);
    setLoading(true);
    setTimeout(() => { onLogin(l, p); setLoading(false); }, 600);
  };

  return (
    <div className="min-h-screen bank-bg flex" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
      {/* Left panel */}
      <div className="hidden lg:flex w-[45%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0b1220 0%, #0d1f3c 40%, #0b1628 100%)' }}>
        {/* Background grid */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(rgba(26,111,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(26,111,255,0.8) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
        <div className="absolute bottom-0 left-0 right-0 h-64"
          style={{ background: 'radial-gradient(ellipse at 50% 120%, rgba(26,111,255,0.2) 0%, transparent 70%)' }} />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #1a6fff, #0d4db5)' }}>
              <Icon name="Building2" size={20} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-white text-lg tracking-tight" style={{ fontFamily: 'Oswald, sans-serif' }}>СБОЛ.про</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>АС РФС v4.2.1</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-white leading-tight mb-3" style={{ fontFamily: 'Oswald, sans-serif' }}>
              АВТОМАТИЗИРОВАННАЯ<br />
              <span style={{ color: '#1a6fff' }}>БАНКОВСКАЯ</span><br />
              СИСТЕМА
          </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
              Розничное финансовое обслуживание.<br />
              Управление счетами, картами, кредитами и переводами.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: 'Shield', label: 'Безопасность', desc: 'Шифрование TLS 1.3' },
              { icon: 'Zap', label: 'Скорость', desc: 'Операции за 0.3 сек' },
              { icon: 'Globe', label: 'Доступность', desc: '24/7 без перерывов' },
              { icon: 'BarChart2', label: 'Аналитика', desc: 'Отчёты в реальном времени' },
            ].map(({ icon, label, desc }) => (
              <div key={label} className="rounded-xl p-3"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <Icon name={icon as Parameters<typeof Icon>[0]['name']} size={16} style={{ color: '#1a6fff' }} />
                <p className="text-white text-sm font-medium mt-1">{label}</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>
            © 2026 АС РФС СБОЛ.про · Лицензия ЦБ РФ № 1234
          </p>
        </div>
      </div>

      {/* Right — login form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #1a6fff, #0d4db5)' }}>
              <Icon name="Building2" size={18} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>СБОЛ.про</p>
              <p className="text-xs text-muted-foreground">АС РФС</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Oswald, sans-serif' }}>ВХОД В СИСТЕМУ</h2>
          <p className="text-sm text-muted-foreground mb-8">Введите учётные данные для доступа</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block font-medium tracking-wide uppercase">Логин</label>
              <div className="relative">
                <Icon name="User" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={login}
                  onChange={e => setLogin(e.target.value)}
                  placeholder="Введите логин"
                  className="w-full pl-9 pr-4 py-3 rounded-xl text-sm text-white transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block font-medium tracking-wide uppercase">Пароль</label>
              <div className="relative">
                <Icon name="Lock" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={pass}
                  onChange={e => setPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-3 rounded-xl text-sm text-white transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors">
                  <Icon name={showPass ? 'EyeOff' : 'Eye'} size={15} />
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm animate-scale-in"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
                <Icon name="AlertCircle" size={14} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !login || !pass}
              className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: loading ? '#0d4db5' : 'linear-gradient(135deg, #1a6fff, #0d4db5)' }}
            >
              {loading ? (
                <><Icon name="Loader2" size={16} className="animate-spin" />Проверка...</>
              ) : (
                <><Icon name="LogIn" size={16} />Войти в систему</>
              )}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-8">
            <p className="text-xs text-muted-foreground mb-3 text-center uppercase tracking-wider">Демо-доступ</p>
            <div className="space-y-2">
              {DEMO_ACCOUNTS.map(acc => (
                <button
                  key={acc.login}
                  onClick={() => handleDemo(acc.login, acc.pass)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all hover:scale-[1.01] active:scale-[0.99]"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${acc.color}22`, border: `1px solid ${acc.color}44` }}>
                    <Icon name={acc.icon as Parameters<typeof Icon>[0]['name']} size={14} style={{ color: acc.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{acc.label}</p>
                    <p className="text-xs text-muted-foreground">{acc.desc}</p>
                  </div>
                  <span className="text-xs font-mono px-2 py-1 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}>
                    {acc.login}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
