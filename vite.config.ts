import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Tout (JS, CSS, polices) est intégré dans un seul index.html :
// le site s'ouvre en double-cliquant dessus, sans serveur, sur PC comme sur téléphone.
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  base: './',
  build: { target: 'es2020', chunkSizeWarningLimit: 2000, assetsInlineLimit: 100_000_000 },
});
