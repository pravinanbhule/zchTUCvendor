const oktaAuthConfig = {
  // Note: If your app is configured to use the Implicit flow
  // instead of the Authorization Code with Proof of Code Key Exchange (PKCE)
  // you will need to add `pkce: false`
  //issuer: "https://dev-97242534.okta.com/oauth2/default",
  //clientId: "0oa5t6jij44rNLQOk5d7",
  issuer: "https://zurichtest.oktapreview.com/oauth2/aus16yog9z58Gq5LO0h8",
  clientId: "0oa16yoi5gddu5ZXx0h8",
  //issuer: "https://zurich.okta-emea.com/oauth2/aus8962grhVCUonuz0i7",
  //clientId: "0oa8960ob0CS6ZizE0i7",
  redirectUri: window.location.origin + "/login/callback",
  postLogoutRedirectUri: window.location.origin + "/login",
  logoutUrl: window.location.origin + "/login",
  scopes: ["openid", "profile", "email"],
};

const oktaSignInConfig = {
  //baseUrl: "https://dev-97242534.okta.com",
  //clientId: "0oa5t6jij44rNLQOk5d7",
  baseUrl: "https://zurichtest.oktapreview.com",
  clientId: "0oa16yoi5gddu5ZXx0h8",
  //baseUrl: "https://zurich.okta-emea.com",
  //clientId: "0oa8960ob0CS6ZizE0i7",
  redirectUri: window.location.origin + "/login/callback",
  postLogoutRedirectUri: window.location.origin + "/login",
  logoutUrl: window.location.origin + "/login",
  scopes: ["openid", "profile", "email"],
  authParams: {
    // If your app is configured to use the Implicit flow
    // instead of the Authorization Code with Proof of Code Key Exchange (PKCE)
    // you will need to uncomment the below line
    // pkce: false
  },
  disableHttpsCheck: true,
  // Additional documentation on config options can be found at https://github.com/okta/okta-signin-widget#basic-config-options
};

export { oktaAuthConfig, oktaSignInConfig };
