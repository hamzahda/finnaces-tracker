import React, { useContext } from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  RouteProps,
  Redirect
} from "react-router-dom";
import { DashboardPage } from "./pages/Dashboard/DashboardPage";
import { LoginPage } from "./pages/Login/LoginPage";
import { RegisterPage } from "./pages/Register/RegisterPage";
import { routes } from "./utils/routes";
import { AuthProvider, authContext } from "./contexts/AuthenticationContext";
import { TagProvider } from "./contexts/TagContext";

const UnauthenticatedRoute: React.FC<RouteProps> = ({
  children,
  ...routeProps
}) => {
  const { token } = useContext(authContext);
  if (token === null) {
    return <Route {...routeProps} />;
  }
  return <Redirect to="/" />;
};

const AuthenticatedRoute: React.FC<RouteProps> = ({
  children,
  ...routeProps
}) => {
  const {
    token,
    actions: { getTokenData }
  } = useContext(authContext);
  if (token !== null) {
    const tokenData = getTokenData();
    if (tokenData !== null) {
      const { exp } = tokenData;

      if (parseInt(exp) * 1000 > Date.now()) {
        return <Route {...routeProps} />;
      }
    }
  }
  return <Redirect to="/" />;
};

const BasePage = () => {
  const { token } = useContext(authContext);
  if (token) {
    return <Redirect to="/dashboard" />;
  } else {
    return <Redirect to="/login" />;
  }
};

export const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TagProvider>
          <Switch>
            <UnauthenticatedRoute
              exact
              path={routes.app.login}
              component={LoginPage}
            />
            <UnauthenticatedRoute
              exact
              path={routes.app.register}
              component={RegisterPage}
            />
            <AuthenticatedRoute
              exact
              path={routes.app.dashboard}
              component={DashboardPage}
            />
            <Route path="/" component={BasePage} />
          </Switch>
        </TagProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};
