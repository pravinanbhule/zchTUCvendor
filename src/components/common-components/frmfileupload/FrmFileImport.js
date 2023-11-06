import React, { useState, useEffect } from "react";
import readXlsxFile from "read-excel-file";
import "./Style.css";
function FrmFileImport(props) {
  const {
    name,
    title,
    isReadMode,
    isdisabled,
    isRequired,
    onfileImport,
    filenme,
  } = props;
  const [selectedfile, setselectedfile] = useState();
  const [filename, setfilename] = useState();
  const maxFileSize = 150;

  const onfileselect = (e) => {
    let _this = e.target;
    let fileName = "";
    if (_this.files) {
      for (let i = 0; i < _this.files.length; i++) {
        let file = _this.files[i];
        let filesize = bytesToMBSize(file.size);
        if (filesize > maxFileSize) {
          alert(
            `You can not upload file of size more than 150 MB. The file ${file.name} has size ${filesize} MB.\nPlease select another file.`
          );
          document.getElementById("file").value = null;
          return;
        }
      }
    }
    setselectedfile(_this.files);
    if (_this.files && _this.files.length > 1) {
      fileName = (_this.getAttribute("data-multiple-caption") || "").replace(
        "{count}",
        _this.files.length
      );
    } else {
      fileName = e.target.value.split("\\").pop();
    }

    if (fileName) {
      setfilename(fileName);
    }
  };
  const onfileImportHandler = () => {
    if (!selectedfile) {
      return;
    }
    setfilename("");
    onfileImport(selectedfile);
  };

  const bytesToMBSize = (bytes) => {
    /*var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes == 0) return "0 Byte";
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));*/
    return Math.round(bytes / Math.pow(1024, 2), 2);
  };
  return (
    <div
      className={`frm-field fileupload ${isRequired ? "mandatory" : ""} ${
        isdisabled && "disabled"
      }`}
    >
      <label htmlFor={name}>
        <div className="label">{title}</div>
      </label>
      {!isReadMode ? (
        <>
          <div className="select-file-container">
            <input
              type="file"
              name="file"
              id="file"
              class="inputfile"
              multiple={false}
              accept="xlsx,xls,xlsm"
              onChange={onfileselect}
              disabled={isdisabled ? isdisabled : false}
            />
            <label for="file">
              <div className="select-filebox">
                <div className="selected-files">
                  {filename ? filename : "Choose a file…"}
                </div>
                <div
                  className={`btn-blue browse-btn ${isdisabled && "disable"}`}
                >
                  Browse
                </div>
              </div>
            </label>
            <div
              className={`upload-btn btn-blue ${
                filename ? "normal" : "disable"
              }`}
              onClick={onfileImportHandler}
            >
              Import
            </div>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}

export default React.memo(FrmFileImport);
