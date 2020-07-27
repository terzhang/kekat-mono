// import 'core-js/stable';
import 'regenerator-runtime/runtime';
import ReactDOM from 'react-dom';
import React from 'react';
import { Provider as UrqlProvider } from 'urql';
import { client } from './API/client';
import { AppRouter } from './router';
import { User } from './containers/User';
import './css/index.css';

ReactDOM.render(
  <UrqlProvider value={client}>
    <User.Provider>
      <AppRouter />
    </User.Provider>
  </UrqlProvider>,
  document.getElementById('app')
);
