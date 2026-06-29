/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{vue,js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        shopee: {
          orange: '#EE4D2D',
          light: '#FFF0ED',
        },
        base: '#0f0e0d',
        surface: {
          DEFAULT: '#171614',
          hi: '#1e1c19',
        },
        wire: {
          DEFAULT: '#2e2b25',
          hi: '#3e3b33',
        },
        sand: {
          DEFAULT: '#d4c5a9',
          2: '#917e6e',
          3: '#5e5650',
        },
        amber: {
          DEFAULT: '#c47c2a',
          dim: '#7a4e1a',
          bg: '#1e1710',
          border: '#3d2e18',
        },
        green: {
          DEFAULT: '#6aaa80',
          bg: '#111e15',
          border: '#1e3d28',
        },
        red: {
          DEFAULT: '#b06a5a',
          bg: '#1a1010',
          border: '#3d2018',
        },
      },
    },
  },
}
