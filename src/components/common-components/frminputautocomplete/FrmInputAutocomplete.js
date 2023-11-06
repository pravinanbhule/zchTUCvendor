import React, { useState, useEffect, useRef } from "react";
import "./Style.css";
import ToolTip from "../tooltip/ToolTip";
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
  } = props;
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestions = options?.length
    ? options?.filter((option) =>
        option?.toLowerCase().includes(value?.toLowerCase())
      )
    : [];

  const autocompleteRef = useRef();
  const autocompletInput = useRef();
  useEffect(() => {
    const handleClick = (event) => {
      if (
        autocompleteRef.current &&
        !autocompleteRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
        autocompletInput.current.blur();
        //document.querySelector(".autocomplete input").blur();
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);
  const handleInputChange = (event) => {
    //setInputValue(event.target.value);
    handleChange(name, event.target.value);
  };

  const handleSuggestionClick = (suggetion) => {
    //setInputValue(suggetion);
    handleChange(name, suggetion);
    setShowSuggestions(false);
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
          <div className="autocomplete" ref={autocompleteRef}>
            <input
              type={type}
              name={name}
              value={value}
              disabled={isdisabled ? isdisabled : false}
              onChange={handleInputChange}
              placeholder="Search"
              onFocus={() => setShowSuggestions(true)}
              maxLength="80"
              autoComplete="off"
              ref={autocompletInput}
            />
            {showSuggestions && (
              <ul className="suggestions">
                {suggestions.map((suggestion) => (
                  <li
                    onClick={() => handleSuggestionClick(suggestion)}
                    key={suggestion}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}

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
