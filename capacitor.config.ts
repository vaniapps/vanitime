import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
 appId: 'com.vanipedia.vanitimeapp',
 appName: 'vanitimeapp',
 webDir: 'build',
 server: {
  androidScheme: 'https',
  url:"http://172.20.10.4:3000",
  cleartext: true
 },
}

export default config
