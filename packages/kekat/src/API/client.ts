import { createClient, dedupExchange, fetchExchange } from 'urql';
// import { cacheExchange } from '@urql/exchange-graphcache';
import { API_URL } from '../constants/api';
// const cache = cacheExchange({});

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
  exchanges: [dedupExchange, /* cache, */ fetchExchange],
});
