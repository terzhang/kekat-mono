import React from 'react';
import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom';
import { Home } from '../pages/Home';

// history to go back and forth
// import { Login } from '../pages/Login';
// import { Register } from '../pages/Register';
// import { Logout } from '../pages/Logout';
// import { ConfirmEmail } from '../pages/ConfirmEmail';

// sidebar
// import { SidebarRoutes } from './Sidebar';
// import { PrivateRoute } from './PrivateRoute';

import loadable from '@loadable/component';

// for non-default imports use resolveComponent
// https://loadable-components.com/docs/api-loadable-component/#optionsresolvecomponent
const Login = loadable(() => import('../pages/Login'), {
  resolveComponent: (imported) => imported.Login,
});

const Register = loadable(() => import('../pages/Register'), {
  resolveComponent: (imported) => imported.Register,
});

const Logout = loadable(() => import('../pages/Logout'), {
  resolveComponent: (imported) => imported.Logout,
});

const ConfirmEmail = loadable(() => import('../pages/ConfirmEmail'), {
  resolveComponent: (imported) => imported.ConfirmEmail,
});

const SidebarRoutes = loadable(() => import('./Sidebar'), {
  resolveComponent: (imported) => imported.SidebarRoutes,
});

const PrivateRoute = loadable(() => import('./PrivateRoute'), {
  resolveComponent: (imported) => imported.PrivateRoute,
});

/** routes that can only be access when authorized */
const Authorized = () => {
  return (
    <PrivateRoute>
      <SidebarRoutes />
      <Switch>
        <Route path='/' exact children={<Home />} />
        <Route path='/join' children={<div>Join!</div>} />
        <Route path='/newChat' children={<div>New Chat</div>} />
        <Route path='/logout' children={<Logout />} />
      </Switch>
    </PrivateRoute>
  );
};

/** decides how app navigation works */
export const AppRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path='/confirm' children={<ConfirmEmail />} />
        <Route path='/login' children={<Login />} />
        <Route path='/register' children={<Register />} />
        <Authorized />
        {/* If nothing none of the above route matches go home */}
        <Redirect to='/' />
      </Switch>
    </Router>
  );
};
