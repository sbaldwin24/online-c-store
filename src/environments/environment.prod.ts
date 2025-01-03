export const environment = {
  production: true,
  apiUrl: 'https://dummyjson.com',
  version: '1.0.0',
  environmentName: 'production',
  auth: {
    clientId: 'your-client-id',
    authority: 'https://your-auth-server.com',
    redirectUri: 'https://your-app.com/callback'
  },
  features: {
    enableAnalytics: true,
    enableCache: true,
    debugMode: false
  },
  apiTimeoutMs: 30000,
  cacheExpiryMs: 3600000 // 1 hour
};
