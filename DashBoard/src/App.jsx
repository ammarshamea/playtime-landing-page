import React, { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar.jsx';
import Toast from './components/Toast.jsx';
import { Loader2, Sparkles } from 'lucide-react';

const Overview      = lazy(() => import('./pages/Overview.jsx'));
const GenerateToken = lazy(() => import('./pages/GenerateToken.jsx'));
const GenerateKeys  = lazy(() => import('./pages/GenerateKeys.jsx'));
const DecodeToken   = lazy(() => import('./pages/DecodeToken.jsx'));

const PAGES = { overview: Overview, generate: GenerateToken, keys: GenerateKeys, decode: DecodeToken };
const PAGE_META = {
  overview: { title: 'الرئيسية',    desc: 'لوحة التحكم', badge: null },
  generate: { title: 'توليد Token', desc: 'إنشاء كود تفعيل', badge: 'Ed25519' },
  keys:     { title: 'المفاتيح',    desc: 'إدارة المفاتيح', badge: 'Ed25519' },
  decode:   { title: 'قراءة Token', desc: 'فك وتحليل', badge: 'PT1' },
};

function PageLoader() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] gap-5">
      <motion.div
        className="relative w-14 h-14"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.25), rgba(99,102,241,0.15))',
            border: '1px solid rgba(139,92,246,0.3)',
            boxShadow: '0 0 30px rgba(139,92,246,0.2)',
          }}
        />
        <Loader2 className="absolute inset-0 m-auto w-6 h-6" style={{ color: '#c4b5fd' }} />
      </motion.div>
      <motion.p
        className="text-xs font-mono"
        style={{ color: 'var(--muted-dim)' }}
        animate={{ opacity: [0.4, 0.9, 0.4] }}
        transition={{ repeat: Infinity, duration: 1.6 }}
      >
        جاري التحميل…
      </motion.p>
    </div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage]   = useState('overview');
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [toasts, setToasts]             = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4200);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const navigate = useCallback((page) => {
    setCurrentPage(page);
    setSidebarOpen(false);
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setSidebarOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const PageComponent = PAGES[currentPage];
  const meta = PAGE_META[currentPage];

  return (
    <div className="app-bg flex h-screen overflow-hidden">
      {/* Ambient orbs */}
      <div className="orb orb-violet animate-orb-drift" aria-hidden />
      <div className="orb orb-blue animate-orb-drift" style={{ animationDelay: '-6s' }} aria-hidden />
      <div className="orb orb-pink animate-orb-drift" style={{ animationDelay: '-3s' }} aria-hidden />

      {/* Subtle grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.018]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
        aria-hidden
      />

      <Sidebar
        currentPage={currentPage}
        onNavigate={navigate}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content area */}
      <div className="relative z-10 flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <motion.header
          className="flex-shrink-0 h-16 flex items-center px-5 lg:px-8 gap-4"
          style={{
            background: 'rgba(5,5,10,0.75)',
            backdropFilter: 'blur(32px)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Mobile menu toggle */}
          <motion.button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl text-zinc-400 hover:text-zinc-100 transition-colors"
            style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)' }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            aria-label="فتح القائمة"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </motion.button>

          {/* Page title */}
          <div className="flex-1 min-w-0 flex items-center gap-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                className="flex flex-col"
                initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              >
                <h1 className="text-base font-semibold text-zinc-100 leading-tight truncate">
                  {meta.title}
                </h1>
                <p className="text-[11px] truncate" style={{ color: 'var(--muted-dim)' }}>
                  {meta.desc}
                </p>
              </motion.div>
            </AnimatePresence>

            {meta.badge && (
              <motion.span
                className="badge-violet hidden sm:inline-flex"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 400, damping: 20 }}
              >
                {meta.badge}
              </motion.span>
            )}
          </div>

          {/* Status pill */}
          <motion.div
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
            whileHover={{ borderColor: 'rgba(139,92,246,0.25)' }}
          >
            <motion.span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: 'var(--success)' }}
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
            />
            <span className="text-[10px] font-medium font-mono" style={{ color: 'var(--muted)' }}>
              PT1 · محلي
            </span>
          </motion.div>

          {/* Sparkle icon */}
          <motion.div
            className="hidden md:flex w-8 h-8 items-center justify-center rounded-xl flex-shrink-0"
            style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.18)' }}
            animate={{ boxShadow: ['0 0 0 rgba(139,92,246,0)', '0 0 16px rgba(139,92,246,0.25)', '0 0 0 rgba(139,92,246,0)'] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <Sparkles size={14} style={{ color: '#a78bfa' }} />
          </motion.div>
        </motion.header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              className="min-h-full"
              initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              <Suspense fallback={<PageLoader />}>
                <PageComponent onToast={showToast} onNavigate={navigate} />
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Toast stack */}
      <div className="fixed bottom-6 end-6 z-50 flex flex-col gap-2.5 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              className="pointer-events-auto"
              initial={{ opacity: 0, x: 40, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            >
              <Toast message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
