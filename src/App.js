import React, { useEffect, useState } from "react";
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
import AddRfelogForm from "./components/rfelog/CreateRfelogForm";
import Token from "./components/manage/token/Token";
import { handlePermission } from "./permissions/Permission";
import Co from "./components/manage/co/Co";
import UserView from "./components/manage/userview/UserView";
import Notifications from "./components/manage/notifications/Notifications";
import Emailrequest from "./components/emailrequest/EmailRequest";
import Generic from "./genericApi";
import { getUrlParameter } from "./helpers";
import ChatPage from "./components/rfelog/ChatPage";

function ScrollToTop() {
  window.scrollTo(0, 0);
  return null;
}
function App({ state, menuClick }) {
  const [isCheck, setIsCheck] = useState(false);
  const [isGenericPath, setIsGernericPath] = useState(false);
  useEffect(() => {
    let pastPath = sessionStorage.getItem('path');
    if (window.location.pathname.search('generic') === 1 || pastPath === 'generic') {
      if (pastPath === 'generic') {
        window.location.href = window.location.origin + '/generic'
      }
      setIsGernericPath(true)
      setIsCheck(true)
    }
    setTimeout(() => {
      setIsCheck(true)
    }, 2000);
  }, [window.location.pathname])
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
  if (window.location.pathname === "/rfelogs/create-rfelog" && handlePermission("Navbar", "rfelogs") === false) {
    state.userprofileState.isAuthenticated = false
    state.userprofileState.isUnAuthenticated = true
  }

  if (window.location.pathname === '/chat/login/callback' || window.location.pathname === '/.auth/login/aad/callback') {
    let code = getUrlParameter("code")
    localStorage.setItem('code', code)
  }

  return (
    <>
      {isCheck ?
        <>
          {isGenericPath ?
            <>
              <Generic />
            </>
            :
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
                            render={(routeParams) => {
                              if (window.location.search) {
                                return;
                              } else if ((window.location.pathname === "/rfelogs/create-rfelog" && !localStorage.getItem('in-app')) || window.location.pathname === '/chat/login/callback' || window.location.pathname === '/.auth/login/aad/callback') {
                                return;
                              } else {
                                return <Navbar
                                  userProfile={state.userprofileState.userProfile}
                                  state={state}
                                  {...routeParams}
                                />
                              }
                            }}
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
                                path="/email-request"
                                component={Emailrequest}
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
                                path="/rfelogs/create-rfelog"
                                exact
                                component={AddRfelogForm}
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
                              <Route
                                path="/chat/login/callback"
                                component={ChatPage}
                                state={state}
                                menuClick={menuClick}
                              />
                              <Route
                                path="/.auth/login/aad/callback"
                                component={ChatPage}
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
          }
        </> :
        <Loader />
      }
    </>
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
