import React, { useState, useEffect, useRef } from "react";
import FrmInput from "../../common-components/frminput/FrmInput";
import FrmSelect from "../../common-components/frmselect/FrmSelect";
import FrmTextArea from "../../common-components/frmtextarea/FrmTextArea";
import FrmMultiselect from "../../common-components/frmmultiselect/FrmMultiselect";
import Popup from "../../common-components/Popup";
import { connect } from "react-redux";
import FrmInputSearch from "../../common-components/frmpeoplepicker/FrmInputSearch";
import { userActions } from "../../../actions";
import FrmRadio from "../../common-components/frmradio/FrmRadio";
import FrmCheckbox from "../../common-components/frmcheckbox/FrmCheckbox";
import { dynamicSort } from "../../../helpers";

function AddEditForm(props) {
  const {
    title,
    hideAddPopup,
    postItem,
    putItem,
    isEditMode,
    formIntialState,
    frmCountrySelectOpts,
    frmRegionSelectOpts,
    frmuserType,
    frmuserTypeObj,
    countrymapping,
    userState,
    getAllUsers,
    userroles,
  } = props;

  const [regionopts, setregionopts] = useState([]);
  const [countryopts, setcountryopts] = useState([]);
  const [formfield, setformfield] = useState(formIntialState);
  const [issubmitted, setissubmitted] = useState(false);

  const [isdisabled, setisdisabled] = useState(false);

  const [accessBreachLogOpts, setaccessBreachLogOpts] = useState([
    {
      label: "",
      value: true,
    },
  ]);
  const [isSuperAdminOpts, setisSuperAdminOpts] = useState([
    {
      label: "",
      value: true,
    },
  ]);
  const bottomRef = useRef(null);
  useEffect(() => {
    fnOnInit();
  }, []);

  const fnOnInit = () => {
    let tempopts = [];
    let selectedlist = formIntialState.regionList;
    frmRegionSelectOpts.forEach((item) => {
      if (isEditMode) {
        let isselected = false;
        selectedlist.forEach((region) => {
          if (item.regionID === region.value) {
            isselected = true;
          }
        });
        if (item.isActive || isselected) {
          tempopts.push(item);
        }
      } else if (item.isActive) {
        tempopts.push(item);
      }
    });
    setregionopts(tempopts);
    tempopts = [];
    selectedlist = formIntialState.countryList;
    frmCountrySelectOpts.forEach((item) => {
      if (isEditMode) {
        let isselected = false;
        selectedlist.forEach((country) => {
          if (item.countryID === country.value) {
            isselected = true;
          }
        });
        if (item.isActive || isselected) {
          tempopts.push(item);
        }
      } else if (item.isActive) {
        tempopts.push(item);
      }
    });
    setcountryopts(tempopts);
    setformfield(formIntialState);
  };
  const handleChange = (e) => {
    let { name, value } = e.target;
    if (e.target.type === "checkbox") {
      value = e.target.checked;
    }

    if (
      name === "isSuperAdmin" ||
      (name === "userType" &&
        (frmuserTypeObj[value] === "Region" ||
          frmuserTypeObj[value] === "Global"))
    ) {
      setformfield((prevstate) => ({
        ...prevstate,
        [name]: value,
        isAccessDeleteLog: true,
      }));
    } else {
      setformfield((prevstate) => ({ ...prevstate, [name]: value }));
    }
  };
  const handleMultiSelectChange = (name, value) => {
    //const tempval = value.map((item) => item.value);
    setformfield({ ...formfield, [name]: value });
  };
  /*useEffect(() => {
    if (
      formfield.isSuperAdmin ||
      frmuserTypeObj[formfield.userType] === "Global" ||
      frmuserTypeObj[formfield.userType] === "Region"
    ) {

      setformfield((prevstate) => ({
        ...prevstate,
        isAccessDeleteLog: true,
      }));
    }
  }, [formfield.isSuperAdmin, formfield.userType]);*/

  useEffect(() => {
    if (formfield.isSuperAdmin) {
      setformfield({
        ...formfield,
        regionList: [],
        countryList: [],
        userType: "Super Admin",
        isAccessBreachLog: false,
        isAccessDeleteLog: true,
      });
      setisdisabled(true);
    } else {
      setformfield((prevstate) => ({
        ...prevstate,
        isAccessDeleteLog: false,
      }));
      setisdisabled(false);
    }
  }, [formfield.isSuperAdmin]);
  useEffect(() => {
    if (formfield.isGeneralUser) {
      setformfield({
        ...formfield,
        regionList: [],
        countryList: [],
        userType: "",
        isAccessBreachLog: false,
        isGeneralUser: true,
        isAccessDeleteLog: true,
      });
    } else {
      setformfield({
        ...formfield,
        regionList: [],
        countryList: [],
        userType: "",
        isAccessBreachLog: false,
        isGeneralUser: false,
        isAccessDeleteLog: false,
      });
    }
  }, [formfield.isGeneralUser]);

  useEffect(() => {
    const selectedrole = frmuserType.filter(
      (item) => item.value === formfield.userType
    );
    if (frmuserTypeObj[formfield.userType] === "Global") {
      setformfield({ ...formfield, regionList: [] });
    }
    if (frmuserTypeObj[formfield.userType] === "Region") {
      setformfield({ ...formfield, countryList: [] });
    }
  }, [formfield.userType]);
  useEffect(() => {
    mapCountryRegion();
  }, [formfield.regionList]);

  const mapCountryRegion = () => {
    if (!formfield.regionList) {
      return;
    }
    let tempmapObj = countrymapping.filter((item) => {
      for (let i = 0; i < formfield.regionList.length; i++) {
        let selectedRegion = formfield.regionList[i];
        if (item.region === selectedRegion.value) {
          return true;
        }
      }
    });
    let countryopts = [];
    let selectedlist = formIntialState.countryList;
    if (tempmapObj.length) {
      for (let i = 0; i < tempmapObj.length; i++) {
        tempmapObj[i].country.forEach((item) => {
          let isfound = false;
          selectedlist.forEach((country) => {
            if (item.countryID === country.value) {
              isfound = true;
            }
          });
          if (isEditMode) {
            if (item.isActive || isfound) {
              countryopts.push({ label: item.label, value: item.value });
            }
          } else if (item.isActive) {
            countryopts.push({ label: item.label, value: item.value });
          }
        });
      }
    }
    let selExistsCountry = formfield.countryList.filter((selcountry) => {
      let isexist = false;
      for (let i = 0; i < countryopts.length; i++) {
        let countryitem = countryopts[i];
        if (selcountry.value === countryitem.value) {
          isexist = true;
          break;
        }
      }
      return isexist;
    });
    countryopts.sort(dynamicSort("label"));
    setcountryopts([...countryopts]);
    setformfield({ ...formfield, countryList: [...selExistsCountry] });
  };
  const handleApproverChange = (name, value) => {
    setformfield({ ...formfield, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setissubmitted(true);
    if (
      formfield.user.length &&
      (formfield.userType !== "" || formfield.isGeneralUser)
    ) {
      const selectedrole = frmuserType.filter(
        (item) => item.value === formfield.userType
      );
      if (
        frmuserTypeObj[formfield.userType] === "Region" &&
        !formfield.regionList.length
      ) {
        return;
      }
      if (
        frmuserTypeObj[formfield.userType] === "Country" &&
        !formfield.regionList.length &&
        !formfield.countryList.length
      ) {
        return;
      }
      if (isEditMode) {
        putItem(formfield);
      } else {
        postItem(formfield);
      }
    }
  };
  const handleInputSearchChange = (e) => {
    const searchval = e.target.value ? e.target.value : "#$%";
    getAllUsers({ UserName: searchval });
  };
  const handleCountryClick = () => {
    // bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    //var objDiv = document.getElementById("your_div");
    if (bottomRef.current) {
      bottomRef.current.scrollTo({
        top: bottomRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };
  return (
    <Popup {...props}>
      <div className="popup-box">
        <div className="popup-header-container">
          <div className="popup-header-title">{title}</div>
          <div className="popup-close" onClick={() => hideAddPopup()}>
            X
          </div>
        </div>

        <div
          id="your_div"
          ref={bottomRef}
          className="popup-formitems user-formitems"
        >
          <form onSubmit={handleSubmit} id="myForm">
            <>
              <FrmInputSearch
                title={"Search User"}
                name={"user"}
                value={formfield.user}
                type={"text"}
                handleChange={handleApproverChange}
                singleSelection={true}
                isRequired={true}
                isEditMode={isEditMode}
                validationmsg={"Mandatory field"}
                issubmitted={issubmitted}
                handleInputSearchChange={handleInputSearchChange}
                searchItems={userState.userItems ? userState.userItems : []}
              />
              <div className="frm-checkbox-container">
                {userroles.issuperadmin && (
                  <FrmCheckbox
                    title={"Super Admin"}
                    name={"isSuperAdmin"}
                    value={formfield.isSuperAdmin}
                    handleChange={handleChange}
                    isRequired={false}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                    selectopts={accessBreachLogOpts}
                    isdisabled={formfield.isGeneralUser}
                  />
                )}

                <FrmCheckbox
                  title={"Can Access Breach Log"}
                  name={"isAccessBreachLog"}
                  value={formfield.isAccessBreachLog}
                  handleChange={handleChange}
                  isRequired={false}
                  validationmsg={"Mandatory field"}
                  issubmitted={issubmitted}
                  selectopts={accessBreachLogOpts}
                  isdisabled={isdisabled || formfield.isGeneralUser}
                />
              </div>
              <div className="frm-checkbox-container">
                <FrmCheckbox
                  title={"Normal User"}
                  name={"isGeneralUser"}
                  value={formfield.isGeneralUser}
                  handleChange={handleChange}
                  isRequired={false}
                  validationmsg={"Mandatory field"}
                  issubmitted={issubmitted}
                  selectopts={accessBreachLogOpts}
                  isdisabled={isdisabled}
                />
                <FrmCheckbox
                  title={"Can Delete Log"}
                  name={"isAccessDeleteLog"}
                  value={formfield.isAccessDeleteLog}
                  handleChange={handleChange}
                  isRequired={false}
                  validationmsg={"Mandatory field"}
                  issubmitted={issubmitted}
                  selectopts={accessBreachLogOpts}
                  isdisabled={
                    isdisabled ||
                    frmuserTypeObj[formfield.userType] === "Global" ||
                    frmuserTypeObj[formfield.userType] === "Region"
                  }
                />
              </div>
              <FrmRadio
                title={"Special User"}
                name={"userType"}
                value={formfield.userType}
                handleChange={handleChange}
                isRequired={formfield.isGeneralUser ? false : true}
                validationmsg={"Mandatory field"}
                issubmitted={issubmitted}
                selectopts={frmuserType}
                isdisabled={isdisabled || formfield.isGeneralUser}
                isSidebySide={true}
              />
              {frmuserTypeObj[formfield.userType] === "Region" ||
              frmuserTypeObj[formfield.userType] === "Country" ? (
                <FrmMultiselect
                  title={"Region"}
                  name={"regionList"}
                  value={formfield.regionList ? formfield.regionList : []}
                  handleChange={handleMultiSelectChange}
                  isRequired={true}
                  validationmsg={"Mandatory field"}
                  issubmitted={issubmitted}
                  selectopts={regionopts}
                />
              ) : (
                ""
              )}
              {frmuserTypeObj[formfield.userType] === "Country" ||
              frmuserTypeObj[formfield.userType] === "CountrySuperAdmin" ? (
                <div onClick={handleCountryClick}>
                  <FrmMultiselect
                    title={"Country"}
                    name={"countryList"}
                    value={formfield.countryList ? formfield.countryList : []}
                    handleChange={handleMultiSelectChange}
                    isRequired={true}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                    selectopts={countryopts}
                  />
                </div>
              ) : (
                ""
              )}
            </>
          </form>
        </div>
        <div className="popup-footer-container">
          <div className="btn-container">
            <button className="btn-blue" type="submit" form="myForm">
              {isEditMode ? "Apply" : "Submit"}
            </button>
            <div className="btn-blue" onClick={() => hideAddPopup()}>
              Cancel
            </div>
          </div>
        </div>
      </div>
    </Popup>
  );
}
const mapStateToProp = (state) => {
  return {
    userState: state.userState,
  };
};
const mapActions = {
  getAllUsers: userActions.getAllUsers,
};
export default connect(mapStateToProp, mapActions)(AddEditForm);
