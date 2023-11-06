import React from "react";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { CSVLink } from "react-csv";
import { formatDate, formatDateExportReport } from "../../../helpers";
export const ExportCSV = (props) => {
  const {
    exportReportTitle,
    exportData,
    exportFileName,
    exportExcludeFields,
    exportFieldTitles,
    exportHtmlFields,
    exportDateFields,
    exportCapitalField,
    seperator,
  } = props;
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  const NbspsRg = new RegExp(String.fromCharCode(160), "g");
  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };
  let column = [];
  let data = [];
  for (let i = 0; i < exportData.length; i++) {
    let item = exportData[i];
    let dataitem = {};
    for (let key in item) {
      if (!exportExcludeFields.includes(key)) {
        let fieldname = "";
        //if (i === 0) {
        if (exportFieldTitles && exportFieldTitles[key]) {
          //column.push({ title: exportFieldTitles[key] });
          fieldname = exportFieldTitles[key];
        } else {
          //column.push({ title: key });
          fieldname = exportFieldTitles[key];
        }
        //}
        if (exportHtmlFields.includes(key) && item[key]) {
          dataitem[fieldname] = `'${item[key]
            .replace(/<\/?[^>]+(>|$)/g, "")
            .replace(/"/g, '""')
            .replace(/\&nbsp;/g, " ")}'`;

          if (dataitem[fieldname] && dataitem[fieldname].length > 32767) {
            dataitem[fieldname] = dataitem[fieldname].substring(0, 32000);
          }
        } else if (exportDateFields[key] && item[key]) {
          dataitem[fieldname] = formatDate(item[key]);
        } else if (exportCapitalField && exportCapitalField[key] && item[key]) {
          dataitem[fieldname] = item[key].toUpperCase();
        } else {
          dataitem[fieldname] = item[key]
            ? item[key]
            : item[key] === false
            ? item[key]
            : "";
        }
      }
    }
    data.push(dataitem);
  }
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
  /*for (let i = 0; i < exportData.length; i++) {
    let item = exportData[i];
    let dataitem = [];
    for (let key in item) {
      if (item[key] && item[key].length > 32767) {
        item[key] = item[key].substring(0, 300);
      }
    }
  }
  const csvData = [
    ["sep=;"],
    ["firstname", "lastname", "email"],
    ["Ahmed", "Tomi", "ah@smthing.co.com"],
    ["Raed", "Labes", "rl@smthing.co.com"],
    ["Yezzi", "Min l3b", "ymin@cocococo.com"],
  ];*/

  return (
    <button className="exportcsv">
      <CSVLink data={data} filename={exportFileName} separator={`${seperator}`}>
        {exportReportTitle}
      </CSVLink>
    </button>
  );
};
