import React from 'react';

export default function PageShell({ children, className = '' }) {
  return (
    <div className={`page-shell animate-page-enter ${className}`}>
      <div className="stagger-children space-y-6">{children}</div>
    </div>
  );
}
