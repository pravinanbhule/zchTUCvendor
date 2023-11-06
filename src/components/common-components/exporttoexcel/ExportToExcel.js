import React from "react";
import ExportToExcelLib from "./ExportToExcelLib";
import "./Style.css";
import { formatDate, formatDateExportReport } from "../../../helpers";

function ExportToExcel(props) {
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
  let column = [];
  let data = [];
  for (let i = 0; i < exportData.length; i++) {
    let item = exportData[i];
    let dataitem = [];
    for (let key in item) {
      if (!exportExcludeFields?.includes(key)) {
        if (i === 0) {
          if (exportFieldTitles && exportFieldTitles[key]) {
            column.push({ title: exportFieldTitles[key] });
          } else {
            column.push({ title: key });
          }
        }
        if (exportHtmlFields?.includes(key) && item[key]) {
          dataitem.push({ value: item[key].replace(/<\/?[^>]+(>|$)/g, "") });
        } else if (exportDateFields && exportDateFields[key] && item[key]) {
          dataitem.push({
            value: dateValidator(formatDate(item[key])),
            style: {
              numFmt: "d/mmm/yyyy",
            },
          });
        } else if (exportCapitalField && exportCapitalField[key] && item[key]) {
          dataitem.push({ value: item[key].toUpperCase() });
        } else {
          dataitem.push({
            value: item[key] ? item[key] : item[key] === false ? item[key] : "",
          });
        }
      }
    }
    data.push(dataitem);
  }

  const multiDataSet = [
    {
      columns: column,
      data: data,
    },
  ];

  function dateValidator(dataValue) {
    if (
      new Date(dataValue) instanceof Date &&
      !isNaN(new Date(dataValue).valueOf())
    ) {
      // Duration of a day in MilliSeconds
      const oneDay = 1000 * 60 * 60 * 24;
      // Excel starts reading dates from 1900-1-1 and date parameter is our date which we are providing in string format as "2023-4-23"
      //excel reads dates as five digit numbers as difference in date given and 1900-1-1
      //adding 2 beacuse when we get difference it doesn't include those specific days
      const differenceOfDays =
        Math.round(
          Math.abs((new Date("1900-1-1") - new Date(dataValue)) / oneDay)
        ) + 2;
      return differenceOfDays;
    } else {
      return dataValue;
    }
  }
  return (
    <div>
      <ExportToExcelLib
        exportReportTitle={exportReportTitle}
        exportFileName={exportFileName}
        multiDataSet={multiDataSet}
      />
    </div>
  );
}

export default React.memo(ExportToExcel);
