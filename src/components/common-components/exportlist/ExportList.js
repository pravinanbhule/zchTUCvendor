import React, { useState, useEffect, useRef } from "react";
import "./Style.css";
import { ExportCSV } from "../exporttoexcel/ExportCSV";
function ExportList(props) {
  const {
    exportReportTitle,
    exportData,
    exportFileName,
    exportExcludeFields,
    exportFieldTitles,
    exportHtmlFields,
    exportDateFields,
    exportCapitalField,
  } = props;
  const autocloseRef = useRef();
  useEffect(() => {
    const handleClick = (event) => {
      if (
        autocloseRef.current &&
        !autocloseRef.current.contains(event.target)
      ) {
        setshowExportList(false);
        //document.querySelector(".autocomplete input").blur();
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);
  const [showExportList, setshowExportList] = useState(false);
  const handleBtnclick = () => {
    setshowExportList(true);
  };
  const hideExportList = () => {
    setshowExportList(false);
  };
  return (
    <div className="export-container" ref={autocloseRef}>
      <div className="btn-container" style={{ marginRight: "0" }}>
        <div className={`btn-blue export-icon`} onClick={handleBtnclick}>
          {exportReportTitle}
        </div>
      </div>

      {showExportList ? (
        <div className="export-container-list">
          <div>
            <div
              class="popup-close"
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
              }}
              onClick={hideExportList}
            >
              X
            </div>
          </div>

          <div className="export-list">
            <ul>
              <li>
                <ExportCSV
                  exportReportTitle={"Export CSV (comma as delimiter)"}
                  exportFileName={exportFileName}
                  exportData={exportData}
                  exportExcludeFields={exportExcludeFields}
                  exportFieldTitles={exportFieldTitles}
                  exportHtmlFields={exportHtmlFields}
                  exportDateFields={exportDateFields}
                  exportCapitalField={exportCapitalField}
                  seperator={","}
                />
              </li>
              <li>
                <ExportCSV
                  exportReportTitle={"Export CSV (semicolon as delimiter)"}
                  exportFileName={exportFileName}
                  exportData={exportData}
                  exportExcludeFields={exportExcludeFields}
                  exportFieldTitles={exportFieldTitles}
                  exportHtmlFields={exportHtmlFields}
                  exportDateFields={exportDateFields}
                  exportCapitalField={exportCapitalField}
                  seperator={";"}
                />
              </li>
            </ul>
          </div>
          <div className="instruction" style={{ padding: "10px" }}>
            One of the two options given above will provide the correct file
            depending on user Region settings.
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default ExportList;
