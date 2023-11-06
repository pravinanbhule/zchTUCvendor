import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { formatDate } from "../../../helpers";
import "./Style.css";
import ToolTip from "../tooltip/ToolTip";

function FrmDatePicker(props) {
  const {
    title,
    titlelinespace,
    name,
    value,
    type,
    handleChange,
    isRequired,
    isReadMode,
    isdisabled,
    validationmsg,
    issubmitted,
    minDate,
    maxDate,
    isToolTip,
    tooltipmsg,
  } = props;

  const [startDate, setStartDate] = useState();
  useEffect(() => {
    if (value) {
      setStartDate(new Date(moment(value)));
    } else {
      setStartDate("");
    }
  }, [value]);

  const setChangedDate = (date) => {
    if (date) {
      handleChange(name, date);
      setStartDate(date);
    } else {
      setStartDate("");
      handleChange(name, "");
    }
  };
  return (
    <div
      className={`frm-field ${isRequired ? "mandatory" : ""} ${
        !isReadMode && isdisabled ? "disabled" : ""
      }`}
    >
      <label htmlFor={name}>
      <div
            className={`label ${
              isToolTip && "hastooltip"
            }`}
          >{title}</div>
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
        <div>{value ? formatDate(value) : ""}</div>
      ) : (
        <DatePicker
          selected={startDate}
          onChange={(date) => setChangedDate(date)}
          disabled={isdisabled}
          minDate={minDate ? minDate : ""}
          maxDate={maxDate ? maxDate : ""}
          placeholderText="dd-mmm-yyyy"
          dateFormat="dd-MMM-yyyy"
          yearDropdownItemNumber={""}
          showYearDropdown
          showMonthDropdown
        />
      )}
      {isRequired && issubmitted && !value ? (
        <div className="validationError">{validationmsg}</div>
      ) : (
        ""
      )}
    </div>
  );
}

export default FrmDatePicker;
