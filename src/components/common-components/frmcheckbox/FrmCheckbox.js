import React from "react";
import "./Style.css";
function FrmCheckbox(props) {
  const {
    title,
    name,
    value,
    handleChange,
    isRequired,
    isReadMode,
    validationmsg,
    issubmitted,
    selectopts,
    isdisabled,
    inlinetitle,
    aftercheckbox
  } = props;

  return (
    <div className={`frm-field ${isRequired ? "mandatory" : ""} ${
      inlinetitle ? "inlinetitle" : ""
    }`}>
      {title && !aftercheckbox ? (
        <label htmlFor={name} className={`${isdisabled ? "disabled" : ""}`}>
          <div className="label">{title}</div>
        </label>
      ) : (
        ""
      )}
      {isReadMode ? (
        <div>{value}</div>
      ) : (
        <>
          <div className="frm-radiobtns-container">
            {selectopts.map((option, index) => (
              <div className={`radiobtn-container ${
                aftercheckbox ? "radiobtn-container-aftertitle mr-2" : ""
              }`}>
                <input
                  type="checkbox"
                  id={`opt${name}`}
                  className="regular-checkbox"
                  name={name}
                  value={option.value}
                  checked={value}
                  onChange={handleChange}
                  disabled={isdisabled}
                />
                <label for={`opt${name}`}></label>
              </div>
            ))}
          </div>
          {isRequired && issubmitted && !value ? (
            <div className="validationError">{validationmsg}</div>
          ) : (
            ""
          )}
        </>
      )}
       {title && aftercheckbox ? (
        <label htmlFor={name} className={`${isdisabled ? "disabled" : ""}`}>
          <div className="label">{title}</div>
        </label>
      ) : (
        ""
      )}
    </div>
  );
}

export default React.memo(FrmCheckbox);
