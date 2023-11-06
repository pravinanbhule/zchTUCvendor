import React from "react";
import ReactExport from "react-data-export";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
function ExportToExcelLib(props) {
  const { exportReportTitle, exportFileName, multiDataSet } = props;
  return (
    <ExcelFile
      element={<button className="exportxlsbtn">{exportReportTitle}</button>}
      filename={exportFileName}
    >
      <ExcelSheet dataSet={multiDataSet} name="Organization" />
    </ExcelFile>
  );
}

export default ExportToExcelLib;
