import React, { useState, useEffect } from "react";
import Popup from "../common-components/Popup";
import './Chat.css'
import moment from "moment";

function ChatUserList(props) {
  const { hideAddPopup, id, postItem, putItem, isEditMode, formIntialState, chatMembers, handleAddMemberToGroup, microSoftURL, groupDetails, isGroupExist } =
    props;

  const [formfield, setformfield] = useState(formIntialState);
  const [issubmitted, setissubmitted] = useState(false);
  const [listMembers, setListMember] = useState(chatMembers)
  const [addUserList, setAddUserList] = useState([])
  const formattedDate = moment(groupDetails?.lastUpdatedDateTime).format("MMMM Do YYYY, h:mm:ss A");
  // const formattedDate = moment('2021-04-21T17:13:44.033Z').format("MMMM Do YYYY, h:mm:ss A");

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   setissubmitted(true);
  //   if (formfield.regionName) {
  //     if (isEditMode) {
  //       putItem(formfield);
  //     } else {
  //       postItem(formfield);
  //     }
  //   }
  // };
  const handleAddItem = (user) => {
    let res = listMembers.filter((item) => (item.emailAddress !== user.emailAddress))
    setListMember(res)
    if (isGroupExist) {
      res.map((item, i) => {
        document.getElementsByClassName('addbtn')[i].style.setProperty("display", "none")
      })
    }
    setAddUserList([...addUserList, user])
  }
  const handleRemoveItem = (user) => {
    let res = addUserList.filter((item) => (item.emailAddress !== user.emailAddress))
    setAddUserList(res)
    if (res.length === 0) {
      listMembers.map((item, i) => {
          document.getElementsByClassName('addbtn')[i].style.setProperty("display", "block")
      })
    }
    setListMember([...listMembers, user])
  }

  const handleSubmit = () => {
    let emails = []
    addUserList.map((item) => {
      emails.push(item.emailAddress)
    })
    handleAddMemberToGroup(emails)
  }
  return (
    <Popup {...props}>
      <div className="popup-box">
        <div className="popup-header-container" style={{ height: '100px' }}>
          <div className="popup-header-title">Associated People with {id}</div>
          <div className="popup-close" onClick={() => hideAddPopup()}>
            X
          </div>
        </div>
        <div className="popup-formitems" style={{ height: '765px' }}>
          <div className="member-list">
            {listMembers?.map((user) => {
              return <div className="user-view-list">
                <div className="user">
                  <div>
                    {user.firstName + " " + user.lastName}
                  </div>
                  {user && user.emailAddress && (
                    <div className="useremail-line">
                      {user?.emailAddress}
                    </div>
                  )}
                  <div style={{ fontSize: '14px' }}>
                    ({user?.associatedUserRole})
                  </div>
                </div>
                <div
                  className="addbtn"
                  onClick={() => handleAddItem(user)}
                >
                  +
                </div>
              </div>
            })}
          </div>
          <div className="add-member-list">
            <div className="invited-chat-header">
              Invited for Chat
            </div>
            <div className="chat-list">
              {addUserList?.map((user) => {
                return <div className="user-view-list">
                  <div className="user" style={{ width: '100% !important' }}>
                    <div>
                      {user.firstName + " " + user.lastName}
                    </div>
                    {user && user.emailAddress && (
                      <div className="useremail-line">
                        {user?.emailAddress}
                      </div>
                    )}
                    <div style={{ fontSize: '14px' }}>
                      ({user?.associatedUserRole})
                    </div>
                  </div>
                  <div
                    className="delete-icon"
                    onClick={() => handleRemoveItem(user)}
                  >
                  </div>
                </div>
              })}
            </div>
          </div>
        </div>
        {groupDetails?.lastUpdatedDateTime && (<div style={{ marginLeft: '24px' }}>Last update on teams: {formattedDate}</div>)}
        <div className="popup-footer-container">
          <div className="btn-container" style={{ alignItems: 'center' }}>
            {microSoftURL && (
              <div>
                <a href={microSoftURL} target="_blank">Microsoft Teams</a>
              </div>
            )}
            <button
              className={addUserList.length === 0 ? "btn-blue disable" : "btn-blue"}
              onClick={handleSubmit}
            >
              {isEditMode ? "Apply" : "Submit"}
            </button>
            <div className="btn-blue" onClick={() => hideAddPopup()}>
              Cancel
            </div>
          </div>
        </div>
      </div>
    </Popup>
  );
}

export default ChatUserList;
