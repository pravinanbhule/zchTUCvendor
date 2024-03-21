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
            {userProfile && handlePermission("Navbar", "regionmanage") && (
              <Link to="/region">
                <div className="menu-item">Manage</div>
              </Link>
            )}
            {userProfile &&
              handlePermission("Navbar", "usermanage") && (
                <Link to="/user">
                  <div className="menu-item">Manage</div>
                </Link>
            )}
            {userProfile &&
              handlePermission("Navbar", "lookupmanage") && (
                <Link to="/lookup">
                  <div className="menu-item">Manage</div>
                </Link>
            )}
            {appmenu.isSubmenu ? (
              <div className="submenu-container">
                {userProfile && handlePermission("Navbar", "region") && (
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
                {userProfile && handlePermission("Navbar", "country") && (
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
                {userProfile && handlePermission("Navbar", "segment") && (
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
                {userProfile && handlePermission("Navbar", "lob") && (
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
                {userProfile && handlePermission("Navbar", "sublob") && (
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
                {userProfile && handlePermission("Navbar", "lobchapter") && (
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
                {userProfile && handlePermission("Navbar", "token") && (
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
                {userProfile && handlePermission("Navbar", "znaorganization1") && (
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
                {userProfile && handlePermission("Navbar", "znaorganization2") && (
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
                {userProfile && handlePermission("Navbar", "znaorganization3") && (
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
                {userProfile && handlePermission("Navbar", "znaorganization4") && (
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
                {userProfile && handlePermission("Navbar", "office") && (
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
                {userProfile && handlePermission("Navbar", "branch") && (
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
                {userProfile && handlePermission("Navbar", "currency") && (
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
                {userProfile && handlePermission("Navbar", "co") && (
                  <Link to="/co">
                    <div
                      className={`menu-item ${
                        location.pathname === "/co" && "active"
                      }`}
                    >
                      CO
                    </div>
                  </Link>
                )}
                {userProfile && handlePermission("Navbar", "userview") && (
                  <Link to="/userview">
                    <div
                      className={`menu-item ${
                        location.pathname === "/co" && "active"
                      }`}
                    >
                      User View
                    </div>
                  </Link>
                )}
                {userProfile &&
                  handlePermission("Navbar", "user") && (
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
                {userProfile && handlePermission("Navbar", "lookup") && (
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
