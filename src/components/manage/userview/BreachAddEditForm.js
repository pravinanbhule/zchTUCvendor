import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import FrmInput from "../../common-components/frminput/FrmInput";
import FrmToggleSwitch from "../../common-components/frmtoggelswitch/FrmToggleSwitch";
import FrmCheckbox from "../../common-components/frmcheckbox/FrmCheckbox";
import FrmMultiselect from "../../common-components/frmmultiselect/FrmMultiselect";
import FrmSelect from "../../common-components/frmselect/FrmSelect";
import FrmInputSearch from "../../common-components/frmpeoplepicker/FrmInputSearch";
import FrmDatePicker from "../../common-components/frmdatepicker/FrmDatePicker";
import FrmInputAutocomplete from "../../common-components/frminputautocomplete/FrmInputAutocomplete";
import Loading from "../../common-components/Loading";
import moment from "moment";
import { breachlogActions, commonActions, countryActions, dashboardActions, lobActions, lookupActions, officeActions, regionActions, segmentActions, sublobActions, userActions, userViewActions, znaorgnization1Actions, znaorgnization2Actions, znaorgnization3Actions } from "../../../actions";
import { alertMessage, dynamicSort, isEmptyObjectKeys, isNotEmptyValue } from "../../../helpers";
import { REGION_EMEA, REGION_ZNA } from "../../../constants";

function BreachAddEditForm(props) {

    const {
        breachlogState,
        countryState,
        regionState,
        segmentState,
        lobState,
        sublobState,
        dashboardState,
        officeState,
        znaorgnization1State,
        znaorgnization2State,
        znaorgnization3State,
    } = props.state;

    const {
        hideAddPopup,
        isReadMode,
        getAllCountry,
        getAllRegion,
        getAlllob,
        getAllSublob,
        getAllSegment,
        getLookupByType,
        clearDashboardClick,
        getAllOffice,
        getallZNASegments,
        getallZNASBU,
        getallZNAMarketBasket,
        getLogUsers,
        getActionResponsible,
        getAllEntryNumbers,
        getAll,
        formIntialState,
        isEditMode,
        postItem,
        handleEdit,
        userProfile
    } = props;

    const [formfield, setformfield] = useState({
        viewName: "",
        entryNumber: "",
        title: "",
        classification: [],
        group: "",
        customerSegment: [],
        natureofbreach: [],
        loB: [],
        actionResponsible: "",
        entries: "",
        region: [],
        country: [],
        status: [],
        breachStatus: "",
        subLoB: [],
        typeofBreach: [],
        materialBreach: "",
        nearMisses: "",
        howdetected: [],
        rootCauseOfTheBreach: [],
        rangeOfFinancialimpact: [],
        creator: "",
        dateBreachOccurredFrom: "",
        dateBreachOccurredTo: "",
        dateActionClosedFrom: "",
        dateActionClosedTo: "",
        createdDateFrom: "",
        createdDateTo: "",
        dueDateFrom: "",
        dueDateTo: "",
        UWRInvolvedName: "",
        policyName: "",
        policyNumber: "",
        turNumber: "",
        office: "",
        IdentifiedToDate: "",
        IdentifiedFromDate: "",
        znaSegmentId: "",
        znasbuId: "",
        marketBasketId: "",
        isPrivate: false
    })
    const [logTypes, setlogTypes] = useState([{ label: "All", value: "all" }]);
    const [sellogTabType, setsellogTabType] = useState("all");
    const [issubmitted, setissubmitted] = useState(false);
    const selectInitiVal = {
        label: "Select",
        value: "",
    };
    const [commonfilterOpts, setcommonfilterOpts] = useState({
        classificationFilterOpts: [],
        groupFilterOpts: [],
        entriesFilterOpts: [
            {
                label: "My Entries",
                value: "My Entries",
            },
            {
                label: "All Entries",
                value: "All Entries",
            },
        ],
        customerSegmentFilterOpts: [],
        natureOfBreachFilterOpts: [],
        lobFilterOpts: [],
        sublobFilterOpts: [],
        actionResponsibleFilterOpts: [],
        statusFilterOpts: [],
        entryNumberOpts: [],
        typeOfBreachOpts: [],
        rootCauseBreachOpts: [],
        rangeOfFinancialImpactOpts: [],
        howDetectedOpts: [],
        creatorFilterOpts: [],
        uwrInvolvedOpts: [],
        officeOpts: [],
        ZNASegmentOpts: [],
        ZNASBUOpts: [],
        ZNAMarketBasketOpts: [],
    });
    const [switchOpts, setSwitchOpts] = useState([
        {
            label: "Public",
            value: false,
        },
        {
            label: "Private",
            value: true,
        },
    ]);
    const [accessBreachLogOpts, setaccessBreachLogOpts] = useState([
        {
            label: "",
            value: true,
        },
    ]);
    const [userRoles, setUserRoles] = useState([])

    const [selectedUserRoles, setSelectedUserRoles] = useState([])

    const [yesnoopts, setyesnoopts] = useState([
        selectInitiVal,
        {
            label: "Yes",
            value: "1",
        },
        {
            label: "No",
            value: "0",
        },
    ]);

    const [regionFilterOpts, setregionFilterOpts] = useState([]);
    const [regionOptsAll, setregionOptsAll] = useState([]);
    useEffect(() => {
        let selectOpts = [];
        regionState.regionItems.forEach((item) => {
            selectOpts.push({
                ...item,
                label: item.regionName.trim(),
                value: item.regionID,
            });
        });
        selectOpts.sort(dynamicSort("label"));
        setregionFilterOpts([...selectOpts]);
        setregionOptsAll([...selectOpts]);
    }, [regionState.regionItems, formfield.region]);

    const [countryFilterOpts, setcountryFilterOpts] = useState([]);
    const [countrymapping, setcountrymapping] = useState([]);
    const [loading, setLoading] = useState(false)

    const handleSelectedItemArray = (selectedArray, data, field, label) => {
        let arrayData = [];
        selectedArray.map((id, j) => {
            data.map((item, i) => {
                if (item.isActive && id === item[field]) {
                    arrayData.push({
                        ...item,
                        label: item[label],
                        value: item[field],
                    })
                }
            })
        })
        return arrayData
    }


    useEffect(async () => {
        if (isEditMode || isReadMode) {
            setLoading(true)
            let response = formIntialState
            if (regionState.regionItems && typeof response.region === 'string') {
                let selectedRegionArray = response.region.split(',')
                let regionArray = []
                selectedRegionArray.map((id, j) => {
                    regionState.regionItems.map((item, i) => {
                        if (id === item.regionID) {
                            regionArray.push({
                                label: item.regionName.trim(),
                                value: item.regionID,
                            })
                        }
                    })
                })
                response.region = typeof response.region === 'string' && regionArray.length === 0 ? response.region : regionArray
            }

            if (response?.subLoB?.length && response?.subLoB?.length !== 0 && typeof response.subLoB === 'string') {
                let selectedSubLoBArray = response.subLoB.split(',')
                let subLoBArray = []
                let data = await getAllSublob({ isActive: true });
                selectedSubLoBArray.map((id, j) => {
                    data.map((item, i) => {
                        if (id === item.subLOBID) {
                            subLoBArray.push({
                                label: item.subLOBName,
                                value: item.subLOBID,
                                lob: item.lobid,
                            })
                        }
                    })
                })
                response.subLoB = typeof response.subLoB === 'string' && subLoBArray.length === 0 ? response.subLoB : subLoBArray
            } else if (response.subLoB === null || response.subLoB === undefined) {
                response.subLoB = []
            }

            if (response?.customerSegment?.length && response?.customerSegment?.length !== 0 && typeof response.customerSegment === 'string') {
                let selectedSubLoBArray = response.customerSegment.split(',')
                let customerArray = [];
                let data = await getAllSegment({ isActive: true });
                selectedSubLoBArray.map((id, j) => {
                    data.map((item, i) => {
                        if (id === item.segmentID) {
                            customerArray.push({
                                label: item.segmentName,
                                value: item.segmentID,
                                country: item.countryList,
                            })
                        }
                    })
                })
                response.customerSegment = typeof response.customerSegment === 'string' && customerArray.length === 0 ? response.customerSegment : customerArray
            } else if (response.customerSegment === null || response.customerSegment === undefined) {
                response.customerSegment = []
            }

            let loBArray = []
            if (response?.loB?.length && response?.loB?.length !== 0 && typeof response?.loB === 'string') {
                let selectedloBArray = response?.loB?.split(',')
                if (selectedloBArray) {
                    let loBData = await getAlllob({ isActive: true });
                    loBArray = handleSelectedItemArray(selectedloBArray, loBData, 'lobid', 'lobName')
                }
                response.loB = loBArray;
            } else if (response.loB === null || response.loB === undefined) {
                response.loB = []
            }

            let classificationArray = []
            if (response?.classification?.length && response?.classification?.length !== 0 && typeof response?.classification === 'string') {
                let selectedValueArray = response?.classification?.split(',')
                if (selectedValueArray) {
                    let data = await getLookupByType({ LookupType: "BreachClassification" });
                    classificationArray = handleSelectedItemArray(selectedValueArray, data, 'lookupID', 'lookUpValue')
                }
                response.classification = typeof response?.classification === 'string' && classificationArray.length === 0 ? response?.classification : classificationArray;
            } else if (response.classification === null || response.classification === undefined) {
                response.classification = []
            }

            let tempNatureOfBreach = []
            if (response?.natureofbreach?.length && response?.natureofbreach?.length !== 0 && typeof response?.natureofbreach === 'string') {
                let selectedValueArray = response?.natureofbreach?.split(',')
                if (selectedValueArray) {
                    let data = await getLookupByType({ LookupType: "BreachNature" });
                    tempNatureOfBreach = handleSelectedItemArray(selectedValueArray, data, 'lookupID', 'lookUpValue')
                }
                response.natureofbreach = typeof response?.natureofbreach === 'string' && tempNatureOfBreach.length === 0 ? response?.natureofbreach : tempNatureOfBreach;
            } else if (response.natureofbreach === null || response.natureofbreach === undefined) {
                response.natureofbreach = []
            }

            let tempStatus = []
            if (response?.status?.length && response?.status?.length !== 0 && typeof response?.status === 'string') {
                let selectedValueArray = response?.status?.split(',')
                if (selectedValueArray) {
                    let data = await getLookupByType({ LookupType: "BreachStatus" });
                    tempStatus = handleSelectedItemArray(selectedValueArray, data, 'lookupID', 'lookUpValue')
                }
                response.status = typeof response?.status === 'string' && tempStatus.length === 0 ? response?.status : tempStatus;
            } else if (response.status === null || response.status === undefined) {
                response.status = []
            }

            let tempTypeOfBreach = []
            if (response?.typeofBreach?.length && response?.typeofBreach?.length !== 0 && typeof response?.typeofBreach === 'string') {
                let selectedValueArray = response?.typeofBreach?.split(',')
                if (selectedValueArray) {
                    let data = await getLookupByType({ LookupType: "BreachType" });
                    tempTypeOfBreach = handleSelectedItemArray(selectedValueArray, data, 'lookupID', 'lookUpValue')
                }
                response.typeofBreach = typeof response?.typeofBreach === 'string' && tempTypeOfBreach.length === 0 ? response?.typeofBreach : tempTypeOfBreach;
            } else if (response.typeofBreach === null || response.typeofBreach === undefined) {
                response.typeofBreach = []
            }

            let tempRootCauseBreach = []
            if (response?.rootCauseOfTheBreach?.length && response?.rootCauseOfTheBreach?.length !== 0 && typeof response?.rootCauseOfTheBreach === 'string') {
                let selectedValueArray = response?.rootCauseOfTheBreach?.split(',')
                if (selectedValueArray) {
                    let data = await getLookupByType({ LookupType: "BreachRootCause" });
                    tempRootCauseBreach = handleSelectedItemArray(selectedValueArray, data, 'lookupID', 'lookUpValue')
                }
                response.rootCauseOfTheBreach = typeof response?.rootCauseOfTheBreach === 'string' && tempRootCauseBreach.length === 0 ? response?.rootCauseOfTheBreach : tempRootCauseBreach;
            } else if (response.rootCauseOfTheBreach === null || response.rootCauseOfTheBreach === undefined) {
                response.rootCauseOfTheBreach = []
            }

            let tempRangeFinImpact = []
            if (response?.rangeOfFinancialimpact?.length && response?.rangeOfFinancialimpact?.length !== 0 && typeof response?.rangeOfFinancialimpact === 'string') {
                let selectedValueArray = response?.rangeOfFinancialimpact?.split(',')
                if (selectedValueArray) {
                    let data = await getLookupByType({ LookupType: "BreachFinancialRange" });
                    tempRangeFinImpact = handleSelectedItemArray(selectedValueArray, data, 'lookupID', 'lookUpValue')
                }
                response.rangeOfFinancialimpact = typeof response?.rangeOfFinancialimpact === 'string' && tempRangeFinImpact.length === 0 ? response?.rangeOfFinancialimpact : tempRangeFinImpact;
            } else if (response.rangeOfFinancialimpact === null || response.rangeOfFinancialimpact === undefined) {
                response.rangeOfFinancialimpact = []
            }

            let tempHowDetected = []
            if (response?.howdetected?.length && response?.howdetected?.length !== 0 && typeof response?.howdetected === 'string') {
                let selectedValueArray = response?.howdetected?.split(',')
                if (selectedValueArray) {
                    let data = await getLookupByType({ LookupType: "BreachDetection" });
                    tempHowDetected = handleSelectedItemArray(selectedValueArray, data, 'lookupID', 'lookUpValue')
                }
                response.howdetected = typeof response?.howdetected === 'string' && tempHowDetected.length === 0 ? response?.howdetected : tempHowDetected;
            } else if (response.howdetected === null || response.howdetected === undefined) {
                response.howdetected = []
            }

            response.isSuperAdmin = response?.userRoles?.split(',').includes('1')
            response.isGlobalAdmin = response?.userRoles?.split(',').includes('2')
            response.isRegionAdmin = response?.userRoles?.split(',').includes('3')
            response.isCountryAdmin = response?.userRoles?.split(',').includes('4')
            response.isNormalUser = response?.userRoles?.split(',').includes('8')
            response.isCountrySuperAdmin = response?.userRoles?.split(',').includes('9')
            if (typeof response.materialBreach === 'boolean') {
                response.materialBreach = response.materialBreach === true ? '1' : response.materialBreach === false ? '0' : response.materialBreach
            }
            // response.switch = response.isPrivate === true ? false : true
            // delete response.isPrivate
            if (response.isPrivate === true) {
                setShowUserRoles(false)
            } else {
                let Roles = response?.userRoles?.split(",")
                if (Roles?.length > 0) {
                    setSelectedUserRoles(Roles)
                }
            }
            setTimeout(async () => {
                if (typeof response.country === 'string') {
                    let selectedCountryArray = response.country.split(',')
                    let countryArray = []
                    selectedCountryArray.map((id, j) => {
                        countryState.countryItems.map((item, i) => {
                            if (id === item.countryID) {
                                countryArray.push({
                                    label: item.countryName.trim(),
                                    value: item.countryID,
                                })
                            }
                        })
                    })
                    response.country = countryArray
                }
                setLoading(false)
                setformfield(response)
            }, 5000);
        }
    }, [regionState.regionItems])




    useEffect(() => {
        const getEntryNumbers = async () => {
            if (!sellogTabType) {
                return;
            }
            let entityNumberArr = [];
            let reqparam = { LogType: "breachlogs", isSubmit: true };
            let tempEntries = await getAllEntryNumbers(reqparam);
            if (tempEntries.length) {
                tempEntries.forEach((item) => {
                    entityNumberArr.push(item.entryNumber);
                });
                entityNumberArr.sort();
                setcommonfilterOpts((prevstate) => ({
                    ...prevstate,
                    entryNumberOpts: [...entityNumberArr],
                }));
            }
        };
        getEntryNumbers();
    }, [sellogTabType]);

    // lob
    const [lobFilterOpts, setlobFilterOpts] = useState([]);
    useEffect(() => {
        let tempItems = lobState.lobItems.map((item) => ({
            label: item.lobName,
            value: item.lobid,
        }));
        tempItems.sort(dynamicSort("label"));
        setlobFilterOpts([...tempItems]);
    }, [lobState.lobItems]);


    // sub lob
    const [frmsublobopts, setfrmsublobopts] = useState([]);
    useEffect(() => {
        let tempItems = sublobState.sublobitems.map((item) => ({
            label: item.subLOBName,
            value: item.subLOBID,
            lob: item.lobid,
        }));
        tempItems.sort(dynamicSort("label"));
        setfrmsublobopts([...tempItems]);
        setcommonfilterOpts((prevstate) => ({
            ...prevstate,
            sublobFilterOpts: [...tempItems],
        }));
    }, [sublobState.sublobitems]);

    // Customer Segment
    const [segmentFilterOpts, setsegmentFilterOpts] = useState([]);
    useEffect(() => {
        let tempItems = segmentState.segmentItems.map((item) => ({
            label: item.segmentName,
            value: item.segmentID,
            country: item.countryList,
        }));
        tempItems.sort(dynamicSort("label"));
        setsegmentFilterOpts([...tempItems]);
    }, [segmentState.segmentItems]);

    // Office
    useEffect(() => {
        let tempopts = [];
        officeState.officeItems.forEach((item) => {
            if (item.isActive) {
                tempopts.push({
                    ...item,
                    label: item.officeName,
                    value: item.officeId,
                });
            }
        });
        tempopts.sort(dynamicSort("label"));
        setcommonfilterOpts((prevstate) => ({
            ...prevstate,
            officeOpts: [selectInitiVal, ...tempopts],
        }));
    }, [officeState.officeItems]);

    // ZNA 1 Segment
    useEffect(() => {
        let tempopts = [];
        znaorgnization1State.org1Items.forEach((item) => {
            if (item.isActive) {
                tempopts.push({
                    label: item.znaSegmentName,
                    value: item.znaSegmentId,
                });
            }
        });
        tempopts.sort(dynamicSort("label"));
        setcommonfilterOpts((prevstate) => ({
            ...prevstate,
            ZNASegmentOpts: [selectInitiVal, ...tempopts],
        }));
    }, [znaorgnization1State.org1Items]);

    // ZNA 2 Segment
    const [org2FilterOptsAllOpts, setorg2FilterOptsAllOpts] = useState([]);
    useEffect(() => {
        let tempopts = [];
        znaorgnization2State.org2Items.forEach((item) => {
            if (item.isActive) {
                tempopts.push({
                    label: item.sbuName,
                    value: item.znasbuId,
                    znaSegmentId: item.znaSegmentId,
                });
            }
        });
        tempopts.sort(dynamicSort("label"));
        setorg2FilterOptsAllOpts([...tempopts]);
        setcommonfilterOpts((prevstate) => ({
            ...prevstate,
            ZNASBUOpts: [selectInitiVal, ...tempopts],
        }));
    }, [znaorgnization2State.org2Items]);

    // ZNA 3 Segment
    const [org3FilterOptsAllOpts, setorg3FilterOptsAllOpts] = useState([]);
    useEffect(() => {
        let tempopts = [];
        znaorgnization3State.org3Items.forEach((item) => {
            if (item.isActive) {
                tempopts.push({
                    label: item.marketBasketName,
                    value: item.marketBasketId,
                    znasbuId: item.znasbuId,
                });
            }
        });
        tempopts.sort(dynamicSort("label"));
        setorg3FilterOptsAllOpts([...tempopts]);
        setcommonfilterOpts((prevstate) => ({
            ...prevstate,
            ZNAMarketBasketOpts: [selectInitiVal, ...tempopts],
        }));
    }, [znaorgnization3State.org3Items]);

    useEffect(() => {
        if (formfield.znaSegmentId !== "") {
            let tempFilterOpts = org2FilterOptsAllOpts.filter(
                (item) => item.znaSegmentId === formfield.znaSegmentId
            );
            setcommonfilterOpts((prevstate) => ({
                ...prevstate,
                ZNASBUOpts: [
                    selectInitiVal,
                    ...tempFilterOpts.sort(dynamicSort("label")),
                ],
            }));
        } else {
            setcommonfilterOpts((prevstate) => ({
                ...prevstate,
                ZNASBUOpts: [selectInitiVal, ...org2FilterOptsAllOpts],
            }));
        }
        setformfield({
            ...formfield,
            marketBasketId: "",
            znasbuId: "",
        });
    }, [formfield.znaSegmentId]);

    useEffect(() => {
        if (formfield.znasbuId !== "") {
            let tempFilterOpts = org3FilterOptsAllOpts.filter(
                (item) => item.znasbuId === formfield.znasbuId
            );
            setcommonfilterOpts((prevstate) => ({
                ...prevstate,
                ZNAMarketBasketOpts: [
                    selectInitiVal,
                    ...tempFilterOpts.sort(dynamicSort("label")),
                ],
            }));
        } else {
            setcommonfilterOpts((prevstate) => ({
                ...prevstate,
                ZNAMarketBasketOpts: [selectInitiVal, ...org3FilterOptsAllOpts],
            }));
        }
        setformfield({
            ...formfield,
            marketBasketId: "",
        });
    }, [formfield.znasbuId]);

    useEffect(() => {
        let selectOpts = [];
        let tempCountryMapping = [];
        let tempRegionListObj = {};

        countryState.countryItems.forEach((item) => {
            selectOpts.push({
                ...item,
                label: item.countryName.trim(),
                value: item.countryID,
                regionId: item.regionID,
            });

            if (!tempRegionListObj[item.regionID]) {
                tempCountryMapping.push({
                    region: item.regionID,
                    country: [
                        {
                            label: item.countryName,
                            value: item.countryID,
                        },
                    ],
                });
            } else {
                tempCountryMapping.forEach((countryitem) => {
                    if (countryitem.region === item.regionID) {
                        countryitem.country.push({
                            label: item.countryName,
                            value: item.countryID,
                        });
                    }
                });
            }
            tempRegionListObj[item.regionID] = item.countryName;
        });
        selectOpts.sort(dynamicSort("label"));
        setcountrymapping([...tempCountryMapping]);
        setcountryFilterOpts([...selectOpts]);
    }, [countryState.countryItems]);


    const [statusopts, seStatusopts] = useState([
        {
            label: "Closed",
            value: "closed"
        },
        {
            label: "Pending",
            value: "pending"
        },
        {
            label: "Reopen",
            value: "reopen"
        }
    ])

    useEffect(() => {
        fnOnInit();
    }, []);

    const fnOnInit = async () => {
        getAllCountry();
        getAllRegion();
        getAllSegment({ isActive: true });
        getAlllob({ isActive: true });
        getAllSublob({ isActive: true });
        getAllOffice({ isActive: true });
        getallZNASegments();
        getallZNASBU();
        getallZNAMarketBasket();
        loadCreatorUsers();
        loadActionResponsibleUser();
        loadUWRInvolvedUser();
        const lookupvalues = await Promise.all([
            getLookupByType({ LookupType: "BreachClassification" }),
            getLookupByType({ LookupType: "BreachNature" }),
            getLookupByType({ LookupType: "BreachStatus" }),
            getLookupByType({ LookupType: "BreachType" }),
            getLookupByType({ LookupType: "BreachRootCause" }),
            getLookupByType({ LookupType: "BreachFinancialRange" }),
            getLookupByType({ LookupType: "BreachDetection" }),
        ]);
        let tempClassification = lookupvalues[0];
        let tempNatureOfBreach = lookupvalues[1];
        let tempStatus = lookupvalues[2];
        let tempTypeOfBreach = lookupvalues[3];
        let tempRootCauseBreach = lookupvalues[4];
        let tempRangeFinImpact = lookupvalues[5];
        let tempHowDetected = lookupvalues[6];

        tempClassification = tempClassification.map((item) => ({
            label: item.lookUpValue,
            value: item.lookupID,
        }));
        tempNatureOfBreach = tempNatureOfBreach.map((item) => ({
            label: item.lookUpValue,
            value: item.lookupID,
        }));
        tempStatus = tempStatus.map((item) => ({
            label: item.lookUpValue,
            value: item.lookupID,
        }));
        tempTypeOfBreach = tempTypeOfBreach.map((item) => ({
            label: item.lookUpValue,
            value: item.lookupID,
        }));
        tempRootCauseBreach = tempRootCauseBreach.map((item) => ({
            label: item.lookUpValue,
            value: item.lookupID,
        }));
        tempRangeFinImpact = tempRangeFinImpact.map((item) => ({
            label: item.lookUpValue,
            value: item.lookupID,
        }));
        tempHowDetected = tempHowDetected.map((item) => ({
            label: item.lookUpValue,
            value: item.lookupID,
        }));

        //tempClassification.sort(dynamicSort("label"));
        tempNatureOfBreach.sort(dynamicSort("label"));
        tempStatus.sort(dynamicSort("label"));
        tempTypeOfBreach.sort(dynamicSort("label"));
        tempRootCauseBreach.sort(dynamicSort("label"));
        tempRangeFinImpact.sort(dynamicSort("label"));
        tempHowDetected.sort(dynamicSort("label"));
        setcommonfilterOpts((prevstate) => ({
            ...prevstate,
            classificationFilterOpts: [...tempClassification],
            natureOfBreachFilterOpts: [...tempNatureOfBreach],
            statusFilterOpts: [...tempStatus],
            typeOfBreachOpts: [...tempTypeOfBreach],
            rootCauseBreachOpts: [...tempRootCauseBreach],
            rangeOfFinancialImpactOpts: [...tempRangeFinImpact],
            howDetectedOpts: [...tempHowDetected],
        }));
        if (userProfile.isCountrySuperAdmin) {
            setUserRoles([
                {
                    label: "Country Super Admin",
                    name: "isCountrySuperAdmin",
                    filedValue: '9'
                },
                {
                    label: "Country Admin",
                    name: "isCountryAdmin",
                    filedValue: '4'
                },
                {
                    label: "Normal User",
                    name: "isNormalUser",
                    filedValue: '8'
                },
            ])
        } else {
            setUserRoles([
                {
                    label: "Super Admin",
                    name: "isSuperAdmin",
                    filedValue: '1'
                },
                {
                    label: "Global Admin",
                    name: "isGlobalAdmin",
                    filedValue: '2'
                },
                {
                    label: "Region Admin",
                    name: "isRegionAdmin",
                    filedValue: '3'
                },
                {
                    label: "Country Super Admin",
                    name: "isCountrySuperAdmin",
                    filedValue: '9'
                },
                {
                    label: "Country Admin",
                    name: "isCountryAdmin",
                    filedValue: '4'
                },
                {
                    label: "Normal User",
                    name: "isNormalUser",
                    filedValue: '8'
                },
            ])
        }
        if (dashboardState.status) {
            setformfield((prevfilter) => ({
                ...prevfilter,
                breachStatus: dashboardState.status,
            }));
            clearDashboardClick();
        }
    };

    const loadCreatorUsers = async () => {
        let tempCreator = await getLogUsers({
            LogType: "breachlogs",
            FieldName: "CreatedBy",
        });
        tempCreator = tempCreator?.map((item) => ({
            label: item.userName,
            value: item.emailAddress,
        }));
        tempCreator.sort(dynamicSort("label"));
        tempCreator = tempCreator.map((item) => item.label);
        setcommonfilterOpts((prevstate) => ({
            ...prevstate,
            creatorFilterOpts: [...tempCreator],
        }));
    };

    const loadActionResponsibleUser = async () => {
        let tempActionResponsible = await getActionResponsible();
        tempActionResponsible = tempActionResponsible.map((item) => ({
            label: item.userName,
            value: item.emailAddress,
        }));
        tempActionResponsible.sort(dynamicSort("label"));
        //added below line to change filter type to input search
        tempActionResponsible = tempActionResponsible.map((item) => item.label);
        setcommonfilterOpts((prevstate) => ({
            ...prevstate,
            actionResponsibleFilterOpts: [...tempActionResponsible],
        }));
    };

    const loadUWRInvolvedUser = async () => {
        let tempuwrInvolved = await getLogUsers({
            LogType: "breachlogs",
            FieldName: "UWRInvolved",
        });
        tempuwrInvolved = tempuwrInvolved?.map((item) => ({
            label: item.userName,
            value: item.emailAddress,
        }));
        tempuwrInvolved.sort(dynamicSort("label"));
        tempuwrInvolved = tempuwrInvolved.map((item) => item.label);
        setcommonfilterOpts((prevstate) => ({
            ...prevstate,
            uwrInvolvedOpts: [...tempuwrInvolved],
        }));
    };

    const hidePopup = () => {
        hideAddPopup();
    };

    const handleChange = (e) => {
        let { name, value } = e.target;
        if (e.target.type === "checkbox") {
            value = e.target.checked;
            let selectedValue = selectedUserRoles
            userRoles.map((item, i) => {
                if (value === true && item.name === name) {
                    selectedValue.push(item.filedValue)
                }
                if (value === false && item.name === name) {
                    selectedValue = selectedUserRoles.filter((num, j) => {
                        return num !== item.filedValue
                    })
                }
            })
            if (issubmitted && showError === false && selectedValue.length === 0) {
                setShowError(true)
            } else if (issubmitted && showError && selectedValue.length > 0) {
                setShowError(false)
            }
            setSelectedUserRoles(selectedValue)
        }
        setformfield({ ...formfield, [name]: value });
    }

    const [showUserRoles, setShowUserRoles] = useState(true)

    const handleSelectChange = (name, value) => {
        if (name === "isPrivate" && value === true) {
            setSelectedUserRoles([])
            setformfield({
                ...formfield,
                [name]: value,
                isSuperAdmin: false,
                isGlobalAdmin: false,
                isRegionAdmin: false,
                isCountryAdmin: false,
                isNormalUser: false,
                isCountrySuperAdmin: false,
            })
            setShowUserRoles(false)
        } else {
            setformfield({
                ...formfield,
                [name]: value,
            });
            setShowUserRoles(true)
        }
    };

    const handleMultiSelectChange = (name, value) => {
        if (name === "region") {
            let countryopts = formfield.country ? [...formfield.country] : [];
            let regionopts = value;
            let removeValFromIndex = [];
            countryopts.forEach((countryitem, index) => {
                let isExist = false;
                regionopts.forEach((item) => {
                    if (item.value === countryitem.regionId) {
                        isExist = true;
                    }
                });
                if (!isExist) {
                    removeValFromIndex.push(index);
                }
            });
            removeValFromIndex.forEach((item) => {
                countryopts.splice(item, 1);
            });
            setformfield({
                ...formfield,
                [name]: value,
                country: countryopts,
            });
        } else if (name === "country") {
            let country = value;
            let regionOpts = [];
            let selectedRegionopts = [];
            country.forEach((countryitem) => {
                regionOptsAll.forEach((item) => {
                    if (
                        item.value === countryitem.regionId &&
                        !selectedRegionopts.includes(item.value)
                    ) {
                        selectedRegionopts.push(item.value);
                        regionOpts.push(item);
                    }
                });
            });
            //setregionFilterOpts([...regionOpts]);
            setformfield({
                ...formfield,
                [name]: value,
                region: regionOpts,
            });
        } else {
            setformfield({
                ...formfield,
                [name]: value,
            });
        }
    };

    useEffect(() => {
        if (formfield.region !== REGION_ZNA) {
            setformfield((prevstate) => ({
                ...prevstate,
                UWRInvolvedName: "",
                policyName: "",
                policyNumber: "",
                turNumber: "",
                office: "",
                dateIdentifiedTo: "",
                dateIdentifiedFrom: "",
                znaSegmentId: "",
                znasbuId: "",
                marketBasketId: "",
            }));
        } else if (formfield.customerSegment && formfield.region === REGION_ZNA) {
            setformfield((prevstate) => ({
                ...prevstate,
                customerSegment: [],
            }));
        }
        if (
            isNotEmptyValue(formfield.nearMisses) &&
            formfield.region !== REGION_EMEA
        ) {
            setformfield((prevstate) => ({
                ...prevstate,
                nearMisses: "",
            }));
        }
    }, [formfield.region]);

    const handleApproverChange = (name, value) => {
        setformfield({ ...formfield, [name]: value });
    };

    const handleInputSearchChange = (e) => {
        const searchval = e.target.value ? e.target.value : "#$%";
        // getAllUsers({ UserName: searchval });
    };

    const handleDateSelectChange = (name, value) => {
        let dateval = value ? moment(value).format("YYYY-MM-DD") : "";
        setformfield({
            ...formfield,
            [name]: dateval,
        });
    };
    const onSearchFilterInputAutocomplete = (name, value) => {
        //const { name, value } = e.target;
        setformfield({
            ...formfield,
            [name]: value,
        });
    };

    const onSearchFilterInput = (e) => {
        const { name, value } = e.target;
        setformfield({
            ...formfield,
            [name]: value,
        });
    };

    const onSearchFilterSelect = (name, value) => {
        setformfield({
            ...formfield,
            [name]: value,
        });
    };

    const [mandatoryFields, setmandatoryFields] = useState(['viewName']);
    const validateform = () => {
        let isvalidated = true;
        for (let key in formfield) {
            if (mandatoryFields.includes(key) && isvalidated) {
                let value = formfield[key];
                value = value.trim()
                if (value.length === 0) {
                    setformfield({
                        ...formfield,
                        [key]: "",
                    });
                    isvalidated = false;
                }
                if (!isNotEmptyValue(value)) {
                    isvalidated = false;
                }
            }
        }
        return isvalidated;
    };
    const [showError, setShowError] = useState(false)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setissubmitted(true);
        if (validateform()) {
            if (formfield.isPrivate === false && selectedUserRoles.length === 0) {
                setShowError(true)
            } else {
                let tempFilterOpts = {};
                for (let key in formfield) {
                    if (formfield[key]) {
                        let value = formfield[key];
                        tempFilterOpts[key] = value;
                        if (key === "materialBreach") {
                            tempFilterOpts[key] = value === "1" ? true : false;
                        }
                        if (key === "country" || key === "region" ||
                            key === "status" || key === "loB" ||
                            key === "subLoB" || key === "typeofBreach" ||
                            key === "classification" || key === "customerSegment" ||
                            key === "natureofbreach" || key === "howdetected" ||
                            key === "rootCauseOfTheBreach" || key === "rangeOfFinancialimpact"
                        ) {
                            const tmpval = value.map((item) => item.value);
                            tempFilterOpts[key] = tmpval.join(",");
                        }
                    }
                }
                // tempFilterOpts.isPrivate = tempFilterOpts.switch || tempFilterOpts.switch === true ? false : true;
                tempFilterOpts.userRoles = selectedUserRoles.toString()
                tempFilterOpts.UserViewType = 'breachlog'
                tempFilterOpts.requesterUserId = userProfile.userId

                // delete tempFilterOpts.switch
                let response = await postItem(tempFilterOpts)
                if (response) {
                    if (tempFilterOpts.breachViewsId) {
                        alert(alertMessage.userview.update);
                    } else {
                        alert(alertMessage.userview.add);
                    }
                    hideAddPopup()
                }
            }
        }
        // hideAddPopup()
    }

    return (
        <div className="addedit-logs-container">
            <div className="addedit-header-container">
                <div className="addedit-header-title">New/Edit View for Breach Log</div>
                <div className="header-btn-container">
                    {isReadMode &&
                        <div className="addedit-close-view btn-blue" onClick={() => handleEdit(formfield, 'edit')}>
                            Edit
                        </div>
                    }
                    <div className="addedit-close-view btn-blue" onClick={() => hidePopup()}>
                        Back
                    </div>
                </div>
            </div>
            {loading ? (
                <Loading />
            ) : (
                <div className="popup-formitems logs-form">
                    <form onSubmit={handleSubmit} id="myForm">
                        <div className="row">
                            <div className="col-md-3">
                                <FrmInput
                                    title={"View Name"}
                                    name={"viewName"}
                                    value={formfield?.viewName}
                                    type={"text"}
                                    handleChange={handleChange}
                                    isRequired={true}
                                    validationmsg={"Mandatory field"}
                                    issubmitted={issubmitted}
                                    isReadMode={isReadMode}
                                />
                            </div>
                            <div className="col-md-3">
                                <FrmToggleSwitch
                                    title={''}
                                    name={"isPrivate"}
                                    value={formfield.isPrivate}
                                    handleChange={handleSelectChange}
                                    isRequired={false}
                                    issubmitted={issubmitted}
                                    selectopts={switchOpts}
                                    isReadMode={isReadMode}
                                />
                            </div>
                        </div>
                        {showUserRoles &&
                            <>
                                <div className="border-top font-weight-bold frm-container-bgwhite d-flex">
                                    <div className="mb-4"> User Roles</div>
                                    {showError ?
                                        <div className="validationError">Please select atless one user role</div>
                                        : (
                                            ""
                                        )}
                                </div>
                                <div className="border-bottom border-top frm-container-bggray">
                                    <div className="m-1 mt-4 d-flex" style={userProfile.isCountrySuperAdmin ? {} : { justifyContent: 'space-between' }}>
                                        {isReadMode &&
                                            userRoles.map((item, i) => {
                                                return (
                                                    formfield[item.name] &&
                                                    <div className="col-md-2">
                                                        {item.label}
                                                    </div>
                                                )
                                            })
                                        }
                                        {!isReadMode && userRoles.map((item, i) => {
                                            return (
                                                <div className="" style={userProfile.isCountrySuperAdmin ? { marginRight: '10%' } : {}}>
                                                    <FrmCheckbox
                                                        title={item.label}
                                                        name={item.name}
                                                        value={formfield[item.name]}
                                                        handleChange={handleChange}
                                                        isRequired={false}
                                                        selectopts={accessBreachLogOpts}
                                                        inlinetitle={true}
                                                        aftercheckbox={true}
                                                        isReadMode={isReadMode}
                                                    />
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </>
                        }
                        <div className="frm-container-bgwhite">
                            <div className="row">
                                <div className="col-md-3">
                                    <div className="frm-filter">
                                        <FrmInputAutocomplete
                                            title={"Entry Number"}
                                            name={"entryNumber"}
                                            type={"input"}
                                            handleChange={onSearchFilterInputAutocomplete}
                                            value={formfield.entryNumber}
                                            options={commonfilterOpts.entryNumberOpts}
                                            issubmitted={issubmitted}
                                            isReadMode={isReadMode}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <FrmInput
                                        title={"Title"}
                                        name={"title"}
                                        type={"input"}
                                        issubmitted={issubmitted}
                                        handleChange={onSearchFilterInput}
                                        value={formfield.title}
                                        isReadMode={isReadMode}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <FrmMultiselect
                                        title={"Region"}
                                        name={"region"}
                                        value={typeof formfield.region === 'string' ? [] : formfield.region || []}
                                        handleChange={handleMultiSelectChange}
                                        isRequired={false}
                                        issubmitted={issubmitted}
                                        selectopts={regionFilterOpts}
                                        isReadMode={isReadMode}
                                        isAllOptNotRequired={true}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <FrmMultiselect
                                        title={"Country"}
                                        name={"country"}
                                        value={formfield.country || []}
                                        handleChange={handleMultiSelectChange}
                                        isRequired={false}
                                        issubmitted={issubmitted}
                                        selectopts={countryFilterOpts}
                                        isReadMode={isReadMode}
                                        isAllOptNotRequired={true}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <FrmMultiselect
                                        title={"Status"}
                                        name={"status"}
                                        value={formfield.status || []}
                                        handleChange={handleMultiSelectChange}
                                        isRequired={false}
                                        issubmitted={issubmitted}
                                        selectopts={commonfilterOpts.statusFilterOpts}
                                        isReadMode={isReadMode}
                                        isAllOptNotRequired={true}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <FrmInputAutocomplete
                                        title={"Action Responsible"}
                                        name={"actionResponsible"}
                                        type={"input"}
                                        handleChange={onSearchFilterInputAutocomplete}
                                        value={formfield.actionResponsible}
                                        options={
                                            commonfilterOpts.actionResponsibleFilterOpts
                                        }
                                        isReadMode={isReadMode}
                                        isAllOptNotRequired={true}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <FrmMultiselect
                                        title={"LoB"}
                                        name={"loB"}
                                        value={formfield.loB || []}
                                        handleChange={handleMultiSelectChange}
                                        isRequired={false}
                                        issubmitted={issubmitted}
                                        selectopts={lobFilterOpts}
                                        isReadMode={isReadMode}
                                        isAllOptNotRequired={true}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <FrmMultiselect
                                        title={"Sub LoB"}
                                        name={"subLoB"}
                                        value={formfield.subLoB || []}
                                        handleChange={handleMultiSelectChange}
                                        isRequired={false}
                                        issubmitted={issubmitted}
                                        selectopts={commonfilterOpts.sublobFilterOpts}
                                        isReadMode={isReadMode}
                                        isAllOptNotRequired={true}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="frm-container-bgwhite">
                            <div className="user-view-advance-filter-btn-container">
                                <div
                                    className={`user-view-advance-filter-btn`}
                                >
                                    Advance Search
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-3">
                                    <FrmMultiselect
                                        title={"Type of Breach"}
                                        name={"typeofBreach"}
                                        value={formfield.typeofBreach || []}
                                        handleChange={handleMultiSelectChange}
                                        isRequired={false}
                                        issubmitted={issubmitted}
                                        selectopts={commonfilterOpts.typeOfBreachOpts}
                                        isReadMode={isReadMode}
                                        isAllOptNotRequired={true}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <FrmMultiselect
                                        title={"Classification"}
                                        name={"classification"}
                                        value={formfield.classification || []}
                                        handleChange={handleMultiSelectChange}
                                        isRequired={false}
                                        issubmitted={issubmitted}
                                        selectopts={commonfilterOpts.classificationFilterOpts}
                                        isReadMode={isReadMode}
                                        isAllOptNotRequired={true}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <FrmSelect
                                        title={"Material Breach"}
                                        name={"materialBreach"}
                                        value={formfield.materialBreach}
                                        handleChange={handleSelectChange}
                                        isRequired={false}
                                        issubmitted={issubmitted}
                                        selectopts={yesnoopts}
                                        isReadMode={isReadMode}
                                    />
                                </div>
                                {formfield.region !== REGION_ZNA && (
                                    <div className="col-md-3">
                                        <FrmMultiselect
                                            title={"Customer Segment"}
                                            name={"customerSegment"}
                                            value={formfield.customerSegment || []}
                                            handleChange={handleMultiSelectChange}
                                            isRequired={false}
                                            issubmitted={issubmitted}
                                            selectopts={segmentFilterOpts}
                                            isReadMode={isReadMode}
                                            isAllOptNotRequired={true}
                                        />
                                    </div>
                                )}
                                <div className="col-md-3">
                                    <FrmMultiselect
                                        title={"Nature of Breach"}
                                        name={"natureofbreach"}
                                        value={formfield.natureofbreach || []}
                                        handleChange={handleMultiSelectChange}
                                        isRequired={false}
                                        issubmitted={issubmitted}
                                        selectopts={commonfilterOpts.natureOfBreachFilterOpts}
                                        isReadMode={isReadMode}
                                        isAllOptNotRequired={true}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <FrmMultiselect
                                        title={"How detected"}
                                        name={"howdetected"}
                                        value={formfield.howdetected || []}
                                        handleChange={handleMultiSelectChange}
                                        isRequired={false}
                                        issubmitted={issubmitted}
                                        selectopts={commonfilterOpts.howDetectedOpts}
                                        isReadMode={isReadMode}
                                        isAllOptNotRequired={true}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <FrmMultiselect
                                        title={"Root Cause of the Breach"}
                                        name={"rootCauseOfTheBreach"}
                                        value={formfield.rootCauseOfTheBreach || []}
                                        handleChange={handleMultiSelectChange}
                                        isRequired={false}
                                        issubmitted={issubmitted}
                                        selectopts={commonfilterOpts.rootCauseBreachOpts}
                                        isReadMode={isReadMode}
                                        isAllOptNotRequired={true}
                                    />
                                </div>
                                {formfield.region === REGION_EMEA && (
                                    <div className="frm-filter col-md-3">
                                        <FrmSelect
                                            title={<>Near Misses</>}
                                            name={"nearMisses"}
                                            value={formfield.nearMisses}
                                            handleChange={onSearchFilterSelect}
                                            selectopts={yesnoopts}
                                            isReadMode={isReadMode}
                                        />
                                    </div>
                                )}
                                <div className="col-md-3">
                                    <FrmMultiselect
                                        title={"Range of finacial impact"}
                                        name={"rangeOfFinancialimpact"}
                                        value={formfield.rangeOfFinancialimpact || []}
                                        handleChange={handleMultiSelectChange}
                                        isRequired={false}
                                        issubmitted={issubmitted}
                                        selectopts={commonfilterOpts.rangeOfFinancialImpactOpts}
                                        isReadMode={isReadMode}
                                        isAllOptNotRequired={true}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <FrmInputAutocomplete
                                        title={"Creator"}
                                        name={"creator"}
                                        type={"input"}
                                        handleChange={onSearchFilterInputAutocomplete}
                                        value={formfield.creator}
                                        options={commonfilterOpts.creatorFilterOpts}
                                        issubmitted={issubmitted}
                                        isReadMode={isReadMode}
                                    />
                                </div>
                                <div className="col-md-6 filter-date-container">
                                    <div className="frm-filter">
                                        <FrmDatePicker
                                            title={"Date Breach Occurred"}
                                            name={"dateBreachOccurredFrom"}
                                            value={formfield.dateBreachOccurredFrom}
                                            type={"date"}
                                            handleChange={handleDateSelectChange}
                                            isReadMode={isReadMode}
                                        />
                                    </div>

                                    <div className="daterange-title">to</div>

                                    <div className="frm-filter">
                                        <FrmDatePicker
                                            title={""}
                                            name={"dateBreachOccurredTo"}
                                            value={formfield.dateBreachOccurredTo}
                                            type={"date"}
                                            handleChange={handleDateSelectChange}
                                            minDate={moment(
                                                formfield.dateBreachOccurredFrom
                                            ).toDate()}
                                            isReadMode={isReadMode}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6 filter-date-container">
                                    <div className="frm-filter">
                                        <FrmDatePicker
                                            title={"Due Date"}
                                            name={"dueDateFrom"}
                                            value={formfield.dueDateFrom}
                                            type={"date"}
                                            handleChange={handleDateSelectChange}
                                            isReadMode={isReadMode}
                                        />
                                    </div>

                                    <div className="daterange-title">to</div>

                                    <div className="frm-filter">
                                        <FrmDatePicker
                                            title={""}
                                            name={"dueDateTo"}
                                            value={formfield.dueDateTo}
                                            type={"date"}
                                            handleChange={handleDateSelectChange}
                                            minDate={moment(formfield.dueDateFrom).toDate()}
                                            isReadMode={isReadMode}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6 filter-date-container">
                                    <div className="frm-filter">
                                        <FrmDatePicker
                                            title={"Date Action Closed"}
                                            name={"dateActionClosedFrom"}
                                            value={formfield.dateActionClosedFrom}
                                            type={"date"}
                                            handleChange={handleDateSelectChange}
                                            isReadMode={isReadMode}
                                        />
                                    </div>

                                    <div className="daterange-title">to</div>

                                    <div className="frm-filter">
                                        <FrmDatePicker
                                            title={""}
                                            name={"dateActionClosedTo"}
                                            value={formfield.dateActionClosedTo}
                                            type={"date"}
                                            handleChange={handleDateSelectChange}
                                            minDate={moment(
                                                formfield.dateActionClosedFrom
                                            ).toDate()}
                                            isReadMode={isReadMode}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6 filter-date-container">
                                    <div className="frm-filter">
                                        <FrmDatePicker
                                            title={"Created Date"}
                                            name={"createdDateFrom"}
                                            value={formfield.createdDateFrom}
                                            type={"date"}
                                            handleChange={handleDateSelectChange}
                                            isReadMode={isReadMode}
                                        />
                                    </div>

                                    <div className="daterange-title">to</div>

                                    <div className="frm-filter">
                                        <FrmDatePicker
                                            title={""}
                                            name={"createdDateTo"}
                                            value={formfield.createdDateTo}
                                            type={"date"}
                                            handleChange={handleDateSelectChange}
                                            minDate={moment(
                                                formfield.createdDateFrom
                                            ).toDate()}
                                            isReadMode={isReadMode}
                                        />
                                    </div>
                                </div>
                                {formfield.region === REGION_ZNA && (
                                    <>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div
                                                    className="border-bottom"
                                                    style={{
                                                        padding: "5px 0",
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    ZNA Specific Filters
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="frm-filter col-md-3">
                                                <FrmInputAutocomplete
                                                    title={"UWr involved"}
                                                    name={"UWRInvolvedName"}
                                                    type={"input"}
                                                    handleChange={onSearchFilterInputAutocomplete}
                                                    value={formfield.UWRInvolvedName}
                                                    options={commonfilterOpts.uwrInvolvedOpts}
                                                    isReadMode={isReadMode}
                                                />
                                            </div>
                                            <div className="frm-filter col-md-3">
                                                <FrmInput
                                                    title={"Policy name"}
                                                    name={"policyName"}
                                                    type={"input"}
                                                    handleChange={onSearchFilterInput}
                                                    value={formfield.policyName}
                                                    isReadMode={isReadMode}
                                                />
                                            </div>
                                            <div className="frm-filter col-md-3">
                                                <FrmInput
                                                    title={"Policy number"}
                                                    name={"policyNumber"}
                                                    type={"input"}
                                                    handleChange={onSearchFilterInput}
                                                    value={formfield.policyNumber}
                                                    isReadMode={isReadMode}
                                                />
                                            </div>
                                            <div className="frm-filter col-md-3">
                                                <FrmInput
                                                    title={"UQA Review ID"}
                                                    name={"turNumber"}
                                                    type={"input"}
                                                    handleChange={onSearchFilterInput}
                                                    value={formfield.turNumber}
                                                    isReadMode={isReadMode}
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="frm-filter col-md-3">
                                                <FrmSelect
                                                    title={"Office"}
                                                    name={"office"}
                                                    selectopts={commonfilterOpts.officeOpts}
                                                    handleChange={onSearchFilterSelect}
                                                    value={formfield.office}
                                                    isReadMode={isReadMode}
                                                />
                                            </div>
                                            <div className="col-md-6 filter-date-container">
                                                <div className="frm-filter">
                                                    <FrmDatePicker
                                                        title={"Date Identified"}
                                                        name={"IdentifiedFromDate"}
                                                        value={formfield.IdentifiedFromDate}
                                                        type={"date"}
                                                        handleChange={handleDateSelectChange}
                                                        isReadMode={isReadMode}
                                                    />
                                                </div>

                                                <div className="daterange-title">to</div>

                                                <div className="frm-filter">
                                                    <FrmDatePicker
                                                        title={""}
                                                        name={"IdentifiedToDate"}
                                                        value={formfield.IdentifiedToDate}
                                                        type={"date"}
                                                        handleChange={handleDateSelectChange}
                                                        minDate={moment(
                                                            formfield.IdentifiedFromDate
                                                        ).toDate()}
                                                        isReadMode={isReadMode}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="frm-filter col-md-3">
                                                <FrmSelect
                                                    title={"ZNA BU"}
                                                    name={"znaSegmentId"}
                                                    selectopts={commonfilterOpts.ZNASegmentOpts}
                                                    handleChange={onSearchFilterSelect}
                                                    value={formfield.znaSegmentId}
                                                    isReadMode={isReadMode}
                                                />
                                            </div>
                                            <div className="frm-filter col-md-3">
                                                <FrmSelect
                                                    title={"ZNA SBU"}
                                                    name={"znasbuId"}
                                                    selectopts={commonfilterOpts.ZNASBUOpts}
                                                    handleChange={onSearchFilterSelect}
                                                    value={formfield.znasbuId}
                                                    isReadMode={isReadMode}
                                                />
                                            </div>
                                            <div className="frm-filter col-md-3">
                                                <FrmSelect
                                                    title={"ZNA Market Basket"}
                                                    name={"marketBasketId"}
                                                    selectopts={
                                                        commonfilterOpts.ZNAMarketBasketOpts
                                                    }
                                                    handleChange={onSearchFilterSelect}
                                                    value={formfield.marketBasketId}
                                                    isReadMode={isReadMode}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </form>
                    {
                        !isReadMode ? (
                            <div className="popup-footer-container">
                                <div className="btn-container">
                                    <button
                                        className={`btn-blue ${!isEmptyObjectKeys(formfield) ? "" : "disable"
                                            }`}
                                        type="submit"
                                        form="myForm"
                                    >
                                        Submit
                                    </button>
                                    <div className="btn-blue" onClick={() => hideAddPopup()}>
                                        Cancel
                                    </div>
                                </div>
                            </div>
                        ) : (
                            ""
                        )
                    }
                </div>
            )}
        </div>
    );
}
const mapStateToProp = (state) => {
    return {
        state: state,
    };
};
const mapActions = {
    getAll: userViewActions.getAll,
    getAllUsers: userActions.getAllUsers,
    getAllCountry: countryActions.getAllCountry,
    getAllRegion: regionActions.getAllRegions,
    getAlllob: lobActions.getAlllob,
    getAllSublob: sublobActions.getAllSublob,
    getAllSegment: segmentActions.getAllSegment,
    getAllStatus: breachlogActions.getAllStatus,
    getLookupByType: lookupActions.getLookupByType,
    getAllEntryNumbers: commonActions.getAllEntryNumbers,
    clearDashboardClick: dashboardActions.clearDashboardClick,
    getAllOffice: officeActions.getAllOffice,
    getallZNASegments: znaorgnization1Actions.getAllOrgnization,
    getallZNASBU: znaorgnization2Actions.getAllOrgnization,
    getallZNAMarketBasket: znaorgnization3Actions.getAllOrgnization,
    getLogUsers: commonActions.getLogUsers,
    getActionResponsible: breachlogActions.getActionResponsible,
    postItem: userViewActions.postItem
};
export default connect(mapStateToProp, mapActions)(BreachAddEditForm);
