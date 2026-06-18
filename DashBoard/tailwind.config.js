/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"IBM Plex Sans Arabic"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        surface: {
          DEFAULT: 'rgba(24, 24, 27, 0.72)',
          elevated: 'rgba(39, 39, 42, 0.85)',
          hover: 'rgba(63, 63, 70, 0.5)',
        },
        accent: {
          DEFAULT: '#8b5cf6',
          light: '#a78bfa',
          muted: 'rgba(139, 92, 246, 0.15)',
        },
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(139, 92, 246, 0.45)',
        card: '0 1px 0 rgba(255,255,255,0.06) inset, 0 8px 32px -12px rgba(0,0,0,0.5)',
        'card-hover': '0 1px 0 rgba(255,255,255,0.08) inset, 0 16px 48px -16px rgba(0,0,0,0.55)',
      },
      animation: {
        'fade-up': 'fadeUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) backwards',
        'fade-in': 'fadeIn 0.4s ease-out backwards',
        'scale-in': 'scaleIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) backwards',
        'slide-in-right': 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) backwards',
        'slide-in-left': 'slideInLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'page-enter': 'pageEnter 0.45s cubic-bezier(0.16, 1, 0.3, 1) backwards',
        'nav-indicator': 'navIndicator 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        float: 'float 8s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        'orb-drift': 'orbDrift 14s ease-in-out infinite alternate',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)', filter: 'blur(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)',  filter: 'blur(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.94)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        pageEnter: {
          '0%': { opacity: '0', transform: 'translateY(16px)', filter: 'blur(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)',  filter: 'blur(0)' },
        },
        orbDrift: {
          '0%':   { transform: 'translate(0,0) scale(1)' },
          '33%':  { transform: 'translate(40px,-30px) scale(1.06)' },
          '66%':  { transform: 'translate(-20px,40px) scale(0.96)' },
          '100%': { transform: 'translate(20px,-15px) scale(1.03)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(139,92,246,0.3)' },
          '50%':       { boxShadow: '0 0 50px rgba(139,92,246,0.6)' },
        },
        navIndicator: {
          '0%': { opacity: '0', transform: 'scaleY(0.5)' },
          '100%': { opacity: '1', transform: 'scaleY(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(12px, -20px) scale(1.05)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
