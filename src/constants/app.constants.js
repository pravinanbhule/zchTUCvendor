export const REGION_EMEA = "REG00002";
export const REGION_ZNA = "REG00005";
export const REGION_LATAM = "REG00003";
export const INCOUNTRTY_IDS = {
  INDONESIA: "COU000015",
  LATAM: REGION_LATAM,
  UK: "COU000033",
  IRELANDFOS: "7F40A9F4-6D67-40FA-ADCE-828657CFF25F",
  SPAIN: "COU000029",
  SPAINFOS: "COU44EB78A8F27749A2B4BA5FDF78F80035",
  MALAYSIA: "COU000020",
  SINGAPORE: "COU000028",
  ITALY: "COU000017",
  BENELUX: "COU000004",
  BENELUXNETHERLANDS: "COUD5E3A24443884A5CA4FF2587392AB6E0",
  BENELUXLUXEMBOURG: "COUC924407329854C90B61ABBE5E253E19B",
  BENELUXBELGIUM: "COU951B03DFC0874829A3A8D5136EE1CEFD",
  NORDIC: "COU000023",
  NORDICSWEDEN: "COU6B2673050740442E8401297310CAED34",
  NORDICFINALAND: "COU7F1D0D18F6844FBBBA5FF3802BBA0E38",
  NORDICDENMARK: "COU95BF84CB938240FE944EE3D8BF66A99B",
  AUSTRALIA: "COU000002",
  CHINA: "COU000007",
  HONGKONG: "COU000014",
  FRANCE: "COU000012",
  MIDDLEEAST: "COU000022",
  GERMANY: "COU000013",
  INDIA: "COU630B72A0CC50400886209AE0344752E7",
  UKZM: "8D54B159-BF25-45A9-872A-FCCAB3F00898",
};
export const BREACH_LOG_STATUS = {
  Pending: "ECA8E493-1750-4546-9BC1-A1E8DA8A1B58",
  Close: "2BAA867F-5B83-4DF2-B43B-CA3251C2CC55",
  Reopen: "391FDEB3-5C30-466C-B0C0-57C41FAA9756",
};
export const RFE_LOG_STATUS = {
  Pending: "8BC958F0-677E-43AD-9886-D719082D21BD",
  More_information_needed: "244A22AD-A1E3-409E-BB77-A0C069AD377A",
  Empowerment_granted: "9C619D9F-2CC7-4C3C-9DA6-1CA9592D922B",
  Empowerment_granted_with_conditions: "C8D5D3C6-07AC-45D4-BF4F-739302937904",
  Empowerment_not_granted: "FA04DC3E-028E-43FB-820A-B8FAFE7E44F9",
  Withdrawn: "F2623BCB-50B7-467B-AF06-E4A5ECFB29A4",
};
export const EXEMPTION_LOG_STATUS = {
  Pending: "D87A3F87-9007-4033-BE60-32B1C2F572DC-Manual",
  Empowerment_granted: "D87A3F87-9008-4033-BE60-32B1C2F572DC-Manual",
  Empowerment_not_granted: "D87A3F87-9009-4033-BE60-32B1C2F572DC-Manual",
  More_Information_Needed: "D87A3F87-9010-4033-BE60-32B1C2F572DC-Manual",
  Withdrawn: "D87A3F87-9011-4033-BE60-32B1C2F572DC-Manual",
  No_longer_required: "D87A3F87-9012-4033-BE60-32B1C2F572DC-Manual",
};

export const USER_ROLE = {
  superAdmin: "1",
  globalAdmin: "2",
  regionAdmin: "3",
  countryAdmin: "4",
  normalUser: "8",
  countrySuperAdmin: "9",
  auditor: "10",
  dualRole: "11",
  lobAdmin: "12",
  globalUW: "0"
};
export const SUPER_ADMIN_ROLE_ID = "1";
export const COUNTRY_ADMIN_ROLE_ID = "4";
export const HOW_DETECTED_TUR = "312FDA4E-5EC4-4540-B9EA-DE0A146F0E0C";

export const RFE_LOG_ORGALINMENT = {
  Global: "BF101521-5244-496B-AAC6-A50FDBDC92A4",
  Region: "VE202622-6211-500B-BBC7-B34KHANR92P5",
  Country: "A6B6A43F-574E-4E15-9EC2-49D080A16C45",
};
export const EXEMPTION_CONSTANT = {
  TypeExemption_Individual: "B1C499F6-E7B2-4E79-BF41-2AC00FDB5C09",
  TypeExemption_Portfolio: "7652D39F-48DB-447C-824E-F36F58F06463",
  FullTransitional_Transitional: "EF084F52-7CD4-48CC-80F4-0128AB9EB8AD",
  Full_Transitional: "203B34BD-2536-47E1-BCB5-BF1D18E361AB",
};
export const INCOUNTRY_FLAG = {
  INDONESIA: "ID001",
  UK: "UK001",
  LATAM: "LM001",
  SINGAPORE: "SG001",
  INDIA: "IN001",
  ITALY: "IT001",
  BENELUX: "BE001",
  NORDIC: "NR001",
  AUSTRALIA: "AU001",
  CHINA: "CN001",
  HONGKONG: "HK001",
  MALAYSIA: "MY001",
  FRANCE: "FR001",
  MIDDLEEAST: "ME001",
  SPAIN: "ES001",
  GERMANY: "DE001",
  UKZM: "UKZM001",
};
export const INCOUNTRY_FLAG_OPTS = {
  Indonesia: {
    label: "Indonesia",
    value: INCOUNTRY_FLAG.INDONESIA,
    id: INCOUNTRTY_IDS.INDONESIA,
  },
  UK: {
    label: "UK",
    value: INCOUNTRY_FLAG.UK,
    id: `${INCOUNTRTY_IDS.UK},${INCOUNTRTY_IDS.IRELANDFOS},${INCOUNTRTY_IDS.SPAINFOS}`,
  },
  LATAM: {
    label: "LATAM",
    value: INCOUNTRY_FLAG.LATAM,
    id: INCOUNTRTY_IDS.LATAM,
  },
  MALAYSIA: {
    label: "Malaysia",
    value: INCOUNTRY_FLAG.MALAYSIA,
    id: INCOUNTRTY_IDS.MALAYSIA,
  },
  SINGAPORE: {
    label: "Singapore",
    value: INCOUNTRY_FLAG.SINGAPORE,
    id: INCOUNTRTY_IDS.SINGAPORE,
  },
  INDIA: {
    label: "India",
    value: INCOUNTRY_FLAG.INDIA,
    id: INCOUNTRTY_IDS.INDIA,
  },
  ITALY: {
    label: "Italy",
    value: INCOUNTRY_FLAG.ITALY,
    id: INCOUNTRTY_IDS.ITALY,
  },
  AUSTRALIA: {
    label: "Australia",
    value: INCOUNTRY_FLAG.AUSTRALIA,
    id: INCOUNTRTY_IDS.AUSTRALIA,
  },
  BENELUX: {
    label: "Benelux",
    value: INCOUNTRY_FLAG.BENELUX,
    id: `${INCOUNTRTY_IDS.BENELUX},${INCOUNTRTY_IDS.BENELUXBELGIUM},${INCOUNTRTY_IDS.BENELUXLUXEMBOURG},${INCOUNTRTY_IDS.BENELUXNETHERLANDS}`,
  },
  NORDIC: {
    label: "Nordic",
    value: INCOUNTRY_FLAG.NORDIC,
    id: `${INCOUNTRTY_IDS.NORDIC},${INCOUNTRTY_IDS.NORDICDENMARK},${INCOUNTRTY_IDS.NORDICFINALAND},${INCOUNTRTY_IDS.NORDICSWEDEN}`,
  },
  CHINA: {
    label: "China",
    value: INCOUNTRY_FLAG.CHINA,
    id: INCOUNTRTY_IDS.CHINA,
  },
  HONGKONG: {
    label: "Hong Kong",
    value: INCOUNTRY_FLAG.HONGKONG,
    id: INCOUNTRTY_IDS.HONGKONG,
  },
  FRANCE: {
    label: "France",
    value: INCOUNTRY_FLAG.FRANCE,
    id: INCOUNTRTY_IDS.FRANCE,
  },
  MIDDLEEAST: {
    label: "Middle East",
    value: INCOUNTRY_FLAG.MIDDLEEAST,
    id: INCOUNTRTY_IDS.MIDDLEEAST,
  },
  SPAIN: {
    label: "Spain",
    value: INCOUNTRY_FLAG.SPAIN,
    id: INCOUNTRTY_IDS.SPAIN,
  },
  GERMANY: {
    label: "Germany",
    value: INCOUNTRY_FLAG.GERMANY,
    id: INCOUNTRTY_IDS.GERMANY,
  },
  UKZM: {
    label: "UKZM",
    value: INCOUNTRY_FLAG.UKZM,
    id: INCOUNTRTY_IDS.UKZM,
  },
};
export const SHAREPOINT_LINKS = {
  Breachlog:
    "https://zurichinsurance.sharepoint.com/sites/001288/Lists/GlobalBreachLog/DispForm.aspx",
  RFElogActive:
    "https://zurichinsurance.sharepoint.com/sites/grfel/Lists/GlobalRefLog20/DispForm.aspx",
  RFElogArchive:
    "https://zurichinsurance.sharepoint.com/sites/grfel/Lists/GlobalRefLog/DispForm.aspx",
  RFElogLATAMActive:
    "https://zurichinsurance.sharepoint.com/sites/001295/Lists/LatAM%20Request%20for%20Empowerment%20log/DispForm.aspx",
  RFEUKlogActive:
    "https://zurichinsurance.sharepoint.com/sites/001403/Lists/UK%20Commercial%20Insurance%20Referral%20Log%2020/DispForm.aspx",
  RFEARCUKlogActive:
    "https://zurichinsurance.sharepoint.com/sites/001403/Lists/UK%20Commercial%20Broker%20Referral%20Log/DispForm.aspx",
  RFENordiclogActive:
    "https://zurichinsurance.sharepoint.com/sites/001295/Lists/GC%20Nordic/DispForm.aspx",
  RFEItalylogActive:
    "https://zurichinsurance.sharepoint.com/sites/001295/Lists/Italy%20Request%20for%20Empowerment%20Log/DispForm.aspx",
  RFEGermanylogActive:
    "https://zurichinsurance.sharepoint.com/sites/001295/Lists/GC%20Germany/DispForm.aspx",
  RFEUKZMlogActive:
    "https://zurichinsurance.sharepoint.com/sites/001403/Lists/UK Zurich Municipal Referral Log 20/DispForm.aspx",
  ZUGlog:
    "https://zurichinsurance.sharepoint.com/sites/CIExemptionLog/Lists/CI%20Guideline%20Feedback%20and%20Exemption%20Log/DispForm.aspx",
  URPM: "https://zurichinsurance.sharepoint.com/sites/globuz20app/01/Lists/exlog/DispForm.aspx",
};
