export function handlePermission(page, name, userProfile) {
    const role = localStorage.getItem("Role")
    const Permission = {
        SuperAdmin: {
            Navbar: {
                regionmanage: true,
                usermanage: false,
                region: true,
                country: true,
                segment: true,
                loB: true,
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
                user: true,
                lookup: true,
                breachlogs: true,
                rfelogs: true,
                exemptionlogs: true
            }
        },
        GlobalAdmin: {
            Navbar: {
                regionmanage: false,
                usermanage: true,
                region: false,
                country: false,
                segment: false,
                loB: false,
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
                lookup: false,
                breachlogs: true,
                rfelogs: true,
                exemptionlogs: true
            }
        },
        RegionAdmin: {
            Navbar: {
                regionmanage: false,
                usermanage: true,
                region: false,
                country: false,
                segment: false,
                loB: false,
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
                lookup: false,
                breachlogs: true,
                rfelogs: true,
                exemptionlogs: true
            }
        },
        CountryAdmin: {
            Navbar: {
                regionmanage: false,
                usermanage: false,
                region: false,
                country: false,
                segment: false,
                loB: false,
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
                user: false,
                lookup: false,
                breachlogs: true,
                rfelogs: true,
                exemptionlogs: true
            }
        },
        NormalUser: {
            Navbar: {
                regionmanage: false,
                usermanage: false,
                region: false,
                country: false,
                segment: false,
                loB: false,
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
                user: false,
                lookup: false,
                breachlogs: true,
                rfelogs: true,
                exemptionlogs: true
            }
        },
        CountrySuperAdmin: {
            Navbar: {
                regionmanage: false,
                usermanage: true,
                region: false,
                country: false,
                segment: false,
                loB: false,
                sublob: false,
                lobchapter: false,
                token: false,
                znaorganization1: userProfile?.profileRegionName === "ZNA" ? true : false,
                znaorganization2: userProfile?.profileRegionName === "ZNA" ? true : false,
                znaorganization3: userProfile?.profileRegionName === "ZNA" ? true : false,
                znaorganization4: userProfile?.profileRegionName === "ZNA" ? true : false,
                office: userProfile?.profileRegionName === "LATAM" ? true : false,
                branch: userProfile?.profileRegionName === "LATAM" ? true : false,
                currency: userProfile?.profileRegionName === "LATAM" ? true : false,
                user: true,
                lookup: true,
                breachlogs: true,
                rfelogs: true,
                exemptionlogs: true
            }
        }
    }
    let response = false
    response = Permission[role][page][name]
    return response
}