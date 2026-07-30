import React, { useState } from 'react';
import { Customer, Dish, MealAssignment, Brand } from '../types';
import { code39 } from '../utils/barcode';

interface LabelsProps {
  customers: Customer[];
  dishes: Dish[];
  assignments: MealAssignment[];
  todayStr: string;
  brand: Brand;
}

type Template = 'everyday' | 'fresh' | 'premium';
type Fields = { logo: boolean; barcode: boolean; kcal: boolean; note: boolean; box: boolean; fssai: boolean };

function Barcode({ text, narrow = 1.5 }: { text: string; narrow?: number }) {
  const segs = code39(text, narrow);
  return (
    <div className="bc">
      {segs.map((s, i) => (
        <i key={i} style={{ width: `${s.w.toFixed(2)}px`, background: s.on ? '#1a130c' : 'transparent' }} />
      ))}
    </div>
  );
}

function FMark({ type }: { type: Dish['type'] }) {
  // FSSAI mark reflects the FOOD: veg → green square+dot, nonveg/mixed → maroon triangle (safe).
  const isVeg = type === 'veg';
  return <span className={`fmark ${isVeg ? '' : 'non'}`} title={isVeg ? 'Veg' : 'Non-veg'} />;
}

export default function Labels({ customers, dishes, assignments, todayStr, brand }: LabelsProps) {
  const [tpl, setTpl] = useState<Template>('everyday');
  const [shift, setShift] = useState<'morning' | 'evening'>('morning');
  const [fields, setFields] = useState<Fields>({ logo: true, barcode: true, kcal: true, note: true, box: true, fssai: false });

  const rows = assignments.filter(a => a.date === todayStr && a.shift === shift);
  const dateStr = new Date(todayStr + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase();
  const shiftLabel = shift === 'morning' ? 'Morning' : 'Evening';

  const toggle = (k: keyof Fields) => setFields(f => ({ ...f, [k]: !f[k] }));

  const morningN = assignments.filter(a => a.date === todayStr && a.shift === 'morning').length;
  const eveningN = assignments.filter(a => a.date === todayStr && a.shift === 'evening').length;

  const renderLabel = (a: MealAssignment, i: number) => {
    const c = customers.find(x => x.id === a.customerId);
    const d = dishes.find(x => x.id === a.dishId);
    if (!c || !d) return null;
    const box = `${i + 1}/${rows.length}`;
    const kcal = fields.kcal ? <span className="kpill">🔥 {d.calories} kcal</span> : null;
    const note = fields.note && c.dietaryNotes ? <div className="lnote">⚠ {c.dietaryNotes}</div> : null;
    const fssai = fields.fssai ? <div className="lfssai">FSSAI {brand.fssai}</div> : null;
    const bc = fields.barcode ? (<>{<Barcode text={c.code} />}<div className="bc-txt">{c.code}</div></>) : <div className="bc-txt">{c.code}</div>;

    if (tpl === 'everyday') {
      return (
        <div className="lbl everyday" key={a.id}>
          <div className="l-accent" />
          <div className="l-in">
            <div className="l-top">
              <div className="l-brand">{fields.logo ? brand.name : ' '}<small>{brand.city}</small></div>
              <div className="l-meta">{shiftLabel} · {dateStr}<br />{fields.box ? `Box ${box}` : ''}</div>
            </div>
            <div className="l-dish">{d.name}</div>
            <div className="l-mid"><FMark type={d.type} /><span className="l-cust">{c.name}</span></div>
            <div className="l-mid">{kcal}<span className="l-cust" style={{ fontWeight: 500, color: '#8a7a63' }}>{c.address.replace(', ' + brand.city, '')}</span></div>
            {note}
            <div className="l-foot">{bc}{fssai}</div>
          </div>
        </div>
      );
    }
    if (tpl === 'fresh') {
      return (
        <div className="lbl fresh" key={a.id}>
          <div className="l-head">
            <div><div className="hb">{fields.logo ? brand.name : 'Tiffin'}</div><div className="hs">{brand.city} · {shiftLabel} · {dateStr}</div></div>
            <FMark type={d.type} />
          </div>
          <div className="l-in">
            <div className="l-dish">{d.name}</div>
            <div className="l-cust">{c.name}</div>
            <div className="l-tags">{kcal}{fields.box && <span className="chip-box">Box {box}</span>}</div>
            {note}
          </div>
          <div className="l-foot">{bc}{fssai}</div>
        </div>
      );
    }
    // premium
    return (
      <div className="lbl premium" key={a.id}>
        <div className="l-main">
          <div className="l-head"><div className="hb">{fields.logo ? brand.name : 'A2Y'}<small>{brand.city} Kitchen</small></div><FMark type={d.type} /></div>
          <div className="l-in">
            <div className="l-dish">{d.name}</div>
            <div className="l-cust">{c.name} · {c.address.replace(', ' + brand.city, '')}</div>
            <div className="l-tags" style={{ display: 'flex', gap: 7, alignItems: 'center' }}>{kcal}<span style={{ fontSize: 9, color: '#9a8a71' }}>{shiftLabel} · {dateStr}</span></div>
            {note}
          </div>
          <div className="l-foot">{bc}{fssai}</div>
        </div>
        <div className="l-stub">
          <div className="st-shift">{shiftLabel}</div>
          <div className="st-box">{fields.box ? <>BOX<br />{box}</> : c.code}</div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">Print</div>
          <h1>Label Studio</h1>
        </div>
      </div>

      <div className="lab-toolbar no-print">
        <div className="lab-row">
          <div className="lab-field">
            <span className="lab-lab">Label template</span>
            <div className="tpl-row">
              {([
                ['everyday', 'Everyday', 'Clean & simple'],
                ['fresh', 'Fresh', 'Colourful band'],
                ['premium', 'Premium', 'Boarding-pass'],
              ] as [Template, string, string][]).map(([key, name, desc]) => (
                <button key={key} className={`tpl-btn ${tpl === key ? 'on' : ''}`} onClick={() => setTpl(key)}>
                  <span className="tn"><span className={`tpl-sw ${key}`} />{name}</span>
                  <span className="td">{desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="lab-field">
            <span className="lab-lab">Shift</span>
            <div className="shift-toggle" style={{ display: 'inline-flex', background: 'var(--surface-2)', borderRadius: 10, padding: 4, gap: 4 }}>
              <button className="btn" style={btnSeg(shift === 'morning')} onClick={() => setShift('morning')}>☀ Morning ({morningN})</button>
              <button className="btn" style={btnSeg(shift === 'evening')} onClick={() => setShift('evening')}>🌙 Evening ({eveningN})</button>
            </div>
          </div>
        </div>

        <div className="lab-row" style={{ marginTop: 18 }}>
          <div className="lab-field" style={{ flex: 1 }}>
            <span className="lab-lab">Show on label</span>
            <div className="tog-row">
              {([
                ['logo', 'Logo'], ['barcode', 'Barcode'], ['kcal', 'Calories'],
                ['note', 'Diet note'], ['box', 'Box #'], ['fssai', 'FSSAI licence'],
              ] as [keyof Fields, string][]).map(([key, lbl]) => (
                <button key={key} className={`tog2 ${fields[key] ? 'on' : ''}`} onClick={() => toggle(key)}>
                  <span className="box" />{lbl}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="action-bar no-print" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 16 }}>
          Print sheet <span style={{ color: 'var(--ink-soft)', fontWeight: 400, fontSize: 13, fontFamily: 'Inter' }}>— {shiftLabel} · {rows.length} labels</span>
        </div>
        <button className="btn primary" onClick={() => window.print()}>🖨 Print sheet</button>
      </div>

      {rows.length === 0 ? (
        <div className="panel" style={{ padding: 40, textAlign: 'center', color: 'var(--ink-soft)' }}>
          No assignments for the {shiftLabel.toLowerCase()} shift yet. Go to <strong>Daily Assignment</strong> and run the generator, then come back to print.
        </div>
      ) : (
        <div className="lab-sheet">{rows.map(renderLabel)}</div>
      )}
    </div>
  );
}

function btnSeg(on: boolean): React.CSSProperties {
  return {
    border: 'none', padding: '9px 15px', borderRadius: 7, fontSize: 13,
    background: on ? 'var(--forest)' : 'transparent', color: on ? '#fff' : 'var(--ink-soft)',
    boxShadow: on ? '0 1px 3px rgba(0,0,0,.15)' : 'none',
  };
}
