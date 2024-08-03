import { crx, defineManifest } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react-swc';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';
import { type PluginOption, defineConfig } from 'vite';

const viteManifestHackIssue846: PluginOption & {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  renderCrxManifest: (manifest: any, bundle: any) => void;
} = {
  name: 'manifestHackIssue846',
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  renderCrxManifest(_manifest: any, bundle: any) {
    bundle['manifest.json'] = bundle['.vite/manifest.json'];
    bundle['manifest.json'].fileName = 'manifest.json';
    // biome-ignore lint/performance/noDelete: <explanation>
    delete bundle['.vite/manifest.json'];
  },
};

const manifest = defineManifest({
  manifest_version: 3,
  description: '',
  name: 'Prevent Supabase Reset Button',
  version: '0.1.0',
  permissions: ['storage'],
  action: {
    default_icon: 'icons/icon.png',
    default_title: 'Prevent Supabase Reset Button',
    default_popup: 'src/ui/index.html',
  },
  content_scripts: [
    {
      matches: ['https://supabase.com/dashboard/project/*'],
      js: ['src/content/index.ts'],
      run_at: 'document_end',
    },
  ],
});

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'esnext',
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  plugins: [viteManifestHackIssue846, react(), crx({ manifest })],
});
