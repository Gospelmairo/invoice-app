import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useInvoices } from '../context/InvoiceContext';
import StatusBadge from '../components/StatusBadge';
import DeleteModal from '../components/DeleteModal';
import InvoiceForm from '../components/InvoiceForm';
import { formatDate, formatCurrency } from '../utils/formatDate';
import styles from './InvoiceDetail.module.css';

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { invoices, deleteInvoice, markPaid } = useInvoices();
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const invoice = invoices.find(i => i.id === id);

  if (!invoice) {
    return (
      <div className={styles.page}>
        <Link to="/" className={styles.backLink}>← Go Back</Link>
        <p className={styles.notFound}>Invoice not found.</p>
      </div>
    );
  }

  function handleDelete() {
    deleteInvoice(invoice.id);
    navigate('/');
  }

  return (
    <div className={styles.page}>
      <Link to="/" className={styles.backLink}>← Go Back</Link>

      {/* Status bar */}
      <div className={styles.statusBar}>
        <span className={styles.statusLabel}>Status</span>
        <StatusBadge status={invoice.status} />

        <div className={styles.actions}>
          {invoice.status !== 'paid' && (
            <button className={styles.btnEdit} onClick={() => setShowEdit(true)}>Edit</button>
          )}
          <button className={styles.btnDelete} onClick={() => setShowDelete(true)}>Delete</button>
          {invoice.status === 'pending' && (
            <button className={styles.btnPaid} onClick={() => markPaid(invoice.id)}>
              Mark as Paid
            </button>
          )}
        </div>
      </div>

      {/* Invoice card */}
      <article className={styles.card}>
        <div className={styles.cardTop}>
          <div>
            <p className={styles.cardId}><span className={styles.hash}>#</span>{invoice.id}</p>
            <p className={styles.cardDesc}>{invoice.description}</p>
          </div>
          <address className={styles.senderAddr}>
            {invoice.senderAddress.street}<br />
            {invoice.senderAddress.city}<br />
            {invoice.senderAddress.postCode}<br />
            {invoice.senderAddress.country}
          </address>
        </div>

        <div className={styles.metaGrid}>
          <div>
            <p className={styles.metaLabel}>Invoice Date</p>
            <p className={styles.metaValue}>{formatDate(invoice.invoiceDate)}</p>
          </div>
          <div>
            <p className={styles.metaLabel}>Payment Due</p>
            <p className={styles.metaValue}>{formatDate(invoice.paymentDue)}</p>
          </div>
          <div>
            <p className={styles.metaLabel}>Bill To</p>
            <p className={styles.metaValue}>{invoice.clientName}</p>
            <address className={styles.clientAddr}>
              {invoice.clientAddress.street}<br />
              {invoice.clientAddress.city}<br />
              {invoice.clientAddress.postCode}<br />
              {invoice.clientAddress.country}
            </address>
          </div>
          <div>
            <p className={styles.metaLabel}>Sent To</p>
            <p className={styles.metaValue}>{invoice.clientEmail}</p>
          </div>
        </div>

        {/* Items table */}
        <div className={styles.items}>
          <div className={styles.itemsHead}>
            <span>Item Name</span>
            <span>QTY.</span>
            <span>Price</span>
            <span>Total</span>
          </div>
          {invoice.items.map((item, i) => (
            <div key={i} className={styles.itemRow}>
              <span className={styles.itemName}>{item.name}</span>
              <span className={styles.itemQty}>{item.quantity}</span>
              <span className={styles.itemPrice}>{formatCurrency(item.price)}</span>
              <span className={styles.itemTotal}>{formatCurrency(item.quantity * item.price)}</span>
            </div>
          ))}

          <div className={styles.grandTotal}>
            <span>Amount Due</span>
            <span className={styles.grandAmount}>{formatCurrency(invoice.total)}</span>
          </div>
        </div>
      </article>

      {/* Mobile action bar */}
      <div className={styles.mobileActions}>
        {invoice.status !== 'paid' && (
          <button className={styles.btnEdit} onClick={() => setShowEdit(true)}>Edit</button>
        )}
        <button className={styles.btnDelete} onClick={() => setShowDelete(true)}>Delete</button>
        {invoice.status === 'pending' && (
          <button className={styles.btnPaid} onClick={() => markPaid(invoice.id)}>
            Mark as Paid
          </button>
        )}
      </div>

      {showDelete && (
        <DeleteModal
          invoiceId={invoice.id}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}

      {showEdit && (
        <InvoiceForm existing={invoice} onClose={() => setShowEdit(false)} />
      )}
    </div>
  );
}
