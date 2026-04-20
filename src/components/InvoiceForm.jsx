import { useState } from 'react';
import styles from './InvoiceForm.module.css';
import { useInvoices } from '../context/InvoiceContext';

const EMPTY_ITEM = { name: '', quantity: '', price: '' };

const EMPTY_FORM = {
  description: '',
  invoiceDate: new Date().toISOString().split('T')[0],
  paymentTerms: '30',
  clientName: '',
  clientEmail: '',
  clientAddress: { street: '', city: '', postCode: '', country: '' },
  senderAddress: { street: '', city: '', postCode: '', country: '' },
  items: [{ ...EMPTY_ITEM }],
};

function validate(data) {
  const errors = {};
  if (!data.clientName.trim()) errors.clientName = 'Required';
  if (!data.clientEmail.trim()) errors.clientEmail = 'Required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.clientEmail))
    errors.clientEmail = 'Invalid email';
  if (!data.description.trim()) errors.description = 'Required';
  if (!data.senderAddress.street.trim()) errors['senderAddress.street'] = 'Required';
  if (!data.clientAddress.street.trim()) errors['clientAddress.street'] = 'Required';
  if (!data.items.length) errors.items = 'Add at least one item';
  data.items.forEach((item, i) => {
    if (!item.name.trim()) errors[`item_${i}_name`] = 'Required';
    if (!item.quantity || Number(item.quantity) <= 0) errors[`item_${i}_qty`] = 'Must be > 0';
    if (!item.price || Number(item.price) < 0) errors[`item_${i}_price`] = 'Must be ≥ 0';
  });
  return errors;
}

export default function InvoiceForm({ onClose, existing }) {
  const { addInvoice, updateInvoice } = useInvoices();
  const [form, setForm] = useState(existing ? {
    ...existing,
    invoiceDate: existing.invoiceDate || new Date().toISOString().split('T')[0],
    paymentTerms: String(existing.paymentTerms || 30),
    items: existing.items.length ? existing.items.map(i => ({
      name: i.name, quantity: String(i.quantity), price: String(i.price)
    })) : [{ ...EMPTY_ITEM }],
  } : EMPTY_FORM);
  const [errors, setErrors] = useState({});

  function setField(path, value) {
    setForm(prev => {
      const next = { ...prev };
      const parts = path.split('.');
      if (parts.length === 1) {
        next[path] = value;
      } else {
        next[parts[0]] = { ...prev[parts[0]], [parts[1]]: value };
      }
      return next;
    });
    setErrors(e => { const n = { ...e }; delete n[path]; return n; });
  }

  function setItem(index, field, value) {
    setForm(prev => {
      const items = prev.items.map((it, i) => i === index ? { ...it, [field]: value } : it);
      return { ...prev, items };
    });
    setErrors(e => { const n = { ...e }; delete n[`item_${index}_${field === 'quantity' ? 'qty' : field}`]; return n; });
  }

  function addItem() {
    setForm(prev => ({ ...prev, items: [...prev.items, { ...EMPTY_ITEM }] }));
  }

  function removeItem(index) {
    setForm(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
  }

  function itemTotal(item) {
    const total = (Number(item.quantity) || 0) * (Number(item.price) || 0);
    return total.toFixed(2);
  }

  function handleSave(asDraft = false) {
    if (!asDraft) {
      const errs = validate(form);
      if (Object.keys(errs).length) { setErrors(errs); return; }
    }
    if (existing) {
      updateInvoice({ ...form, id: existing.id });
    } else {
      addInvoice(form, asDraft);
    }
    onClose();
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.drawer} role="dialog" aria-modal="true" aria-label={existing ? 'Edit invoice' : 'New invoice'}>
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={onClose} aria-label="Close form">
            ← Go Back
          </button>
          <h2 className={styles.title}>{existing ? `Edit #${existing.id}` : 'New Invoice'}</h2>
        </div>

        <div className={styles.body}>
          {/* Bill from */}
          <fieldset className={styles.section}>
            <legend className={styles.sectionTitle}>Bill From</legend>
            <div className={styles.field}>
              <label htmlFor="senderStreet">Street Address {errors['senderAddress.street'] && <span className={styles.err}>{errors['senderAddress.street']}</span>}</label>
              <input id="senderStreet" value={form.senderAddress.street} onChange={e => setField('senderAddress.street', e.target.value)} className={errors['senderAddress.street'] ? styles.inputErr : ''} />
            </div>
            <div className={styles.row3}>
              <div className={styles.field}>
                <label htmlFor="senderCity">City</label>
                <input id="senderCity" value={form.senderAddress.city} onChange={e => setField('senderAddress.city', e.target.value)} />
              </div>
              <div className={styles.field}>
                <label htmlFor="senderPost">Post Code</label>
                <input id="senderPost" value={form.senderAddress.postCode} onChange={e => setField('senderAddress.postCode', e.target.value)} />
              </div>
              <div className={styles.field}>
                <label htmlFor="senderCountry">Country</label>
                <input id="senderCountry" value={form.senderAddress.country} onChange={e => setField('senderAddress.country', e.target.value)} />
              </div>
            </div>
          </fieldset>

          {/* Bill to */}
          <fieldset className={styles.section}>
            <legend className={styles.sectionTitle}>Bill To</legend>
            <div className={styles.field}>
              <label htmlFor="clientName">Client's Name {errors.clientName && <span className={styles.err}>{errors.clientName}</span>}</label>
              <input id="clientName" value={form.clientName} onChange={e => setField('clientName', e.target.value)} className={errors.clientName ? styles.inputErr : ''} />
            </div>
            <div className={styles.field}>
              <label htmlFor="clientEmail">Client's Email {errors.clientEmail && <span className={styles.err}>{errors.clientEmail}</span>}</label>
              <input id="clientEmail" type="email" value={form.clientEmail} onChange={e => setField('clientEmail', e.target.value)} className={errors.clientEmail ? styles.inputErr : ''} />
            </div>
            <div className={styles.field}>
              <label htmlFor="clientStreet">Street Address {errors['clientAddress.street'] && <span className={styles.err}>{errors['clientAddress.street']}</span>}</label>
              <input id="clientStreet" value={form.clientAddress.street} onChange={e => setField('clientAddress.street', e.target.value)} className={errors['clientAddress.street'] ? styles.inputErr : ''} />
            </div>
            <div className={styles.row3}>
              <div className={styles.field}>
                <label htmlFor="clientCity">City</label>
                <input id="clientCity" value={form.clientAddress.city} onChange={e => setField('clientAddress.city', e.target.value)} />
              </div>
              <div className={styles.field}>
                <label htmlFor="clientPost">Post Code</label>
                <input id="clientPost" value={form.clientAddress.postCode} onChange={e => setField('clientAddress.postCode', e.target.value)} />
              </div>
              <div className={styles.field}>
                <label htmlFor="clientCountry">Country</label>
                <input id="clientCountry" value={form.clientAddress.country} onChange={e => setField('clientAddress.country', e.target.value)} />
              </div>
            </div>
          </fieldset>

          {/* Invoice details */}
          <fieldset className={styles.section}>
            <legend className={styles.sectionTitle}>Invoice Details</legend>
            <div className={styles.row2}>
              <div className={styles.field}>
                <label htmlFor="invoiceDate">Invoice Date</label>
                <input id="invoiceDate" type="date" value={form.invoiceDate} onChange={e => setField('invoiceDate', e.target.value)} />
              </div>
              <div className={styles.field}>
                <label htmlFor="paymentTerms">Payment Terms</label>
                <select id="paymentTerms" value={form.paymentTerms} onChange={e => setField('paymentTerms', e.target.value)}>
                  <option value="1">Net 1 Day</option>
                  <option value="7">Net 7 Days</option>
                  <option value="14">Net 14 Days</option>
                  <option value="30">Net 30 Days</option>
                </select>
              </div>
            </div>
            <div className={styles.field}>
              <label htmlFor="description">Project Description {errors.description && <span className={styles.err}>{errors.description}</span>}</label>
              <input id="description" value={form.description} onChange={e => setField('description', e.target.value)} className={errors.description ? styles.inputErr : ''} />
            </div>
          </fieldset>

          {/* Items */}
          <fieldset className={styles.section}>
            <legend className={styles.sectionTitle}>Item List</legend>
            {errors.items && <p className={styles.err}>{errors.items}</p>}
            <div className={styles.itemsHeader}>
              <span>Item Name</span>
              <span>Qty.</span>
              <span>Price</span>
              <span>Total</span>
              <span />
            </div>
            {form.items.map((item, i) => (
              <div key={i} className={styles.itemRow}>
                <div className={styles.field}>
                  <label htmlFor={`item_name_${i}`} className={styles.srOnly}>Item name</label>
                  <input
                    id={`item_name_${i}`}
                    value={item.name}
                    onChange={e => setItem(i, 'name', e.target.value)}
                    placeholder="Item name"
                    className={errors[`item_${i}_name`] ? styles.inputErr : ''}
                  />
                  {errors[`item_${i}_name`] && <span className={styles.err}>{errors[`item_${i}_name`]}</span>}
                </div>
                <div className={styles.field}>
                  <label htmlFor={`item_qty_${i}`} className={styles.srOnly}>Quantity</label>
                  <input
                    id={`item_qty_${i}`}
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={e => setItem(i, 'quantity', e.target.value)}
                    className={errors[`item_${i}_qty`] ? styles.inputErr : ''}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor={`item_price_${i}`} className={styles.srOnly}>Price</label>
                  <input
                    id={`item_price_${i}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.price}
                    onChange={e => setItem(i, 'price', e.target.value)}
                    className={errors[`item_${i}_price`] ? styles.inputErr : ''}
                  />
                </div>
                <span className={styles.itemTotal}>£{itemTotal(item)}</span>
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => removeItem(i)}
                  aria-label={`Remove item ${item.name || i + 1}`}
                >✕</button>
              </div>
            ))}
            <button type="button" className={styles.addItemBtn} onClick={addItem}>
              + Add New Item
            </button>
          </fieldset>
        </div>

        <div className={styles.footer}>
          {!existing && (
            <>
              <button className={styles.btnDiscard} onClick={onClose}>Discard</button>
              <button className={styles.btnDraft} onClick={() => handleSave(true)}>Save as Draft</button>
              <button className={styles.btnSend} onClick={() => handleSave(false)}>Save &amp; Send</button>
            </>
          )}
          {existing && (
            <>
              <button className={styles.btnDiscard} onClick={onClose}>Cancel</button>
              <button className={styles.btnSend} onClick={() => handleSave(false)}>Save Changes</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
