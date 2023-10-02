import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vanipedia.vanitimeapp',
  appName: 'vanitimeapp',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
