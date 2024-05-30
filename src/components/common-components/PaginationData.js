import React, { useState, useEffect } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import ExportToExcel from "./exporttoexcel/ExportToExcel";
import { ExportCSV } from "./exporttoexcel/ExportCSV";
import ExportList from "./exportlist/ExportList";
import { handlePermission } from "../../permissions/Permission";
function PaginationData(props) {
  const {
    column,
    data,
    datatotalcount,
    showAddPopup,
    showImportLogsPopup,
    isShowActiveBtns,
    setMasterdataActiveState,
    ActiveSelectedItems,
    ActiveBtnsState,
    defaultSorted,
    buttonTitle,
    id,
    hidesearch,
    isExportReport,
    isCSVExportReport,
    isImportLogs,
    importLogsTitle,
    exportReportTitle,
    exportFileName,
    exportExcludeFields,
    exportFieldTitles,
    exportHtmlFields,
    exportDateFields,
    exportCapitalField,
    pageno,
    isShowDownloadBtn,
    handleDownload,
    DownloadBtnState
  } = props;
  const { SearchBar, ClearSearchButton } = Search;

  const sizeperpageoptions = [
    {
      text: "10",
      value: 10,
    },
    {
      text: "25",
      value: 25,
    },
    {
      text: "50",
      value: 50,
    },
  ];
  const [totalcount, settotalcount] = useState(0);
  const [totalmsg, settotalmsg] = useState("");
  const pagination = paginationFactory({
    page: pageno ? pageno : 1,
    paginationSize: 1,
    sizePerPageList: sizeperpageoptions,
    lastPageText: ">>",
    firstPageText: "<<",
    nextPageText: "Next",
    prePageText: "Previous",
    showTotal: true,
    paginationShowsTotal: true,
    withFirstAndLast: false,
    alwaysShowAllBtns: true,
    disablePageTitle: true,
    onPageChange: function (page, sizePerPage) {
      onpageloadchange(page, sizePerPage);
    },
    onSizePerPageChange: function (sizePerPage, page) {
      onpageloadchange(page, sizePerPage);
    },
  });
  useEffect(() => {
    let totalcount = datatotalcount ? datatotalcount : data.length;
    settotalcount(totalcount);
  }, [data]);
  useEffect(() => {
    onpageloadchange(1, sizeperpageoptions[0].value);
  }, [totalcount]);

  const onpageloadchange = (page, sizePerPage) => {
    let startindex = sizePerPage * (page - 1) + 1;
    let endindex = sizePerPage * page;
    settotalmsg(`Showing ${startindex} to ${endindex} of ${totalcount}`);
  };
  const customers = () => {
    let custs = [];
    for (let i = 0; i <= 25; i++) {
      custs.push({
        firstName: `first${i}`,
        lastName: `last${i}`,
        email: `abc${i}@gmail.com`,
        address: `000${i} street city, ST`,
        zipcode: `0000${i}`,
      });
    }
    return custs;
  };
  const handleActivStateClick = (state) => {
    setMasterdataActiveState(state);
  };

  const [isAddActive, setIsAddActive] = useState(true)

  useEffect(()=>{
    const resonse = handlePermission(window.location.pathname.slice(1), "isAdd")
    setIsAddActive(resonse)
  },[])

  const handleAddBtnClick = () =>{
    if (isAddActive) {
      showAddPopup() 
    }
  }


  const handleDownloadButtonClick = () =>{
    if (DownloadBtnState) {
      handleDownload()
    }
  }

  //const pagination = paginationFactory();
  return (
    <div>
      <div className="site-pagination-table">
        <ToolkitProvider
          //remote={{ pagination: false, filter: false, sort: false }}
          bootstrap4
          keyField={id}
          data={data}
          columns={column}
          search
        >
          {(props) => (
            <>
              <div className="pagination-top-container">
                <div className="searchbox">
                  {!hidesearch && (
                    <>
                      <div className="search-title">Search:</div>
                      <SearchBar {...props.searchProps} />
                      <ClearSearchButton {...props.searchProps} />
                    </>
                  )}
                </div>
                <div className="btn-container">
                  {isImportLogs && (
                    <div
                      className="btn-blue import-icon"
                      onClick={() => showImportLogsPopup()}
                    >
                      {importLogsTitle ? importLogsTitle : "Import Logs"}
                    </div>
                  )}
                  {isExportReport && isCSVExportReport ? (
                    <ExportList
                      exportReportTitle={exportReportTitle}
                      exportFileName={exportFileName}
                      exportData={data}
                      exportExcludeFields={exportExcludeFields}
                      exportFieldTitles={exportFieldTitles}
                      exportHtmlFields={exportHtmlFields}
                      exportDateFields={exportDateFields}
                      exportCapitalField={exportCapitalField}
                    />
                  ) : (
                    isExportReport && (
                      <ExportToExcel
                        exportReportTitle={exportReportTitle}
                        exportFileName={exportFileName}
                        exportData={data}
                        exportExcludeFields={exportExcludeFields}
                        exportFieldTitles={exportFieldTitles}
                        exportHtmlFields={exportHtmlFields}
                        exportDateFields={exportDateFields}
                        exportCapitalField={exportCapitalField}
                      />
                    )
                  )}
                  {isShowActiveBtns && (
                    <div className="btn-container">
                      <div
                        className={`btn-blue ${
                          ActiveBtnsState ? "" : "disable"
                        }`}
                        onClick={() => handleActivStateClick(true)}
                      >
                        Active
                      </div>
                      <div
                        className={`btn-blue ${
                          ActiveBtnsState ? "" : "disable"
                        }`}
                        onClick={() => handleActivStateClick(false)}
                      >
                        Inactive
                      </div>
                    </div>
                  )}
                  {isShowDownloadBtn && (
                    <div
                      className={`btn-blue download-icon ${
                        DownloadBtnState ? "" : "disable"
                      }`}
                      onClick={() => handleDownloadButtonClick()}
                    >
                      Download
                    </div>
                  )}
                  <div
                    className={`btn-blue  ${
                      isAddActive ? "" : "disable"
                    } plus-icon`}
                    onClick={() => handleAddBtnClick()}
                  >
                    {buttonTitle}
                  </div>
                </div>
              </div>
              <BootstrapTable
                defaultSorted={defaultSorted}
                pagination={pagination}
                {...props.baseProps}
              />
              <div className="showtotalmsg">{totalmsg}</div>
            </>
          )}
        </ToolkitProvider>
      </div>
    </div>
  );
}
function areEqual(prevProps, nextProps) {
  return (
    prevProps.data === nextProps.data &&
    prevProps.ActiveBtnsState === nextProps.ActiveBtnsState &&
    prevProps.ActiveSelectedItems === nextProps.ActiveSelectedItems
  );
}
export default React.memo(PaginationData, areEqual);
