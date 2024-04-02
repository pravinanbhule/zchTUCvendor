import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { userActions, countryActions, regionActions, userViewActions } from "../../../actions";
import Loading from "../../common-components/Loading";
import PaginationData from "../../common-components/PaginationData";
import BreachAddEditForm from "./BreachAddEditForm";
import './Style.css'
import ExemptionAddEditForm from "./ExemptionAddEditForm";
import { USER_ROLE } from "../../../constants";
import RfEAddEditForm from "./RfEAddEditForm";
function UserView({ ...props }) {

  const {
    userProfile,
    getAll
  } = props;

  const [selectedTab, setSelectedTab] = useState("breachlog")
  const [selectedRow, setSelectedRow] = useState({})
  const [isshowAddPopup, setIsshowAddPopup] = useState(false)
  const [paginationdata, setpaginationdata] = useState([
    {
      userviewId: "1",
      userViewName: "View 1",
      roles: "Super admin, Global admin"
    },
    {
      userviewId: "2",
      userViewName: "View 2",
      roles: "Global admin"
    },
    {
      userviewId: "3",
      userViewName: "View 3",
      roles: "Normal User"
    },
  ]);

  useEffect(async () => {
    let response = await getAll({ UserViewType: selectedTab })
    let roleNames = []
    response.map((item, i) => {
      if (selectedTab === 'breachlog') {
        item.userviewId = item.breachViewsId
      } else if (selectedTab === 'rfelog') {
        item.userviewId = item.rfeViewsId
      } else if (selectedTab === 'exemptionlog') {
        item.userviewId = item.exemptionViewsId
      }
      if (item.userRoles) {
        let rolesArray = item.userRoles.split(",")
        if (rolesArray?.length === 1) {
          item.userRoleNames = handleCheckRoleName(rolesArray[0])
        }
        if (rolesArray?.length > 1) {
          rolesArray.map((role, j) => {
            const name = handleCheckRoleName(role)
            if (name !== '') {
              roleNames.push(name)
            }
          })
          item.userRoleNames = roleNames.toString()
        }
      }
    })
    setpaginationdata(response)
  }, [selectedTab])

  const handleCheckRoleName = (role) => {
    let roleName = ""
    if (role === USER_ROLE.superAdmin) {
      roleName = "Super Admin"
    }
    if (role === USER_ROLE.countryAdmin) {
      roleName = "Country Admin"
    }
    if (role === USER_ROLE.globalAdmin) {
      roleName = "Global Admin"
    }
    if (role === USER_ROLE.countrySuperAdmin) {
      roleName = "Country Super Admin"
    }
    if (role === USER_ROLE.normalUser) {
      roleName = "Normal User"
    }
    if (role === USER_ROLE.regionAdmin) {
      roleName = "Region Admin"
    }
    if (role === USER_ROLE.auditor) {
      roleName = "Auditor"
    }
    if (role === USER_ROLE.lobAdmin) {
      roleName = "LoB Admin"
    }
    return roleName
  }

  const showAddPopup = () => {
    setIsshowAddPopup(true);
  };
  const hideAddPopup = () => {
    setIsshowAddPopup(false)
  }

  const handleSelectTab = (value) => {
    setSelectedTab(value)
  }

  const columns = [
    {
      dataField: "editaction",
      text: "Edit",
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return (
          <div
            className="edit-icon"
            onClick={() => handleEdit(row)}
            rowid={row.userviewId}
          ></div>
        );
      },
      sort: false,
      headerStyle: (colum, colIndex) => {
        return {
          width: "70px",
          textAlign: "center",
        };
      },
    },
    {
      dataField: "viewaction",
      text: "View",
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return (
          <div
            className="view-icon"
            // onClick={handleEdit}
            rowid={row.userviewId}
            mode={"view"}
          ></div>
        );
      },
      sort: false,
      headerStyle: (colum, colIndex) => {
        return {
          width: "70px",
          textAlign: "center",
        };
      },
    },
    {
      dataField: "viewName",
      text: "View Name",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "250px" };
      },
    },
    {
      dataField: "userRoleNames",
      text: "Role",
      sort: false,
    }
  ];
  const defaultSorted = [
    {
      dataField: "viewName",
      order: "asc",
    },
  ];

  const handleEdit = (row) => {
    console.log(row);
    setSelectedRow(row)
  }

  return (
    <>
      {!isshowAddPopup && (
        <>
          <div className="page-title border-bottom-class">Manage User View</div>
          <div className="userview-class">
            <ul className="nav nav-tabs">
              <li className="nav-item" onClick={() => handleSelectTab("breachlog")}>
                <a className={`nav-link ${selectedTab === 'breachlog' ? 'active' : ''}`} aria-current="page" >Breach Log Filters</a>
              </li>
              <li className="nav-item" onClick={() => handleSelectTab("rfelog")}>
                <a className={`nav-link ${selectedTab === 'rfelog' ? 'active' : ''}`} >RfE Log Filters</a>
              </li>
              <li className="nav-item" onClick={() => handleSelectTab("exemptionlog")}>
                <a className={`nav-link ${selectedTab === 'exemptionlog' ? 'active' : ''}`} >Exemption Log Filters</a>
              </li>
            </ul>
          </div>
          <PaginationData
            id={"userviewId"}
            column={columns}
            data={paginationdata}
            showAddPopup={showAddPopup}
            defaultSorted={defaultSorted}
            buttonTitle={"New View"}
            hidesearch={true}
          />
        </>
      )}
      {isshowAddPopup && (
        <>
          {selectedTab === 'breachlog' && (
            <BreachAddEditForm
              title={"Add/Edit Exemption Log"}
              hideAddPopup={hideAddPopup}
              userProfile={userProfile}
              formIntialState={selectedRow}
            ></BreachAddEditForm>
          )}
          {selectedTab === 'exemptionlog' && (
            <ExemptionAddEditForm
              title={"Add/Edit Exemption Log"}
              hideAddPopup={hideAddPopup}
              userProfile={userProfile}
            ></ExemptionAddEditForm>
          )}
          {selectedTab === 'rfelog' && (
            <RfEAddEditForm
              title={"Add/Edit Exemption Log"}
              hideAddPopup={hideAddPopup}
              userProfile={userProfile}
            ></RfEAddEditForm>
          )}
        </>
      )}
    </>
  );
}
const mapStateToProp = (state) => {
  return {
    state: state,
  };
};
const mapActions = {
  getAll: userViewActions.getAll,
};

export default connect(mapStateToProp, mapActions)(UserView);
