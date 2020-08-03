import {
  createClient,
  dedupExchange,
  fetchExchange,
  subscriptionExchange,
} from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';
import { API_URL } from '../constants/api';

import { SubscriptionClient } from 'subscriptions-transport-ws';

// https://formidable.com/open-source/urql/docs/graphcache/schema-awareness/#integrating
const cache = cacheExchange({});

// a subscription client that uses ws protocol its subscription endpoints
const subscriptionClient = new SubscriptionClient('ws://localhost:8888', {
  reconnect: true,
  connectionParams: {
    authToken: localStorage.getItem('secondHalfToken'),
  },
});

export const client = createClient({
  url: API_URL + '/graphql',
  fetchOptions: () => ({
    // credential must be 'include' when using fetch API
    // so cookie will be sent in request header to service
    // https://stackoverflow.com/questions/36824106/express-doesnt-set-a-cookie
    credentials: 'include',
    // send back the second half of the jwt
    headers: {
      authorization: `bearer ${localStorage.getItem('secondHalfToken')}`,
    },
  }),
  exchanges: [
    dedupExchange,
    cache,
    fetchExchange,
    subscriptionExchange({
      // handler that passes the subscription operation (sub. exchnage)
      // onto the subscription client
      forwardSubscription: (operation) => subscriptionClient.request(operation),
    }),
  ],
});
