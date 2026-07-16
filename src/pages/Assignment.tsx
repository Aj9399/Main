import React, { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { assignMeals } from '../utils/assignment';
import { Customer, Dish, MealAssignment } from '../types';

interface AssignmentProps {
  customers: Customer[];
  dishes: Dish[];
  assignments: MealAssignment[];
  todayStr: string;
  onRefresh: () => void;
}

export default function Assignment({
  customers,
  dishes,
  assignments,
  todayStr,
  onRefresh,
}: AssignmentProps) {
  const [morningCount, setMorningCount] = useState(100);
  const [eveningCount, setEveningCount] = useState(90);
  const [mixedRatio, setMixedRatio] = useState(30);
  const [loading, setLoading] = useState(false);
  const [currentShift, setCurrentShift] = useState<'morning' | 'evening'>('morning');

  const todayAssignments = assignments.filter(a => a.date === todayStr);
  const shiftAssignments = todayAssignments.filter(a => a.shift === currentShift);

  const handleRunAssignment = async () => {
    setLoading(true);

    const morningResult = assignMeals(customers, dishes, todayStr, 'morning', morningCount, mixedRatio);
    const eveningResult = assignMeals(customers, dishes, todayStr, 'evening', eveningCount, mixedRatio);

    storage.clearAssignments(todayStr);
    storage.addAssignments([...morningResult.assignments, ...eveningResult.assignments]);

    setTimeout(() => {
      setLoading(false);
      onRefresh();
      alert(`✓ Assignments created!\nMorning: ${morningResult.stats.assigned}/${morningResult.stats.total}\nEvening: ${eveningResult.stats.assigned}/${eveningResult.stats.total}`);
    }, 500);
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">Operations</div>
          <h1>Daily Meal Assignment</h1>
        </div>
      </div>

      <div className="panel" style={{ maxWidth: '500px', marginBottom: '22px' }}>
        <div className="panel-head">
          <h3>Generate Meals for Today</h3>
        </div>
        <div style={{ padding: '20px' }}>
          <div className="input-group">
            <div className="field">
              <label>Morning Meals</label>
              <input
                type="number"
                value={morningCount}
                onChange={e => setMorningCount(Number(e.target.value))}
              />
            </div>
            <div className="field">
              <label>Evening Meals</label>
              <input
                type="number"
                value={eveningCount}
                onChange={e => setEveningCount(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="input-group full">
            <div className="field">
              <label>Mixed Dish Allocation (%)</label>
              <input
                type="number"
                value={mixedRatio}
                min="0"
                max="100"
                onChange={e => setMixedRatio(Number(e.target.value))}
              />
              <div style={{ fontSize: '11px', color: 'var(--ink-soft)', marginTop: '6px' }}>
                {Math.ceil((morningCount + eveningCount) * mixedRatio / 100)} of {morningCount + eveningCount} meals will be mixed veg+nonveg
              </div>
            </div>
          </div>
          <div style={{ background: 'var(--surface-2)', padding: '12px', borderRadius: '8px', marginBottom: '14px', fontSize: '12px' }}>
            <strong>Smart Distribution:</strong> System auto-assigns based on customer preferences. Veg-only customers get veg dishes only.
          </div>
          <div className="action-bar">
            <button className="btn" onClick={() => storage.clearAssignments(todayStr) || onRefresh()}>
              Clear Previous
            </button>
            <button
              className="btn primary"
              onClick={handleRunAssignment}
              disabled={loading}
            >
              {loading ? '⏳ Running...' : '🚀 Run Assignment'}
            </button>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h3>
            {currentShift === 'morning' ? '☀️ Morning Shift' : '🌙 Evening Shift'} Assignment Status
          </h3>
          <div className="hint">{shiftAssignments.length} customers</div>
        </div>

        <div style={{ padding: '10px 19px', borderBottom: '1px solid var(--line)', display: 'flex', gap: '10px' }}>
          <button
            style={{
              padding: '8px 14px',
              border: 'none',
              background: currentShift === 'morning' ? 'var(--lime)' : 'transparent',
              color: currentShift === 'morning' ? 'var(--forest)' : 'var(--ink-soft)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '12px',
            }}
            onClick={() => setCurrentShift('morning')}
          >
            Morning ({todayAssignments.filter(a => a.shift === 'morning').length})
          </button>
          <button
            style={{
              padding: '8px 14px',
              border: 'none',
              background: currentShift === 'evening' ? 'var(--lime)' : 'transparent',
              color: currentShift === 'evening' ? 'var(--forest)' : 'var(--ink-soft)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '12px',
            }}
            onClick={() => setCurrentShift('evening')}
          >
            Evening ({todayAssignments.filter(a => a.shift === 'evening').length})
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Pref</th>
              <th>Assigned Dish</th>
              <th>Cal</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {shiftAssignments.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '20px', color: 'var(--ink-soft)' }}>
                  No assignments yet. Run assignment generator above.
                </td>
              </tr>
            ) : (
              shiftAssignments.slice(0, 20).map(a => {
                const customer = customers.find(c => c.id === a.customerId);
                const dish = dishes.find(d => d.id === a.dishId);
                if (!customer || !dish) return null;

                return (
                  <tr key={a.id}>
                    <td>
                      <strong>{customer.name}</strong>
                    </td>
                    <td>
                      <span className={`mark ${customer.preference === 'veg' ? 'veg' : customer.preference === 'nonveg' ? 'nonveg' : 'mixed'}`}></span>
                    </td>
                    <td>{dish.name}</td>
                    <td className="mono">{dish.calories}</td>
                    <td>
                      <span className="status active">✓ Matched</span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {shiftAssignments.length > 20 && (
          <div style={{ padding: '14px 19px', borderTop: '1px solid var(--line)', fontSize: '12px', color: 'var(--ink-soft)', textAlign: 'center' }}>
            Showing 20 of {shiftAssignments.length} assignments
          </div>
        )}
      </div>
    </div>
  );
}
