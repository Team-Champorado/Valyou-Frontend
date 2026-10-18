/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1569ca',
          hover: '#0e52a5',
          light: '#7fd0e2',
          pastel: '#d4eef5',
          soft: '#e8f4f8',
        },
        accent: {
          yellow: '#ffc005',
          'yellow-pastel': '#fff4cc',
          orange: '#ff8401',
          'orange-pastel': '#ffe4cc',
        },
        background: {
          main: '#fafbfd',
          card: '#ffffff',
          white: '#f1efec',
        },
        text: {
          primary: '#1a2b3c',
          secondary: '#6b7d8f',
          muted: '#9aa8b5',
        },
        border: {
          light: '#e5eaef',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'memphis': '4px 4px 0px 0px rgba(21, 105, 202, 0.15)',
        'memphis-orange': '4px 4px 0px 0px rgba(255, 132, 1, 0.2)',
        'memphis-card': '0 8px 30px -4px rgba(21, 105, 202, 0.08)',
        'memphis-float': '0 20px 40px -10px rgba(21, 105, 202, 0.12)',
      },
    },
  },
  plugins: [],
}
