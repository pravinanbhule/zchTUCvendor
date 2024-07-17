import React, { useState } from "react";
import "./Style.css";
import Popup from "../common-components/Popup";
import { formatDate, dynamicSort } from "../../helpers";
import parse from "html-react-parser";
import moment from "moment";
function VersionHistoryPopupRfe(props) {
  const {
    versionHistoryData,
    exportFieldTitles,
    exportDateFields,
    exportHtmlFields,
    versionHistoryExcludeFields,
    hidePopup,
    isDraft,
  } = props;
  const [versionData, setversionData] = useState(
    versionHistoryData.sort(dynamicSort("VersionNo", "Des"))
  );
  const [order, setorder] = useState(true);
  const [sortColumn, setsortColumn] = useState("VersionNo");
  const sortDataVersion = (sortType) => {
    let tempdata = [...versionData];
    let temporder = order ? "Asc" : "Des";
    tempdata.sort(dynamicSort(sortType, temporder));
    setversionData([...tempdata]);
    setorder(!order);
    setsortColumn(sortType);
  };
  return (
    <Popup {...props}>
      <div className="popup-box versionhistory">
        <div className="popup-header-container">
          <div className="popup-header-title">Version History</div>
          <div className="popup-close" onClick={() => hidePopup()}>
            X
          </div>
        </div>
        <div className="popup-content">
          <div className="versionhistory-container">
            {!isDraft ? (
              versionData.length ? (
                <>
                  <div>
                    <b>Note</b>:The data versions are displayed as per the
                    Server UTC timezone.<br></br>
                    <br></br>
                  </div>
                  <div>All Versions</div>
                  <div className="versionhistory-data-container">
                    <table>
                      <tr style={{ position: "relative", color: "#2167ad" }}>
                        <th
                          style={{ width: "40px" }}
                          onClick={() => sortDataVersion("VersionNo")}
                        >
                          <div>No</div>
                          <div
                            className={`${
                              sortColumn === "VersionNo" ? "sort" : ""
                            } ${order ? "down-arrow" : "up-arrow"} `}
                          ></div>
                        </th>
                        <th
                          style={{ width: "220px" }}
                          onClick={() => sortDataVersion("Modified Date")}
                        >
                          <div>Modified</div>
                          <div
                            className={`${
                              sortColumn === "Modified Date" ? "sort" : ""
                            } ${order ? "down-arrow" : "up-arrow"} `}
                          ></div>
                        </th>
                        <th
                          onClick={() => sortDataVersion("Last Modifior Name")}
                        >
                          <div>Modified By</div>
                          <div
                            className={`${
                              sortColumn === "Last Modifior Name" ? "sort" : ""
                            } ${order ? "down-arrow" : "up-arrow"} `}
                          ></div>
                        </th>
                      </tr>
                      {versionData.map((item, i) => {
                        return (
                          <tbody class="reversible">
                            <tr>
                              <td>{`${item["VersionNo"]}.0`}</td>
                              <td style={{ color: "#243E6F" }}>
                                {" "}
                                {item["Modified Date"]
                                  ? item["Modified Date"]
                                  : ""}
                              </td>
                              <td>
                                {item["Last Modifior Name"]
                                  ? item["Last Modifior Name"]
                                  : ""}
                              </td>
                            </tr>
                            {Object.keys(exportFieldTitles).map((key, i) => {
                              if (
                                item[key] !== undefined &&
                                item[key] !== null &&
                                !versionHistoryExcludeFields[key]
                              ) {
                                return (
                                  <tr class="linktoparent">
                                    <td></td>
                                    <td>{exportFieldTitles[key]}</td>
                                    <td>
                                      {exportDateFields[key] ? (
                                        item[key] ? (
                                          formatDate(item[key])
                                        ) : (
                                          ""
                                        )
                                      ) : exportHtmlFields.includes(key) ? (
                                        item[key] ? (
                                          <div
                                            dangerouslySetInnerHTML={{
                                              __html: item[key],
                                            }}
                                          ></div>
                                        ) : (
                                          ""
                                        )
                                      ) : item[key] === true ||
                                        item[key] === false ? (
                                        item[key] ? (
                                          "Yes"
                                        ) : (
                                          "No"
                                        )
                                      ) : item[key] ? (
                                        item[key]
                                      ) : (
                                        ""
                                      )}
                                    </td>
                                  </tr>
                                );
                              }
                            })}
                            {Object.keys(item).map((key, i) => {
                              if (
                                exportFieldTitles[key] === undefined &&
                                item[key] !== null &&
                                key !== "VersionNo" &&
                                key !== "Last Modifior Name"
                              ) {
                                return (
                                  <tr class="linktoparent">
                                    <td></td>
                                    <td>{key}</td>
                                    <td>
                                      {item[key]
                                        ? (item[key] === true ||
                                          item[key] === false)
                                          ? item[key]
                                            ? "Yes"
                                            : "No"
                                          : item[key].split(',').join(', ')
                                        : ""}
                                    </td>
                                  </tr>
                                );
                              }
                            })}
                          </tbody>
                        );
                      })}
                    </table>
                  </div>
                </>
              ) : (
                ""
              )
            ) : (
              <div>
                <b>No version history will be saved for the Draft.</b>
              </div>
            )}
          </div>
        </div>
      </div>
    </Popup>
  );
}

export default VersionHistoryPopupRfe;
