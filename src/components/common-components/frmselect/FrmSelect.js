import React, { useEffect } from "react";
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
    isAddButton,
    handleClickButton,
    isRemoveButton,
    isShowTextBox,
    textValue,
    isAddButtonDisable,
    selectedlanguage
  } = props;
  const onSelect = (selectedopt) => {
    handleChange(name, selectedopt.value, itemid, selectedopt.label);
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

  useEffect(()=>{
    if (selectedlanguage === "DE001" && selectopts[0].label === "Select") {
      selectopts[0] = {label: "Auswählen", value: ""}
    } else if (selectopts[0].label === "Auswählen") {
      selectopts[0] = {label: "Select", value: ""}
    }
  },[selectedlanguage])

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
        <>
          <div>{value ? getSelectedOpt() : ""}</div>
          <div className="marginTop">{isShowTextBox ? textValue : ""}</div>
        </>
      ) : (
        <>
          <div className={`${isAddButton || isRemoveButton ? "dropdowncls" : ""}`}>
            <Dropdown
              className={`${isAddButton || isRemoveButton ? "drop-down" : ""}`}
              options={selectopts}
              onChange={onSelect}
              value={value}
              placeholder="Select"
              placeholderClassName={value ? "" : selectedlanguage !== "EN001" ? "Dropdown-Germany-placeholder" : "Dropdown-English-placeholder"}
              disabled={isdisabled ? isdisabled : false}
            />
            {isAddButton ?
              <div className={`${isAddButtonDisable ? "plus-button Button-disabled" : "plus-button"}`} onClick={() => handleClickButton("add", name)}>+</div> : ""}
            {isRemoveButton ?
              <div className="plus-button" onClick={() => handleClickButton("remove", name)}>-</div> : ""}
            {isShowTextBox ?
              <input
                name={name}
                value={textValue}
                disabled={isdisabled ? isdisabled : false}
                onChange={(e) => handleChange(name, e.target.value, "Textboxvalue")}
                placeholder="Add your Reason here"
                maxLength="150"
                autoComplete="off"
                className="marginTop"
              ></input> : ""}
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
