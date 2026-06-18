import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, KeyRound, Key, ScanSearch, X, Sparkles } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'overview',  label: 'الرئيسية',     icon: LayoutDashboard, desc: 'لوحة التحكم' },
  { id: 'generate',  label: 'توليد Token',  icon: KeyRound,        desc: 'إنشاء كود تفعيل' },
  { id: 'keys',      label: 'المفاتيح',     icon: Key,             desc: 'Ed25519' },
  { id: 'decode',    label: 'قراءة Token',  icon: ScanSearch,      desc: 'فك وتحليل' },
];

const SIDEBAR_W = 'w-64';

function NavItem({ item, active, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 group text-start"
      style={{
        color: active ? '#fff' : 'var(--muted)',
        background: active ? 'rgba(139,92,246,0.18)' : 'transparent',
      }}
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
    >
      {/* Active indicator bar */}
      <AnimatePresence>
        {active && (
          <motion.div
            layoutId="nav-active"
            className="absolute inset-0 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(139,92,246,0.22) 0%, rgba(99,102,241,0.14) 100%)',
              border: '1px solid rgba(139,92,246,0.3)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      {/* Active side accent */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="absolute end-0 top-1/2 w-[3px] h-5 rounded-full"
            style={{ background: 'var(--accent)', translateY: '-50%' }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            exit={{ scaleY: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 24 }}
          />
        )}
      </AnimatePresence>

      <motion.div
        className="relative z-10 flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
        style={{
          background: active ? 'rgba(139,92,246,0.25)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${active ? 'rgba(139,92,246,0.35)' : 'rgba(255,255,255,0.06)'}`,
        }}
        animate={{
          boxShadow: active ? '0 0 16px rgba(139,92,246,0.3)' : '0 0 0 transparent',
        }}
      >
        <item.icon size={14} />
      </motion.div>

      <div className="relative z-10 flex flex-col items-start min-w-0">
        <span className="leading-tight">{item.label}</span>
        <span className="text-[10px] opacity-50 leading-none mt-0.5">{item.desc}</span>
      </div>
    </motion.button>
  );
}

export default function Sidebar({ currentPage, onNavigate, open, onClose }) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col ${SIDEBAR_W} border-r flex-shrink-0 relative z-20`}
        style={{
          background: 'rgba(8,8,14,0.85)',
          backdropFilter: 'blur(32px)',
          borderColor: 'var(--border)',
        }}
      >
        <SidebarInner currentPage={currentPage} onNavigate={onNavigate} />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            <motion.aside
              key="drawer"
              className={`fixed top-0 start-0 bottom-0 z-50 flex flex-col ${SIDEBAR_W} lg:hidden`}
              style={{
                background: 'rgba(8,8,14,0.97)',
                backdropFilter: 'blur(40px)',
                borderInlineEnd: '1px solid var(--border)',
              }}
              initial={{ x: '-100%', opacity: 0.8 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            >
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 end-4 p-1.5 rounded-lg text-zinc-500 hover:text-zinc-100 hover:bg-white/[0.06] transition-colors"
                aria-label="إغلاق"
              >
                <X size={16} />
              </button>
              <SidebarInner currentPage={currentPage} onNavigate={onNavigate} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function SidebarInner({ currentPage, onNavigate }) {
  return (
    <div className="flex flex-col h-full p-4 gap-1 overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-1 mb-5 mt-1">
        <motion.div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(99,102,241,0.2))',
            border: '1px solid rgba(139,92,246,0.4)',
            boxShadow: '0 0 20px rgba(139,92,246,0.2)',
          }}
          animate={{ boxShadow: ['0 0 20px rgba(139,92,246,0.2)', '0 0 40px rgba(139,92,246,0.35)', '0 0 20px rgba(139,92,246,0.2)'] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        >
          <Sparkles size={15} style={{ color: '#c4b5fd' }} />
        </motion.div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-zinc-100">Playtime</span>
          <span className="text-[10px]" style={{ color: 'var(--muted)' }}>License Dashboard</span>
        </div>
      </div>

      {/* Divider */}
      <div className="divider-glow mb-3" />

      {/* Nav items */}
      <nav className="flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            active={currentPage === item.id}
            onClick={() => onNavigate(item.id)}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-4">
        <div className="divider-glow mb-4" />
        <div className="px-1 flex flex-col gap-1">
          <p className="text-[10px] font-mono" style={{ color: 'var(--muted-dim)' }}>
            PT1 Format · Ed25519
          </p>
          <p className="text-[10px]" style={{ color: 'var(--muted-dim)' }}>
            Playtime Manager © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}
