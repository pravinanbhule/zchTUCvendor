import React, { useState, useEffect, useRef } from "react";
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
    selectedlanguage,
    groupBy
  } = props;
  const [selectedItems, setselectedItems] = useState([]);
  const [option, setOption] = useState(selectopts);
  const [displayOpt, setDisplayOpt] = useState(selectopts)
  const displayOptRef = useRef(selectopts);
  useEffect(() => {
    if (value) {
      let selectedListOpts = [];
      value.map((item, i) => {
        selectedListOpts.push({
          ...item,
          value: item.value+"@"+item.label
        })
      }) 
      setselectedItems(selectedListOpts);
    }
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
    let selectedListOpts = [];
    tempSelectedList.map((item, i) => {
      selectedListOpts.push({
        ...item,
        value: item.value.replace("@"+ item.label, "")
      })
    }) 
    setselectedItems([...tempSelectedList]);
    handleChange(name, [...selectedListOpts]);
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
          groupBy={groupBy ? groupBy : ''}
          options={displayOpt.map((e) => ({...e, value: e.value+"@"+e.label}))}
          displayValue='value'
          hidePlaceholder={false}
          showCheckbox={true}
          placeholder={selectedlanguage ? AppLocale[selectedlanguage].messages["placeholder.search"] : "Select"}
          selectedValues={selectedItems}
          onClick={onClickHandle}
          onSelect={onSelect}
          onRemove={onRemove}
          optionValueDecorator={(a, c) => {
            return c.label
          }}
          avoidHighlightFirstOption={true}
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
        selectedItems?.length === selectopts?.length ? (
          <div className="multi-selected-opts" key={selectopts[0]?.value}>
            <div>{selectopts[0].label}</div>
            {!isReadMode && (
              <div
                className="delete-icon"
                onClick={() => removeSelectedItem(selectopts[0].value)}
              ></div>
            )}
          </div>
        ) : (
          selectedItems && selectedItems.length ? 
            selectedItems?.map((item) => (
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
          : ""
        )}
      </div>
    </div>
  );
}

export default FrmMultiselect;
