import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInvoices } from '../context/InvoiceContext';
import StatusBadge from '../components/StatusBadge';
import InvoiceForm from '../components/InvoiceForm';
import { formatDate, formatCurrency } from '../utils/formatDate';
import styles from './InvoiceList.module.css';

const FILTERS = ['all', 'draft', 'pending', 'paid'];

export default function InvoiceList() {
  const { invoices } = useInvoices();
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered = filter === 'all' ? invoices : invoices.filter(i => i.status === filter);

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.heading}>Invoices</h1>
          <p className={styles.count}>
            {filtered.length === 0
              ? 'No invoices'
              : `${filtered.length} invoice${filtered.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        <div className={styles.controls}>
          {/* Filter dropdown */}
          <div className={styles.filterWrap}>
            <button
              className={styles.filterBtn}
              onClick={() => setFilterOpen(o => !o)}
              aria-haspopup="listbox"
              aria-expanded={filterOpen}
            >
              Filter <span className={styles.filterLabel}>by status</span>
              <span className={styles.chevron} aria-hidden="true">{filterOpen ? '▲' : '▼'}</span>
            </button>

            {filterOpen && (
              <ul className={styles.dropdown} role="listbox" aria-label="Filter by status">
                {FILTERS.map(f => (
                  <li key={f} role="option" aria-selected={filter === f}>
                    <label className={styles.filterOption}>
                      <input
                        type="checkbox"
                        checked={filter === f}
                        onChange={() => { setFilter(f); setFilterOpen(false); }}
                      />
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button className={styles.newBtn} onClick={() => setShowForm(true)}>
            <span className={styles.plusIcon} aria-hidden="true">+</span>
            New <span className={styles.newLabel}>Invoice</span>
          </button>
        </div>
      </header>

      {/* List */}
      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon} aria-hidden="true">📭</div>
          <h2>Nothing here</h2>
          <p>
            {filter === 'all'
              ? 'Create an invoice by clicking the New Invoice button.'
              : `No ${filter} invoices found.`}
          </p>
        </div>
      ) : (
        <ul className={styles.list} aria-label="Invoice list">
          {filtered.map(inv => (
            <li key={inv.id}>
              <Link to={`/invoice/${inv.id}`} className={styles.card}>
                <span className={styles.id}><span className={styles.hash}>#</span>{inv.id}</span>
                <span className={styles.due}>Due {formatDate(inv.paymentDue)}</span>
                <span className={styles.client}>{inv.clientName}</span>
                <span className={styles.amount}>{formatCurrency(inv.total)}</span>
                <StatusBadge status={inv.status} />
                <span className={styles.arrow} aria-hidden="true">›</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {showForm && <InvoiceForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
