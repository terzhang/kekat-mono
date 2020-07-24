import { v4 } from 'uuid';
import { redis } from '../database/redis';

type ConfirmationUrlInput = {
  /** the output url: urlPrefix + id + urlSuffix
   * the output key: prefix + id + suffix
   */
  userId: string;
  prefix?: '' | string;
  suffix?: '' | string;
  expiration?: number;
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
  prefix = '',
  suffix = '',
  expiration = 60 * 60,
  urlPrefix = '',
  urlSuffix = '',
}: ConfirmationUrlInput): Promise<string | void> {
  // generate a unique id
  const uniqueId = v4();
  // stored as key:value pair in redis
  // (prefix + uniqueId + suffix): userId
  const key = prefix + uniqueId + suffix;
  // setting a key-value always returns a Promise<"Ok"> for some reason
  await redis.set(key, userId, 'ex', expiration, (error, _res) => {
    if (error) {
      console.log(error);
      return;
    }
  }); // expire in 1hr

  // create a url to a graphql mutation
  return urlPrefix + uniqueId + urlSuffix;
}
