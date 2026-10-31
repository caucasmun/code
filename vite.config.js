import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' — относительный путь к сборке, поэтому сайт одинаково корректно
// работает и по адресу https://USERNAME.github.io/REPOSITORY/,
// и в корне домена, и в локальной папке.
// Если репозиторий публикуется по адресу https://USERNAME.github.io/REPOSITORY/
// и требуется абсолютный путь, замените './' на '/REPOSITORY/'
// (REPOSITORY — точное имя репозитория, см. README, раздел «Публикация»).
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  server: {
    port: 5173,
    open: false,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.js', 'src/**/*.test.jsx'],
    environmentMatchGlobs: [['src/**/*.test.jsx', 'jsdom']],
  },
});
