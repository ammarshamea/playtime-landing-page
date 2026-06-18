import React, { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Toast from './components/Toast.jsx';
import { Loader2 } from 'lucide-react';

const Overview = lazy(() => import('./pages/Overview.jsx'));
const GenerateToken = lazy(() => import('./pages/GenerateToken.jsx'));
const GenerateKeys = lazy(() => import('./pages/GenerateKeys.jsx'));
const DecodeToken = lazy(() => import('./pages/DecodeToken.jsx'));

const PAGES = {
  overview: Overview,
  generate: GenerateToken,
  keys: GenerateKeys,
  decode: DecodeToken,
};

const PAGE_META = {
  overview: { title: 'الرئيسية', desc: 'لوحة التحكم' },
  generate: { title: 'توليد Token', desc: 'إنشاء كود تفعيل' },
  keys: { title: 'المفاتيح', desc: 'Ed25519' },
  decode: { title: 'قراءة Token', desc: 'فك وتحليل' },
};

function PageLoader() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-2xl border border-violet-500/30 animate-pulse-soft" />
        <Loader2 className="w-6 h-6 text-violet-400 absolute inset-0 m-auto animate-spin" />
      </div>
      <p className="text-xs text-zinc-600 tracking-wide">جاري التحميل…</p>
    </div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const navigate = useCallback((page) => {
    setCurrentPage(page);
    setSidebarOpen(false);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const PageComponent = PAGES[currentPage];
  const meta = PAGE_META[currentPage];

  return (
    <div className="app-bg flex h-screen overflow-hidden">
      <div className="orb orb-violet" aria-hidden />
      <div className="orb orb-blue" aria-hidden />

      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
          aria-label="إغلاق القائمة"
        />
      )}

      <Sidebar
        currentPage={currentPage}
        onNavigate={navigate}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="relative z-10 flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex-shrink-0 h-16 border-b border-white/[0.06] bg-zinc-950/70 backdrop-blur-2xl flex items-center px-5 lg:px-8 gap-4">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2.5 rounded-xl border border-white/[0.06] bg-zinc-900/80 text-zinc-400 hover:text-zinc-100 hover:border-white/10 transition-all"
            aria-label="فتح القائمة"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>

          <div className="flex-1 min-w-0">
            <h1 className="text-base font-semibold text-zinc-100 truncate">{meta.title}</h1>
            <p className="text-[11px] text-zinc-600 truncate">{meta.desc}</p>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.06] bg-zinc-900/50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-soft" />
            <span className="text-[10px] font-medium text-zinc-500 font-mono">PT1 · محلي</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <Suspense fallback={<PageLoader />}>
            <div key={currentPage} className="animate-page-enter min-h-full">
              <PageComponent onToast={showToast} onNavigate={navigate} />
            </div>
          </Suspense>
        </main>
      </div>

      <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2.5 pointer-events-none">
        {toasts.map((toast, i) => (
          <div
            key={toast.id}
            className="pointer-events-auto"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <Toast message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}
