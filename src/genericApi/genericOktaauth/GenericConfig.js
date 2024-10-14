import { OktaAuth } from '@okta/okta-auth-js';

export const oktaAuth = new OktaAuth({
  clientId: '0oa5t6jij44rNLQOk5d7',
  issuer: 'https://dev-97242534.okta.com/oauth2/default',
  redirectUri: window.location.origin + '/generic/login/callback',
  scopes: ['openid', 'profile', 'email'],
  pkce: true,
  disableHttpsCheck: true,
});
