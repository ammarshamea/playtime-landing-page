import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <p className="mt-2 flex items-center gap-1.5 text-xs text-red-400 animate-fade-in">
      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
      {msg}
    </p>
  );
}
