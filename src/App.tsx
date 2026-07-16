import React, { useState, useEffect } from 'react';
import { storage } from './utils/storage';
import { Customer, Dish, MealAssignment } from './types';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Dishes from './pages/Dishes';
import Assignment from './pages/Assignment';
import Labels from './pages/Labels';
import './App.css';

type PageType = 'dashboard' | 'customers' | 'dishes' | 'assign' | 'labels';

export default function App() {
  const [page, setPage] = useState<PageType>('dashboard');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [assignments, setAssignments] = useState<MealAssignment[]>([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    storage.initSampleData();
    setCustomers(storage.getCustomers());
    setDishes(storage.getDishes());
    setAssignments(storage.getAssignments());
  }, []);

  useEffect(() => {
    setCustomers(storage.getCustomers());
    setDishes(storage.getDishes());
    setAssignments(storage.getAssignments());
  }, [refresh]);

  const triggerRefresh = () => setRefresh(r => r + 1);

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">🍱</div>
          <div>
            <div className="brand-name">MEAL ASSIGN</div>
            <div className="brand-sub">Kitchen Ops</div>
          </div>
        </div>

        <nav className="nav">
          <button
            className={`nav-item ${page === 'dashboard' ? 'active' : ''}`}
            onClick={() => setPage('dashboard')}
          >
            📊 Dashboard
          </button>
          <button
            className={`nav-item ${page === 'customers' ? 'active' : ''}`}
            onClick={() => setPage('customers')}
          >
            👥 Customers
          </button>
          <button
            className={`nav-item ${page === 'dishes' ? 'active' : ''}`}
            onClick={() => setPage('dishes')}
          >
            🍽️ Dishes
          </button>
          <button
            className={`nav-item ${page === 'assign' ? 'active' : ''}`}
            onClick={() => setPage('assign')}
          >
            📋 Daily Assignment
          </button>
          <button
            className={`nav-item ${page === 'labels' ? 'active' : ''}`}
            onClick={() => setPage('labels')}
          >
            🖨️ Print Labels
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="kitchen-name">Demo Kitchen</div>
          <div className="kitchen-date mono">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</div>
        </div>
      </aside>

      <main className="main">
        {page === 'dashboard' && (
          <Dashboard
            customers={customers}
            dishes={dishes}
            assignments={assignments}
            todayStr={todayStr}
          />
        )}
        {page === 'customers' && (
          <Customers
            customers={customers}
            onRefresh={triggerRefresh}
          />
        )}
        {page === 'dishes' && (
          <Dishes
            dishes={dishes}
            onRefresh={triggerRefresh}
          />
        )}
        {page === 'assign' && (
          <Assignment
            customers={customers}
            dishes={dishes}
            assignments={assignments}
            todayStr={todayStr}
            onRefresh={triggerRefresh}
          />
        )}
        {page === 'labels' && (
          <Labels
            customers={customers}
            dishes={dishes}
            assignments={assignments}
            todayStr={todayStr}
          />
        )}
      </main>
    </div>
  );
}
