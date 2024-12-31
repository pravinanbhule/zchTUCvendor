import React, { useState, useEffect } from "react";
import RichTextEditor from "react-rte";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import parse from "html-react-parser";
import "./Style.css";
import ToolTip from "../tooltip/ToolTip";

ClassicEditor.defaultConfig = {
  toolbar: {
    items: [
      "heading",
      "|",
      "bold",
      "italic",
      "|",
      "bulletedList",
      "numberedList",
      "|",
      "insertTable",
      "|",
      "link",
      "|",
    ],
  },
  table: {
    contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
  },
  language: "en",
};
function FrmRichTextEditor5(props) {
  const {
    title,
    name,
    value,
    type,
    isReadMode,
    handleChange,
    isRequired,
    validationmsg,
    issubmitted,
    isdisabled,
    isToolTip,
    tooltipmsg,
    isRfEBtn,
    chatlink,
    handleRfEBtnClick
  } = props;
  /*

  const setRichTextValue = (e, editor) => {
    handleChange(name, editor.getData());
  };
  const toolbarConfig = {
    // Optionally specify the groups to display (displayed in the order listed).
    display: [
      "INLINE_STYLE_BUTTONS",
      "BLOCK_TYPE_BUTTONS",
      "BLOCK_TYPE_DROPDOWN",
    ],
    BLOCK_TYPE_DROPDOWN: [
      { label: "Normal", style: "unstyled" },
      { label: "Heading Large", style: "header-one" },
      { label: "Heading Medium", style: "header-two" },
      { label: "Heading Small", style: "header-three" },
    ],
    INLINE_STYLE_BUTTONS: [
      { label: "Bold", style: "BOLD", className: "custom-css-class" },
      { label: "Italic", style: "ITALIC" },
      { label: "Underline", style: "UNDERLINE" },
    ],

    BLOCK_TYPE_BUTTONS: [
      { label: "UL", style: "unordered-list-item" },
      { label: "OL", style: "ordered-list-item" },
    ],
  };
  const [editorValue, seteditorValue] = useState(
    RichTextEditor.createEmptyValue()
  );

  useEffect(() => {
    if (value) {
      seteditorValue(editorValue.setContentFromString(value, "html"));
    }
  }, []);*/

  const setRichTextValue = (event, editor) => {
    const data = editor.getData();
    handleChange(name, data);
  };
  return (
    <div
      className={`frm-field ${isRequired ? "mandatory" : ""} ${!isReadMode && isdisabled ? "disabled" : ""
        }`}
    >
      <label htmlFor={name} className={`${isRfEBtn ? 'ref-btn' : ''}`}>
        <div
          className={`label ${isToolTip && "hastooltip"
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
        {
          chatlink ? (<div className="title-chatlink"><i>Click <a href={chatlink} target="_blank">here</a> to access the live conversation about this RfE</i></div>) : ""
        }
        {isRfEBtn ? (
          <div
            className="btn-blue"
            style={{ marginLeft: "10px" }}
            onClick={() => handleRfEBtnClick()}
          >
            Copy previous RfE Details
          </div>
        ) : (
          ""
        )}
      </label>
      {isReadMode ? (
        <div
          className="rich-text-data"
          dangerouslySetInnerHTML={{ __html: value ? value : "" }}
        />
      ) : (
        <>
          <CKEditor
            editor={ClassicEditor}
            data={value ? value : ""}
            disabled={isdisabled ? isdisabled : false}
            onChange={setRichTextValue}
          />
          {isRequired &&
            issubmitted &&
            (!value || (value && !value.replace(/<\/?[^>]+(>|$)/g, ""))) ? (
            <div className="validationError">{validationmsg}</div>
          ) : (
            ""
          )}
        </>
      )}
    </div>
  );
}

export default React.memo(FrmRichTextEditor5);
