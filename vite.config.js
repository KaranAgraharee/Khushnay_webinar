import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
<<<<<<< HEAD
        target: 'https://webinar-backend-ib7t.onrender.com',
=======
        target: 'https://webinar-backend-ku1e.onrender.com',
>>>>>>> bf356013a9726b865da206ffce992e71e0443435
        changeOrigin: true,
      },
    },
  },
})
