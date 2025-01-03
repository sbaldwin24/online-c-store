export const environment = {
  production: false,
  apiUrl: 'https://dummyjson.com',
  version: '1.0.0',
  environmentName: 'development',
  auth: {
    clientId: 'your-client-id',
    authority: 'https://your-auth-server.com',
    redirectUri: 'http://localhost:4200/callback'
  },
  features: {
    enableAnalytics: false,
    enableCache: true,
    debugMode: true
  },
  apiTimeoutMs: 30000,
  cacheExpiryMs: 3600000 // 1 hour
};
