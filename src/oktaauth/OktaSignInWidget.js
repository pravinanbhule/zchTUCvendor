import React, { useEffect, useRef } from "react";
import OktaSignIn from "@okta/okta-signin-widget";
import "@okta/okta-signin-widget/dist/css/okta-sign-in.min.css";
import { useOktaAuth } from "@okta/okta-react";
const OktaSignInWidget = ({ config, onSuccess, onError }) => {
  const widgetRef = useRef();
  const { oktaAuth, authState } = useOktaAuth();
  useEffect(() => {
    if (!widgetRef.current) return false;

    //const widget = new OktaSignIn(config);
    const widget = oktaAuth.signInWithRedirect();
    widget
      .showSignInToGetTokens({
        el: widgetRef.current,
      })
      .then(onSuccess)
      .catch(onError);

    return () => widget.remove();
  }, [config, onSuccess, onError]);

  return <div ref={widgetRef} />;
};
export default OktaSignInWidget;
