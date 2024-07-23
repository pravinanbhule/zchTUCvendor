import React, { useState } from "react";
import "./Style.css";
import { handlePermission } from "../../../permissions/Permission";
function MoreActions({
  rowid,
  isSubmit,
  handleCopyItem,
  handleShareItem,
  handleDeleteItem,
  userProfile,
  isDelete,
  handleLinkItem,
}) {
  let timeout;
  const [active, setActive] = useState(false);
  const showMoreItems = () => {
    timeout = setTimeout(() => {
      setActive(true);
    }, 400);
  };

  const hideMoreItems = () => {
    clearInterval(timeout);
    setActive(false);
  };
  const copyItem = () => {
    handleCopyItem(rowid);
    hideMoreItems();
  };
  const shareItem = () => {
    handleShareItem(rowid, isSubmit);
    hideMoreItems();
  };
  const deleteItem = () => {
    handleDeleteItem(rowid, isSubmit);
    hideMoreItems();
  };
  const addItem = () => {
    handleLinkItem(rowid, isSubmit);
    hideMoreItems();
  } 
  return (
    <div>
      <div
        className="moreaction-container"
        // When to show the tooltip
        onMouseEnter={showMoreItems}
        onMouseLeave={hideMoreItems}
      >
        <div className="moreaction-icon-container">
          <div className="moreaction-icon"></div>
        </div>
        {active && (
          <div className="moreaction-items-container">
            <div className="copy-icon icon" onClick={() => copyItem()}></div>
            <div className="share-icon icon" onClick={() => shareItem()}></div>
            {isDelete &&
            (userProfile.isSuperAdmin ||
              userProfile.isGlobalAdmin ||
              userProfile.isRegionAdmin ||
              userProfile.isAccessDeleteLog) ? (
              <div
                className="delete-icon icon"
                onClick={() => deleteItem()}
              ></div>
            ) : (
              ""
            )}
            {handlePermission(window.location.pathname.slice(1), "isAdd") &&
              handleLinkItem && (
              <div
                className="moreaction-plus-icon icon"
                onClick={() => addItem()}
              >
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MoreActions;
