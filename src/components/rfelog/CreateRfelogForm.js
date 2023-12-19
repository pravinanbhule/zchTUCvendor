import React, { useState, useEffect, useLayoutEffect } from "react";
import { useHistory, useLocation, useNavigate } from 'react-router-dom';
import { connect } from "react-redux";
import "./Style.css";
import {
    userActions,
    lookupActions,
    rfelogActions,
    lobActions,
    sublobActions,
    commonActions,
    countryActions,
    segmentActions,
    currencyActions,
    branchActions,
    userprofileActions,
} from "../../actions";
import AddEditForm from "./AddEditForm";
import { alertMessage, dynamicSort, getUrlParameter } from "../../helpers";
import { RFE_LOG_STATUS } from "../../constants";
import VersionHistoryPopupRfe from "../versionhistorypopup/VersionHistoryPopupRfe";
import { versionHistoryExcludeFields, versionHistoryexportDateFields, versionHistoryexportFieldTitles, versionHistoryexportHtmlFields } from "./Rfelogconstants";


function CreateRfelogForm(props) {
    const { rfelogState, regionState, countryState, lobState, dashboardState } =
        props.state;
    const {
        postItem,
        userProfile,
        getDataVersion,
        getById,
    } = props;

    const [isEditMode, setisEditMode] = useState(false);
    const [isReadMode, setisReadMode] = useState(false);
    const formInitialValue = {
        AccountName: "",
        OrganizationalAlignment: "",
        CountryId: "",
        CountryList: [],
        countryCode: "",
        RegionList: [],
        Underwriter: userProfile.emailAddress,
        UnderwriterName: userProfile.firstName + " " + userProfile.lastName,
        UnderwriterAD: {
            firstName: userProfile.firstName,
            lastName: userProfile.lastName,
            userName: userProfile.firstName + " " + userProfile.lastName,
            emailAddress: userProfile.emailAddress,
        },
        CHZ: "",
        LOBId: "",
        RequestForEmpowermentReason: "",
        RFELogDetails: "",
        UnderwriterGrantingEmpowerment: "",
        UnderwriterGrantingEmpowermentAD: [],
        UnderwriterGrantingEmpowermentName: "",
        RequestForEmpowermentCC: "",
        RequestForEmpowermentCCAD: [],
        RequestForEmpowermentCCName: "",
        RequestForEmpowermentStatus: "",
        RFEAttachmentList: [],
        ResponseDate: null,
        ReceptionInformationDate: null,
        UnderwriterGrantingEmpowermentComments: "",
        FullFilePath: "",
        IsSubmit: false,
        RFELogEmailLink: window.location.origin + '/rfelogs',
        isdirty: false,
        IsArchived: false,
        ConditionApplicableTo: "",
        DurationofApproval: "",
        Branch: "",
        CustomerSegment: "",
        NewRenewal: "",
        PolicyPeriod: "",
        Currency: "",
        Limit: "",
        GWP: "",
        ZurichShare: "",
        DecisionDate: null,
        IncountryFlag: "",
        SUBLOBID: "",
        mappedLOBs: "",
        PolicyTermId: "",
    };
    const [formIntialState, setformIntialState] = useState(formInitialValue);
    const [frmCountrySelectOpts, setfrmCountrySelectOpts] = useState([]);
    const [accountOpts, setaccountOpts] = useState({});
    const [queryparam, setqueryparam] = useState({
        id: "",
        status: "",
    });
    const [selectedview, setselectedview] = useState("gn");
    const rfelog_status = {
        Pending: RFE_LOG_STATUS.Pending,
        More_information_needed: RFE_LOG_STATUS.More_information_needed,
        Empowerment_granted: RFE_LOG_STATUS.Empowerment_granted,
        Empowerment_granted_with_conditions:
            RFE_LOG_STATUS.Empowerment_granted_with_conditions,
        Empowerment_not_granted: RFE_LOG_STATUS.Empowerment_not_granted,
        Withdrawn: RFE_LOG_STATUS.Withdrawn,
    };
    const [versionHistoryData, setversionHistoryData] = useState([]);
    const [isDraftVersionHistory, setisDraftVersionHistory] = useState(false);
    const [showVersionHistory, setshowVersionHistory] = useState(false);
    const [loading, setloading] = useState(true)
    const history = useHistory();
    const location = useLocation()

    useEffect(() => {
        const handleTabClose = event => {
            localStorage.removeItem("id");
            localStorage.removeItem("status");
            localStorage.removeItem("in-app");
        };

        window.addEventListener('beforeunload', handleTabClose);

        return () => {
            window.removeEventListener('beforeunload', handleTabClose);
        };
    }, []);

    useEffect(() => {
        let selectOpts = [];
        countryState.countryItems.forEach((item) => {
            selectOpts.push({
                label: item.countryName.trim(),
                value: item.countryID,
                regionId: item.regionID,
            });
        });

        selectOpts.sort(dynamicSort("label"));
        setfrmCountrySelectOpts([...selectOpts]);
    }, [countryState.countryItems]);

    useEffect(async () => {
        let itemid;
        let status;
        if (getUrlParameter("id")) {
            itemid = getUrlParameter("id");
            status = getUrlParameter("status");
            localStorage.setItem("id", itemid);
            localStorage.setItem("status", status)
            setqueryparam({ id: itemid, status: status });
            removeQueryParams()
        } else if (localStorage.getItem("id")) {
            itemid = localStorage.getItem("id");
            status = localStorage.getItem("status")
            setqueryparam({ id: itemid, status: status });
        } else {
            setloading(false)
        }
    }, []);


    const removeQueryParams = () => {
        history.replace({
            pathname: location.pathname,
            search: '',
        })
    };

    useEffect(() => {
        if (queryparam.id) {
            handleEdit(this, true);
        }
    }, [queryparam]);

    useEffect(() => {
        if (Array.isArray(rfelogState.accounts) && rfelogState.accounts.length) {
            let tempAccObj = {};
            rfelogState.accounts.forEach((iteam) => {
                // if (isNaN(iteam.charAt(0))) {
                if (tempAccObj[iteam.charAt(0).toLowerCase()]) {
                    tempAccObj[iteam.charAt(0).toLowerCase()].push(iteam);
                } else {
                    tempAccObj[iteam.charAt(0).toLowerCase()] = [];
                }
                //}
            });
            setaccountOpts({ ...tempAccObj });
        }
    }, [rfelogState.accounts]);

    const hideAddPopup = () => {
        setformIntialState(formInitialValue)
        localStorage.removeItem("id");
        localStorage.removeItem("status");
        localStorage.removeItem("in-app");
        history.push("/rfelogs");
    };

    const postItemHandler = async (item) => {
        let tempfullPathArr = item.RFEAttachmentList.map((item) => item.filePath);
        let fullFilePath = tempfullPathArr.join(",");
        item.FullFilePath = fullFilePath;
        if (
            item.RequestForEmpowermentStatus !==
            rfelog_status.Empowerment_granted_with_conditions
        ) {
            item.ConditionApplicableTo = "";
        }
        let response = await postItem({
            ...item,
            CreatedByID: userProfile.userId,
            ModifiedByID: userProfile.userId,
        });

        if (response) {
            if (item.IsSubmit) {
                alert(alertMessage.rfelog.add);
            } else {
                alert(alertMessage.rfelog.draft);
            }
            hideAddPopup();
        }
    };

    const handleDataVersion = async (itemid, isSubmit) => {
        let versiondata = await getDataVersion({
            TempId: itemid,
            LogType: "rfelogs",
            IncountryFlag: selectedview === "gn" ? "" : selectedview,
            UserRole:
                userProfile?.userRoles[userProfile?.userRoles?.length - 1].displayRole,
        });
        setversionHistoryData(versiondata ? versiondata : []);
        if (isSubmit) {
            setisDraftVersionHistory(false);
        } else {
            setisDraftVersionHistory(true);
        }
        setshowVersionHistory(true);
    };
    const hideVersionHistoryPopup = () => {
        setshowVersionHistory(false);
    };

    const putItemHandler = async (item) => {
        let tempfullPathArr = item.RFEAttachmentList.map((item) => item.filePath);
        let fullFilePath = tempfullPathArr.join(",");
        item.FullFilePath = fullFilePath;
        if (
            item.RequestForEmpowermentStatus !==
            rfelog_status.Empowerment_granted_with_conditions
        ) {
            item.ConditionApplicableTo = "";
        }
        let response = await postItem({
            ...item,
            ModifiedByID: userProfile.userId,
        });

        if (response) {
            alert(alertMessage.rfelog.update);
            hideAddPopup();
        }
        setisEditMode(false);
    };

    const setInEditMode = () => {
        setisEditMode(true);
        setisReadMode(false);
    };


    const handleEdit = async (e, hasqueryparam) => {
        let itemid = queryparam.id;
        let mode = queryparam.status !== "undefined" ? queryparam.status : "view";

        let response = await getById({
            rfeLogId: itemid,
        });
        if (response.FieldValues) {
            response = response.FieldValues;
            response.UnderwriterName = response.UnderwriterAD
                ? response.UnderwriterAD.userName
                : "";

            if (
                response.RequestForEmpowermentCCAD &&
                response.RequestForEmpowermentCCAD.length
            ) {
                let users = "";
                users = response.RequestForEmpowermentCCAD.map((item) => item.userName);
                response.RequestForEmpowermentCCName = users.join(",");
            }
            if (
                response.UnderwriterGrantingEmpowermentAD &&
                response.UnderwriterGrantingEmpowermentAD.length
            ) {
                let users = "";
                users = response.UnderwriterGrantingEmpowermentAD.map(
                    (item) => item.userName
                );
                response.UnderwriterGrantingEmpowermentName = users.join(",");
            }
            let countryList = response.CountryList;
            countryList = countryList.map((country) => ({
                label: country.countryName,
                value: country.countryID,
                regionId: country.regionID,
            }));
            response["CountryList"] = [...countryList];
            if (mode === "edit" && response.IsSubmit) {
                setisEditMode(true);
            }
            if (mode === "view") {
                setisReadMode(true);
            }
            setformIntialState({
                ...response,
                isdirty: false,
            });
            setloading(false)
        }
    };

    return (
        <>
            {loading ?
                "Loading" :
                <AddEditForm
                    title={isReadMode ? "View RfE Log" : "Add/Edit RfE Log"}
                    hideAddPopup={hideAddPopup}
                    postItem={postItemHandler}
                    putItem={putItemHandler}
                    isEditMode={isEditMode}
                    isReadMode={isReadMode}
                    formIntialState={formIntialState}
                    frmCountrySelectOpts={frmCountrySelectOpts}
                    accountOpts={accountOpts}
                    userProfile={userProfile}
                    setInEditMode={setInEditMode}
                    queryparam={queryparam}
                    handleDataVersion={handleDataVersion}
                ></AddEditForm>
            }
            {showVersionHistory ? (
                <VersionHistoryPopupRfe
                    versionHistoryData={versionHistoryData}
                    hidePopup={hideVersionHistoryPopup}
                    exportFieldTitles={versionHistoryexportFieldTitles}
                    exportDateFields={versionHistoryexportDateFields}
                    exportHtmlFields={versionHistoryexportHtmlFields}
                    versionHistoryExcludeFields={versionHistoryExcludeFields}
                    isDraft={isDraftVersionHistory ? true : false}
                />
            ) : (
                ""
            )}
        </>
    )
}
const mapStateToProp = (state) => {
    return {
        state: state,
    };
};
const mapActions = {
    getAllUsers: userActions.getAllUsers,
    getLookupByType: lookupActions.getLookupByType,
    getallLocalLinks: rfelogActions.getallLocalLinks,
    getToolTip: commonActions.getToolTip,
    getAlllob: lobActions.getAlllob,
    getAllCountry: countryActions.getAllCountry,
    getAllSublob: sublobActions.getAllSublob,
    uploadFile: commonActions.uploadFile,
    deleteFile: commonActions.deleteFile,
    downloadFile: commonActions.downloadFile,
    getLogFields: commonActions.getLogFields,
    getAllUsers: userActions.getAllUsers,
    getAllSegment: segmentActions.getAllSegment,
    getAllCurrency: currencyActions.getAllCurrency,
    getAllBranch: branchActions.getAllBranch,
    getMultiUserProfile: userprofileActions.getMultiUserProfile,
    getAllPolicyAccounts: rfelogActions.getAllPolicyAccounts,
    getPolicyTermId: rfelogActions.getPolicyTermId,
    postItem: rfelogActions.postItem,
    getById: rfelogActions.getById,
    getDataVersion: commonActions.getDataVersion,
};
export default connect(mapStateToProp, mapActions)(CreateRfelogForm);
