import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { appmenuActions, dashboardActions } from "../../actions";
import useSetNavMenu from "../../customhooks/useSetNavMenu";
import "./Style.css";
import breachlogo from "./../../assets/Breach.jpg";
import rfelogo from "./../../assets/RFE.jpg";
import exemptionlogo from "./../../assets/Exemption.jpg";
import ConfirmPopup from "../common-components/confirmpopup/ConfirmPopup";
function Dashboard({ ...props }) {
  const history = useHistory();
  const { dashboardState } = props.state;
  const {
    menuClick,
    setDashboardClick,
    getBreachlogCount,
    getRFElogCount,
    getExemptionlogCount,
    userProfile,
  } = props;
  useSetNavMenu({ currentMenu: "Dashboard", isSubmenu: false }, menuClick);
  const initialObj = {
    loading: true,
    total: "",
    status: [],
  };
  const [breachLogDetails, setbreachLogDetails] = useState(initialObj);
  const [refLogDetails, setrefLogDetails] = useState(initialObj);
  const [exemptionLogDetails, setexemptionLogDetails] = useState(initialObj);
  const [showpage, setShowPage] = useState(false)
  useEffect(() => {
    fnOnInit();
  }, []);
  const fnOnInit = () => {
    if (userProfile?.isAccessBreachLog) {
      getBreachlogCount();
    }
    getRFElogCount();
    getExemptionlogCount();
  };
  useEffect(() => {
    if (dashboardState.breachlogcount?.Status) {
      setbreachLogDetails({ loading: false, ...dashboardState.breachlogcount });
    }
  }, [dashboardState.breachlogcount]);

  useEffect(() => {
    if (dashboardState.reflogcount?.Status) {
      setrefLogDetails({ loading: false, ...dashboardState.reflogcount });
    }
  }, [dashboardState.reflogcount]);

  useEffect(() => {
    if (dashboardState.exemptionlogcount?.ZUG) {
      setexemptionLogDetails({
        loading: false,
        ...dashboardState.exemptionlogcount,
      });
    }
  }, [dashboardState.exemptionlogcount]);

  const handleLogClick = (logname, statusId, logtype) => {
    if (logname === "exemptionlog") {
      setShowPage(true)
    } else {
      setDashboardClick({
        status: statusId,
        logType: logtype ? logtype : "",
      });
      switch (logname) {
        case "breachlog":
          history.push("/breachlogs");
          break;
        case "rfelog":
          history.push("/rfelogs");
          break;
        case "exemptionlog":
          history.push("/exemptionlogs");
          break;
        default:
          break;
      }
    }
  };

  const getLogCountBlock = (status, logname, logtype) => {
    return status.Count ? (
      <div className="log-status-details-container">
        <div
          className="log-status-details"
          onClick={() => handleLogClick(logname, status.Id, logtype)}
        >
          <div className="log-count">{status.Count}</div>
          <div className="log-status">{status.Title}</div>
        </div>
      </div>
    ) : (
      ""
    );
  };
  return (
    <div className="dashboard-container">
      <div className="page-title-container">
        <div className="page-title">Dashboard</div>
      </div>

      <div className="logs-details-container">
        {userProfile?.isAccessBreachLog && (
          <div className="logs-details">
            <div className="log-title-container">
              <div className="logo">
                <img src={breachlogo}></img>
              </div>
              <div className="log-count">{breachLogDetails.Total}</div>
              <div className="log-title">Breach Logs</div>
            </div>
            <div className="log-count-details">
              <>
                {breachLogDetails.loading
                  ? "Loading..."
                  : breachLogDetails.Status.map((status) =>
                      getLogCountBlock(status, "breachlog")
                    )}
              </>
            </div>
          </div>
        )}

        <div className="logs-details">
          <div className="log-title-container">
            <div className="logo">
              <img src={rfelogo}></img>
            </div>
            <div className="log-count">{refLogDetails.Total}</div>
            <div className="log-title">RfE Logs</div>
          </div>
          <div className="log-count-details">
            {refLogDetails.loading
              ? "Loading..."
              : refLogDetails.Status.map((status) =>
                  getLogCountBlock(status, "rfelog")
                )}
          </div>
        </div>

        <div className="logs-details">
          <div className="log-title-container">
            <div className="logo">
              <img src={exemptionlogo}></img>
            </div>
            <div className="log-title">Exemption Logs</div>
          </div>
          {exemptionLogDetails.loading ? (
            "Loading..."
          ) : (
            <>
              <div
                className="log-title-container"
                style={{ marginBottom: "10px" }}
              >
                <div className="log-count">{exemptionLogDetails.ZUG.Total}</div>
                <div className="log-title">ZUG</div>
              </div>
              <div
                className="log-count-details"
                style={{ marginBottom: "15px" }}
              >
                {exemptionLogDetails.ZUG.Status.map((status) =>
                  getLogCountBlock(status, "exemptionlog", "zug")
                )}
              </div>
              <div
                className="log-title-container"
                style={{ marginBottom: "10px" }}
              >
                <div className="log-count">
                  {exemptionLogDetails.URPM.Total}
                </div>
                <div className="log-title">URPM</div>
              </div>
              <div className="log-count-details">
                {exemptionLogDetails.URPM.Status.map((status) =>
                  getLogCountBlock(status, "exemptionlog", "urpm")
                )}
              </div>
            </>
          )}
        </div>
      </div>
      {showpage &&
        <ConfirmPopup
          title={"Are You Sure?"}
          hidePopup={() => setShowPage(false)}
          itemDetails={"If you click on the “Yes” button, you will be directed to the Exemption log. On the other hand, if you want to create an empowerment log, click on the Rfe logs tab."}
        />
      }
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
  setDashboardClick: dashboardActions.setDashboardClick,
  clearDashboardClick: dashboardActions.clearDashboardClick,
  getBreachlogCount: dashboardActions.getBreachlogCount,
  getRFElogCount: dashboardActions.getRFElogCount,
  getExemptionlogCount: dashboardActions.getExemptionlogCount,
};
export default connect(mapStateToProp, mapActions)(Dashboard);
