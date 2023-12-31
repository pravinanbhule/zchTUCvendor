import React from "react";
import { Link } from "react-router-dom";

function Navbar({ ...props }) {
  const { appmenu } = props.state;
  const { location, userProfile } = props;

  return (
    <nav className="menu-nav">
      <div className="nav-links">
        <Link to="/">
          <div className={`menu-item ${location.pathname === "/" && "active"}`}>
            Dashboard
          </div>
        </Link>
        {userProfile && (
          <>
            {userProfile && userProfile.isSuperAdmin && (
              <Link to="/region">
                <div className="menu-item">Manage</div>
              </Link>
            )}
            {userProfile &&
              !userProfile.isSuperAdmin &&
              (userProfile.isGlobalAdmin || userProfile.isRegionAdmin) && (
                <Link to="/user">
                  <div className="menu-item">Manage</div>
                </Link>
              )}
            {appmenu.isSubmenu ? (
              <div className="submenu-container">
                {userProfile && userProfile.isSuperAdmin && (
                  <>
                    <Link to="/region">
                      <div
                        className={`menu-item ${
                          location.pathname === "/region" && "active"
                        }`}
                      >
                        Region
                      </div>
                    </Link>
                    <Link to="/token">
                      <div
                        className={`menu-item ${
                          location.pathname === "/token" && "active"
                        }`}
                      >
                        Token
                      </div>
                    </Link>
                    <Link to="/country">
                      <div
                        className={`menu-item ${
                          location.pathname === "/country" && "active"
                        }`}
                      >
                        Country
                      </div>
                    </Link>
                    <Link to="/segment">
                      <div
                        className={`menu-item ${
                          location.pathname === "/segment" && "active"
                        }`}
                      >
                        Segment
                      </div>
                    </Link>
                    <Link to="/lob">
                      <div
                        className={`menu-item ${
                          location.pathname === "/lob" && "active"
                        }`}
                      >
                        LoB
                      </div>
                    </Link>
                    <Link to="/sublob">
                      <div
                        className={`menu-item ${
                          location.pathname === "/sublob" && "active"
                        }`}
                      >
                        Sub-LoB
                      </div>
                    </Link>
                    <Link to="/lobchapter">
                      <div
                        className={`menu-item ${
                          location.pathname === "/lobchapter" && "active"
                        }`}
                      >
                        LoB Chapter
                      </div>
                    </Link>
                    <Link to="/znaorganization1">
                      <div
                        className={`menu-item ${
                          location.pathname === "/znaorganization1" && "active"
                        }`}
                      >
                        ZNA Organization 1
                      </div>
                    </Link>
                    <Link to="/znaorganization2">
                      <div
                        className={`menu-item ${
                          location.pathname === "/znaorganization2" && "active"
                        }`}
                      >
                        ZNA Organization 2
                      </div>
                    </Link>
                    <Link to="/znaorganization3">
                      <div
                        className={`menu-item ${
                          location.pathname === "/znaorganization3" && "active"
                        }`}
                      >
                        ZNA Organization 3
                      </div>
                    </Link>
                    <Link to="/znaorganization4">
                      <div
                        className={`menu-item ${
                          location.pathname === "/znaorganization4" && "active"
                        }`}
                      >
                        ZNA Organization 4
                      </div>
                    </Link>
                    <Link to="/office">
                      <div
                        className={`menu-item ${
                          location.pathname === "/office" && "active"
                        }`}
                      >
                        Office
                      </div>
                    </Link>
                    <Link to="/branch">
                      <div
                        className={`menu-item ${
                          location.pathname === "/branch" && "active"
                        }`}
                      >
                        Branch
                      </div>
                    </Link>
                    <Link to="/currency">
                      <div
                        className={`menu-item ${
                          location.pathname === "/currency" && "active"
                        }`}
                      >
                        Currency
                      </div>
                    </Link>
                  </>
                )}
                {userProfile &&
                  (userProfile.isSuperAdmin ||
                    userProfile.isGlobalAdmin ||
                    userProfile.isRegionAdmin) && (
                    <Link to="/user">
                      <div
                        className={`menu-item ${
                          location.pathname === "/user" && "active"
                        }`}
                      >
                        User
                      </div>
                    </Link>
                  )}
                {userProfile && userProfile.isSuperAdmin && (
                  <>
                    <Link to="/lookup">
                      <div
                        className={`menu-item ${
                          location.pathname === "/lookup" && "active"
                        }`}
                      >
                        Lookup
                      </div>
                    </Link>
                  </>
                )}
              </div>
            ) : (
              ""
            )}
          </>
        )}

        {userProfile &&
          userProfile?.isAdminGroup &&
          userProfile?.isAccessBreachLog && (
            <Link to="/breachlogs">
              <div
                className={`menu-item ${
                  location.pathname === "/breachlogs" && "active"
                }`}
              >
                Breach Logs
              </div>
            </Link>
          )}

        <Link to="/rfelogs">
          <div
            className={`menu-item ${
              location.pathname === "/rfelogs" && "active"
            }`}
          >
            RfE Logs
          </div>
        </Link>

        <Link to="/exemptionlogs">
          <div
            className={`menu-item ${
              location.pathname === "/exemptionlogs" && "active"
            }`}
          >
            Exemption Logs
          </div>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
