export const intialFilterState = {
  EntryNumber: "",
  AccountName: "",
  LOBId: "",
  CountryId: [],
  RegionId: [],
  Underwriter: "",
  role: "",
  RequestForEmpowermentStatus: "",
  OrganizationalAlignment: "",
  RequestForEmpowermentReason: "",
  CHZ: "",
  RequestForEmpowermentCC: "",
  UnderwriterGrantingEmpowerment: "",
  Creator: "",
  CreatedFromDate: "",
  CreatedToDate: "",
  DurationofApproval: "",
  ConditionApplicableTo: "",
};
export const filterfieldsmapping = {
  EntryNumber: {
    componenttype: "FrmInputAutocomplete",
    options: "commonfilterOpts.entryNumberOpts",
    eventhandler: "onSearchFilterInputAutocomplete",
    filtertype: "common",
  },
  AccountName: {
    componenttype: "FrmInput",
    options: "",
    eventhandler: "onSearchFilterInput",
    filtertype: "common",
  },
  LOBId: {
    componenttype: "FrmMultiselect",
    options: "lobFilterOpts",
    eventhandler: "handleMultiSelectChange",
    filtertype: "common",
  },
  Role: {
    componenttype: "FrmSelect",
    options: "commonfilterOpts.rolesFilterOpts",
    eventhandler: "onSearchFilterSelect",
    filtertype: "common",
  },
  RegionId: {
    componenttype: "FrmMultiselect",
    options: "regionFilterOpts",
    eventhandler: "handleMultiSelectChange",
    filtertype: "common",
  },
  CountryId: {
    componenttype: "FrmMultiselect",
    options: "countryFilterOpts",
    eventhandler: "handleMultiSelectChange",
    filtertype: "common",
  },
  Underwriter: {
    componenttype: "FrmInputAutocomplete",
    options: "commonfilterOpts.underwriterFilterOpts",
    eventhandler: "onSearchFilterInputAutocomplete",
    filtertype: "common",
    fieldTitleHtml: true,
  },
  UnderwriterGrantingEmpowerment: {
    componenttype: "FrmInputAutocomplete",
    options: "commonfilterOpts.underwriterGrantingEmpowermentOpts",
    eventhandler: "onSearchFilterInputAutocomplete",
    filtertype: "common",
  },
  RequestForEmpowermentStatus: {
    componenttype: "FrmMultiselect",
    options: "commonfilterOpts.statusFilterOpts",
    eventhandler: "handleMultiSelectChange",
    filtertype: "common",
  },
  OrganizationalAlignment: {
    componenttype: "FrmMultiselect",
    options: "commonfilterOpts.organizationalAlignmentOpts",
    eventhandler: "handleMultiSelectChange",
    filtertype: "advance",
    titlelinespace: true,
  },
  RequestForEmpowermentReason: {
    componenttype: "FrmMultiselect",
    options: "commonfilterOpts.requestForEmpowermentReasonOpts",
    eventhandler: "handleMultiSelectChange",
    filtertype: "advance",
    titlelinespace: true,
  },
  CHZ: {
    componenttype: "FrmSelect",
    options: "commonfilterOpts.chzOpts",
    eventhandler: "onSearchFilterSelect",
    filtertype: "advance",
  },
  RequestForEmpowermentCC: {
    componenttype: "FrmInputAutocomplete",
    options: "commonfilterOpts.requestForEmpowermentCCOpts",
    eventhandler: "onSearchFilterInputAutocomplete",
    filtertype: "advance",
    titlelinespace: true,
  },
  Creator: {
    componenttype: "FrmInputAutocomplete",
    options: "commonfilterOpts.creatorFilterOpts",
    eventhandler: "onSearchFilterInputAutocomplete",
    filtertype: "advance",
  },
  CreatedDate: {
    componenttype: "FrmDatePicker",
    options: "",
    eventhandler: "handleDateSelectChange",
    filtertype: "advance",
    colspan: 6,
    datefieldfrom: { fieldname: "CreatedFromDate", minDate: "" },
    datefieldto: {
      fieldname: "CreatedToDate",
      minDate: "selfilter.createdFromDate",
    },
  },
  Currency: {
    componenttype: "FrmMultiselect",
    options: "commonfilterOpts.currencyOpts",
    eventhandler: "handleMultiSelectChange",
    filtertype: "Incountry",
  },
  Branch: {
    componenttype: "FrmMultiselect",
    options: "commonfilterOpts.branchOpts",
    eventhandler: "handleMultiSelectChange",
    filtertype: "Incountry",
  },
  DurationofApproval: {
    componenttype: "FrmMultiselect",
    options: "commonfilterOpts.durationofApprovalOpts",
    eventhandler: "handleMultiSelectChange",
    filtertype: "advance",
  },
  NewRenewal: {
    componenttype: "FrmMultiselect",
    options: "commonfilterOpts.newRenewalOpts",
    eventhandler: "handleMultiSelectChange",
    filtertype: "Incountry",
  },
  Limit: {
    componenttype: "FrmInput",
    options: "",
    eventhandler: "onSearchFilterInput",
    filtertype: "Incountry",
  },
  ZurichShare: {
    componenttype: "FrmInput",
    options: "",
    eventhandler: "onSearchFilterInput",
    filtertype: "Incountry",
  },
  AccountNumber: {
    componenttype: "FrmInput",
    options: "",
    eventhandler: "onSearchFilterInput",
    filtertype: "Incountry",
  },
  CustomerSegment: {
    componenttype: "FrmMultiselect",
    options: "commonfilterOpts.customerSegmentOpts",
    eventhandler: "handleMultiSelectChange",
    filtertype: "Incountry",
  },
  PolicyPeriod: {
    componenttype: "FrmInput",
    options: "",
    eventhandler: "onSearchFilterInput",
    filtertype: "Incountry",
  },
  ConditionApplicableTo: {
    componenttype: "FrmMultiselect",
    options: "commonfilterOpts.conditionApplicableToOpts",
    eventhandler: "handleMultiSelectChange",
    filtertype: "advance",
  },
  GWP: {
    componenttype: "FrmInput",
    options: "",
    eventhandler: "onSearchFilterInput",
    filtertype: "Incountry",
  },
  SUBLOBID: {
    componenttype: "FrmMultiselect",
    options: "sublobFilterOpts",
    eventhandler: "handleMultiSelectChange",
    filtertype: "Incountry",
  },
};
export const versionHistoryexportFieldTitles = {
  "Entry Number": "Entry Number",
  "Account Name": "Account Name",
  "Organizational alignment": "Organizational alignment",
  "Country": "Country",
  "Region": "Region",
  "Underwriter(submitter)": "Underwriter",
  "CHZ Sustainability Desk / CHZ GI Credit Risk": "CHZ Sustainability Desk / CHZ GI Credit Risk",
  "LOB": "LoB",
  "Sub-LoB": "Sub-LoB",
  "Request For Empowerment Reason": "Request for empowerment reason",
  "Specific Details": "Specific Details",
  "Underwriter granting empowerment": "Underwriter granting empowerment",
  "Request For Empowerment CC": "Request for empowerment CC",
  "Request For Empowerment Status": "Request for empowerment status",
  "Request for empowerment reason 2": "Request for empowerment reason 2",
  "Request for empowerment reason 3": "Request for empowerment reason 3",
  "Request for empowerment reason 4": "Request for empowerment reason 4",
  "Request for empowerment reason 5": "Request for empowerment reason 5",
  "Date of reception of information needed by approver":
    "Date of reception of information needed by approver",
  "Date Of Response": "Date of response",
  "Underwriter granting empowerment comments / condition":
    "Underwriter granting empowerment comments",
  "Creator Name": "Creator Name",
  "RfeLogEmailLink": "Link",
  "Imported By": "Imported By",
  "Condition Applicable To": "Condition Applicable To",
  "Duration of approval (in years)": "Duration of Approval (in years)",
  "Customer Segment": "Customer Segment",
  "New/Renewal": "New/Renewal",
  "Branch": "Branch",
  "Policy Period": "Policy Period",
  "Currency": "Currency",
  Limit: "Limit",
  GWP: "GWP",
  "Zurich Share": "Zurich Share",
  "Decision Date": "Decision Date",
  "Created Date": "Created Date",
  "Modified Date": "Modified Date",
};
export const versionHistoryExcludeFields = {
  "RfeLogEmailLink": "rfeLogEmailLink",
  "Created Date": "createdDate",
  "Modified Date": "modifiedDate",
  "Region": "regionName",
  "Creator Name": "creatorName",
};
export const versionHistoryexportDateFields = {
  ResponseDate: "responseDate",
  ReceptionInformationDate: "receptionInformationDate",
};
export const versionHistoryexportHtmlFields = [
  "RFELogDetails",
  "UnderwriterGrantingEmpowermentComments",
];

export const formfieldsmapping = {
  AccountName: {
    componenttype: "FrmInputAutocomplete",
    eventhandler: "onSearchFilterInputAutocomplete",
    options: "frmAccountOpts",
    titlelinespace: true,
    colspan: 3,
    startbgcls: "frm-field-bggray",
  },
  CountryId: {
    componenttype: "FrmMultiselect",
    options: "countryopts",
    eventhandler: "handleSelectChange",
    titlelinespace: true,
    colspan: 3,
    fieldname: "CountryList",
  },
  LOBId: {
    componenttype: "FrmSelect",
    options: "frmLoB",
    eventhandler: "handleSelectChange",
    titlelinespace: true,
    colspan: 3,
  },
  SUBLOBID: {
    componenttype: "FrmSelect",
    options: "frmSublob",
    eventhandler: "handleSelectChange",
    titlelinespace: true,
    colspan: 0,
    conditionaldisplay: "frmSublob.length > 1",
  },
  RequestForEmpowermentReason: {
    componenttype: "FrmSelect",
    options: "frmrfeempourment",
    eventhandler: "handleSelectChange",
    tooltipmsg: "tooltip.RequestForEmpowermentReason",
    colspan: 3,
    fieldTitleHtml: true,
  },
  ReferralReasonLevel2: {
    componenttype: "FrmSelect",
    options: "referralReasonLevel2Option",
    eventhandler: "handleSelectChange",
    titlelinespace: true,
    colspan: 0,
    startbgcls: "frm-field-bggray",
    conditionaldisplay: "reasonfields.ReferralReasonLevel2 ? true : false",
  },
  ReferralReasonLevel3: {
    componenttype: "FrmSelect",
    options: "referralReasonLevel3Option",
    eventhandler: "handleSelectChange",
    titlelinespace: true,
    colspan: 0,
    startbgcls: "frm-field-bggray",
    conditionaldisplay: "reasonfields.ReferralReasonLevel3 ? true : false",
  },
  ReferralReasonLevel4: {
    componenttype: "FrmSelect",
    options: "referralReasonLevel4Option",
    eventhandler: "handleSelectChange",
    titlelinespace: true,
    colspan: 0,
    startbgcls: "frm-field-bggray",
    conditionaldisplay: "reasonfields.ReferralReasonLevel4 ? true : false",
  },
  ReferralReasonLevel5: {
    componenttype: "FrmSelect",
    options: "referralReasonLevel5Option",
    eventhandler: "handleSelectChange",
    titlelinespace: true,
    colspan: 0,
    startbgcls: "frm-field-bggray",
    conditionaldisplay: "reasonfields.ReferralReasonLevel5 ? true : false",
  },
  UnderwriterGrantingEmpowerment: {
    componenttype: "FrmInput",
    eventhandler: "handleChange",
    peoplepickertype: "approver",
    fieldname: "UnderwriterGrantingEmpowermentName",
    colspan: 3,
    titlelinespace: false,
    startbgcls: "frm-field-bggray",
    fieldTitleHtml: true,
  },
  Branch: {
    componenttype: "FrmSelect",
    options: "frmBranchOpts",
    eventhandler: "handleSelectChange",
    colspan: 3,
    titlelinespace: true,
    conditionaldisplay:
      "IncountryFlag === IncountryFlagConst.LATAM && frmBranchOpts.length",
  },
  OrganizationalAlignment: {
    componenttype: "FrmRadio",
    options: "frmorgnizationalalignment",
    eventhandler: "handleChange",
    tooltipmsg: "tooltip.OrgnizationalAlignment",
    colspan: 3,
    titlelinespace: true,
  },
  Underwriter: {
    componenttype: "FrmInput",
    eventhandler: "handleChange",
    peoplepickertype: "underwriter",
    fieldname: "UnderwriterName",
    colspan: 3,
    titlelinespace: true,
    startbgcls: "frm-field-bggray",
    fieldTitleHtml: true,
  },
  RFELogDetails: {
    componenttype: "FrmRichTextEditor",
    eventhandler: "handleSelectChange",
    tooltipmsg: "tooltip.SpecificDetails",
    colspan: 12,
    clsrowname: "border-bottom",
    startbgcls: "frm-field-bggray",
  },
  CustomerSegment: {
    componenttype: "FrmSelect",
    options: "frmSegmentOpts",
    eventhandler: "handleSelectChange",
    colspan: 3,
    startbgcls: "frm-field-bggray",
  },
  AccountNumber: {
    componenttype: "FrmInput",
    eventhandler: "handleChange",
    colspan: 0,
    conditionaldisplay: "accountNumberShow",
  },
  NewRenewal: {
    componenttype: "FrmSelect",
    options: "inCountryOptsLATAM.frmNewRenewalOpts",
    eventhandler: "handleSelectChange",
    colspan: 3,
  },
  PolicyPeriod: {
    componenttype: "FrmInput",
    eventhandler: "handleChange",
    colspan: 3,
    breakblock: true,
  },
  Currency: {
    componenttype: "FrmSelect",
    options: "frmCurrencyOpts",
    eventhandler: "handleSelectChange",
    colspan: 3,
    startbgcls: "frm-field-bggray",
  },
  Limit: {
    componenttype: "FrmInput",
    eventhandler: "handleChange",
    colspan: 3,
  },
  GWP: {
    componenttype: "FrmInput",
    eventhandler: "handleChange",
    colspan: 3,
  },
  ZurichShare: {
    componenttype: "FrmInput",
    eventhandler: "handleChange",
    colspan: 3,
    clsrowname: "border-bottom",
    breakblock: true,
    startbgcls: "frm-field-bggray",
  },
  CHZ: {
    componenttype: "FrmSelect",
    options: "frmrfechz",
    eventhandler: "handleSelectChange",
    tooltipmsg: "tooltip.CHZ",
    colspan: 3,
    startbgcls: "frm-field-bggray",
  },
  RequestForEmpowermentCC: {
    componenttype: "FrmInput",
    eventhandler: "handleChange",
    peoplepickertype: "ccuser",
    fieldname: "RequestForEmpowermentCCName",
    tooltipmsg: "tooltip.Rfecc",
    colspan: 3,
    breakblock: true,
    startbgcls: "frm-container-bggray",
  },
  DecisionDate: {
    componenttype: "FrmDatePicker",
    eventhandler: "handleDateSelectChange",
    minDate: "",
    maxDate: "",
    colspan: 3,
    titlelinespace: true,
    breakblock: true,
    startbgcls: "frm-container-bggray",
  },
  RequestForEmpowermentStatus: {
    componenttype: "FrmSelect",
    eventhandler: "handleSelectChange",
    options: "frmstatus",
    tooltipmsg: "tooltip.RequestForEmpowermentStatus",
    colspan: 3,
    startbgcls: "frm-container-bggray",
  },
  ConditionApplicableTo: {
    componenttype: "FrmSelect",
    eventhandler: "handleSelectChange",
    options: "frmConditionOpts",
    tooltipmsg: "tooltip.ConditionApplicableTo",
    colspan: 3,
    conditionaldisplay:
      "formfield.RequestForEmpowermentStatus ===rfelog_status.Empowerment_granted_with_conditions",
  },
  DurationofApproval: {
    componenttype: "FrmSelect",
    eventhandler: "handleSelectChange",
    options: "frmDurationOpts",
    tooltipmsg: "tooltip.DurationofApproval",
    colspan: 3,
    startbgcls: "frm-container-bggray",
    disablecondition: "isdurationdisabled",
  },
  UnderwriterGrantingEmpowermentComments: {
    componenttype: "FrmRichTextEditor",
    eventhandler: "handleSelectChange",
    tooltipmsg: "tooltip.UnderwriterGrantingEmpowermentComments",
    colspan: 12,
    startbgcls: "frm-container-bggray",
    clsrowname: "border-bottom",
    disablecondition:
      "isstatusdisabled || formfield.RequestForEmpowermentStatus ===  rfelog_status.Pending",
  },
  ReceptionInformationDate: {
    componenttype: "FrmDatePicker",
    eventhandler: "handleDateSelectChange",
    minDate: "",
    maxDate: "moment().toDate()",
    colspan: 3,
    clsrowname: "border-bottom",
    startbgcls: "frm-container-bggray",
    disablecondition:
      "isstatusdisabled || formfield.RequestForEmpowermentStatus === rfelog_status.Pending",
  },
  ResponseDate: {
    componenttype: "FrmDatePicker",
    eventhandler: "handleDateSelectChange",
    minDate:
      "formfield.ReceptionInformationDate ? moment(formfield.ReceptionInformationDate).toDate() : ''",
    maxDate: "moment().toDate()",
    colspan: 3,
    titlelinespace: true,
    endbgcls: "frm-container-bggray",
    disablecondition:
      "isstatusdisabled || formfield.RequestForEmpowermentStatus === rfelog_status.Pending",
  },
};
