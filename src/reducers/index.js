import { combineReducers } from "redux";
import { appmenuReducer as appmenu } from "./appmenu.reducer";
import { regionReducer as regionState } from "./region.reducer";
import { loginuserReducer as loginState } from "./loginuser.reducer";
import { countryReducer as countryState } from "./country.reducer";
import { segmentReducer as segmentState } from "./segment.reducer";
import { lobReducer as lobState } from "./lob.reducer";
import { sublobReducer as sublobState } from "./sublob.reducer";
import { lobchapterReducer as lobchapterState } from "./lobchapter.reducer";
import { lookupReducer as lookupState } from "./lookup.reducer";
import { userReducer as userState } from "./user.reducer";
import { znaorgnization1Reducer as znaorgnization1State } from "./znaorgnization1.reducer";
import { znaorgnization2Reducer as znaorgnization2State } from "./znaorgnization2.reducer";
import { znaorgnization3Reducer as znaorgnization3State } from "./znaorgnization3.reducer";
import { znaorgnization4Reducer as znaorgnization4State } from "./znaorgnization4.reducer";
import { breachlogReducer as breachlogState } from "./breachlog.reducer";
import { rfelogReducer as rfelogState } from "./rfelog.reducer";
import { exemptionlogReducer as exemptionlogState } from "./exemptionlog.reducer";
import { userprofileReducer as userprofileState } from "./userprofile.reducer";
import { officeReducer as officeState } from "./office.reducer";
import { dashboardReducer as dashboardState } from "./dashboard.reducer";
import { branchReducer as branchState } from "./branch.reducer";
import { currencyReducer as currencyState } from "./currency.reducer";
const rootReducer = combineReducers({
  appmenu,
  userprofileState,
  regionState,
  loginState,
  countryState,
  segmentState,
  lobState,
  sublobState,
  lobchapterState,
  userState,
  znaorgnization1State,
  znaorgnization2State,
  znaorgnization3State,
  znaorgnization4State,
  officeState,
  lookupState,
  breachlogState,
  rfelogState,
  exemptionlogState,
  dashboardState,
  branchState,
  currencyState,
});
export default rootReducer;
