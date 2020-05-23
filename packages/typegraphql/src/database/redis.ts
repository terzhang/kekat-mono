import Redis from 'ioredis';

// setup Redis
export const redis = new Redis({
  port: 6000, // redis port set in my pc
});
