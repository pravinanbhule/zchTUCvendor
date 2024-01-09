import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { tokenActions } from "../../../actions";
import Loading from "../../common-components/Loading";
import useSetNavMenu from "../../../customhooks/useSetNavMenu";
import PaginationData from "../../common-components/PaginationData";
import { alertMessage, formatDate } from "../../../helpers";
import AddEditForm from "./AddEditFrom";
import CopyItem from "../../common-components/copyitem/CopyItem";
function Token({ ...props }) {
  const { tokenState } = props.state;
  const {
    getAll,
    putItem,
    postItem,
    deleteItem,
    userProfile,
  } = props;
  useSetNavMenu({ currentMenu: "Token", isSubmenu: true }, props.menuClick);

  //set pagination data and functionality
  const [dataActItems, setdataActItems] = useState({});
  const [data, setdata] = useState([]);
  const [paginationdata, setpaginationdata] = useState([]);
  const columns = [
    // {
    //   dataField: "editaction",
    //   text: "Edit",
    //   formatter: (cell, row, rowIndex, formatExtraData) => {
    //     return (
    //       <div className="edit-icon" onClick={handleEdit} rowid={row.applicationId}></div>
    //     );
    //   },
    //   sort: false,
    //   headerStyle: (colum, colIndex) => {
    //     return { width: "65px", textAlign: "center" };
    //   },
    // },
    {
      dataField: "deleteaction",
      text: "Delete",
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return (
          <div
            className="delete-icon"
            onClick={() => handleDelete(row)}
            rowid={row.applicationId}
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
      dataField: "copyaction",
      text: "Copy Token",
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return (
          <div
            className="copy-icon"
            onClick={() => handleCopyItem(row)}
            rowid={row.applicationId}
          ></div>
        );
      },
      sort: false,
      headerStyle: (colum, colIndex) => {
        return {
          width: "110px",
          textAlign: "center"
        };
      },
    },
    {
      dataField: "applicationId",
      text: "Application ID",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "150px", textAlign: "left" };
      },
    },
    {
      dataField: "userName",
      text: "User Name",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "180px" };
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
      dataField: "userName",
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
    tokenState.items.forEach((item) => {
      tempdata.push(item)
    });
    setdata([...tempdata]);
    setdataActItems(initalval);
  }, [tokenState.items]);

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
    emailAddress: "",
    applicationId: "",
    tokenId: ""
  };
  const [isEditMode, setisEditMode] = useState(false);
  const [formIntialState, setformIntialState] = useState(initvalstate);
  const handleEdit = async (row) => {
    setisEditMode(true);
    setformIntialState({
      emailAddress: row.emailAddress,
      applicationId: row.applicationId,
      tokenId: row.tokenId
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
      alert(alertMessage.token.update);
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
      alert(alertMessage.token.add);
    }
  };
  const handleDelete = async (row) => {
    if (!window.confirm(alertMessage.token.deleteConfirm)) {
      return;
    }
    let resonse = await deleteItem({ tokenId: row.tokenId });
    if (resonse) {
      getAll();
      alert(alertMessage.token.delete);
    }
  };

  //copy action functionality
  const [showCopyLog, setshowCopyLog] = useState(false);
  const [shareitemDetails, setshareitemDetails] = useState({});
  const handleCopyItem = (row) => {
    setshareitemDetails({
      id: row.applicationId,
      link: row.token,
    });
    setshowCopyLog(true);
  };

  const hidelogPopup = () => {
    setshowCopyLog(false);
  };

  return (
    <>
      <div className="page-title">Manage Token</div>
      <div className="page-filter"></div>
      <div>
        {tokenState.loading ? (
          <Loading />
        ) : tokenState.error ? (
          <div>{tokenState.error}</div>
        ) : (
          <PaginationData
            id={"applicationId"}
            column={columns}
            data={paginationdata}
            showAddPopup={showAddPopup}
            defaultSorted={defaultSorted}
            buttonTitle={"New Token"}
            hidesearch={true}
          />
        )}
      </div>
      {isshowAddPopup ? (
        <AddEditForm
          title={"Add/Edit Token"}
          hideAddPopup={hideAddPopup}
          postItem={postItemHandler}
          putItem={putItemHandler}
          isEditMode={isEditMode}
          formIntialState={formIntialState}
        ></AddEditForm>
      ) : (
        ""
      )}
      {showCopyLog ? (
        <CopyItem
          title={"Copy a Token"}
          hidePopup={hidelogPopup}
          itemDetails={shareitemDetails}
        />
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
  getAll: tokenActions.getAll,
  postItem: tokenActions.postItem,
  putItem: tokenActions.putItem,
  deleteItem: tokenActions.deleteItem,
};
export default connect(mapStateToProp, mapActions)(Token);
