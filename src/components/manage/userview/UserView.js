import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { userActions, countryActions, regionActions } from "../../../actions";
import Loading from "../../common-components/Loading";
import useSetNavMenu from "../../../customhooks/useSetNavMenu";
import FrmSelect from "../../common-components/frmselect/FrmSelect";
import PaginationData from "../../common-components/PaginationData";
import { alertMessage, dynamicSort } from "../../../helpers";
import AddEditForm from "./AddEditForm";
import UserProfile from "../../common-components/UserProfile";
import FrmInput from "../../common-components/frminput/FrmInput";
import { USER_ROLE } from "../../../constants";
import './Style.css'
import ToolkitProvider, { ColumnToggle } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
function UserView({ ...props }) {

  const { ToggleList } = ColumnToggle;
  const columns = [{
    dataField: 'breachlog',
    text: 'Breach Log Filters'
  }, {
    dataField: 'rfelog',
    text: 'RfE Log Filters'
  }, {
    dataField: 'exemptionlog',
    text: 'Exemption Log Filters'
  }];

  const [isshowAddPopup, setIsshowAddPopup] = useState(false)

  const hideAddPopup = () => {
    setIsshowAddPopup(false)
  }

  const data = [
    {
      dataField: "editaction",
      text: "Edit",
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return (
          <div
            className="edit-icon"
            // onClick={handleEdit}
            rowid={row.userId}
          ></div>
        );
      },
      sort: false,
      headerStyle: (colum, colIndex) => {
        return {
          width: "65px",
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
            // onClick={handleDelete}
            rowid={row.userId}
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
    }
  ]

  return (
    <>
      {!isshowAddPopup && (
        <>
          <div className="page-title border-bottom-class">Manage User View</div>
          <div className="userview-class">
            <ul class="nav nav-tabs">
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="#">Active</a>
              </li>
              <li class="nav-item">
                <a class="nav-link active" href="#">Link</a>
              </li>
              <li class="nav-item">
                <a class="nav-link active" href="#">Link</a>
              </li>
              <li class="nav-item">
                <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
              </li>
            </ul>
            {/* <ToolkitProvider
              keyField="id"
              data={data}
              columns={columns}
              columnToggle
            >
              {
                props => (
                  <div>
                    <ToggleList {...props.columnToggleProps} />
                    <hr />
                    <BootstrapTable
                      {...props.baseProps}
                    />
                  </div>
                )
              }
            </ToolkitProvider> */}
          </div>
        </>
      )}
      {isshowAddPopup && (
        <AddEditForm
          title={"Add/Edit Exemption Log"}
          hideAddPopup={hideAddPopup}
        ></AddEditForm>
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
