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
import { alertMessage, formatDate } from "../../../helpers";
import FrmRadio from "../../common-components/frmradio/FrmRadio";
import useSetNavMenu from "../../../customhooks/useSetNavMenu";
function UserView({ ...props }) {

  const {
    userProfile,
    getAll,
    deleteItem
  } = props;

  useSetNavMenu(
    {
      currentMenu: "userview",
      isSubmenu: true,
    },
    props.menuClick
  );

  const [selectedTab, setSelectedTab] = useState("breachlog")
  const [selectedRow, setSelectedRow] = useState({})
  const [isshowAddPopup, setIsshowAddPopup] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isReadMode, setIsReadmode] = useState(false)
  const [selectedExemptionLog, setselectedExemptionLog] = useState("zug");
  const [exemptionlogsType, setexemptionlogsType] = useState([
    {
      label: "ZUG",
      value: "zug",
    },
    {
      label: "URPM",
      value: "urpm",
    },
  ]);
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
    handleGetAll()
  }, [selectedTab, selectedExemptionLog])

  const handleGetAll = async () => {
    let response = await getAll({ UserViewType: selectedTab, exemptiontype: selectedTab === 'exemptionlog' ? selectedExemptionLog : '' })
    let roleNames = []

    response.map((item, i) => {
      if (selectedTab === 'breachlog') {
        item.userviewId = item.breachViewsId
      } else if (selectedTab === 'rfelog') {
        item.userviewId = item.rfeViewsId
      } else if (selectedTab === 'exemptionlog') {
        if (selectedExemptionLog === 'zug') {
          item.userviewId = item.zugExemptionViewsId
        } else if (selectedExemptionLog === 'urpm') {
          item.userviewId = item.urpmExemptionViewsId
        }
      }
      if (item.userRoles) {
        let rolesArray = item?.userRoles?.split(",")
        if (rolesArray?.length === 1) {
          item.userRoleNames = handleCheckRoleName(rolesArray[0])
        }
        if (rolesArray?.length > 1) {
          rolesArray.map((role, j) => {
            const name = handleCheckRoleName(role)
            if (name !== '') {
              if (name === 'Super Admin') {
                roleNames[1] = name
              } else if (name === 'Global Admin') {
                roleNames[2] = name
              } else if (name === 'Region Admin') {
                roleNames[3] = name
              } else if (name === 'Country Super Admin') {
                roleNames[4] = name
              } else if (name === 'Country Admin') {
                roleNames[5] = name
              } else if (name === 'Normal User') {
                roleNames[6] = name
              } else if (name === 'Auditor') {
                roleNames[7] = name
              } else if (name === 'LoB Admin') {
                roleNames[8] = name
              }
            }
          })
          roleNames = roleNames.filter(function (element) {
            return element !== undefined;
          });

          item.userRoleNames = roleNames.toString()
          roleNames = []
        }
      }
    })
    setpaginationdata(response)
  }

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
    setSelectedRow({})
    handleGetAll()
    setIsReadmode(false)
    setIsEditMode(false)
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
            onClick={() => handleEdit(row, 'edit')}
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
            onClick={() => handleEdit(row, 'view')}
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
      dataField: "deleteaction",
      text: "Delete",
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return (
          <div
            className="delete-icon"
            onClick={handleDelete}
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
      align: "center",
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
    },
    {
      dataField: "createdDate",
      text: "Created Date",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return <span>{cell ? formatDate(cell) : ""}</span>;
      },
    },
    {
      dataField: "modifiedDate",
      text: "Modified Date",
      sort: false,
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return <span>{cell ? formatDate(cell) : ""}</span>;
      },
    }
  ];
  const defaultSorted = [
    {
      dataField: "viewName",
      order: "asc",
    },
  ];

  const handleEdit = (row, type) => {
    let selctedData = paginationdata.filter((item, i) => {
      if (row.userviewId === item.userviewId) {
        return item
      }
    })
    if (selectedTab === 'exemptionlog') {
      row.pC_URPMExemptionRequired = row.pC_URPMExemptionRequired === true ? '1' : '0'
    }
    if (type === 'view') {
      setIsReadmode(true)
      setIsEditMode(false)
    } else if (type === 'edit') {
      setIsEditMode(true)
      setIsReadmode(false)
    }
    setIsshowAddPopup(true)
    setSelectedRow(selctedData[0])
  }

  const handleDelete = async (e) => {
    let itemid = e.target.getAttribute("rowid");
    if (!window.confirm(alertMessage.userview.deleteConfirm)) {
      return;
    }
    let params = {
      UserViewType: selectedTab
    }
    if (selectedTab === 'breachlog') {
      params.BreachViewsId = itemid
    } else if (selectedTab === 'rfelog') {
      params.RFEViewsId = itemid
    } else if (selectedTab === 'exemptionlog') {
      if (selectedExemptionLog === 'zug') {
        params.ZUGExemptionViewsId = itemid
        params.exemptiontype = 'zug'
      } else if (selectedExemptionLog === 'urpm') {
        params.URPMExemptionViewsId = itemid
        params.exemptiontype = 'urpm'
      }
    }
    let resonse = await deleteItem(params);
    if (resonse) {
      handleGetAll()
      alert(alertMessage.userview.delete);
    }
  };

  const onExemptionlogSelection = (e) => {
    let { name, value } = e.target;
    setselectedExemptionLog(value)
  };

  return (
    <>
      {!isshowAddPopup && (
        <>
          <div className="page-title border-bottom">Manage User View</div>
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
          {selectedTab === 'exemptionlog' &&
            <div style={{ paddingLeft: "20px" }} className="border-bottom mt-4">
              <FrmRadio
                title={"Exemption Log Type"}
                name={"exemptionLogType"}
                selectopts={exemptionlogsType}
                handleChange={onExemptionlogSelection}
                value={selectedExemptionLog}
              />
            </div>
          }
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
              isEditMode={isEditMode}
              isReadMode={isReadMode}
              handleEdit={handleEdit}
            ></BreachAddEditForm>
          )}
          {selectedTab === 'exemptionlog' && (
            <ExemptionAddEditForm
              title={"Add/Edit Exemption Log"}
              hideAddPopup={hideAddPopup}
              formIntialState={selectedRow}
              userProfile={userProfile}
              isEditMode={isEditMode}
              isReadMode={isReadMode}
              handleEdit={handleEdit}
              exemptionType={selectedExemptionLog}
            ></ExemptionAddEditForm>
          )}
          {selectedTab === 'rfelog' && (
            <RfEAddEditForm
              title={"Add/Edit Exemption Log"}
              hideAddPopup={hideAddPopup}
              userProfile={userProfile}
              formIntialState={selectedRow}
              isEditMode={isEditMode}
              isReadMode={isReadMode}
              handleEdit={handleEdit}
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
  deleteItem: userViewActions.deleteItem
};

export default connect(mapStateToProp, mapActions)(UserView);
