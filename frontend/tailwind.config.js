/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lb: {
          bg: '#14181c',
          panel: '#1b2228',
          card: '#202830',
          hover: '#2c3440',
          border: '#2c3440',
          borderLight: '#445566',
          green: '#00e054',
          'green-hover': '#00b343',
          orange: '#ff8000',
          'orange-hover': '#e67300',
          blue: '#40bcf4',
          text: '#9ab0c2',
          textMuted: '#677b8c',
          light: '#e1e8ed',
          white: '#ffffff',
        }
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'lb-card': '0 2px 8px rgba(0,0,0,0.6)',
        'lb-glow': '0 0 15px rgba(0, 224, 84, 0.3)',
      },
      aspectRatio: {
        'poster': '2 / 3',
      }
    },
  },
  plugins: [],
}
