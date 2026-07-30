import React, { useState, useRef } from 'react';
import { storage } from '../utils/storage';
import { Customer } from '../types';
import { parseCSV, mapRowsToCustomers } from '../utils/csv';

interface CustomersProps {
  customers: Customer[];
  onRefresh: () => void;
}

export default function Customers({ customers, onRefresh }: CustomersProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<Partial<Customer>>({
    name: '', phone: '', address: '', preference: 'veg', plan: 'Monthly', dietaryNotes: '', status: 'active',
  });

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({ name: '', phone: '', address: '', preference: 'veg', plan: 'Monthly', dietaryNotes: '', status: 'active' });
    setShowForm(true);
  };
  const handleEdit = (c: Customer) => { setEditingId(c.id); setFormData(c); setShowForm(true); };
  const handleSubmit = () => {
    if (!formData.name || !formData.phone) { alert('Name and phone are required'); return; }
    if (editingId) storage.updateCustomer(editingId, formData as Partial<Customer>);
    else storage.addCustomer(formData as Omit<Customer, 'id' | 'createdAt' | 'code'>);
    setShowForm(false); onRefresh();
  };
  const handleDelete = (id: string) => { if (confirm('Delete this customer?')) { storage.deleteCustomer(id); onRefresh(); } };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const rows = parseCSV(String(reader.result));
        const { customers: parsed, errors } = mapRowsToCustomers(rows);
        if (parsed.length === 0) { alert('No valid rows found. Check the column headers:\nName, Phone, Area, Veg/NonVeg, Plan, Notes'); return; }
        const veg = parsed.filter(c => c.preference === 'veg').length;
        const non = parsed.filter(c => c.preference === 'nonveg').length;
        const both = parsed.length - veg - non;
        const ok = confirm(
          `Found ${parsed.length} subscribers in the file:\n` +
          `  • ${veg} veg, ${non} non-veg, ${both} both\n` +
          (errors.length ? `  • ${errors.length} rows skipped (missing name)\n` : '') +
          `\nImport them into A2Y now? (existing phone numbers will be updated, not duplicated)`
        );
        if (!ok) return;
        const res = storage.importCustomers(parsed);
        onRefresh();
        alert(`✓ Done. Added ${res.added} new, updated ${res.updated} existing.`);
      } catch (err) {
        alert('Could not read that file. Please export it from Excel as CSV and try again.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const filtered = customers.filter(c => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.code.toLowerCase().includes(q) || c.address.toLowerCase().includes(q);
  });

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">Manage</div>
          <h1>Subscribers</h1>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <input ref={fileRef} type="file" accept=".csv,text/csv" onChange={handleFile} style={{ display: 'none' }} />
          <button className="btn" onClick={() => fileRef.current?.click()}>⬆ Import from Excel</button>
          <button className="btn accent" onClick={handleAddNew}>+ Add subscriber</button>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h3>All subscribers</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <input placeholder="Search name, phone, code…" value={query} onChange={e => setQuery(e.target.value)} style={{ minWidth: 210 }} />
            <div className="hint">{filtered.length} of {customers.length}</div>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr><th>Code</th><th>Name</th><th>Phone</th><th>Area</th><th>Pref</th><th>Plan</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td className="mono" style={{ fontSize: 12 }}>{c.code}</td>
                  <td><strong>{c.name}</strong>{c.dietaryNotes && <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>{c.dietaryNotes}</div>}</td>
                  <td className="mono">{c.phone}</td>
                  <td>{c.address}</td>
                  <td>
                    <span className={`badge ${c.preference}`}>
                      <span className={`mark ${c.preference === 'veg' ? 'veg' : c.preference === 'nonveg' ? 'nonveg' : 'mixed'}`} />
                      {c.preference === 'veg' ? 'Veg' : c.preference === 'nonveg' ? 'Non-veg' : 'Both'}
                    </span>
                  </td>
                  <td>{c.plan}</td>
                  <td><span className={`status ${c.status === 'paused' ? 'paused' : 'active'}`}>{c.status === 'paused' ? 'Paused' : 'Active'}</span></td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <button className="btn" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => handleEdit(c)}>Edit</button>
                    <button className="btn" style={{ padding: '6px 12px', fontSize: 12, marginLeft: 6, color: 'var(--coral)' }} onClick={() => handleDelete(c.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--ink-soft)', padding: 24 }}>No subscribers match “{query}”.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="panel" style={{ maxWidth: 640 }}>
          <div className="panel-head"><h3>{editingId ? 'Edit subscriber' : 'Add subscriber'}</h3></div>
          <div style={{ padding: 20 }}>
            <div className="input-group">
              <div className="field"><label>Name *</label><input value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Aarav Sharma" /></div>
              <div className="field"><label>Phone *</label><input value={formData.phone || ''} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="98-XXXX-XXXX" /></div>
            </div>
            <div className="input-group full">
              <div className="field"><label>Area / Address</label><input value={formData.address || ''} onChange={e => setFormData({ ...formData, address: e.target.value })} placeholder="Arera Colony, Bhopal" /></div>
            </div>
            <div className="input-group">
              <div className="field"><label>Preference *</label>
                <select value={formData.preference || 'veg'} onChange={e => setFormData({ ...formData, preference: e.target.value as Customer['preference'] })}>
                  <option value="veg">Vegetarian</option><option value="nonveg">Non-vegetarian</option><option value="both">Both (flexible)</option>
                </select>
              </div>
              <div className="field"><label>Plan</label>
                <select value={formData.plan || 'Monthly'} onChange={e => setFormData({ ...formData, plan: e.target.value })}>
                  <option>Monthly</option><option>Weekly</option><option>Trial</option>
                </select>
              </div>
            </div>
            <div className="input-group">
              <div className="field"><label>Diet note</label><input value={formData.dietaryNotes || ''} onChange={e => setFormData({ ...formData, dietaryNotes: e.target.value })} placeholder="No onion · Jain · Less spicy" /></div>
              <div className="field"><label>Status</label>
                <select value={formData.status || 'active'} onChange={e => setFormData({ ...formData, status: e.target.value as Customer['status'] })}>
                  <option value="active">Active</option><option value="paused">Paused</option>
                </select>
              </div>
            </div>
            <div className="action-bar">
              <button className="btn" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn primary" onClick={handleSubmit}>Save subscriber</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
