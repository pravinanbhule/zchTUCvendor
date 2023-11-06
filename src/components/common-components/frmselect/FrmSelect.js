import React, { useState } from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import "./Style.css";
import ToolTip from "../tooltip/ToolTip";
function FrmSelect(props) {
  const {
    title,
    titlelinespace,
    inlinetitle,
    name,
    value,
    handleChange,
    isRequired,
    isReadMode,
    validationmsg,
    issubmitted,
    selectopts,
    isdisabled,
    isToolTip,
    tooltipmsg,
    itemid,
    isinline,
  } = props;
  const onSelect = (selectedopt) => {
    handleChange(name, selectedopt.value, itemid);
  };

  const getSelectedOpt = () => {
    let selectedopt = [];
    selectedopt = selectopts.filter((item) => item.value === value);
    if (selectedopt.length) {
      return selectedopt[0].label;
    } else {
      return;
    }
  };
  return (
    <div
      className={`frm-field ${isRequired ? "mandatory" : ""} ${
        inlinetitle ? "inlinetitle" : ""
      }`}
      style={isinline && { marginBottom: "0px" }}
    >
      {!isinline ? (
        <label htmlFor={name}>
          <div
            className={`label ${!isReadMode && isdisabled ? "disabled" : ""} ${
              isToolTip ? "hastooltip" : ""
            } `}
          >
            {title}
          </div>
          {isToolTip ? (
            <>
              <div className="icon info-icon" data-tip={tooltipmsg}></div>
              <ToolTip />
            </>
          ) : (
            ""
          )}
        </label>
      ) : (
        ""
      )}

      {titlelinespace && <br></br>}
      {isReadMode ? (
        <div>{value ? getSelectedOpt() : ""}</div>
      ) : (
        <>
          <div className="dropdowncls">
            <Dropdown
              className="drop-down"
              options={selectopts}
              onChange={onSelect}
              value={value}
              placeholder="Select"
              disabled={isdisabled ? isdisabled : false}
            />
          </div>
          {isRequired && issubmitted && !value ? (
            <div className="validationError">{validationmsg}</div>
          ) : (
            ""
          )}
        </>
      )}
    </div>
  );
}

export default FrmSelect;
