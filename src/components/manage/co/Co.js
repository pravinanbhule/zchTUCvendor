import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { coActions } from "../../../actions";
import Loading from "../../common-components/Loading";
import useSetNavMenu from "../../../customhooks/useSetNavMenu";
import PaginationData from "../../common-components/PaginationData";
import { alertMessage, formatDate } from "../../../helpers";
import AddEditForm from "./AddEditFrom";
function Co({ ...props }) {
  const { coState } = props.state;
  const {
    getAll,
    putItem,
    postItem,
    deleteItem,
    userProfile,
  } = props;
  useSetNavMenu({ currentMenu: "CO", isSubmenu: true }, props.menuClick);
  //set pagination data and functionality
  const [dataActItems, setdataActItems] = useState({});
  const [data, setdata] = useState([]);
  const [paginationdata, setpaginationdata] = useState([]);
  const columns = [
    {
      dataField: "editaction",
      text: "Edit",
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return (
          <div className="edit-icon" onClick={() => handleEdit(row)} rowid={row.coId}></div>
        );
      },
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "65px", textAlign: "center" };
      },
    },
    {
      dataField: "deleteaction",
      text: "Delete",
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return (
          <div
            className="delete-icon"
            onClick={() => handleDelete(row)}
            rowid={row.coId}
          ></div>
        );
      },
      sort: false,
      headerStyle: (colum, colIndex) => {
        return {
          width: "70px",
          textAlign: "center"
        };
      }
    },
    {
      dataField: "coName",
      text: "CO Name",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "150px", textAlign: "left" };
      },
    },
    {
      dataField: "coDescription",
      text: "Description",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "250px" };
      },
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
      dataField: "coName",
      order: "asc",
    },
  ];

  useEffect(() => {
    setpaginationdata([...data]);
  }, [data]);

  useEffect(() => {
    fnOnInit();
  }, []);

  const fnOnInit = async () => {
    getAll({ RequesterUserId: userProfile.userId });
  };

  useEffect(() => {
    let tempdata = [];
    let initalval = {};
    coState.items.forEach((item) => {
      tempdata.push(item)
    });
    setdata([...tempdata]);
    setdataActItems(initalval);
  }, [coState.items]);

  const [isshowAddPopup, setshowAddPopup] = useState(false);

  const showAddPopup = () => {
    setshowAddPopup(true);
  };
  const hideAddPopup = () => {
    setshowAddPopup(false);
    setformIntialState(initvalstate);
    setisEditMode(false);
  };
  const initvalstate = {
    coName: "",
    coDescription: "",
    coId: "",
    isActive: false 
  };
  const [isEditMode, setisEditMode] = useState(false);
  const [formIntialState, setformIntialState] = useState(initvalstate);
  const handleEdit = async (row) => {
    setisEditMode(true);
    setformIntialState({
      coName: row.coName,
      coDescription: row.coDescription,
      coId: row.coId,
      isActive: row.isActive
    })
    showAddPopup();
  };
  const putItemHandler = async (item) => {
    let response = await putItem({
      ...item,
    });
    if (response) {
      getAll();
      hideAddPopup();
      alert(alertMessage.co.update);
    }
    setisEditMode(false);
    setformIntialState(initvalstate);
  };
  const postItemHandler = async (item) => {
    let response = await postItem({
      ...item
    });
    if (response) {
      getAll();
      hideAddPopup();
      alert(alertMessage.co.add);
    }
  };
  const handleDelete = async (row) => {
    if (!window.confirm(alertMessage.co.deleteConfirm)) {
      return;
    }
    let resonse = await deleteItem({ COId: row.coId });
    if (resonse) {
      getAll();
      alert(alertMessage.co.delete);
    }
  };

  return (
    <>
      <div className="page-title">Manage CO</div>
      <div className="page-filter"></div>
      <div>
        {coState.loading ? (
          <Loading />
        ) : coState.error ? (
          <div>{coState.error}</div>
        ) : (
          <PaginationData
            id={"coId"}
            column={columns}
            data={paginationdata}
            showAddPopup={showAddPopup}
            defaultSorted={defaultSorted}
            buttonTitle={"New CO"}
            hidesearch={true}
          />
        )}
      </div>
      {isshowAddPopup ? (
        <AddEditForm
          title={"Add / Edit CO"}
          hideAddPopup={hideAddPopup}
          postItem={postItemHandler}
          putItem={putItemHandler}
          isEditMode={isEditMode}
          formIntialState={formIntialState}
        ></AddEditForm>
      ) : (
        ""
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
  getAll: coActions.getAll,
  postItem: coActions.postItem,
  putItem: coActions.putItem,
  deleteItem: coActions.deleteItem,
};
export default connect(mapStateToProp, mapActions)(Co);
