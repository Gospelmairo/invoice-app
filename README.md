# Invoice Management App

A fully responsive, accessible invoice management application built with React and Vite.

## Live URL

> Add your Vercel/Netlify URL here after deployment

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm

### Run Locally

```bash
# Clone the repo
git clone https://github.com/Gospelmairo/invoice-app.git
cd invoice-app

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## Architecture

```
src/
├── context/
│   ├── InvoiceContext.jsx   # Global invoice state (CRUD) + localStorage sync
│   └── ThemeContext.jsx     # Light/dark mode toggle + localStorage sync
├── components/
│   ├── Sidebar.jsx          # Navigation sidebar with theme toggle
│   ├── StatusBadge.jsx      # Coloured draft/pending/paid badge
│   ├── InvoiceForm.jsx      # Create & edit form with validation
│   └── DeleteModal.jsx      # Confirmation modal (ESC + focus trap)
├── pages/
│   ├── InvoiceList.jsx      # Invoice list with filter by status
│   └── InvoiceDetail.jsx    # Invoice detail with actions
└── utils/
    ├── storage.js           # localStorage read/write helpers
    ├── generateId.js        # Random ID generator e.g. "AB1234"
    └── formatDate.js        # Date and currency formatters
```

### State Management

- **React Context + useReducer** for global invoice state
- **Lazy initializer** pattern — `useReducer(reducer, null, loadInvoices)` loads persisted data synchronously on first render, preventing the empty-state overwrite race condition
- **localStorage** synced via a single `useEffect` on every state change

### Routing

React Router v6 with two routes:
- `/` — Invoice list
- `/invoice/:id` — Invoice detail

---

## Trade-offs

| Decision | Reason |
|---|---|
| LocalStorage over IndexedDB/backend | Simpler setup, sufficient for this scope, no server needed |
| CSS Modules over Tailwind/styled-components | Scoped styles without extra dependencies, easier to read |
| Context + useReducer over Redux | No extra library needed for this app's complexity level |
| Lazy initializer for initial state | Prevents the race condition where the save effect wipes localStorage before load effect runs |

---

## Accessibility Notes

- All form fields have associated `<label>` elements
- Delete modal traps focus and closes on `Escape` key
- All buttons use `<button>` elements with visible text or `aria-label`
- Status badges use colour + text (not colour alone)
- Interactive elements have visible `:focus-visible` outlines
- Sidebar theme toggle has descriptive `aria-label` that updates with current mode
- Semantic HTML throughout — `<main>`, `<header>`, `<article>`, `<address>`, `<fieldset>`, `<legend>`
- WCAG AA colour contrast maintained in both light and dark themes

---

## Improvements Beyond Requirements

- **Invoice ID format** — human-readable 6-character IDs (e.g. `AB1234`) matching real invoice conventions
- **Currency formatting** — GBP formatting via `Intl.NumberFormat`
- **Payment terms selector** — Net 1 / 7 / 14 / 30 days with automatic due date calculation
- **Item totals** — calculated live in the form as you type quantity and price
- **Edit locked for paid invoices** — paid invoices cannot be edited, preventing accidental changes
- **Mobile action bar** — fixed bottom bar on detail page for easy access on small screens
- **Smooth theme transition** — CSS transition on background/color for a polished feel
- **Empty state messaging** — context-aware message changes based on active filter
