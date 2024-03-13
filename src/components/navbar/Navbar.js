import React from "react";
import { Link } from "react-router-dom";
import { handlePermission } from "../../permissions/Permission";

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
            {userProfile && handlePermission("Navbar", "regionmanage", userProfile) && (
              <Link to="/region">
                <div className="menu-item">Manage</div>
              </Link>
            )}
            {userProfile &&
              handlePermission("Navbar", "usermanage", userProfile) && (
                <Link to="/user">
                  <div className="menu-item">Manage</div>
                </Link>
              )}
            {appmenu.isSubmenu ? (
              <div className="submenu-container">
                {userProfile && handlePermission("Navbar", "region", userProfile) && (
                  <Link to="/region">
                    <div
                      className={`menu-item ${
                        location.pathname === "/region" && "active"
                      }`}
                    >
                      Region
                    </div>
                  </Link>
                )}
                {userProfile && handlePermission("Navbar", "country", userProfile) && (
                  <Link to="/country">
                    <div
                      className={`menu-item ${
                        location.pathname === "/country" && "active"
                      }`}
                    >
                      Country
                    </div>
                  </Link>
                )}
                {userProfile && handlePermission("Navbar", "segment", userProfile) && (
                  <Link to="/segment">
                    <div
                      className={`menu-item ${
                        location.pathname === "/segment" && "active"
                      }`}
                    >
                      Segment
                    </div>
                  </Link>
                )}
                {userProfile && handlePermission("Navbar", "lob", userProfile) && (
                  <Link to="/lob">
                    <div
                      className={`menu-item ${
                        location.pathname === "/lob" && "active"
                      }`}
                    >
                      LoB
                    </div>
                  </Link>
                )}
                {userProfile && handlePermission("Navbar", "sublob", userProfile) && (
                  <Link to="/sublob">
                    <div
                      className={`menu-item ${
                        location.pathname === "/sublob" && "active"
                      }`}
                    >
                      Sub-LoB
                    </div>
                  </Link>
                )}
                {userProfile && handlePermission("Navbar", "lobchapter", userProfile) && (
                  <Link to="/lobchapter">
                    <div
                      className={`menu-item ${
                        location.pathname === "/lobchapter" && "active"
                      }`}
                    >
                      LoB Chapter
                    </div>
                  </Link>
                )}
                {userProfile && handlePermission("Navbar", "token", userProfile) && (
                  <Link to="/token">
                    <div
                      className={`menu-item ${
                        location.pathname === "/token" && "active"
                      }`}
                    >
                      Token
                    </div>
                  </Link>
                )}
                {userProfile && handlePermission("Navbar", "znaorganization1", userProfile) && (
                  <Link to="/znaorganization1">
                    <div
                      className={`menu-item ${
                        location.pathname === "/znaorganization1" && "active"
                      }`}
                    >
                      ZNA Organization 1
                    </div>
                  </Link>
                )}
                {userProfile && handlePermission("Navbar", "znaorganization2", userProfile) && (
                  <Link to="/znaorganization2">
                    <div
                      className={`menu-item ${
                        location.pathname === "/znaorganization2" && "active"
                      }`}
                    >
                      ZNA Organization 2
                    </div>
                  </Link>
                )}
                {userProfile && handlePermission("Navbar", "znaorganization3", userProfile) && (
                  <Link to="/znaorganization3">
                    <div
                      className={`menu-item ${
                        location.pathname === "/znaorganization3" && "active"
                      }`}
                    >
                      ZNA Organization 3
                    </div>
                  </Link>
                )}
                {userProfile && handlePermission("Navbar", "znaorganization4", userProfile) && (
                  <Link to="/znaorganization4">
                    <div
                      className={`menu-item ${
                        location.pathname === "/znaorganization4" && "active"
                      }`}
                    >
                      ZNA Organization 4
                    </div>
                  </Link>
                )}
                {userProfile && handlePermission("Navbar", "office", userProfile) && (
                  <Link to="/office">
                    <div
                      className={`menu-item ${
                        location.pathname === "/office" && "active"
                      }`}
                    >
                      Office
                    </div>
                  </Link>
                )}
                {userProfile && handlePermission("Navbar", "branch", userProfile) && (
                  <Link to="/branch">
                    <div
                      className={`menu-item ${
                        location.pathname === "/branch" && "active"
                      }`}
                    >
                      Branch
                    </div>
                  </Link>
                )}
                {userProfile && handlePermission("Navbar", "currency", userProfile) && (
                  <Link to="/currency">
                    <div
                      className={`menu-item ${
                        location.pathname === "/currency" && "active"
                      }`}
                    >
                      Currency
                    </div>
                  </Link>
                )}
                {userProfile &&
                  handlePermission("Navbar", "user", userProfile) && (
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
                {userProfile && handlePermission("Navbar", "lookup", userProfile) && (
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
