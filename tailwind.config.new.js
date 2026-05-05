/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        foreground: '#ffffff',
        // Paleta Neon Max Pro
        neon: {
          pink: '#ff2edf',
          purple: '#7c3aed',
          orange: '#ff6a00',
          cyan: '#00ffff',
          green: '#00ff00',
          yellow: '#ffff00',
        },
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        gold: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
      },
      fontFamily: {
        'display': ['"Bebas Neue"', 'Impact', 'Arial Black', 'sans-serif'],
        'body': ['"Montserrat"', 'system-ui', 'sans-serif'],
        'mono': ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-neon': 'pulseNeon 1.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(255, 45, 219, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(255, 45, 219, 0.6)' },
        },
        pulseNeon: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'gradient-neon': 'linear-gradient(135deg, #ff2edf 0%, #7c3aed 50%, #ff6a00 100%)',
        'gradient-dark': 'linear-gradient(135deg, #000000 0%, #090417 100%)',
      },
      boxShadow: {
        'neon-pink': '0 0 30px rgba(255, 45, 219, 0.5)',
        'neon-purple': '0 0 30px rgba(124, 58, 237, 0.5)',
        'neon-orange': '0 0 30px rgba(255, 106, 0, 0.5)',
        'neon-multi': '0 0 40px rgba(255, 45, 219, 0.3), 0 0 40px rgba(124, 58, 237, 0.3), 0 0 40px rgba(255, 106, 0, 0.3)',
      },
    },
  },
  plugins: [],
}