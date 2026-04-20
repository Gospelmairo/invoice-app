import { useEffect, useRef } from 'react';
import styles from './DeleteModal.module.css';

export default function DeleteModal({ invoiceId, onConfirm, onCancel }) {
  const cancelRef = useRef(null);

  useEffect(() => {
    cancelRef.current?.focus();

    function onKey(e) {
      if (e.key === 'Escape') onCancel();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onCancel]);

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className={styles.modal}>
        <h2 id="modal-title" className={styles.title}>Confirm Deletion</h2>
        <p className={styles.body}>
          Are you sure you want to delete invoice <strong>#{invoiceId}</strong>?
          This action cannot be undone.
        </p>
        <div className={styles.actions}>
          <button ref={cancelRef} className={styles.btnCancel} onClick={onCancel}>
            Cancel
          </button>
          <button className={styles.btnDelete} onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
