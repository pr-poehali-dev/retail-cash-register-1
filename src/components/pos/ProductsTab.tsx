import { useState } from 'react';
import { Product } from '@/types/pos';
import Icon from '@/components/ui/icon';

interface Props {
  products: Product[];
  onAdd: (p: Omit<Product, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<Product>) => void;
  onDelete: (id: string) => void;
}

const EMPTY: Omit<Product, 'id'> = { name: '', barcode: '', category: '', costPrice: 0, sellPrice: 0, stock: 0, unit: 'шт' };

export default function ProductsTab({ products, onAdd, onUpdate, onDelete }: Props) {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Product, 'id'>>(EMPTY);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setForm(EMPTY); setEditId(null); setShowForm(true); };
  const openEdit = (p: Product) => { setForm({ name: p.name, barcode: p.barcode, category: p.category, costPrice: p.costPrice, sellPrice: p.sellPrice, stock: p.stock, unit: p.unit }); setEditId(p.id); setShowForm(true); };

  const handleSave = () => {
    if (!form.name || form.sellPrice <= 0) return;
    if (editId) onUpdate(editId, form);
    else onAdd(form);
    setShowForm(false);
  };

  const margin = (form.sellPrice > 0 && form.costPrice > 0)
    ? Math.round((form.sellPrice - form.costPrice) / form.sellPrice * 100)
    : 0;

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск товаров..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--neon-green)] transition-all"
          />
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-[var(--neon-green)] text-[#0a1628] hover:opacity-90 transition-all active:scale-95"
        >
          <Icon name="Plus" size={16} />
          Добавить товар
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md animate-scale-in">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-lg gradient-text" style={{ fontFamily: 'Oswald, sans-serif' }}>
                {editId ? 'РЕДАКТИРОВАТЬ ТОВАР' : 'НОВЫЙ ТОВАР'}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                <Icon name="X" size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Название *</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--neon-green)] transition-all"
                  placeholder="Название товара" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Штрихкод</label>
                  <input value={form.barcode} onChange={e => setForm(p => ({ ...p, barcode: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--neon-green)] transition-all"
                    placeholder="4600001" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Категория</label>
                  <input value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--neon-green)] transition-all"
                    placeholder="Категория" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Цена закупки ₽</label>
                  <input type="number" min="0" value={form.costPrice} onChange={e => setForm(p => ({ ...p, costPrice: Number(e.target.value) }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--neon-green)] transition-all" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Цена продажи ₽</label>
                  <input type="number" min="0" value={form.sellPrice} onChange={e => setForm(p => ({ ...p, sellPrice: Number(e.target.value) }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--neon-green)] transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Остаток на складе</label>
                  <input type="number" min="0" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: Number(e.target.value) }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--neon-green)] transition-all" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Единица</label>
                  <select value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--neon-green)] transition-all">
                    {['шт', 'кг', 'л', 'м', 'упак'].map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>

              {form.costPrice > 0 && form.sellPrice > 0 && (
                <div className={`rounded-xl p-3 text-sm flex justify-between ${margin >= 20 ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-orange-500/10 border border-orange-500/30'}`}>
                  <span className="text-muted-foreground">Наценка:</span>
                  <span className={`font-bold ${margin >= 20 ? 'text-emerald-400' : 'text-orange-400'}`}>
                    {margin}% (+{(form.sellPrice - form.costPrice).toLocaleString()} ₽)
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm hover:bg-muted transition-all">
                Отмена
              </button>
              <button onClick={handleSave}
                className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-[var(--neon-green)] text-[#0a1628] hover:opacity-90 transition-all active:scale-95">
                {editId ? 'Сохранить' : 'Добавить'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-gradient-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {['Название', 'Категория', 'Закупка', 'Продажа', 'Наценка', 'Остаток', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs text-muted-foreground font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => {
              const m = p.costPrice > 0 ? Math.round((p.sellPrice - p.costPrice) / p.sellPrice * 100) : 0;
              return (
                <tr key={p.id} className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-sm">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.barcode}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-muted px-2 py-1 rounded-full">{p.category}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{p.costPrice.toLocaleString()} ₽</td>
                  <td className="px-4 py-3 text-sm font-bold text-[var(--neon-green)]">{p.sellPrice.toLocaleString()} ₽</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${m >= 20 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}`}>
                      {m}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-bold ${p.stock <= 3 ? 'text-red-400' : p.stock <= 10 ? 'text-orange-400' : 'text-emerald-400'}`}>
                      {p.stock} {p.unit}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-[var(--neon-green)] transition-colors">
                        <Icon name="Pencil" size={14} />
                      </button>
                      <button onClick={() => onDelete(p.id)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-red-400 transition-colors">
                        <Icon name="Trash2" size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-16 text-center text-muted-foreground">
            <Icon name="Package" size={40} className="mx-auto mb-3 opacity-20" />
            <p>Товары не найдены</p>
          </div>
        )}
      </div>
    </div>
  );
}
