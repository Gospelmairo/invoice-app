import { createContext, useContext, useReducer, useEffect } from 'react';
import { loadInvoices, saveInvoices } from '../utils/storage';
import { generateId } from '../utils/generateId';
import { addDays } from '../utils/formatDate';

const InvoiceContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [...state, action.payload];

    case 'UPDATE':
      return state.map(inv => inv.id === action.payload.id ? action.payload : inv);

    case 'DELETE':
      return state.filter(inv => inv.id !== action.id);

    case 'MARK_PAID':
      return state.map(inv =>
        inv.id === action.id ? { ...inv, status: 'paid' } : inv
      );

    default:
      return state;
  }
}

export function InvoiceProvider({ children }) {
  const [invoices, dispatch] = useReducer(reducer, null, loadInvoices);

  useEffect(() => {
    saveInvoices(invoices);
  }, [invoices]);

  function buildInvoice(data, status) {
    const today = new Date().toISOString().split('T')[0];
    const paymentDue = addDays(data.invoiceDate || today, Number(data.paymentTerms) || 30);
    const total = (data.items || []).reduce(
      (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.price) || 0),
      0
    );
    return {
      id: data.id || generateId(),
      status,
      createdAt: data.createdAt || today,
      paymentDue,
      description: data.description || '',
      paymentTerms: data.paymentTerms || 30,
      invoiceDate: data.invoiceDate || today,
      clientName: data.clientName || '',
      clientEmail: data.clientEmail || '',
      clientAddress: data.clientAddress || { street: '', city: '', postCode: '', country: '' },
      senderAddress: data.senderAddress || { street: '', city: '', postCode: '', country: '' },
      items: data.items || [],
      total,
    };
  }

  function addInvoice(data, asDraft = false) {
    const invoice = buildInvoice(data, asDraft ? 'draft' : 'pending');
    dispatch({ type: 'ADD', payload: invoice });
    return invoice;
  }

  function updateInvoice(data) {
    const existing = invoices.find(i => i.id === data.id);
    const invoice = buildInvoice({ ...existing, ...data }, existing?.status || 'pending');
    dispatch({ type: 'UPDATE', payload: invoice });
  }

  function deleteInvoice(id) {
    dispatch({ type: 'DELETE', id });
  }

  function markPaid(id) {
    dispatch({ type: 'MARK_PAID', id });
  }

  return (
    <InvoiceContext.Provider value={{ invoices, addInvoice, updateInvoice, deleteInvoice, markPaid }}>
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoices() {
  return useContext(InvoiceContext);
}
