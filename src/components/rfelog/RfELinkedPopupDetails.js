import React, { useEffect, useState } from "react";
import "./Style.css";
import Popup from "../common-components/Popup";
import FrmSelect from "../common-components/frmselect/FrmSelect";
import FrmMultiselect from "../common-components/frmmultiselect/FrmMultiselect";
import { formfieldsmapping } from "./Rfelogconstants";
import FrmFileUpload from "../common-components/frmfileupload/FrmFileUpload";
import FrmInput from "../common-components/frminput/FrmInput";
import FrmInputAutocomplete from "../common-components/frminputautocomplete/FrmInputAutocomplete";
import FrmRadio from "../common-components/frmradio/FrmRadio";
import FrmRichTextEditor from "../common-components/frmrichtexteditor/FrmRichTextEditor5";
import FrmDatePicker from "../common-components/frmdatepicker/FrmDatePicker";
import moment from "moment";
import AppLocale from "../../IngProvider";
import { formatDate } from "../../helpers";
import { commonActions } from "../../actions";
import { connect } from "react-redux";

function RfELinkedPopupDetails(props) {
    const {
        hidePopup,
        referenceRfEId,
        details,
        countryopts,
        frmLoB,
        getLogFields,
        selectedlanguage,
        IncountryFlag,
        IncountryFlagConst,
        frmrfeempourmentgermany,
        reasonOtherValue,
        frmSublob,
        OrganizationalAlignment,
        segmentAccount,
        frmrfeempourment,
        frmAccountOpts,
        frmorgnizationalalignment,
        frmrfechz,
        frmstatus,
        frmConditionOpts,
        frmDurationOpts,
        rfelog_status,
        frmBranchOpts,
        showReferenceBtn,
        handleCopyValue,
        referralReasonLevel2Option,
        referralReasonLevel3Option,
        frmSegmentOpts,
        inCountryOptsLATAM,
        frmCurrencyOpts
    } = props;

    const [fieldDetails, setFieldDetails] = useState([])
    const [accountNumberShow, setAccountNumberShow] = useState(false);
    const [formfield, setformfield] = useState({});
    const [showTextBox, setShowTextBox] = useState(false);
    const [reasonfields, setReasonfields] = useState({
        ReferralReasonLevel2: details?.ReferralReasonLevel2Value !== null ? true : false,
        ReferralReasonLevel3: details?.ReferralReasonLevel3Value !== null ? true : false,
    })

    useEffect(() => {
        setformfield(details)
        fnloadcountryview()
    }, [])

    const fnloadcountryview = async () => {
        const tempdbfields = await getLogFields({
            IncountryFlag: IncountryFlag,
            FieldType: "Form",
            LanguageCode: selectedlanguage?.value,
        });
        if (IncountryFlag === IncountryFlagConst.GERMANY) {
            let newFields = tempdbfields;
            let index = newFields.findIndex(
                (item) => item.fieldName === "CustomerSegment"
            );
            let AccountNumber = newFields.filter(
                (item) => item.fieldName === "AccountNumber"
            );
            for (let i = 0; i < newFields.length; i++) {
                if (newFields[i]?.fieldName === "GWP") {
                    newFields[i].isMandatory = false;
                }
                if (newFields[i]?.fieldName === "CustomerSegment") {
                    newFields.splice(index + 1, 0, AccountNumber[0]);
                } else if (
                    newFields[i]?.fieldName === "AccountNumber" &&
                    newFields[i - 1]?.fieldName !== "CustomerSegment"
                ) {
                    newFields.splice(i, 1);
                }
            }
        }
        if (
            details?.CountryName === "Germany" &&
            segmentAccount.includes(
                details?.CustomerSegmentValue?.toLowerCase().replace(/\s/g, "")
            )
        ) {
            setAccountNumberShow(true);
        }
        let tempfields = [];
        tempdbfields?.forEach((item) => {
            if (item.isActive) {
                let tempformobj = formfieldsmapping[item.fieldName];
                if (tempformobj) {
                    let tempobj = {
                        componenttype: tempformobj["componenttype"],
                        title: item.displayName,
                        name: tempformobj["fieldname"]
                            ? tempformobj["fieldname"]
                            : item.fieldName,
                        eventhandler: tempformobj["eventhandler"],
                        colspan: tempformobj["colspan"],
                        clsrowname: tempformobj["clsrowname"]
                            ? tempformobj["clsrowname"]
                            : "",
                        ismandatory: item.isMandatory,
                    };
                    if (item.fieldName === "RequestForEmpowermentReason") {
                        tempobj = {
                            ...tempobj,
                            isAddButton:
                                details?.ReferralReasonLevel2 ||
                                    (details?.ReferralReasonLevel2 !== null &&
                                        details?.ReferralReasonLevel2 !== "" &&
                                        details?.ReferralReasonLevel2 !== undefined)
                                    ? false
                                    : true,
                            options: IncountryFlag === IncountryFlagConst.GERMANY ? frmrfeempourmentgermany : item.options,
                        };
                        if (details?.RequestForEmpowermentReasonValue?.toLowerCase().replace(/\s/g, "") === reasonOtherValue) {
                            setShowTextBox(true);
                        } else {
                            setShowTextBox(false);
                        }
                    }
                    if (item.fieldName === "ReferralReasonLevel2") {
                        tempobj = {
                            ...tempobj,
                            options: frmrfeempourment,
                            isAddButton:
                                details?.ReferralReasonLevel3 ||
                                    (details?.ReferralReasonLevel3 !== null &&
                                        details?.ReferralReasonLevel3 !== "" &&
                                        details?.ReferralReasonLevel3 !== undefined)
                                    ? false
                                    : true,
                            titlelinespace:
                                selectedlanguage?.value === "DE001" ? false : true,
                            colspan:
                                details?.RequestForEmpowermentReasonValue?.toLowerCase().replace(
                                    /\s/g,
                                    ""
                                ) === reasonOtherValue
                                    ? 0
                                    : details?.ReferralReasonLevel2 ||
                                        (details?.ReferralReasonLevel2 !== null &&
                                            details?.ReferralReasonLevel2 !== "" &&
                                            details?.ReferralReasonLevel2 !== undefined)
                                        ? 3
                                        : 0,
                        };
                    }
                    if (item.fieldName === "ReferralReasonLevel3") {
                        tempobj = {
                            ...tempobj,
                            isAddButton: false,
                            options: frmrfeempourment,
                            titlelinespace:
                                selectedlanguage?.value === "DE001" ? false : true,
                            colspan:
                                details?.RequestForEmpowermentReasonValue?.toLowerCase().replace(
                                    /\s/g,
                                    ""
                                ) === reasonOtherValue
                                    ? 0
                                    : details?.ReferralReasonLevel3 ||
                                        (details?.ReferralReasonLevel3 !== null &&
                                            details?.ReferralReasonLevel3 !== "" &&
                                            details?.ReferralReasonLevel3 !== undefined)
                                        ? 3
                                        : 0,
                        };
                    }
                    if (item.fieldName === "SUBLOBID") {
                        tempobj = {
                            ...tempobj,
                            colspan: details?.SUBLOBID ? 3 : 0,
                        };
                    }
                    if (item.fieldName === "AccountNumber") {
                        tempobj = {
                            ...tempobj,
                            colspan:
                                details?.AccountNumber || accountNumberShow ? 3 : 0,
                        };
                    }
                    if (item.fieldName === "CustomerSegment") {
                        tempobj = {
                            ...tempobj,
                            titlelinespace:
                                selectedlanguage?.value === "DE001" && window.innerWidth < 1488
                                    ? true
                                    : false,
                        };
                    }
                    if (item.fieldName === "NewRenewal") {
                        tempobj = {
                            ...tempobj,
                            titlelinespace:
                                selectedlanguage?.value === "DE001" && window.innerWidth < 1488
                                    ? true
                                    : false,
                        };
                    }
                    if (item.fieldName === "GWP") {
                        tempobj = {
                            ...tempobj,
                            titlelinespace:
                                selectedlanguage?.value === "DE001" && window.innerWidth < 1488
                                    ? true
                                    : false,
                        };
                    }
                    if (item.fieldName === "ZurichShare") {
                        tempobj = {
                            ...tempobj,
                            titlelinespace:
                                selectedlanguage?.value === "DE001" && window.innerWidth < 1488
                                    ? true
                                    : false,
                        };
                    }
                    if (item.fieldName === "ConditionApplicableTo") {
                        tempobj = {
                            ...tempobj,
                            titlelinespace: window.innerWidth < 1488 ? true : false,
                        };
                    }
                    if (tempformobj["options"]) {
                        tempobj = {
                            ...tempobj,
                            options: tempformobj["options"],
                        };
                    }
                    if (tempformobj["minDate"] || tempformobj["maxDate"]) {
                        tempobj = {
                            ...tempobj,
                            minDate: tempformobj["minDate"],
                            maxDate: tempformobj["maxDate"],
                        };
                    }
                    if (tempformobj["tooltipmsg"]) {
                        tempobj = {
                            ...tempobj,
                            tooltipmsg: tempformobj["tooltipmsg"],
                        };
                    }
                    if (tempformobj["titlelinespace"]) {
                        tempobj = {
                            ...tempobj,
                            titlelinespace: tempformobj["titlelinespace"],
                        };
                    }
                    if (tempformobj["peoplepickertype"]) {
                        tempobj = {
                            ...tempobj,
                            peoplepickertype: tempformobj["peoplepickertype"],
                        };
                    }
                    if (tempformobj["startbgcls"]) {
                        tempobj = {
                            ...tempobj,
                            startbgcls: tempformobj["startbgcls"],
                        };
                    }
                    if (tempformobj["breakblock"]) {
                        tempobj = {
                            ...tempobj,
                            breakblock: tempformobj["breakblock"],
                        };
                    }
                    if (tempformobj["conditionaldisplay"]) {
                        tempobj = {
                            ...tempobj,
                            conditionaldisplay: tempformobj["conditionaldisplay"],
                        };
                    }
                    if (tempformobj["disablecondition"]) {
                        tempobj = {
                            ...tempobj,
                            disablecondition: tempformobj["disablecondition"],
                        };
                    }
                    if (tempformobj["fieldTitleHtml"]) {
                        tempobj = {
                            ...tempobj,
                            fieldTitleHtml: tempformobj["fieldTitleHtml"],
                        };
                    }
                    tempfields.push(tempobj);
                }
            }
        });
        if (tempfields.length) {
            setFieldDetails(tempfields);
        }
    };

    const getformsfieldsblock = (arrayObjs, clsrowname) => {
        let startbgcls = "";
        arrayObjs.forEach((element) => {
            if (element.startbgcls) {
                startbgcls = element.startbgcls;
            }
        });
        return (
            <div className={`row ${clsrowname} ${startbgcls}`}>
                {arrayObjs.map((item) => Fromdomobj(item, moment))}
            </div>
        );
    };

    const Fromdomobj = (obj, moment) => {
        let tempelement;
        switch (obj.componenttype) {
            case "FrmInput":
                tempelement = (
                    <div className={`col-md-${obj.colspan}`}>
                        {obj.peoplepickertype ? (
                            <FrmInput
                                title={
                                    obj.fieldTitleHtml ? (
                                        <span
                                            dangerouslySetInnerHTML={{ __html: obj.title }}
                                        ></span>
                                    ) : (
                                        obj.title
                                    )
                                }
                                titlelinespace={obj.titlelinespace ? true : false}
                                name={obj.name}
                                value={formfield[obj.name]}
                                type={"text"}
                                isReadMode={true}
                            />
                        ) : (
                            <FrmInput
                                title={obj.title}
                                titlelinespace={obj.titlelinespace ? true : false}
                                name={obj.name}
                                value={formfield[obj.name]}
                                type={"text"}
                                isReadMode={true}
                            />
                        )}
                    </div>
                );
                return obj.conditionaldisplay
                    ? eval(obj.conditionaldisplay)
                        ? tempelement
                        : ""
                    : tempelement;
            case "FrmInputAutocomplete":
                tempelement = (
                    <div className={`col-md-${obj.colspan}`}>
                        <FrmInputAutocomplete
                            title={obj.title}
                            titlelinespace={obj.titlelinespace ? true : false}
                            name={obj.name}
                            type={"input"}
                            value={formfield[obj.name]}
                            options={eval(obj.options)}
                            isReadMode={true}
                            selectedlanguage={
                                selectedlanguage?.value ? selectedlanguage?.value : "EN001"
                            }
                        />
                    </div>
                );
                return obj.conditionaldisplay
                    ? eval(obj.conditionaldisplay)
                        ? tempelement
                        : ""
                    : tempelement;
            case "FrmSelect":
                tempelement = (
                    <div className={`col-md-${obj.colspan}`}>
                        <FrmSelect
                            title={
                                obj.fieldTitleHtml ? (
                                    <span dangerouslySetInnerHTML={{ __html: obj.title }}></span>
                                ) : (
                                    obj.title
                                )
                            }
                            titlelinespace={
                                (obj.name === "ReferralReasonLevel2" ||
                                    obj.name === "ReferralReasonLevel3") &&
                                    selectedlanguage?.value &&
                                    selectedlanguage?.value !== "EN001"
                                    ? false
                                    : obj.titlelinespace
                                        ? true
                                        : false
                            }
                            name={obj.name}
                            value={formfield[obj.name]}
                            isReadMode={true}
                            selectopts={eval(obj.options)}
                            isAddButton={obj.isAddButton === true ? true : false}
                            isShowTextBox={
                                obj.name === "RequestForEmpowermentReason" &&
                                showTextBox
                            }
                            textValue={formfield.OtherReferralReason}
                            selectedlanguage={
                                selectedlanguage?.value ? selectedlanguage?.value : "EN001"
                            }
                        />
                    </div>
                );
                return obj.conditionaldisplay
                    ? eval(obj.conditionaldisplay)
                        ? tempelement
                        : ""
                    : tempelement;
            case "FrmMultiselect":
                return (
                    <div className={`col-md-${obj.colspan}`}>
                        <FrmMultiselect
                            title={
                                obj.fieldTitleHtml ? (
                                    <span dangerouslySetInnerHTML={{ __html: obj.title }}></span>
                                ) : (
                                    obj.title
                                )
                            }
                            titlelinespace={obj.titlelinespace ? true : false}
                            name={obj.name}
                            value={formfield[obj.name] ? formfield[obj.name] : []}
                            isReadMode={true}
                            selectopts={eval(obj.options)}
                            isAllOptNotRequired={true}
                            selectedlanguage={
                                selectedlanguage?.value ? selectedlanguage?.value : "EN001"
                            }
                        />
                    </div>
                );
            case "FrmRadio":
                return (
                    <>
                        <div className={`col-md-${obj.colspan}`}>
                            <FrmRadio
                                title={obj.title}
                                titlelinespace={obj.titlelinespace ? true : false}
                                name={obj.name}
                                value={
                                    formfield[obj.name]
                                        ? formfield[obj.name]
                                        : OrganizationalAlignment.global
                                }
                                isReadMode={true}
                                selectopts={eval(obj.options)}
                                isclickDisable={true}
                            />
                        </div>
                    </>
                );
            case "FrmRichTextEditor":
                tempelement = (
                    <>
                        <div className={`col-md-${obj.colspan}`}>
                            <FrmRichTextEditor
                                title={obj.title}
                                titlelinespace={obj.titlelinespace ? true : false}
                                name={obj.name}
                                value={formfield[obj.name]}
                                isReadMode={true}
                            />
                        </div>
                    </>
                );
                return obj.conditionaldisplay
                    ? eval(obj.conditionaldisplay)
                        ? tempelement
                        : ""
                    : tempelement;
            case "FrmDatePicker":
                tempelement = (
                    <div className={`col-md-${obj.colspan}`}>
                        <FrmDatePicker
                            title={obj.title}
                            name={obj.name}
                            titlelinespace={obj.titlelinespace ? true : false}
                            value={formfield[obj.name]}
                            type={"date"}
                            isReadMode={true}
                            minDate={obj.minDate ? eval(obj.minDate) : ""}
                            maxDate={obj.maxDate ? eval(obj.maxDate) : ""}
                            validationmsg={
                                AppLocale[
                                    selectedlanguage?.value ? selectedlanguage.value : "EN001"
                                ].messages["message.mandatory"]
                            }
                        />
                    </div>
                );
                return obj.conditionaldisplay
                    ? eval(obj.conditionaldisplay)
                        ? tempelement
                        : ""
                    : tempelement;
            default:
                break;
        }
    };

    let blockelelements = [];
    let domblockspancnt = 0;
    let clsrowname = "";

    return (
        <Popup {...props}>
            <div className="popup-box versionhistory" style={{ width: '1090px' }}>
                <div className="popup-header-container">
                    <div className="popup-header-title">Reference RfE:- {`${referenceRfEId}`}</div>
                    <div className="header-btn-container">
                        {showReferenceBtn &&
                            (
                                <div
                                    className="addedit-close btn-blue"
                                    style={{ marginRight: "10px" }}
                                    onClick={() => handleCopyValue()}
                                >
                                    Copy Details
                                    {/* {
                                        AppLocale[
                                            selectedlanguage?.value ? selectedlanguage.value : "EN001"
                                        ].messages["button.referenceLog"]
                                    } */}
                                </div>
                            )
                        }
                        <div className="popup-close" style={{marginTop: '5%'}} onClick={() => hidePopup()}>
                            X
                        </div>
                    </div>
                </div>
                <div className="popup-content">
                    <div className="versionhistory-container">
                        <div className="popup-formitems logs-form">
                            <form id="myForm">
                                <>
                                    <>
                                        {fieldDetails.map((item, index) => {
                                            let nextelement = fieldDetails[index + 1]
                                                ? fieldDetails[index + 1]
                                                : {};
                                            domblockspancnt += item.colspan;
                                            clsrowname = item.clsrowname ? item.clsrowname : clsrowname;
                                            if (
                                                domblockspancnt === 12 ||
                                                domblockspancnt + nextelement?.colspan > 12 ||
                                                (item.breakblock && !nextelement.breakblock) ||
                                                index === fieldDetails.length - 1 ||
                                                item.name === "ZurichShare"
                                            ) {
                                                blockelelements.push(item);
                                                const eleblock = getformsfieldsblock(
                                                    blockelelements,
                                                    clsrowname
                                                );
                                                blockelelements = [];
                                                domblockspancnt = 0;
                                                clsrowname = "";
                                                return eleblock;
                                            } else {
                                                blockelelements.push(item);
                                            }
                                        })}
                                    </>
                                    <div class="frm-field-bggray">
                                        <div className="row ">
                                            <div className="col-md-6">
                                                <FrmFileUpload
                                                    title={
                                                        AppLocale[
                                                            selectedlanguage?.value
                                                                ? selectedlanguage.value
                                                                : "EN001"
                                                        ].messages["label.uploadattachment"]
                                                    }
                                                    name={"FullFilePath"}
                                                    uploadedfiles={formfield?.RFEAttachmentList}
                                                    value={""}
                                                    type={""}
                                                    isRequired={false}
                                                    isReadMode={true}
                                                    isdisabled={true}
                                                    downloadfile={() => { console.log("you can't dowanload file") }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mb20 border-top pt10">
                                        <div className="col-md-3">
                                            <label>
                                                {
                                                    AppLocale[
                                                        selectedlanguage?.value
                                                            ? selectedlanguage.value
                                                            : "EN001"
                                                    ].messages["label.createdby"]
                                                }
                                            </label>
                                            <br></br>
                                            {formfield?.CreatorName}
                                        </div>
                                        <div className="col-md-3">
                                            <label>
                                                {
                                                    AppLocale[
                                                        selectedlanguage?.value
                                                            ? selectedlanguage.value
                                                            : "EN001"
                                                    ].messages["label.createddate"]
                                                }
                                            </label>
                                            <br></br>
                                            {formfield?.CreatedDate
                                                ? formatDate(formfield?.CreatedDate)
                                                : ""}
                                        </div>
                                        <div className="col-md-3">
                                            <label>
                                                {
                                                    AppLocale[
                                                        selectedlanguage?.value
                                                            ? selectedlanguage.value
                                                            : "EN001"
                                                    ].messages["label.modifiedby"]
                                                }
                                            </label>
                                            <br></br>
                                            {formfield?.LastModifiorName}
                                        </div>
                                        <div className="col-md-3">
                                            <label>
                                                {
                                                    AppLocale[
                                                        selectedlanguage?.value
                                                            ? selectedlanguage.value
                                                            : "EN001"
                                                    ].messages["label.modifieddate"]
                                                }
                                            </label>
                                            <br></br>
                                            {formfield?.ModifiedDate
                                                ? formatDate(formfield?.ModifiedDate)
                                                : ""}
                                        </div>
                                    </div>
                                </>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Popup>
    );
}

const mapStateToProp = (state) => {
    return {
        state: state,
    };
};
const mapActions = {
    getLogFields: commonActions.getLogFields,
};

export default connect(mapStateToProp, mapActions)(RfELinkedPopupDetails);
