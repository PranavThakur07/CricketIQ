/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        stadium: {
          dark: '#07080d',      // Midnight stadium sky background
          card: '#0f1322',      // Deep glassmorphic card base
          cardLight: '#181e36', // Lighter hover card base
          border: '#1f294d',    // Pitch boundary line border
          emerald: '#10b981',   // Emerald pitch grass
          cyan: '#06b6d4',      // Cyber analysis cyan
          accent: '#ffbf00',    // Spotlight gold
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(16, 185, 129, 0.2)' },
          '100%': { boxShadow: '0 0 15px rgba(16, 185, 129, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}
