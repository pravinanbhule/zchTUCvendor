import React from "react";
import "./Style.css";
import ToolTip from "../tooltip/ToolTip";
function FrmRadio(props) {
  const {
    title,
    titlelinespace,
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
    isSidebySide
  } = props;
  const getSelectedOpt = () => {
    let selectopt;
    selectopt = selectopts.filter((item) => item.value === value);
    return selectopt.length ? selectopt[0].label : "";
  };
  const middleIndex = Math.ceil(selectopts.length / 2);
  const firstColumn = selectopts.slice(0, middleIndex);
  const secondColumn = selectopts.slice(middleIndex);
  return (
    <div className={`frm-field ${isRequired ? "mandatory" : ""}`}>
      <label
        htmlFor={name}
        className={`${isdisabled && !isReadMode ? "disabled" : ""}`}
      >
        <div className="label">{title}</div>
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
        <div>{getSelectedOpt()}</div>
      ) : (
        <>
          <div className="frm-radiobtns-container">
            {!isSidebySide ?
              selectopts.map((option) => (
                <div className="radiobtn-container">
                  <input
                    key={option.label}
                    type="radio"
                    id={option.label}
                    className="regular-radio "
                    name={name}
                    value={option.value}
                    checked={value === option.value ? true : false}
                    onChange={handleChange}
                    disabled={option.isdisabled || isdisabled}
                  />
                  <label for={option.label}></label>
                  <div className={`labeltext ${isdisabled ? "disabled" : ""}`}>
                    {option.label}
                  </div>
                </div>
              )) :
              <div style={{ display: 'flex' }}>
                <div style={{ flex: 1 }}>
                  {firstColumn.map((option) => (
                    <div className="radiobtn-container">
                      <input
                        key={option.label}
                        type="radio"
                        id={option.label}
                        className="regular-radio "
                        name={name}
                        value={option.value}
                        checked={value === option.value ? true : false}
                        onChange={handleChange}
                        disabled={option.isdisabled || isdisabled}
                      />
                      <label for={option.label}></label>
                      <div className={`labeltext ${isdisabled ? "disabled" : ""}`}>
                        {option.label}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ flex: 1 }}>
                  {secondColumn.map((option) => (
                    <div className="radiobtn-container">
                      <input
                        key={option.label}
                        type="radio"
                        id={option.label}
                        className="regular-radio "
                        name={name}
                        value={option.value}
                        checked={value === option.value ? true : false}
                        onChange={handleChange}
                        disabled={option.isdisabled || isdisabled}
                      />
                      <label for={option.label}></label>
                      <div className={`labeltext ${isdisabled ? "disabled" : ""}`}>
                        {option.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            }
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

export default React.memo(FrmRadio);
