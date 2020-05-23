import { v4 } from 'uuid';
import { redis } from '../database/redis';

type ConfirmationUrlInput = {
  /** the output url: urlPrefix + id + urlSuffix
   * the output key: prefix + id + suffix
   */
  userId: string;
  prefix?: '' | string;
  suffix?: '' | string;
  expiration?: 3600;
  urlPrefix: string;
  urlSuffix?: '' | string;
};

/**
 * A function that generates a confirmation url in the following format: urlPrefix + id + urlSuffix.
 * Also stores a token in redis for reference where the key is prefix + id + suffix, the value is the user id
 * and expires in 1 hour by default.
 * A prefix or suffix is recommended for security and easier lookup
 */
export async function confirmationUrl({
  userId,
  prefix,
  suffix,
  expiration,
  urlPrefix,
  urlSuffix,
}: ConfirmationUrlInput): Promise<string> {
  // generate a unique id then store it in redis (our memory-based storage)
  const uniqueId = v4();
  // a key-value pair token is stored where key is the prefix+id+suffix, and the value is the user id
  await redis.set(prefix + uniqueId + suffix, userId, 'ex', expiration); // have the uuid expire in 1hr

  // create a url to a graphql mutation
  // check for trailing forward slash, and add it to the end if there isn't one
  if (urlPrefix[urlPrefix.length + 1] !== '/') urlPrefix += '/';
  return urlPrefix + uniqueId + urlSuffix;
}
