import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { InvoiceProvider } from './context/InvoiceContext';
import Sidebar from './components/Sidebar';
import InvoiceList from './pages/InvoiceList';
import InvoiceDetail from './pages/InvoiceDetail';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <InvoiceProvider>
          <div className="app-layout">
            <Sidebar />
            <main className="app-main">
              <Routes>
                <Route path="/" element={<InvoiceList />} />
                <Route path="/invoice/:id" element={<InvoiceDetail />} />
              </Routes>
            </main>
          </div>
        </InvoiceProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
