import React, { useState, useEffect } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import ReactPaginate from "react-paginate";
import ExportToExcel from "../exporttoexcel/ExportToExcel";
import "./Style.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import FrmSelect from "../frmselect/FrmSelect";
import { handlePermission } from "../../../permissions/Permission";
function Pagination(props) {
  const {
    column,
    data,
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
    pageno,
    pagesize,
    totalItems,
    onPaginationPagechange,
    onPageSizeChange,
    isAddButton,
    isPagination,
    isExportReport,
    isImportLogs,
    importLogsTitle,
    exportReportTitle,
    exportReportLogsHandler,
  } = props;

  const [pageSizeOpts, setpageSizeOpts] = useState([
    { label: "5", value: 5 },
    { label: "10", value: 10 },
    { label: "25", value: 25 },
  ]);
  const [totalmsg, settotalmsg] = useState("");
  const handlePageClick = (data) => {
    //console.log(data.selected + 1);
    onPaginationPagechange(data.selected + 1);
  };
  useEffect(() => {
    let endindex =
      totalItems > pagesize * pageno ? pagesize * pageno : totalItems;
    let startindex =
      pagesize * (pageno - 1) + 1 > endindex
        ? endindex
        : pagesize * (pageno - 1) + 1;
    settotalmsg(`Showing ${startindex} to ${endindex} of ${totalItems}`);
  }, [pageno, pagesize]);
  const onPagesizeSelect = (name, value) => {
    onPageSizeChange(parseInt(value));
  };
  const handleActivStateClick = (state) => {
    setMasterdataActiveState(state);
  };

  const [isAddActive, setIsAddActive] = useState(true)
  const [isExportActive, setIsExportActive] = useState(true)
  const [isImportActive, setIsImportActive] = useState(true)

  useEffect(()=>{
    const addResponse = handlePermission(window.location.pathname.slice(1), "isAdd")
    setIsAddActive(addResponse)
    const exportResonse = handlePermission(window.location.pathname.slice(1), "isExport")
    setIsExportActive(exportResonse)
    const importResonse = handlePermission(window.location.pathname.slice(1), "isImport")
    setIsImportActive(importResonse)
  },[])

  const handleAddBtnClick = () => {
    if (isAddActive) {
      showAddPopup() 
    }
  }

  const handleImportBtnClick = () => {
    if (isImportActive) {
      showImportLogsPopup() 
    }
  }

  const handleExportBtnClick = () => {
    if (isExportActive) {
      exportReportLogsHandler()
    }
  }

  return (
    <div className="site-pagination-table container-fluid">
      <div className="pagination-top-container row">
        <div className="btn-container ">
          {isImportLogs && (
            <div
              className={`btn-blue import-icon ${
                isImportActive ? "" : "disable"
              }`}
              onClick={() => handleImportBtnClick()}
            >
              {importLogsTitle ? importLogsTitle : "Import Logs"}
            </div>
          )}

          {isShowActiveBtns && (
            <div className="btn-container">
              <div
                className={`btn-blue ${ActiveBtnsState ? "" : "disable"}`}
                onClick={() => handleActivStateClick(true)}
              >
                Active
              </div>
              <div
                className={`btn-blue ${ActiveBtnsState ? "" : "disable"}`}
                onClick={() => handleActivStateClick(false)}
              >
                Inactive
              </div>
            </div>
          )}
          {
            /*isExportReport && (
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
          )*/
            isExportReport && (
              <div
                className={`btn-blue exportxlsbtn ${
                  isExportActive ? "" : "disable"
                }`}
                onClick={() => handleExportBtnClick()}
              >
                {exportReportTitle ? exportReportTitle : "Export"}
              </div>
            )
          }
          {isAddButton !== false && (
            <div
              className={`btn-blue plus-icon ${
                isAddActive ? "" : "disable"
              }`}
              onClick={() => handleAddBtnClick()}
            >
              {buttonTitle}
            </div>
          )}
        </div>
      </div>
      <div className="row">
        <BootstrapTable
          bootstrap4
          keyField={id}
          data={data}
          columns={column}
          defaultSorted={defaultSorted}
          defaultSortDirection="asc"
          noDataIndication='No data available'
          //pagination={paginationFactory()}
        />
      </div>
      {isPagination !== false && (
        <div className="pagination-bottom-container row">
          <div className="col-md-1">
            <FrmSelect
              name={"pageno"}
              selectopts={pageSizeOpts}
              handleChange={onPagesizeSelect}
              value={pagesize.toString()}
              isinline={true}
            />
          </div>
          <div className="col-md-4">
            <div className="showtotalmsg">{totalmsg}</div>
          </div>
          <div className="col-md-7">
            <div className="Page navigation">
              <ReactPaginate
                forcePage={pageno - 1}
                previousLabel={"Previous"}
                nextLabel={"Next"}
                pageCount={totalItems ? Math.ceil(totalItems / pagesize) : 1}
                marginPagesDisplayed={2}
                pageRangeDisplayed={2}
                onPageChange={handlePageClick}
                containerClassName="pagination justify-content-end"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                activeClassName="active"
              />
            </div>
          </div>
        </div>
      )}
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
export default React.memo(Pagination, areEqual);
