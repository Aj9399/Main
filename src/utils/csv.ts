import { Customer } from '../types';

// Minimal, dependency-free CSV parser. Handles quoted fields, escaped quotes,
// embedded commas and newlines, and CRLF. Returns an array of string rows.
export function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let field = '', row: string[] = [], inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += ch;
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === ',') { row.push(field); field = ''; }
      else if (ch === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
      else if (ch !== '\r') field += ch;
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter(r => r.some(c => c.trim() !== ''));
}

// Normalise a free-text veg/non-veg column. Defaults to 'veg' (the safe choice).
export function normPreference(v: string): Customer['preference'] {
  const s = (v || '').toString().trim().toLowerCase();
  if (/non.?veg|nonveg|\bnv\b|chicken|egg|mutton|fish/.test(s)) return 'nonveg';
  if (/both|either|any|mix|flex/.test(s)) return 'both';
  return 'veg';
}

// Map parsed CSV rows (with a header row) to partial Customer objects.
export function mapRowsToCustomers(rows: string[][]): { customers: Array<Partial<Customer>>; errors: string[] } {
  if (rows.length < 2) return { customers: [], errors: ['File has no data rows'] };
  const header = rows[0].map(h => h.trim().toLowerCase());
  const col = (...names: string[]) => {
    for (const n of names) { const idx = header.indexOf(n); if (idx >= 0) return idx; }
    return -1;
  };
  const iName = col('name', 'customer', 'subscriber', 'naam');
  const iPhone = col('phone', 'mobile', 'contact', 'number', 'no', 'phone no');
  const iArea = col('area', 'address', 'location', 'locality');
  const iPref = col('veg/nonveg', 'veg / nonveg', 'preference', 'type', 'veg', 'diet');
  const iPlan = col('plan', 'subscription');
  const iNotes = col('notes', 'note', 'allergy', 'allergen', 'remarks');

  const customers: Array<Partial<Customer>> = [];
  const errors: string[] = [];
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const name = (iName >= 0 ? row[iName] : '').trim();
    if (!name) { errors.push(`Row ${r + 1}: missing name`); continue; }
    customers.push({
      name,
      phone: (iPhone >= 0 ? row[iPhone] : '').trim(),
      address: (iArea >= 0 ? row[iArea] : '').trim(),
      preference: normPreference(iPref >= 0 ? row[iPref] : ''),
      plan: (iPlan >= 0 ? row[iPlan] : '').trim() || 'Monthly',
      dietaryNotes: (iNotes >= 0 ? row[iNotes] : '').trim(),
    });
  }
  return { customers, errors };
}
