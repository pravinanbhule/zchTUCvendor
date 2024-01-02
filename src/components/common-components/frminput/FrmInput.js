import React from "react";
import "./Style.css";
import ToolTip from "../tooltip/ToolTip";
function FrmInput(props) {
  const {
    title,
    titlelinespace,
    name,
    value,
    type,
    handleChange,
    isRequired,
    isReadMode,
    validationmsg,
    issubmitted,
    handleClick,
    isdisabled,
    isToolTip,
    tooltipmsg,
    iserror,
    errormsg
  } = props;

  return (
    <div className={`frm-field ${isRequired ? "mandatory" : ""}`}>
      <label htmlFor={name}>
        <div
          className={`label ${!isReadMode && isdisabled ? "disabled" : ""} ${
            isToolTip && "hastooltip"
          }`}
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
      {titlelinespace && <br></br>}
      {isReadMode ? (
        <div>{value}</div>
      ) : (
        <>
          {" "}
          <input
            type={type}
            name={name}
            value={value}
            disabled={isdisabled ? isdisabled : false}
            onChange={handleChange}
            onClick={handleClick}
            maxLength="150"
            autoComplete="off"
          ></input>
          {iserror && (
            <div className="validationError">{errormsg}</div>
          )}
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

export default React.memo(FrmInput);
