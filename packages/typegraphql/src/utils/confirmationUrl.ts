import { v4 } from 'uuid';
import { redis } from '../database/redis';

// a function that takes the user id and give back a confirmation url
export async function confirmationUrl(userId: string) {
  // generate a unique id then store it in redis (our memory-based storage)
  const uniqueId = v4();
  await redis.set(uniqueId, userId, 'ex', 60 * 60); // have the uuid expire in 1hr

  // create a url to a graphql mutation from the FRONT END
  const frontEndUrl = 'http://localhost:9999';
  const confirmUrl = `${frontEndUrl}/user/confirm/${uniqueId}`;
  return confirmUrl;
}
