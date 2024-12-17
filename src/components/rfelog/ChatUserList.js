import React, { useState, useEffect } from "react";
import Popup from "../common-components/Popup";
import './Chat.css'

function ChatUserList(props) {
  const { hideAddPopup, id, postItem, putItem, isEditMode, formIntialState, chatMembers, handleAddMemberToGroup } =
    props;

  const [formfield, setformfield] = useState(formIntialState);
  const [issubmitted, setissubmitted] = useState(false);
  const [listMembers, setListMember] = useState(chatMembers)
  const [addUserList, setAddUserList] = useState([])

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
    setAddUserList([...addUserList, user])
  }
  const handleRemoveItem = (user) => {
    let res = addUserList.filter((item) => (item.emailAddress !== user.emailAddress))
    setAddUserList(res)
    setListMember([...listMembers, user])
  }

  const handleSubmit = () => {
    let emails = []
    addUserList.map((item) => {
      emails.push(item.emailAddress) 
    })
    handleAddMemberToGroup(emails)
  }

  useEffect(() => {
    console.log("addUserList>>", addUserList, chatMembers);
  }, [addUserList])
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
                  <div style={{ fontSize: '14px', textDecoration: 'underline' }}>
                    {user?.associatedUserRole}
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
                  <div className="user" style={{ width: '100% !important'}}>
                    <div>
                      {user.firstName + " " + user.lastName}
                    </div>
                    {user && user.emailAddress && (
                      <div className="useremail-line">
                        {user?.emailAddress}
                      </div>
                    )}
                    <div style={{ fontSize: '14px', textDecoration: 'underline' }}>
                      {user?.associatedUserRole}
                    </div>
                  </div>
                </div>
              })}
            </div>
          </div>
        </div>
        <div className="popup-footer-container">
          <div className="btn-container">
            <button className="btn-blue" onClick={handleSubmit}>
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
