import React from "react";
import { Link } from "react-router-dom";
import TokenService from "../../services/Tokenservice";
import { connect } from "react-redux";
import "./Style.css";
function Unauthorized({ ...props }) {
  const { userprofileState } = props.state;
  const handlelogout = () => {
    TokenService.removeUser();
    window.location = "/";
  };
  return (
    <div className="unauthorized-message">
      <h1>Unauthorized Access</h1>
      <br></br>

      {userprofileState.isAuthenticated ? (
        <p>
          You do not have access to this page. Click&nbsp;
          <span className="link">
            <Link to="/">here</Link>
          </span>
          &nbsp;to navigate to the Dashboard.
        </p>
      ) : (
        <p>
          You do not have access to this site. Click&nbsp;
          <span className="link" onClick={handlelogout}>
            here
          </span>
          &nbsp;to logout and login with other user account.
        </p>
      )}
    </div>
  );
}
const mapStateToProp = (state) => {
  return {
    state: state,
  };
};
export default connect(mapStateToProp)(Unauthorized);
