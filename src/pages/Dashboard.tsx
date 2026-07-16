import React from 'react';
import { Customer, Dish, MealAssignment } from '../types';

interface DashboardProps {
  customers: Customer[];
  dishes: Dish[];
  assignments: MealAssignment[];
  todayStr: string;
}

export default function Dashboard({
  customers,
  dishes,
  assignments,
  todayStr,
}: DashboardProps) {
  const todayAssignments = assignments.filter(a => a.date === todayStr);
  const activeCustomers = customers.filter(c => c.status === 'active');
  const vegDishes = dishes.filter(d => d.type === 'veg').length;
  const nonvegDishes = dishes.filter(d => d.type === 'nonveg').length;
  const mixedDishes = dishes.filter(d => d.type === 'mixed').length;

  const morningAssignments = todayAssignments.filter(a => a.shift === 'morning');
  const eveningAssignments = todayAssignments.filter(a => a.shift === 'evening');

  const vegCount = todayAssignments.filter(a => {
    const cust = customers.find(c => c.id === a.customerId);
    return cust?.preference === 'veg';
  }).length;

  const nonvegCount = todayAssignments.filter(a => {
    const cust = customers.find(c => c.id === a.customerId);
    return cust?.preference === 'nonveg';
  }).length;

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">Overview</div>
          <h1>Today's Kitchen Status</h1>
        </div>
      </div>

      <div className="stats">
        <div className="stat-card">
          <div className="label">Active Customers</div>
          <div className="value">{activeCustomers.length}</div>
          <div className="sub">{activeCustomers.filter(c => c.preference === 'veg').length} veg · {activeCustomers.filter(c => c.preference === 'nonveg').length} non-veg</div>
        </div>
        <div className="stat-card">
          <div className="label">Total Dishes</div>
          <div className="value">{dishes.length}</div>
          <div className="sub">{vegDishes} veg · {nonvegDishes} non-veg · {mixedDishes} mixed</div>
        </div>
        <div className="stat-card">
          <div className="label">Meals Assigned Today</div>
          <div className="value">{todayAssignments.length}</div>
          <div className="sub">{morningAssignments.length} morning · {eveningAssignments.length} evening</div>
        </div>
        <div className="stat-card">
          <div className="label">Assignment Coverage</div>
          <div className="value">{activeCustomers.length > 0 ? Math.round((todayAssignments.length / activeCustomers.length) * 100) : 0}%</div>
          <div className="sub">of active customers</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-head"><h3>Today's Distribution</h3></div>
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Count</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span className="badge veg">
                    <span className="mark veg"></span>Veg
                  </span>
                </td>
                <td>{vegCount}</td>
                <td>{todayAssignments.length > 0 ? Math.round((vegCount / todayAssignments.length) * 100) : 0}%</td>
              </tr>
              <tr>
                <td>
                  <span className="badge nonveg">
                    <span className="mark nonveg"></span>Non-veg
                  </span>
                </td>
                <td>{nonvegCount}</td>
                <td>{todayAssignments.length > 0 ? Math.round((nonvegCount / todayAssignments.length) * 100) : 0}%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="panel">
          <div className="panel-head"><h3>Unassigned Customers</h3></div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Pref</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {activeCustomers
                .filter(c => !todayAssignments.some(a => a.customerId === c.id))
                .slice(0, 5)
                .map(c => (
                  <tr key={c.id}>
                    <td><strong>{c.name}</strong></td>
                    <td>
                      <span className="mark" style={{ borderColor: c.preference === 'veg' ? 'var(--veg)' : 'var(--nonveg)' }}></span>
                    </td>
                    <td><span className="status paused">Pending</span></td>
                  </tr>
                ))}
              {activeCustomers.filter(c => !todayAssignments.some(a => a.customerId === c.id)).length === 0 && (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center', color: 'var(--ink-soft)' }}>
                    All customers assigned ✓
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
