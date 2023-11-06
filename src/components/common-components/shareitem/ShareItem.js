import React, { useState, useEffect } from "react";
import Popup from "../Popup";
import FrmInput from "../frminput/FrmInput";
import FrmTextArea from "../frmtextarea/FrmTextArea";
import PeoplePickerPopup from "../../breachlog/PeoplePickerPopup";
import { connect } from "react-redux";
import { commonActions } from "../../../actions";
import { alertMessage } from "../../../helpers";
function ShareItem(props) {
  const { title, hidePopup, itemDetails, shareLogEmail, logtype, userProfile } =
    props;
  const [formfield, setformfield] = useState({});
  const [mandatoryFields, setmandatoryFields] = useState(["shareToName"]);
  const [isfrmdisabled, setisfrmdisabled] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showToUsers, setshowToUsers] = useState(false);
  const [issubmitted, setissubmitted] = useState(false);
  useEffect(() => {
    fnOnInit();
  }, []);
  const fnOnInit = () => {
    setformfield({
      shareTo: "",
      shareToName: "",
      message: "",
      shareToAD: [],
      subject: "Share a log",
      link: itemDetails.link,
    });
  };
  const handleChange = (e) => {
    let { name, value } = e.target;
    setformfield({ ...formfield, isdirty: true, [name]: value });
  };
  const handleshowpeoplepicker = (usertype, e) => {
    e.target.blur();
    const position = window.pageYOffset;
    setScrollPosition(position);
    setshowToUsers(true);
  };
  const hidePeoplePickerPopup = () => {
    setshowToUsers(false);
    window.scrollTo({ top: scrollPosition, behavior: "smooth" });
  };
  const validateform = () => {
    let isvalidated = true;
    for (let key in formfield) {
      if (mandatoryFields.includes(key) && isvalidated) {
        let value = formfield[key];
        if (!value) {
          isvalidated = false;
        }
      }
    }
    return isvalidated;
  };
  const handleShareLog = async (e) => {
    setissubmitted(true);
    if (validateform) {
      let requestParam = {
        toEmailId: formfield.shareTo,
        subject: `${userProfile.firstName} ${userProfile.lastName} has shared ${logtype} Log`,
        description: `${formfield.message} <br/> Link: <a href='${formfield.link}'>${logtype} Log link</a>`,
      };
      const response = await shareLogEmail(requestParam);
      if (response) {
        alert(`The ${logtype} ${alertMessage.commonmsg.sharelog}`);
        setformfield({
          ...formfield,
          shareTo: "",
          shareToName: "",
          shareToAD: [],
          subject: `${userProfile.firstName} ${userProfile.lastName} has shared ${logtype} Log`,
        });
        setissubmitted(false);
        hidePopup();
      }
    }
  };
  const assignPeoplepikerUser = (name, value, usertype) => {
    let displayname = [];
    let email = [];
    value.forEach((item) => {
      displayname.push(item.firstName + " " + item.lastName);
      email.push(item["emailAddress"]);
    });
    let namefield = "";
    let adfield = "";
    let selvalue = value;

    if (usertype === "touser") {
      namefield = "shareToName";
      adfield = "shareToAD";
    }

    setformfield({
      ...formfield,
      isdirty: true,
      [name]: email.join(","),
      [namefield]: displayname.join(","),
      [adfield]: selvalue,
    });
  };
  return (
    <Popup {...props}>
      <div
        className="popup-box medium"
        style={{
          position: "relative",
          left: "0",
          margin: "0 auto",
          top: "100px",
        }}
      >
        <div className="popup-header-container">
          <div className="popup-header-title">{title}</div>
          <div className="popup-close" onClick={() => hidePopup()}>
            X
          </div>
        </div>

        <div className="popup-content">
          <div className="row">
            <div className="col-md-12">
              <FrmInput
                title={"To"}
                name={"shareToName"}
                value={formfield.shareToName}
                type={"text"}
                handleChange={handleChange}
                handleClick={(e) => handleshowpeoplepicker("ccuser", e)}
                isRequired={true}
                validationmsg={"Mandatory field"}
                issubmitted={issubmitted}
              />
            </div>
            {/* <div className="col-md-12">
              <FrmInput
                title={"Subject"}
                name={"subject"}
                value={formfield.subject}
                type={"text"}
                handleChange={handleChange}
                isRequired={false}
                validationmsg={"Mandatory field"}
              />
      </div>*/}
            <div className="col-md-12">
              <FrmTextArea
                title={"Message"}
                name={"message"}
                value={formfield.message}
                handleChange={handleChange}
                isRequired={false}
                isReadMode={false}
                validationmsg={""}
              />
            </div>
            <div className="col-md-12">
              <FrmInput
                title={"Link"}
                name={"link"}
                value={formfield.link}
                handleChange={handleChange}
                isRequired={false}
                isReadMode={false}
                validationmsg={""}
                isdisabled={true}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div
                className="btn-container"
                style={{ justifyContent: "flex-end" }}
              >
                <button
                  className={`btn-blue ${isfrmdisabled && "disable"}`}
                  onClick={handleShareLog}
                >
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showToUsers ? (
        <PeoplePickerPopup
          title={"Share log"}
          name={"shareTo"}
          usertype="touser"
          actionResponsible={formfield.shareTo ? [...formfield.shareToAD] : []}
          assignPeoplepikerUser={assignPeoplepikerUser}
          hideAddPopup={hidePeoplePickerPopup}
        />
      ) : (
        ""
      )}
    </Popup>
  );
}
const mapActions = {
  shareLogEmail: commonActions.shareLogEmail,
};
export default connect(null, mapActions)(ShareItem);
