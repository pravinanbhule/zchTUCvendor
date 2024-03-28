import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { userActions, countryActions, regionActions } from "../../../actions";
import Loading from "../../common-components/Loading";
import PaginationData from "../../common-components/PaginationData";
import BreachAddEditForm from "./BreachAddEditForm";
import './Style.css'
import ExemptionAddEditForm from "./ExemptionAddEditForm";
function UserView({ ...props }) {

  const [selectedTab, setSelectedTab] = useState("exemptionlog")
  const [isshowAddPopup, setIsshowAddPopup] = useState(true)
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

  useEffect(() => {
    if (selectedTab === "breachlog  ") {
      setpaginationdata([
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
      ])
    } else if (selectedTab === "rfelog") {
      setpaginationdata([
        {
          userviewId: "4",
          userViewName: "View 4",
          roles: "Super admin, Global admin"
        },
        {
          userviewId: "5",
          userViewName: "View 5",
          roles: "Global admin"
        },
        {
          userviewId: "6",
          userViewName: "View 6",
          roles: "Normal User"
        },
      ])
    } else if (selectedTab === "exemptionlog") {
      setpaginationdata([
        {
          userviewId: "7",
          userViewName: "View 7",
          roles: "Super admin, Global admin"
        },
        {
          userviewId: "8",
          userViewName: "View 8",
          roles: "Global admin"
        },
        {
          userviewId: "3",
          userViewName: "View 3",
          roles: "Normal User"
        },
      ])
    }

  }, [selectedTab])

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
            // onClick={handleEdit}
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
      dataField: "userViewName",
      text: "User View Name",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "250px" };
      },
    },
    {
      dataField: "roles",
      text: "Role",
      sort: false,
    }
  ];
  const defaultSorted = [
    {
      dataField: "znaSegmentName",
      order: "asc",
    },
  ];

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
      {selectedTab === 'breachlog' &&(
        <BreachAddEditForm
          title={"Add/Edit Exemption Log"}
          hideAddPopup={hideAddPopup}
        ></BreachAddEditForm>
      )}
      {selectedTab === 'exemptionlog' &&(
        <ExemptionAddEditForm
          title={"Add/Edit Exemption Log"}
          hideAddPopup={hideAddPopup}
        ></ExemptionAddEditForm>
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
  getAll: userActions.getAll,
  getAllUsers: userActions.getAllUsers,
  getAllCountry: countryActions.getAllCountry,
  getUserCountry: countryActions.getUserCountry,
  getAllRegion: regionActions.getAllRegions,
  getUserRegions: regionActions.getUserRegions,
  getAllSpecialUsers: userActions.getAllSpecialUsers,
  getAllUsersRoles: userActions.getAllUsersRoles,
  getById: userActions.getById,
  checkNameExist: userActions.checkNameExist,
  checkIsInUse: userActions.checkIsInUse,
  postItem: userActions.postItem,
  deleteItem: userActions.deleteItem,
};

export default connect(mapStateToProp, mapActions)(UserView);
