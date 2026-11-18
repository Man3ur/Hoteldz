import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

/**
 * Rend le fichier unique compatible avec un maximum de lecteurs :
 * script classique (pas de type="module", bloqué par certains navigateurs en file://)
 * placé en fin de <body>, après la div #root.
 */
function classicScript(): Plugin {
  return {
    name: 'classic-script',
    enforce: 'post',
    writeBundle(options) {
      const file = path.join(options.dir ?? 'dist', 'index.html');
      if (!fs.existsSync(file)) return;
      let src = fs.readFileSync(file, 'utf8');
      const open = src.indexOf('<script type="module"');
      const headEnd = src.indexOf('</head>');
      if (open < 0 || headEnd < 0 || open > headEnd) return;
      const bodyStart = src.indexOf('>', open) + 1;
      const close = src.lastIndexOf('</script>', headEnd);
      const code = src.slice(bodyStart, close);
      src = src.slice(0, open) + src.slice(close + '</script>'.length);
      // Fonction de remplacement : évite l'interprétation des motifs "$&", "$'"… présents dans le code
      src = src.replace('</body>', () => `<script>${code}</script>\n</body>`);
      fs.writeFileSync(file, src);
    },
  };
}

// Tout (JS, CSS, polices) est intégré dans un seul index.html :
// le site s'ouvre en double-cliquant dessus, sans serveur, sur PC comme sur téléphone.
export default defineConfig({
  plugins: [react(), viteSingleFile(), classicScript()],
  base: './',
  build: {
    target: 'es2019',
    chunkSizeWarningLimit: 2000,
    assetsInlineLimit: 100_000_000,
    rolldownOptions: { output: { format: 'iife' } },
  },
});
