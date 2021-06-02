import React, { useEffect} from "react";
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';

import { useAuth } from '../global';
import routerLinks from "../utils/routerLinks";
import {routes, arrayPaths} from "./routes";

const Layout = ({layout: Layout, isPublic, children}) => {
  const auth = useAuth();
  if (isPublic === true || auth.user)
    return <Layout>{children}</Layout>;
  return <Redirect to='/auth/login'/>;
};

const Page = ({title, component: Comp, ...props}) => {
  const auth = useAuth();

  useEffect(() => {
    auth.setTitlePage('titles.' + title || "");
  }, [title]);

  return <Comp {...props} />;
};

export default () => (
  <HashRouter>
    <Switch>
      {
        routes.map(({layout, isPublic, child}, index) => (
          <Route key={index} path={arrayPaths[index]}>
            <Layout layout={layout} isPublic={isPublic}>
              {child.map(({path, title, component}, subIndex) => (
                <Route key={subIndex} path={path}
                       render={(props) => <Page title={title} component={component} {...props}/>}/>
              ))}
            </Layout>
          </Route>
        ))
      }
      <Route component={() => <Redirect to={routerLinks('Profile')}/>} />
    </Switch>
  </HashRouter>
);

