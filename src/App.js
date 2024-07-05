import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useHistory,
} from "react-router-dom";

import { connect } from "react-redux";
import { appmenuActions } from "./actions/appmenu.action";
import Loginpage from "./components/loginpage/Loginpage";
import AppWithRouterAccess from "./AppWithRouterAccess";
import Dashboard from "./components/dashboard/Dashboard";
import Country from "./components/manage/country/Country";
import Lob from "./components/manage/lob/Lob";
import Region from "./components/manage/region/Region";
import Segment from "./components/manage/segment/Segment";
import Sublob from "./components/manage/sublob/Sublob";
import Navbar from "./components/navbar/Navbar";
import User from "./components/manage/user/User";
import Lookup from "./components/manage/lookup/Lookup";
import Lobchapter from "./components/manage/lobchapter/Lobchapter";
import ZNAOrgnization1 from "./components/manage/znaorgnization1/ZNAOrgnization1";
import ZNAOrgnization2 from "./components/manage/znaorgnization2/ZNAOrgnization2";
import ZNAOrgnization3 from "./components/manage/znaorgnization3/ZNAOrgnization3";
import ZNAOrgnization4 from "./components/manage/znaorgnization4/ZNAOrgnization4";
import Office from "./components/manage/office/Office";
import Branch from "./components/manage/branch/Branch";
import Currency from "./components/manage/currency/Currency";
import Breachlog from "./components/breachlog/Breachlog";
import Rfelog from "./components/rfelog/Rfelog";
import Exemptionlog from "./components/exemptionlog/Exemptionlog";
import Unauthorized from "./components/unauthorized/Unauthorized";
import PrivateRoute from "./components/privateroute/PrivateRoute";
import Loader from "./components/common-components/Loading";
import Token from "./components/manage/token/Token";
import { handlePermission } from "./permissions/Permission";
import Co from "./components/manage/co/Co";
import UserView from "./components/manage/userview/UserView";
import Notifications from "./components/manage/notifications/Notifications";

function ScrollToTop() {
  window.scrollTo(0, 0);
  return null;
}
function App({ state, menuClick }) {
  // const { oktaAuth, authState } = useOktaAuth();
  let userProfile;
  if (window.location.pathname === "/login") {
    //TokenService.removeUser();
  } else {
    //userProfile = TokenService.getUser();
    userProfile = {};
  }

  if (window.location.pathname !== "/rfelogs/create-rfelog" && handlePermission("Navbar", window.location.pathname.slice(1)) === false) {
    state.userprofileState.isAuthenticated = false
    state.userprofileState.isUnAuthenticated = true
  }
  if(window.location.pathname === "/rfelogs/create-rfelog" && handlePermission("Navbar", "rfelogs") === false){
    state.userprofileState.isAuthenticated = false
    state.userprofileState.isUnAuthenticated = true
  }

  return (
    <div className="container-fluid">
      <div className="main-container">
        <Router>
          <>
            <AppWithRouterAccess state={state} menuClick={menuClick} />
            {state.userprofileState.isAuthenticated ? (
              <>
                <ScrollToTop />
                <div className="site-container">
                  <Route
                    path="/"
                    render={(routeParams) => (
                      <Navbar
                        userProfile={state.userprofileState.userProfile}
                        state={state}
                        {...routeParams}
                      />
                    )}
                  />
                  <div className="pageview-container">
                    <Switch>
                      <PrivateRoute
                        path="/"
                        exact
                        component={Dashboard}
                        menuClick={menuClick}
                      />
                      <PrivateRoute
                        path="/region"
                        component={Region}
                        menuClick={menuClick}
                      />
                      <PrivateRoute
                        path="/country"
                        component={Country}
                        menuClick={menuClick}
                      />
                      <PrivateRoute
                        path="/token"
                        component={Token}
                        menuClick={menuClick}
                      />
                      <PrivateRoute
                        path="/segment"
                        component={Segment}
                        menuClick={menuClick}
                      />
                      <PrivateRoute
                        path="/lob"
                        component={Lob}
                        menuClick={menuClick}
                      />
                      <PrivateRoute
                        path="/sublob"
                        component={Sublob}
                        menuClick={menuClick}
                      />
                      <PrivateRoute
                        path="/lobchapter"
                        component={Lobchapter}
                        menuClick={menuClick}
                      />
                      <PrivateRoute
                        path="/znaorganization1"
                        component={ZNAOrgnization1}
                        menuClick={menuClick}
                      />
                      <PrivateRoute
                        path="/znaorganization2"
                        component={ZNAOrgnization2}
                        menuClick={menuClick}
                      />
                      <PrivateRoute
                        path="/znaorganization3"
                        component={ZNAOrgnization3}
                        menuClick={menuClick}
                      />
                      <PrivateRoute
                        path="/znaorganization4"
                        component={ZNAOrgnization4}
                        menuClick={menuClick}
                      />
                      <PrivateRoute
                        path="/office"
                        component={Office}
                        menuClick={menuClick}
                      />
                      <PrivateRoute
                        path="/branch"
                        component={Branch}
                        menuClick={menuClick}
                      />
                      <PrivateRoute
                        path="/currency"
                        component={Currency}
                        menuClick={menuClick}
                      />
                      <PrivateRoute
                        path="/user"
                        component={User}
                        menuClick={menuClick}
                      />
                      <PrivateRoute
                        path="/lookup"
                        component={Lookup}
                        menuClick={menuClick}
                      />
                      <PrivateRoute
                        path="/notifications"
                        component={Notifications}
                        menuClick={menuClick}
                      />
                       <PrivateRoute
                        path="/co"
                        component={Co}
                        menuClick={menuClick}
                      />
                       <PrivateRoute
                        path="/userview"
                        component={UserView}
                        menuClick={menuClick}
                      />
                      <PrivateRoute
                        path="/breachlogs"
                        component={Breachlog}
                        menuClick={menuClick}
                      />
                      <PrivateRoute
                        path="/rfelogs"
                        exact
                        component={Rfelog}
                        menuClick={menuClick}
                      />
                      <PrivateRoute
                        path="/exemptionlogs"
                        component={Exemptionlog}
                        menuClick={menuClick}
                      />
                      <Route
                        path="/unauthorizedaccess"
                        component={Unauthorized}
                        state={state}
                        menuClick={menuClick}
                      />
                      <Redirect from="*" to="/" />
                    </Switch>
                  </div>
                </div>
              </>
            ) : (
              state.userprofileState.loading && <Loader />
            )}
          </>
        </Router>
      </div>
    </div>
  );
}
const mapStateToProp = (state) => {
  return {
    state: state,
  };
};
const mapActions = {
  menuClick: appmenuActions.menuClick,
};
export default connect(mapStateToProp, mapActions)(App);
