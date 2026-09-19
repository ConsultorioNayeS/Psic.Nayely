import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Psic.Nayely/', // <-- Pon aquí el nombre exacto de tu repositorio entre barras
});