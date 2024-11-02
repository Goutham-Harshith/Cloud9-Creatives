import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cloud9.creatives',
  appName: 'Cloud9 Creatives',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 0, // Disable default splash screen
      showSpinner: false, // Disables any spinner that may appear
      androidSplashResourceName: '', // Ensures no default splash icon on Android
    }
  }
};

export default config;
