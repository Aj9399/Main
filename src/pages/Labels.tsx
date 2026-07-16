import React, { useState } from 'react';
import { Customer, Dish, MealAssignment } from '../types';

interface LabelsProps {
  customers: Customer[];
  dishes: Dish[];
  assignments: MealAssignment[];
  todayStr: string;
}

export default function Labels({
  customers,
  dishes,
  assignments,
  todayStr,
}: LabelsProps) {
  const [shift, setShift] = useState<'morning' | 'evening'>('morning');

  const todayAssignments = assignments.filter(a => a.date === todayStr && a.shift === shift);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const day = date.getDate();
    return `${day} ${month}`;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleOpenPrintTab = () => {
    const printContent = document.getElementById('print-sheet')?.innerHTML || '';
    const printWindow = window.open('', '', 'width=1000,height=800');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Print Labels - ${shift} Shift</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 18px; }
            .print-sheet { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; }
            .label-item {
              border: 1.5px dashed #999;
              padding: 12px;
              font-size: 11px;
              display: flex;
              flex-direction: column;
              gap: 6px;
              min-height: 100px;
              justify-content: space-between;
              page-break-inside: avoid;
            }
            .dish { font-weight: 700; font-size: 12px; }
            .name { color: #666; }
            .bottom { display: flex; justify-content: space-between; font-size: 9px; color: #999; }
            .mark { width: 11px; height: 11px; border: 1.6px solid; border-radius: 2px; display: inline-block; }
            .veg { border-color: #2E8B57; }
            .nonveg { border-color: #A13F2E; }
            @media print {
              body { margin: 0; padding: 0; }
              .print-sheet { gap: 0; }
            }
          </style>
        </head>
        <body>
          <div class="print-sheet">${printContent}</div>
          <script>window.print();</script>
        </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">Print</div>
          <h1>Generate Sticker Labels</h1>
        </div>
      </div>

      <div style={{ marginBottom: '22px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            style={{
              padding: '10px 16px',
              border: 'none',
              background: shift === 'morning' ? 'var(--lime)' : 'var(--surface-2)',
              color: shift === 'morning' ? 'var(--forest)' : 'var(--ink-soft)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px',
            }}
            onClick={() => setShift('morning')}
          >
            ☀️ Morning ({assignments.filter(a => a.date === todayStr && a.shift === 'morning').length})
          </button>
          <button
            style={{
              padding: '10px 16px',
              border: 'none',
              background: shift === 'evening' ? 'var(--lime)' : 'var(--surface-2)',
              color: shift === 'evening' ? 'var(--forest)' : 'var(--ink-soft)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px',
            }}
            onClick={() => setShift('evening')}
          >
            🌙 Evening ({assignments.filter(a => a.date === todayStr && a.shift === 'evening').length})
          </button>
        </div>
      </div>

      <div className="action-bar">
        <button className="btn" onClick={() => window.scrollTo(0, 0)}>
          ← Back to Assignment
        </button>
        <button className="btn accent" onClick={handleOpenPrintTab}>
          Open printable page ↗
        </button>
        <button className="btn primary" onClick={handlePrint}>
          🖨️ Print this sheet
        </button>
      </div>

      <div className="print-preview">
        <h3>Print sheet — {shift === 'morning' ? 'Morning' : 'Evening'} · {todayAssignments.length} labels</h3>
        <div className="hint">
          One sticker per box, with dish, name, veg/non-veg mark and calories. Sized for 3-across thermal or A4 label sheet.
        </div>
        <div className="label-grid" id="print-sheet">
          {todayAssignments.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--ink-soft)' }}>
              No assignments for this shift yet. Go to Daily Assignment and generate meals.
            </div>
          ) : (
            todayAssignments.map(a => {
              const customer = customers.find(c => c.id === a.customerId);
              const dish = dishes.find(d => d.id === a.dishId);
              if (!customer || !dish) return null;

              // The sticker mark must reflect the FOOD in the box, not the
              // customer's preference. Mixed dishes may contain non-veg, so
              // they carry the non-veg mark for safety.
              const isVegDish = dish.type === 'veg';

              return (
                <div key={a.id} className="label-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--ink-soft)', fontSize: '9px' }}>
                      {shift} · {formatDate(todayStr)}
                    </span>
                    <span className={`mark ${isVegDish ? 'veg' : 'nonveg'}`}></span>
                  </div>
                  <div>
                    <div className="dish">{dish.name}</div>
                    <div className="name">{customer.name}</div>
                  </div>
                  <div className="bottom">
                    <span>—</span>
                    <strong style={{ color: 'var(--coral)' }}>{dish.calories} kcal</strong>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-section, #print-section * {
            visibility: visible;
          }
          .print-preview {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            box-shadow: none;
            margin: 0;
            padding: 0;
          }
          .print-preview h3,
          .print-preview .hint {
            display: none;
          }
          .label-grid {
            box-shadow: none !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
