import React, { useState } from 'react';
import { storage } from '../utils/storage';
import { Dish } from '../types';

interface DishesProps {
  dishes: Dish[];
  onRefresh: () => void;
}

export default function Dishes({ dishes, onRefresh }: DishesProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Dish>>({
    name: '',
    type: 'veg',
    calories: 500,
    price: 100,
    shift: 'both',
  });

  const vegDishes = dishes.filter(d => d.type === 'veg');
  const nonvegDishes = dishes.filter(d => d.type === 'nonveg');
  const mixedDishes = dishes.filter(d => d.type === 'mixed');

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      name: '',
      type: 'veg',
      calories: 500,
      price: 100,
      shift: 'both',
    });
    setShowForm(true);
  };

  const handleEdit = (dish: Dish) => {
    setEditingId(dish.id);
    setFormData(dish);
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!formData.name) {
      alert('Dish name is required');
      return;
    }

    if (editingId) {
      storage.updateDish(editingId, formData as Partial<Dish>);
    } else {
      storage.addDish(formData as Omit<Dish, 'id'>);
    }

    setShowForm(false);
    onRefresh();
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this dish?')) {
      storage.deleteDish(id);
      onRefresh();
    }
  };

  const DishTable = ({ dishList, title }: { dishList: Dish[]; title: string }) => (
    <div className="panel">
      <div className="panel-head">
        <h3>{title}</h3>
      </div>
      <table>
        <thead>
          <tr>
            <th>Dish</th>
            <th>Cal</th>
            <th>Price (₹)</th>
            <th>Shift</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {dishList.map(d => (
            <tr key={d.id}>
              <td>
                <strong>{d.name}</strong>
              </td>
              <td className="mono">{d.calories}</td>
              <td className="mono">{d.price}</td>
              <td>
                <span style={{ fontSize: '12px', color: 'var(--ink-soft)' }}>
                  {d.shift === 'both' ? '🌅 Both' : d.shift === 'morning' ? '☀️ Morning' : '🌙 Evening'}
                </span>
              </td>
              <td>
                <button
                  className="btn"
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                  onClick={() => handleEdit(d)}
                >
                  Edit
                </button>
                <button
                  className="btn"
                  style={{ padding: '6px 12px', fontSize: '12px', marginLeft: '6px', color: 'var(--coral)' }}
                  onClick={() => handleDelete(d.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">Configure</div>
          <h1>Dish Catalog</h1>
        </div>
        <button className="btn accent" onClick={handleAddNew}>
          + Add Dish
        </button>
      </div>

      <div className="grid-2">
        <DishTable dishList={vegDishes} title="🥬 Vegetarian Dishes" />
        <DishTable dishList={nonvegDishes} title="🍗 Non-veg Dishes" />
      </div>

      <DishTable dishList={mixedDishes} title="🎯 Mixed (Veg + Non-veg) Dishes" />

      {showForm && (
        <div className="panel" style={{ maxWidth: '600px', marginTop: '22px' }}>
          <div className="panel-head">
            <h3>{editingId ? 'Edit Dish' : 'Add New Dish'}</h3>
          </div>
          <div style={{ padding: '20px' }}>
            <div className="input-group full">
              <div className="field">
                <label>Dish Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Paneer Butter Masala"
                  value={formData.name || ''}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>
            <div className="input-group">
              <div className="field">
                <label>Type *</label>
                <select
                  value={formData.type || 'veg'}
                  onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                >
                  <option value="veg">Vegetarian</option>
                  <option value="nonveg">Non-vegetarian</option>
                  <option value="mixed">Mixed (Veg + Non-veg)</option>
                </select>
              </div>
              <div className="field">
                <label>Calories</label>
                <input
                  type="number"
                  value={formData.calories || 500}
                  onChange={e => setFormData({ ...formData, calories: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="input-group">
              <div className="field">
                <label>Price (₹)</label>
                <input
                  type="number"
                  value={formData.price || 100}
                  onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                />
              </div>
              <div className="field">
                <label>Available Shift</label>
                <select
                  value={formData.shift || 'both'}
                  onChange={e => setFormData({ ...formData, shift: e.target.value as any })}
                >
                  <option value="both">Both (Morning & Evening)</option>
                  <option value="morning">Morning Only</option>
                  <option value="evening">Evening Only</option>
                </select>
              </div>
            </div>
            <div className="action-bar">
              <button className="btn" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button className="btn primary" onClick={handleSubmit}>
                Save Dish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
