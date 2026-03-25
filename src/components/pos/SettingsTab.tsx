import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface Settings {
  shopName: string;
  currency: string;
  taxRate: number;
  lowStockAlert: number;
  receiptFooter: string;
}

const DEFAULT: Settings = {
  shopName: 'Мой магазин',
  currency: '₽',
  taxRate: 20,
  lowStockAlert: 5,
  receiptFooter: 'Спасибо за покупку!',
};

export default function SettingsTab() {
  const [settings, setSettings] = useState<Settings>(DEFAULT);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <label className="text-sm text-muted-foreground mb-1.5 block">{label}</label>
      {children}
    </div>
  );

  return (
    <div className="max-w-2xl space-y-6">
      {saved && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-xl p-4 flex items-center gap-3 animate-scale-in">
          <Icon name="CheckCircle2" size={18} className="text-emerald-400" />
          <span className="text-emerald-400 font-medium text-sm">Настройки сохранены</span>
        </div>
      )}

      <div className="bg-gradient-card border border-border rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
          <Icon name="Store" size={14} />
          Магазин
        </h3>
        <Field label="Название магазина">
          <input
            value={settings.shopName}
            onChange={e => setSettings(p => ({ ...p, shopName: e.target.value }))}
            className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--neon-green)] transition-all"
          />
        </Field>
        <Field label="Подпись в чеке">
          <textarea
            value={settings.receiptFooter}
            onChange={e => setSettings(p => ({ ...p, receiptFooter: e.target.value }))}
            rows={2}
            className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--neon-green)] transition-all resize-none"
          />
        </Field>
      </div>

      <div className="bg-gradient-card border border-border rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
          <Icon name="Settings2" size={14} />
          Финансы
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Валюта">
            <select
              value={settings.currency}
              onChange={e => setSettings(p => ({ ...p, currency: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--neon-green)] transition-all"
            >
              {['₽', '$', '€', '₸'].map(c => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="НДС (%)">
            <input
              type="number" min="0" max="100"
              value={settings.taxRate}
              onChange={e => setSettings(p => ({ ...p, taxRate: Number(e.target.value) }))}
              className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--neon-green)] transition-all"
            />
          </Field>
        </div>
        <Field label="Порог уведомления о низком остатке (шт)">
          <input
            type="number" min="1"
            value={settings.lowStockAlert}
            onChange={e => setSettings(p => ({ ...p, lowStockAlert: Number(e.target.value) }))}
            className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--neon-green)] transition-all"
          />
        </Field>
      </div>

      <div className="bg-gradient-card border border-border rounded-2xl p-5">
        <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
          <Icon name="Keyboard" size={14} />
          Горячие клавиши
        </h3>
        <div className="space-y-2">
          {[
            { key: 'F9', desc: 'Информация о системе' },
            { key: 'Escape', desc: 'Закрыть диалог' },
          ].map(({ key, desc }) => (
            <div key={key} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
              <span className="text-sm text-muted-foreground">{desc}</span>
              <kbd className="px-2.5 py-1 rounded-lg bg-muted border border-border text-xs font-mono font-bold text-[var(--neon-green)]">{key}</kbd>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full py-3 rounded-xl font-bold text-sm bg-[var(--neon-green)] text-[#0a1628] hover:opacity-90 transition-all active:scale-[0.99] flex items-center justify-center gap-2"
      >
        <Icon name="Save" size={16} />
        Сохранить настройки
      </button>
    </div>
  );
}
