import React, { useState, useEffect, useRef } from "react";
import "./Style.css";
import ToolTip from "../tooltip/ToolTip";
import AppLocale from "../../../IngProvider";
import { AutoComplete } from "antd";
function FrmInputAutocomplete(props) {
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
    isdisabled,
    isToolTip,
    tooltipmsg,
    options,
    selectedlanguage
  } = props;
  const [suggestions, setSuggestions] = useState([])
  const [suggestionOpt, setSuggestionOpt] = useState([])

  useEffect(() => {
    let data = []
    options.map((item, i) => {
      data.push({
        label: item,
        value: item
      })
    })
    setSuggestionOpt([...data])
    setSuggestions([...data])
  }, [])

  const handleInputChange = (event) => {
    const suggest = []; 
    suggestions.map((option) => {
      if (option?.value?.toLowerCase().includes(event?.toLowerCase())) {
        suggest.push(option)
      }
    })
    setSuggestionOpt([...suggest])
    handleChange(name, event);
  };

  const handleSuggestionClick = (suggetion) => {
    //setInputValue(suggetion);
    handleChange(name, suggetion);
  };

  return (
    <div className={`frm-field ${isRequired ? "mandatory" : ""}`}>
      <label
        htmlFor={name}
        className={`${!isReadMode && isdisabled ? "disabled" : ""}`}
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
        <div>{value}</div>
      ) : (
        <>
          <div className="autocomplete">
            <AutoComplete
              onSearch={handleInputChange}
              onSelect={handleSuggestionClick}
              value={{
                label: value,
                value: value
              }}
              placeholder={selectedlanguage ? AppLocale[selectedlanguage].messages["placeholder.search"] : "Search"}
              options={suggestionOpt}
              dropdownClassName='suggestions'
            />
            {isRequired && issubmitted && !value ? (
              <div className="validationError">{validationmsg}</div>
            ) : (
              ""
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default FrmInputAutocomplete;
