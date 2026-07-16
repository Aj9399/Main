import React, { useState } from 'react';
import { storage } from '../utils/storage';
import { Customer } from '../types';

interface CustomersProps {
  customers: Customer[];
  onRefresh: () => void;
}

export default function Customers({ customers, onRefresh }: CustomersProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Customer>>({
    name: '',
    phone: '',
    address: '',
    preference: 'veg',
    dietaryNotes: '',
    status: 'active',
  });

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      name: '',
      phone: '',
      address: '',
      preference: 'veg',
      dietaryNotes: '',
      status: 'active',
    });
    setShowForm(true);
  };

  const handleEdit = (customer: Customer) => {
    setEditingId(customer.id);
    setFormData(customer);
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.phone) {
      alert('Name and phone are required');
      return;
    }

    if (editingId) {
      storage.updateCustomer(editingId, formData as Partial<Customer>);
    } else {
      storage.addCustomer(formData as Omit<Customer, 'id' | 'createdAt'>);
    }

    setShowForm(false);
    onRefresh();
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this customer?')) {
      storage.deleteCustomer(id);
      onRefresh();
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">Manage</div>
          <h1>Customer Database</h1>
        </div>
        <button className="btn accent" onClick={handleAddNew}>
          + Add Customer
        </button>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h3>All Customers</h3>
          <div className="hint">{customers.length} total</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Pref</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.id}>
                <td>
                  <strong>{c.name}</strong>
                </td>
                <td className="mono">{c.phone}</td>
                <td>{c.address}</td>
                <td>
                  <span className={`badge ${c.preference}`}>
                    <span className={`mark ${c.preference === 'veg' ? 'veg' : c.preference === 'nonveg' ? 'nonveg' : 'mixed'}`}></span>
                    {c.preference === 'veg' ? 'Veg' : c.preference === 'nonveg' ? 'Non-veg' : 'Both'}
                  </span>
                </td>
                <td>
                  <span className={`status ${c.status === 'active' ? 'active' : 'paused'}`}>
                    {c.status === 'active' ? 'Active' : 'Paused'}
                  </span>
                </td>
                <td>
                  <button
                    className="btn"
                    style={{ padding: '6px 12px', fontSize: '12px' }}
                    onClick={() => handleEdit(c)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn"
                    style={{ padding: '6px 12px', fontSize: '12px', marginLeft: '6px', color: 'var(--coral)' }}
                    onClick={() => handleDelete(c.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="panel" style={{ maxWidth: '600px', marginTop: '22px' }}>
          <div className="panel-head">
            <h3>{editingId ? 'Edit Customer' : 'Add New Customer'}</h3>
          </div>
          <div style={{ padding: '20px' }}>
            <div className="input-group">
              <div className="field">
                <label>Name *</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={formData.name || ''}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Phone *</label>
                <input
                  type="text"
                  placeholder="98-XXXX-XXXX"
                  value={formData.phone || ''}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="input-group full">
              <div className="field">
                <label>Address</label>
                <input
                  type="text"
                  placeholder="Sector 7, Pune"
                  value={formData.address || ''}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
            </div>
            <div className="input-group">
              <div className="field">
                <label>Preference *</label>
                <select
                  value={formData.preference || 'veg'}
                  onChange={e => setFormData({ ...formData, preference: e.target.value as any })}
                >
                  <option value="veg">Vegetarian</option>
                  <option value="nonveg">Non-vegetarian</option>
                  <option value="both">Both (Flexible)</option>
                </select>
              </div>
              <div className="field">
                <label>Status</label>
                <select
                  value={formData.status || 'active'}
                  onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                </select>
              </div>
            </div>
            <div className="input-group full">
              <div className="field">
                <label>Dietary Notes</label>
                <input
                  type="text"
                  placeholder="e.g. No onion, Less spicy, Gluten-free"
                  value={formData.dietaryNotes || ''}
                  onChange={e => setFormData({ ...formData, dietaryNotes: e.target.value })}
                />
              </div>
            </div>
            <div className="action-bar">
              <button className="btn" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button className="btn primary" onClick={handleSubmit}>
                Save Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
