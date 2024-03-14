import React, { useState, useEffect } from "react";
import Multiselect from "multiselect-react-dropdown";
import "./Style.css";
import AppLocale from "../../../IngProvider";
function FrmMultiselect(props) {
  const {
    title,
    name,
    value,
    handleChange,
    isRequired,
    validationmsg,
    issubmitted,
    selectopts,
    isReadMode,
    isAllOptNotRequired,
    titlelinespace,
    selectedlanguage
  } = props;
  const [selectedItems, setselectedItems] = useState(value);
  useEffect(() => {
    setselectedItems(value);
  }, [value]);
  const onSelect = (selectedList, selectedItem) => {
    let tempSelectedList = [...selectedList];
    if (
      !isAllOptNotRequired &&
      (selectedItem.value === "*" ||
        selectedList.length === selectopts.length - 1)
    ) {
      tempSelectedList = [...selectopts];
    }
    setselectedItems([...tempSelectedList]);
    handleChange(name, [...tempSelectedList]);
  };
  const onRemove = (selectedList, selectedItem) => {
    let tempSelectedList = [...selectedList];
    if (selectedItem.value === "*") {
      tempSelectedList = [];
    } else {
      tempSelectedList = selectedList.filter((item) => item.value !== "*");
    }
    setselectedItems([...tempSelectedList]);
    handleChange(name, [...tempSelectedList]);
  };
  const removeSelectedItem = (value) => {
    let tempItems = selectedItems.filter((item) => item.value !== value);
    if (value === "*") {
      tempItems = [];
    }
    setselectedItems([...tempItems]);
    handleChange(name, [...tempItems]);
  };
  const onClickHandle = () => {};
  return (
    <div className={`frm-field ${isRequired ? "mandatory" : ""}`}>
      <label htmlFor={name}>
        <div className="label">{title}</div>
      </label>
      {titlelinespace && <br></br>}
      {!isReadMode && (
        <Multiselect
          className="custom-multiselect"
          options={selectopts}
          displayValue="label"
          hidePlaceholder={false}
          showCheckbox={true}
          placeholder={selectedlanguage ? AppLocale[selectedlanguage].messages["placeholder.search"] : "Select"}
          selectedValues={selectedItems}
          onClick={onClickHandle}
          onSelect={onSelect}
          onRemove={onRemove}
        ></Multiselect>
      )}

      {isRequired && issubmitted && !selectedItems.length ? (
        <div className="validationError">{validationmsg}</div>
      ) : (
        ""
      )}
      <div className="multi-selected-opts-container">
        {!isAllOptNotRequired &&
        selectopts &&
        selectopts.length &&
        selectedItems.length === selectopts.length ? (
          <div className="multi-selected-opts" key={selectopts[0].value}>
            <div>{selectopts[0].label}</div>
            {!isReadMode && (
              <div
                className="delete-icon"
                onClick={() => removeSelectedItem(selectopts[0].value)}
              ></div>
            )}
          </div>
        ) : (
          selectedItems.map((item) => (
            <div className="multi-selected-opts" key={item.value}>
              <div>{item.label}</div>
              {!isReadMode && (
                <div
                  className="delete-icon"
                  onClick={() => removeSelectedItem(item.value)}
                ></div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default FrmMultiselect;
