/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: '#7c3aed',
        'brand-light': '#ede9ff',
        'brand-mid': '#a78bfa',
        'brand-dark': '#5b21b6',
        page: '#fafbff',
        surface: '#ffffff',
        'surface-alt': '#f5f3ff',
        ink: '#0f0a1e',
        'ink-2': 'rgba(15,10,30,0.65)',
        'ink-3': 'rgba(15,10,30,0.38)',
      },
      animation: {
        'float-3d': 'float3d 6s ease-in-out infinite',
        'float-3d-slow': 'float3d 9s ease-in-out infinite',
        'float-3d-delayed': 'float3d 7s ease-in-out 2s infinite',
        'shimmer': 'shimmerAnim 2.5s linear infinite',
        'orb1': 'orb1 20s ease-in-out infinite',
        'orb2': 'orb2 25s ease-in-out infinite',
        'ping-slow': 'pingSlowAnim 2s cubic-bezier(0,0,0.2,1) infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        float3d: {
          '0%,100%': { transform: 'translateY(0) rotateX(0deg) rotateY(0deg)' },
          '25%': { transform: 'translateY(-12px) rotateX(2deg) rotateY(-1deg)' },
          '50%': { transform: 'translateY(-20px) rotateX(0deg) rotateY(2deg)' },
          '75%': { transform: 'translateY(-10px) rotateX(-1deg) rotateY(0deg)' },
        },
        shimmerAnim: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        orb1: {
          '0%,100%': { transform: 'translate(0,0) scale(1)' },
          '33%': { transform: 'translate(60px,-40px) scale(1.1)' },
          '66%': { transform: 'translate(-30px,50px) scale(0.95)' },
        },
        orb2: {
          '0%,100%': { transform: 'translate(0,0) scale(1)' },
          '33%': { transform: 'translate(-80px,30px) scale(1.15)' },
          '66%': { transform: 'translate(40px,-60px) scale(0.9)' },
        },
        pingSlowAnim: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '75%,100%': { transform: 'scale(2.5)', opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      boxShadow: {
        'glow': '0 0 50px rgba(124,58,237,0.25)',
        'glow-sm': '0 0 25px rgba(124,58,237,0.18)',
        'card': '0 4px 30px rgba(124,58,237,0.08), 0 1px 4px rgba(0,0,0,0.04)',
        'card-hover': '0 20px 60px rgba(124,58,237,0.16), 0 4px 16px rgba(0,0,0,0.06)',
        '3d': '0 30px 80px -10px rgba(124,58,237,0.2), 0 0 0 1px rgba(124,58,237,0.1)',
        'float': '0 40px 100px -20px rgba(124,58,237,0.3)',
      },
    },
  },
  plugins: [],
}
