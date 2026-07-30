import React, { useState, useMemo } from 'react';
import { storage } from '../utils/storage';
import { assignByCategory, allowedTypesFor, CategoryDish } from '../utils/assignment';
import { Customer, Dish, MealAssignment } from '../types';

interface AssignmentProps {
  customers: Customer[];
  dishes: Dish[];
  assignments: MealAssignment[];
  todayStr: string;
  onRefresh: () => void;
}

const CATS: { key: keyof CategoryDish; label: string; emoji: string; types: Array<Dish['type']> }[] = [
  { key: 'veg', label: 'Veg customers', emoji: '🟢', types: ['veg'] },
  { key: 'nonveg', label: 'Non-veg customers', emoji: '🔴', types: ['nonveg', 'mixed'] },
  { key: 'both', label: 'Veg + Non-veg customers', emoji: '🟡', types: ['veg', 'nonveg', 'mixed'] },
];

export default function Assignment({ customers, dishes, assignments, todayStr, onRefresh }: AssignmentProps) {
  const [shift, setShift] = useState<'morning' | 'evening'>('morning');

  const shiftDishes = useMemo(() => dishes.filter(d => d.shift === 'both' || d.shift === shift), [dishes, shift]);
  const active = customers.filter(c => c.status === 'active');
  const counts = {
    veg: active.filter(c => c.preference === 'veg').length,
    nonveg: active.filter(c => c.preference === 'nonveg').length,
    both: active.filter(c => c.preference === 'both').length,
  };

  // default a dish per category (first available of the allowed type for this shift)
  const defaultCat = (): CategoryDish => {
    const first = (types: Array<Dish['type']>) => shiftDishes.find(d => types.includes(d.type))?.id || '';
    return { veg: first(['veg']), nonveg: first(['nonveg', 'mixed']), both: first(['veg', 'nonveg', 'mixed']) };
  };
  const [catDish, setCatDish] = useState<CategoryDish>(defaultCat);

  // reset category defaults when shift changes
  React.useEffect(() => { setCatDish(defaultCat()); /* eslint-disable-next-line */ }, [shift]);

  const shiftAssignments = assignments.filter(a => a.date === todayStr && a.shift === shift);
  const morningN = assignments.filter(a => a.date === todayStr && a.shift === 'morning').length;
  const eveningN = assignments.filter(a => a.date === todayStr && a.shift === 'evening').length;

  const handleGenerate = () => {
    const { assignments: rows, skipped } = assignByCategory(customers, catDish, todayStr, shift);
    storage.clearShift(todayStr, shift);
    storage.addAssignments(rows);
    onRefresh();
    alert(`✓ ${rows.length} ${shift} tickets ready.` + (skipped ? `\n${skipped} skipped (no dish set for their category).` : '') + `\n\nGo to Label Studio to print.`);
  };

  const handleOverride = (id: string, dishId: string) => { storage.updateAssignmentDish(id, dishId); onRefresh(); };

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">Operations</div>
          <h1>Daily Assignment</h1>
        </div>
        <div className="shift-toggle" style={{ display: 'inline-flex', background: 'var(--surface-2)', borderRadius: 10, padding: 4, gap: 4 }}>
          <button className="btn" style={seg(shift === 'morning')} onClick={() => setShift('morning')}>☀ Morning ({morningN})</button>
          <button className="btn" style={seg(shift === 'evening')} onClick={() => setShift('evening')}>🌙 Evening ({eveningN})</button>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h3>Fill today's {shift} menu — 3 categories</h3>
          <div className="hint">Pick one dish per category. Every customer auto-gets their category's dish.</div>
        </div>
        <div style={{ padding: 18, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 14 }}>
          {CATS.map(cat => {
            const opts = shiftDishes.filter(d => cat.types.includes(d.type));
            return (
              <div key={cat.key} style={{ border: '1px solid var(--line)', borderRadius: 12, padding: 15, background: 'var(--bg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <strong style={{ fontSize: 13.5 }}>{cat.emoji} {cat.label}</strong>
                  <span className="badge" style={{ background: 'var(--surface-2)', color: 'var(--ink-soft)' }}>{counts[cat.key]}</span>
                </div>
                <select
                  style={{ width: '100%' }}
                  value={catDish[cat.key]}
                  onChange={e => setCatDish({ ...catDish, [cat.key]: e.target.value })}
                >
                  <option value="">— No dish (skip) —</option>
                  {opts.map(d => (
                    <option key={d.id} value={d.id}>{d.name} · {d.calories} kcal{d.type === 'mixed' ? ' (mixed)' : ''}</option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
        <div className="action-bar" style={{ padding: '0 18px 18px', margin: 0 }}>
          <button className="btn" onClick={() => { storage.clearShift(todayStr, shift); onRefresh(); }}>Clear {shift}</button>
          <button className="btn primary" onClick={handleGenerate}>🎫 Generate {shift} tickets</button>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h3>{shift === 'morning' ? '☀ Morning' : '🌙 Evening'} tickets</h3>
          <div className="hint">{shiftAssignments.length} tickets · change any individual dish below</div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead><tr><th>Code</th><th>Customer</th><th>Pref</th><th>Assigned dish</th><th>Energy</th></tr></thead>
            <tbody>
              {shiftAssignments.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 22, color: 'var(--ink-soft)' }}>
                  No tickets yet. Fill the 3 categories above and press <strong>Generate {shift} tickets</strong>.
                </td></tr>
              ) : shiftAssignments.map(a => {
                const c = customers.find(x => x.id === a.customerId);
                const d = dishes.find(x => x.id === a.dishId);
                if (!c) return null;
                const allowed = allowedTypesFor(c.preference);
                const opts = shiftDishes.filter(x => allowed.includes(x.type));
                return (
                  <tr key={a.id}>
                    <td className="mono" style={{ fontSize: 12 }}>{c.code}</td>
                    <td><strong>{c.name}</strong></td>
                    <td>
                      <span className={`badge ${c.preference}`}>
                        <span className={`mark ${c.preference === 'veg' ? 'veg' : c.preference === 'nonveg' ? 'nonveg' : 'mixed'}`} />
                        {c.preference === 'veg' ? 'Veg' : c.preference === 'nonveg' ? 'Non-veg' : 'Both'}
                      </span>
                    </td>
                    <td>
                      <select value={a.dishId} onChange={e => handleOverride(a.id, e.target.value)} style={{ maxWidth: 260 }}>
                        {opts.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
                      </select>
                    </td>
                    <td className="mono">{d ? d.calories : '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function seg(on: boolean): React.CSSProperties {
  return { border: 'none', padding: '9px 15px', borderRadius: 7, fontSize: 13, background: on ? 'var(--forest)' : 'transparent', color: on ? '#fff' : 'var(--ink-soft)', boxShadow: on ? '0 1px 3px rgba(0,0,0,.15)' : 'none' };
}
