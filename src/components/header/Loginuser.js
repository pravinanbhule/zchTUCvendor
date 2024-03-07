import React, { useState, useRef, useEffect } from "react";
import locationlogo from "../../assets/location.png";
import TokenService from "../../services/Tokenservice";
import { userprofileActions } from "../../actions";
import { connect } from "react-redux";
import { useOktaAuth } from "@okta/okta-react";
import { USER_ROLE } from "../../constants";
function LoggedInUser({ ...props }) {
  const { userprofileState } = props.state;
  const {
    setOktaAuthenticated,
    setOktaUnAuthenticated,
    setOktaToken,
    setUserProfile,
    getUserProfile,
  } = props;
  const { oktaAuth, authState } = useOktaAuth();
  const [userProfileLocal, setuserProfileLocal] = useState("");
  const [userInitials, setuserInitials] = useState("");
  useEffect(() => {
    const getuser = async () => {
      if (authState && authState.isAuthenticated) {
        let tempUserProfile = await oktaAuth.getUser();
        let tempToken = await oktaAuth.getAccessToken();
        let initialprofile = {
          isAdminGroup: false,
          isSuperAdmin: false,
          isGlobalAdmin: false,
          isRegionAdmin: false,
          isCountryAdmin: false,
          isCountrySuperAdmin: false
        };
        if (tempUserProfile) {
          //tempUserProfile.email = "paula.wolfenson@zurich.com";
          let userprofile = await getUserProfile({
            EmailAddress: tempUserProfile.email,
          });
          let userRoles =
            userprofile && userprofile.userRoles
              ? userprofile.userRoles[0]
              : initialprofile;
          if (userRoles.roleId === USER_ROLE.superAdmin) {
            userprofile.isSuperAdmin = true;
            userprofile.isAdminGroup = true;
          }
          if (userRoles.roleId === USER_ROLE.globalAdmin) {
            userprofile.isGlobalAdmin = true;
            userprofile.isAdminGroup = true;
          }
          if (userRoles.roleId === USER_ROLE.regionAdmin) {
            userprofile.isRegionAdmin = true;
            userprofile.isAdminGroup = true;
          }
          if (userRoles.roleId === USER_ROLE.countryAdmin) {
            userprofile.isCountryAdmin = true;
            userprofile.isAdminGroup = true;
          }
          if (userRoles.roleId === USER_ROLE.countrySuperAdmin) {
            userprofile.isCountrySuperAdmin = true;
            userprofile.isAdminGroup = true;
          }
          tempUserProfile = {
            ...tempUserProfile,
            ...initialprofile,
            ...userprofile,
          };
          setUserProfile(tempUserProfile);
          setuserProfileLocal(tempUserProfile);
          if (userprofile) {
            setuserInitials(
              `${
                tempUserProfile.firstName
                  ? tempUserProfile.firstName.charAt(0)?.toUpperCase()
                  : ""
              }${
                tempUserProfile.lastName
                  ? tempUserProfile.lastName
                      ?.charAt(0)
                      ?.toUpperCase()
                      .charAt(0)
                      ?.toUpperCase()
                  : ""
              }`
            );
            setOktaAuthenticated();
          } else {
            setOktaUnAuthenticated();
          }
        }
        if (tempToken) {
          setOktaToken(tempToken);
        }
      }
    };
    getuser();
  }, [authState]);

  const logout = async () => {
    setshowlogout(false);
    TokenService.removeUser();
    await oktaAuth.signOut();
    //window.location.reload(true);
  };
  const [showlogout, setshowlogout] = useState(false);
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);
  return (
    userprofileState.isAuthenticated && (
      <div className="loggeduser-container">
        <div className="loggeduser">
          <div className="userregion-container">
            <div className="user-region">
              {userProfileLocal && userProfileLocal.profileRegionName}
            </div>
            <div className="user-country">
              {userProfileLocal && userProfileLocal.profileCountryName}
            </div>
          </div>
          <div className="userregion-logo">
            <img src={locationlogo}></img>
          </div>
          <div
            className="user-image profile-picture"
            onClick={() => setshowlogout(!showlogout)}
          >
            {userInitials ? userInitials : ""}
          </div>
        </div>
        {showlogout && (
          <div className="logout-container" ref={wrapperRef}>
            <div>{userProfileLocal.name}</div>
            <div className="logout-btn" onClick={logout}>
              Log out
            </div>
          </div>
        )}
      </div>
    )
  );
  function useOutsideAlerter(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setshowlogout(false);
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }
}

const mapStateToProp = (state) => {
  return {
    state: state,
  };
};
const mapActions = {
  setOktaAuthenticated: userprofileActions.setOktaAuthenticated,
  setOktaUnAuthenticated: userprofileActions.setOktaUnAuthenticated,
  setUserProfile: userprofileActions.setUserProfile,
  setOktaToken: userprofileActions.setOktaToken,
  getUserProfile: userprofileActions.getUserProfile,
};
export default connect(mapStateToProp, mapActions)(LoggedInUser);
