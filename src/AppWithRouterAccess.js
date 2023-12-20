import React from "react";
import { Route, useHistory, Switch } from "react-router-dom";
import TokenService from "./services/Tokenservice";
import {
  Security,
  SecureRoute,
  LoginCallback,
  useOktaAuth,
} from "@okta/okta-react";
import { OktaAuth, toRelativeUrl } from "@okta/okta-auth-js";
import Header from "./components/header/Header";
import OktaLogin from "./oktaauth/OktaLogin";
import UnauthorizedSiteAccess from "./components/unauthorized/UnauthorizedSiteAccess";
import { oktaAuthConfig, oktaSignInConfig } from "./oktaauth/Config";

const oktaAuth = new OktaAuth(oktaAuthConfig);

const AppWithRouterAccess = ({ state, menuClick }) => {
  const history = useHistory();
  const customAuthHandler = () => {
    history.push("/login");
  };
  const restoreOriginalUri = async (_oktaAuth, originalUri) => {
    let redirectURL = originalUri;
    // if (originalUri || originalUri.indexOf("?id=") !== -1 || originalUri.indexOf("?invokeAppId=") !== -1) {
    //   redirectURL = originalUri;
    // }
    //originalUri - will redirect to the original path/location
    history.replace(toRelativeUrl(redirectURL, window.location.origin));
  };
  const securecomponent = () => {
    return <></>;
  };
  return (
    <Security
      oktaAuth={oktaAuth}
      onAuthRequired={customAuthHandler}
      restoreOriginalUri={restoreOriginalUri}
    >
      <Header></Header>
      {state.userprofileState.isUnAuthenticated && <UnauthorizedSiteAccess />}
      <Switch>
        <Route path="/login/callback" exact={true} component={LoginCallback} />

        <Route
          path="/login"
          exact={true}
          render={() => {
            TokenService.removeUser();
            return <OktaLogin config={oktaSignInConfig} />;
          }}
        />
        <SecureRoute path="/" component={securecomponent} />
        {/*<Route
          path="/login"
          exact={true}
          render={() => {
            TokenService.removeUser();
            return <OktaLogin config={oktaSignInConfig} />;
          }}
        />
        <SecureRoute path="/" component={Home} />
        <Route path="/login/callback" component={LoginCallback} />*/}
      </Switch>
    </Security>
  );
};
export default AppWithRouterAccess;
