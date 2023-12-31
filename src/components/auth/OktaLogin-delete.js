import React from "react";
import { Redirect } from "react-router-dom";
import OktaSignInWidget from "../../OktaSignInWidget";
import { useOktaAuth } from "@okta/okta-react";

const OktaLogin = ({ config }) => {
  debugger;
  const { oktaAuth, authState } = useOktaAuth();

  const onSuccess = (tokens) => {
    oktaAuth.handleLoginRedirect(tokens);
  };

  const onError = (err) => {
    console.log("error logging in", err);
  };

  if (!authState) return null;

  return authState.isAuthenticated ? (
    <Redirect to={{ pathname: "/" }} />
  ) : (
    <OktaSignInWidget config={config} onSuccess={onSuccess} onError={onError} />
  );
};
export default OktaLogin;
