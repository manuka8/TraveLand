/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#eef9ff',
                    100: '#d8f1ff',
                    200: '#b9e7ff',
                    300: '#89d7ff',
                    400: '#52beff',
                    500: '#2a9df4',
                    600: '#1480e0',
                    700: '#0d66c0',
                    800: '#0f549a',
                    900: '#12467f',
                    950: '#0d2d52',
                },
                accent: {
                    400: '#fb923c',
                    500: '#f97316',
                    600: '#ea6c0a',
                },
                dark: {
                    800: '#1a1f2e',
                    900: '#0f1420',
                    950: '#070c17',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Poppins', 'system-ui', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'hero-gradient': 'linear-gradient(135deg, #0f1420 0%, #0d2d52 50%, #0f1420 100%)',
            },
            animation: {
                'float': 'float 3s ease-in-out infinite',
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                fadeIn: {
                    from: { opacity: 0 },
                    to: { opacity: 1 },
                },
                slideUp: {
                    from: { transform: 'translateY(20px)', opacity: 0 },
                    to: { transform: 'translateY(0)', opacity: 1 },
                },
            },
        },
    },
    plugins: [],
}
