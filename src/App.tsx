import React, { useState, useEffect } from 'react';
import { storage } from './utils/storage';
import { Customer, Dish, MealAssignment, Brand } from './types';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Dishes from './pages/Dishes';
import Assignment from './pages/Assignment';
import Labels from './pages/Labels';
import './App.css';

type PageType = 'dashboard' | 'customers' | 'dishes' | 'assign' | 'labels';

const NAV: [PageType, string, string][] = [
  ['dashboard', '📊', 'Dashboard'],
  ['customers', '👥', 'Subscribers'],
  ['dishes', '🍽️', 'Menu'],
  ['assign', '📋', 'Daily Assignment'],
  ['labels', '🏷️', 'Label Studio'],
];

export default function App() {
  const [page, setPage] = useState<PageType>('dashboard');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [assignments, setAssignments] = useState<MealAssignment[]>([]);
  const [brand, setBrand] = useState<Brand>(storage.getBrand());
  const [refresh, setRefresh] = useState(0);

  useEffect(() => { storage.initSampleData(); setRefresh(r => r + 1); }, []);
  useEffect(() => {
    setCustomers(storage.getCustomers());
    setDishes(storage.getDishes());
    setAssignments(storage.getAssignments());
    setBrand(storage.getBrand());
  }, [refresh]);

  const triggerRefresh = () => setRefresh(r => r + 1);
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">🍱</div>
          <div>
            <div className="brand-name">{brand.name}</div>
            <div className="brand-sub">{brand.city} · Kitchen Ops</div>
          </div>
        </div>

        <nav className="nav">
          {NAV.map(([key, icon, label]) => (
            <button key={key} className={`nav-item ${page === key ? 'active' : ''}`} onClick={() => setPage(key)}>
              <span style={{ width: 18, display: 'inline-block' }}>{icon}</span>{label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="kitchen-name">{brand.name}</div>
          <div className="kitchen-date mono">{new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</div>
        </div>
      </aside>

      <main className="main">
        {page === 'dashboard' && <Dashboard customers={customers} dishes={dishes} assignments={assignments} todayStr={todayStr} />}
        {page === 'customers' && <Customers customers={customers} onRefresh={triggerRefresh} />}
        {page === 'dishes' && <Dishes dishes={dishes} onRefresh={triggerRefresh} />}
        {page === 'assign' && <Assignment customers={customers} dishes={dishes} assignments={assignments} todayStr={todayStr} onRefresh={triggerRefresh} />}
        {page === 'labels' && <Labels customers={customers} dishes={dishes} assignments={assignments} todayStr={todayStr} brand={brand} />}
      </main>
    </div>
  );
}
