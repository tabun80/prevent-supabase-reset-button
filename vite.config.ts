import { crx, defineManifest } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

const manifest = defineManifest({
  manifest_version: 3,
  description: '',
  name: 'Prevent Supabase Reset Button',
  version: '0.1.0',
  action: {
    default_icon: 'icons/icon.png',
    default_title: 'Prevent Supabase Reset Button',
    default_popup: 'src/ui/index.html',
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), crx({ manifest })],
});
