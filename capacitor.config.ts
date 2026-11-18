import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'dz.rihla.app',
  appName: 'Rihla',
  webDir: 'dist',
  backgroundColor: '#FBF5EA',
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      backgroundColor: '#0E4C6B',
      showSpinner: false,
    },
  },
};

export default config;
