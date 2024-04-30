export function handlePermission(page, name) {
    const role = localStorage.getItem("Role")
    const profileData = localStorage.getItem("UserProfile")
    const userProfile = JSON.parse(profileData)
    const Permission = {
        SuperAdmin: {
            Navbar: {
                "": true,
                regionmanage: true,
                usermanage: false,
                region: true,
                country: true,
                segment: true,
                lob: true,
                sublob: true,
                lobchapter: true,
                token: true,
                znaorganization1: true,
                znaorganization2: true,
                znaorganization3: true,
                znaorganization4: true,
                office: true,
                branch: true,
                currency: true,
                co: true,
                userview: true,
                user: true,
                lookup: true,
                breachlogs: true,
                rfelogs: true,
                exemptionlogs: true
            },
            region: {
                isAdd: true,
                isEdit: true,
                isDelete: true
            },
            country: {
                isAdd: true,
                isEdit: true,
                isDelete: true
            },
            segment: {
                isAdd: true,
                isEdit: true,
                isDelete: true
            },
            lob: {
                isAdd: true,
                isEdit: true,
                isDelete: true
            },
            sublob: {
                isAdd: true,
                isEdit: true,
                isDelete: true
            },
            lobchapter: {
                isAdd: true,
                isEdit: true,
                isDelete: true
            },
            token: {
                isAdd: true,
                isEdit: true,
                isDelete: true
            },
            znaorganization1: {
                isAdd: true,
                isEdit: true,
                isDelete: true
            },
            znaorganization2: {
                isAdd: true,
                isEdit: true,
                isDelete: true
            },
            znaorganization3: {
                isAdd: true,
                isEdit: true,
                isDelete: true
            },
            znaorganization4: {
                isAdd: true,
                isEdit: true,
                isDelete: true
            },
            office: {
                isAdd: true,
                isEdit: true,
                isDelete: true
            },
            branch: {
                isAdd: true,
                isEdit: true,
                isDelete: true
            },
            currency: {
                isAdd: true,
                isEdit: true,
                isDelete: true
            },
            co: {
                isAdd: true,
                isEdit: true,
                isDelete: true
            },
            userview: {
                isAdd: true,
                isEdit: true,
                isDelete: true
            },
            user: {
                isAdd: true,
                isEdit: true,
                isDelete: true
            },
            lookup: {
                isAdd: true,
                isEdit: true,
                isDelete: true
            },
            breachlogs: {
                isAdd: true,
                isEdit: true,
                isExport: true,
                isImport: true,
                isDelete: true
            },
            rfelogs: {
                isAdd: true,
                isEdit: true,
                isExport: true,
                isImport: true,
                isDelete: true
            },
            exemptionlogs: {
                isAdd: true,
                isEdit: true,
                isExport: true,
                isImport: true,
                isDelete: true
            }
        },
        GlobalAdmin: {
            Navbar: {
                "": true,
                regionmanage: false,
                usermanage: true,
                region: false,
                country: false,
                segment: false,
                lob: false,
                sublob: false,
                lobchapter: false,
                token: false,
                znaorganization1: false,
                znaorganization2: false,
                znaorganization3: false,
                znaorganization4: false,
                office: false,
                branch: false,
                currency: false,
                co: false,
                userview: false,
                user: true,
                lookup: false,
                breachlogs: true,
                rfelogs: true,
                exemptionlogs: true
            },
            user: {
                isAdd: true,
                isEdit: true,
                isDelete: true
            },
            breachlogs: {
                isAdd: true,
                isEdit: true,
                isExport: true,
                isImport: true,
                isDelete: userProfile?.isAccessDeleteLog === true ? true : false
            },
            rfelogs: {
                isAdd: true,
                isEdit: true,
                isExport: true,
                isImport: true,
                isDelete: userProfile?.isAccessDeleteLog === true ? true : false
            },
            exemptionlogs: {
                isAdd: true,
                isEdit: true,
                isExport: true,
                isImport: true,
                isDelete: userProfile?.isAccessDeleteLog === true ? true : false
            }
        },
        RegionAdmin: {
            Navbar: {
                "": true,
                regionmanage: false,
                usermanage: true,
                region: false,
                country: false,
                segment: false,
                lob: false,
                sublob: false,
                lobchapter: false,
                token: false,
                znaorganization1: false,
                znaorganization2: false,
                znaorganization3: false,
                znaorganization4: false,
                office: false,
                branch: false,
                currency: false,
                user: true,
                co: false,
                userview: false,
                lookup: false,
                breachlogs: true,
                rfelogs: true,
                exemptionlogs: true
            },
            user: {
                isAdd: true,
                isEdit: true,
                isDelete: true
            },
            breachlogs: {
                isAdd: true,
                isEdit: true,
                isExport: true,
                isImport: true,
                isDelete: userProfile?.isAccessDeleteLog === true ? true : false
            },
            rfelogs: {
                isAdd: true,
                isEdit: true,
                isExport: true,
                isImport: true,
                isDelete: userProfile?.isAccessDeleteLog === true ? true : false
            },
            exemptionlogs: {
                isAdd: true,
                isEdit: true,
                isExport: true,
                isImport: true,
                isDelete: userProfile?.isAccessDeleteLog === true ? true : false
            }
        },
        CountryAdmin: {
            Navbar: {
                "": true,
                regionmanage: false,
                usermanage: false,
                region: false,
                country: false,
                segment: false,
                lob: false,
                sublob: false,
                lobchapter: false,
                token: false,
                znaorganization1: false,
                znaorganization2: false,
                znaorganization3: false,
                znaorganization4: false,
                office: false,
                branch: false,
                currency: false,
                co: false,
                userview: false,
                user: false,
                lookup: false,
                breachlogs: true,
                rfelogs: true,
                exemptionlogs: true
            },
            breachlogs: {
                isAdd: true,
                isEdit: true,
                isExport: true,
                isImport: true,
                isDelete: userProfile?.isAccessDeleteLog === true ? true : false
            },
            rfelogs: {
                isAdd: true,
                isEdit: true,
                isExport: true,
                isImport: true,
                isDelete: userProfile?.isAccessDeleteLog === true ? true : false
            },
            exemptionlogs: {
                isAdd: true,
                isEdit: true,
                isExport: true,
                isImport: true,
                isDelete: userProfile?.isAccessDeleteLog === true ? true : false
            }
        },
        NormalUser: {
            Navbar: {
                "": true,
                regionmanage: false,
                usermanage: false,
                region: false,
                country: false,
                segment: false,
                lob: false,
                sublob: false,
                lobchapter: false,
                token: false,
                znaorganization1: false,
                znaorganization2: false,
                znaorganization3: false,
                znaorganization4: false,
                office: false,
                branch: false,
                currency: false,
                co: false,
                userview: false,
                user: false,
                lookup: false,
                breachlogs: true,
                rfelogs: true,
                exemptionlogs: true
            },
            breachlogs: {
                isAdd: true,
                isEdit: true,
                isExport: true,
                isImport: true,
                isDelete: userProfile?.isAccessDeleteLog === true ? true : false
            },
            rfelogs: {
                isAdd: true,
                isEdit: true,
                isExport: true,
                isImport: true,
                isDelete: userProfile?.isAccessDeleteLog === true ? true : false
            },
            exemptionlogs: {
                isAdd: true,
                isEdit: true,
                isExport: true,
                isImport: true,
                isDelete: userProfile?.isAccessDeleteLog === true ? true : false
            }
        },
        CountrySuperAdmin: {
            Navbar: {
                "": true,
                regionmanage: false,
                usermanage: false,
                lookupmanage: true,
                region: false,
                country: false,
                segment: false,
                lob: false,
                sublob: false,
                lobchapter: false,
                token: false,
                znaorganization1: userProfile?.isZNACountrySuperAdmin === true ? true : false,
                znaorganization2: userProfile?.isZNACountrySuperAdmin === true ? true : false,
                znaorganization3: userProfile?.isZNACountrySuperAdmin === true ? true : false,
                znaorganization4: userProfile?.isZNACountrySuperAdmin === true ? true : false,
                office: userProfile?.isLATAMCountrySuperAdmin === true ? true : false,
                branch: userProfile?.isLATAMCountrySuperAdmin === true ? true : false,
                currency: userProfile?.isLATAMCountrySuperAdmin === true ? true : false,
                co: false,
                userview: true,
                user: true,
                lookup: true,
                breachlogs: true,
                rfelogs: true,
                exemptionlogs: true
            },
            znaorganization1: {
                isAdd: true,
                isEdit: true,
                isDelete: true
            },
            znaorganization2: {
                isAdd: true,
                isEdit: true,
                isDelete: true
            },
            znaorganization3: {
                isAdd: true,
                isEdit: true,
                isDelete: true
            },
            znaorganization4: {
                isAdd: true,
                isEdit: true,
                isDelete: true
            },
            office: {
                isAdd: true,
                isEdit: true,
                isDelete: true
            },
            branch: {
                isAdd: true,
                isEdit: true,
                isDelete: true
            },
            currency: {
                isAdd: true,
                isEdit: true,
                isDelete: true
            },
            userview: {
                isAdd: true,
                isEdit: true,
                isDelete: true
            },
            user: {
                isAdd: true,
                isEdit: true,
                isDelete: true
            },
            lookup: {
                isAdd: true,
                isEdit: true,
                isDelete: true
            },
            breachlogs: {
                isAdd: true,
                isEdit: true,
                isExport: true,
                isImport: true,
                isDelete: userProfile?.isAccessDeleteLog === true ? true : false
            },
            rfelogs: {
                isAdd: true,
                isEdit: true,
                isExport: true,
                isImport: true,
                isDelete: userProfile?.isAccessDeleteLog === true ? true : false
            },
            exemptionlogs: {
                isAdd: true,
                isEdit: true,
                isExport: true,
                isImport: true,
                isDelete: userProfile?.isAccessDeleteLog === true ? true : false
            }
        },
        Auditor: {
            Navbar: {
                "": true,
                regionmanage: true,
                usermanage: false,
                region: true,
                country: true,
                segment: true,
                lob: true,
                sublob: true,
                lobchapter: true,
                token: true,
                znaorganization1: true,
                znaorganization2: true,
                znaorganization3: true,
                znaorganization4: true,
                office: true,
                branch: true,
                currency: true,
                co: true,
                userview: true,
                user: true,
                lookup: true,
                breachlogs: true,
                rfelogs: true,
                exemptionlogs: true
            },
            region: {
                isAdd: false,
                isEdit: false,
                isDelete: false
            },
            country: {
                isAdd: false,
                isEdit: false,
                isDelete: false
            },
            segment: {
                isAdd: false,
                isEdit: false,
                isDelete: false
            },
            lob: {
                isAdd: false,
                isEdit: false,
                isDelete: false
            },
            sublob: {
                isAdd: false,
                isEdit: false,
                isDelete: false
            },
            lobchapter: {
                isAdd: false,
                isEdit: false,
                isDelete: false
            },
            token: {
                isAdd: false,
                isEdit: false,
                isDelete: false
            },
            znaorganization1: {
                isAdd: false,
                isEdit: false,
                isDelete: false
            },
            znaorganization2: {
                isAdd: false,
                isEdit: false,
                isDelete: false
            },
            znaorganization3: {
                isAdd: false,
                isEdit: false,
                isDelete: false
            },
            znaorganization4: {
                isAdd: false,
                isEdit: false,
                isDelete: false
            },
            office: {
                isAdd: false,
                isEdit: false,
                isDelete: false
            },
            branch: {
                isAdd: false,
                isEdit: false,
                isDelete: false
            },
            currency: {
                isAdd: false,
                isEdit: false,
                isDelete: false
            },
            co: {
                isAdd: false,
                isEdit: false,
                isDelete: false
            },
            userview: {
                isAdd: true,
                isEdit: true,
                isDelete: true
            },
            user: {
                isAdd: false,
                isEdit: false,
                isDelete: false
            },
            lookup: {
                isAdd: false,
                isEdit: false,
                isDelete: false
            },
            breachlogs: {
                isAdd: false,
                isEdit: false,
                isExport: false,
                isImport: false,
                isDelete: false
            },
            rfelogs: {
                isAdd: false,
                isEdit: false,
                isExport: false,
                isImport: false,
                isDelete: false
            },
            exemptionlogs: {
                isAdd: false,
                isEdit: false,
                isExport: false,
                isImport: false,
                isDelete: false
            }
        },
        LoBAdmin: {
            Navbar: {
                "": true,
                regionmanage: false,
                usermanage: false,
                region: false,
                country: false,
                segment: false,
                lob: false,
                sublob: false,
                lobchapter: false,
                token: false,
                znaorganization1: false,
                znaorganization2: false,
                znaorganization3: false,
                znaorganization4: false,
                office: false,
                branch: false,
                currency: false,
                co: false,
                userview: false,
                user: false,
                lookup: false,
                breachlogs: true,
                rfelogs: true,
                exemptionlogs: true
            },
            breachlogs: {
                isAdd: true,
                isEdit: true,
                isExport: true,
                isImport: true,
                isDelete: userProfile?.isAccessDeleteLog === true ? true : false
            },
            rfelogs: {
                isAdd: true,
                isEdit: true,
                isExport: true,
                isImport: true,
                isDelete: userProfile?.isAccessDeleteLog === true ? true : false
            },
            exemptionlogs: {
                isAdd: true,
                isEdit: true,
                isExport: true,
                isImport: true,
                isDelete: userProfile?.isAccessDeleteLog === true ? true : false
            }
        },
        DualRole: {
            Navbar: {
                "": true,
                regionmanage: false,
                usermanage: false,
                region: false,
                country: false,
                segment: false,
                lob: false,
                sublob: false,
                lobchapter: false,
                token: false,
                znaorganization1: false,
                znaorganization2: false,
                znaorganization3: false,
                znaorganization4: false,
                office: false,
                branch: false,
                currency: false,
                co: false,
                userview: false,
                user: false,
                lookup: false,
                breachlogs: true,
                rfelogs: true,
                exemptionlogs: true
            },
            breachlogs: {
                isAdd: true,
                isEdit: true,
                isExport: true,
                isImport: true,
                isDelete: userProfile?.isAccessDeleteLog === true ? true : false
            },
            rfelogs: {
                isAdd: true,
                isEdit: true,
                isExport: true,
                isImport: true,
                isDelete: userProfile?.isAccessDeleteLog === true ? true : false
            },
            exemptionlogs: {
                isAdd: true,
                isEdit: true,
                isExport: true,
                isImport: true,
                isDelete: userProfile?.isAccessDeleteLog === true ? true : false
            }
        },
    }
    let response = false
    response = Permission?.[role]?.[page]?.[name]
    return response
}