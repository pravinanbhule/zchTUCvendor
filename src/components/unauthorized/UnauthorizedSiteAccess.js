import React from "react";
import TokenService from "../../services/Tokenservice";
import { useOktaAuth } from "@okta/okta-react";

import "./Style.css";
function UnauthorizedSiteAccess({ ...props }) {
  const { oktaAuth, authState } = useOktaAuth();
  const handlelogout = async () => {
    TokenService.removeUser();
    await oktaAuth.signOut();
  };
  return (
    <div className="unauthorized-message">
      <h1>Unauthorized Access</h1>
      <br></br>

      <p>
        You do not have access to this site. Click&nbsp;
        <span className="link" onClick={handlelogout}>
          here
        </span>
        &nbsp;to logout and login with other user account.
      </p>
    </div>
  );
}

export default UnauthorizedSiteAccess;
