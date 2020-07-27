import Redis from 'ioredis';

// setup Redis
export const redis = new Redis({
  port: 6379, // default port for Redis 5.0.9 for Windows
  showFriendlyErrorStack: false, // enable during development only
});
