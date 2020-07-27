import React from 'react';
import { Link, Switch, Route } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import '../css/sidebar.css';
const sidebarRoutes = [
  {
    path: '/',
    exact: true,
    sidebar: () => <div>Home</div>,
  },
  {
    path: '/join',
    sidebar: () => <div>Join anything</div>,
  },
  {
    path: '/newChat',
    sidebar: () => <div>Create a room</div>,
  },
  {
    path: '/logout',
    sidebar: () => <div>Logout</div>,
  },
];

const Sidebar = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to='/'>Home</Link>
        </li>
        <li>
          <Link to='/join'>Join</Link>
        </li>
        <li>
          <Link to='/newChat'>New chat</Link>
        </li>
        <li>
          <Link to='/logout'>Logout</Link>
        </li>
      </ul>
    </nav>
  );
};

/** SidebarRoutes is like a subrouter that controls the main router components
 * Each switch route here accept a children which can also render a component
 * under the sidebar component
 */
export const SidebarRoutes = () => {
  return (
    <div className='sidebar-container'>
      <Sidebar />
      <Switch>
        <PrivateRoute>
          {sidebarRoutes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              // TODO: a static user profile and name
              children={<route.sidebar />}
            />
          ))}
        </PrivateRoute>
      </Switch>
    </div>
  );
};
