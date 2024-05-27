import React from "react";
import "./Style.css";
import Popup from "../common-components/Popup";
function RfELinkedPopupDetails(props) {
    const {
        hidePopup,
        referenceRfEId,
    } = props;
    return (
        <Popup {...props}>
            <div className="popup-box versionhistory">
                <div className="popup-header-container">
                    <div className="popup-header-title">Reference RfE:- {`${referenceRfEId}`}</div>
                    <div className="popup-close" onClick={() => hidePopup()}>
                        X
                    </div>
                </div>
                <div className="popup-content">
                    <div className="versionhistory-container">

                        <div>
                            <div className="row">
                                <div className="col-md-3">
                                    {
                                        <FrmInputAutocomplete
                                            title={"Account Name"}
                                            titlelinespace={true}
                                            name={"AccountName"}
                                            type={"input"}
                                            handleChange={onSearchFilterInputAutocomplete}
                                            value={formfield.AccountName ? formfield.AccountName : ""}
                                            options={frmAccountOpts}
                                            isReadMode={isReadMode}
                                            isRequired={true}
                                            validationmsg={"Mandatory field"}
                                            issubmitted={issubmitted}
                                            isdisabled={isfrmdisabled}
                                        />
                                    }
                                </div>
                                <div className="col-md-3">
                                    <FrmSelect
                                        title={"Country"}
                                        titlelinespace={true}
                                        name={"CountryId"}
                                        value={formfield.CountryId}
                                        handleChange={handleSelectChange}
                                        isRequired={true}
                                        isReadMode={isReadMode}
                                        validationmsg={"Mandatory field"}
                                        issubmitted={issubmitted}
                                        selectopts={countryopts}
                                        isdisabled={isfrmdisabled}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <FrmSelect
                                        title={<>LoB</>}
                                        titlelinespace={true}
                                        name={"LOBId"}
                                        value={formfield.LOBId}
                                        handleChange={handleSelectChange}
                                        isRequired={true}
                                        isReadMode={isReadMode}
                                        validationmsg={"Mandatory field"}
                                        issubmitted={issubmitted}
                                        selectopts={frmLoB}
                                        isdisabled={isfrmdisabled}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <FrmSelect
                                        title={
                                            <>
                                                Request for empowerment<br></br>reason
                                            </>
                                        }
                                        name={"RequestForEmpowermentReason"}
                                        value={formfield.RequestForEmpowermentReason}
                                        handleChange={handleSelectChange}
                                        isRequired={true}
                                        isReadMode={isReadMode}
                                        validationmsg={"Mandatory field"}
                                        issubmitted={issubmitted}
                                        selectopts={frmrfeempourment}
                                        isdisabled={isfrmdisabled}
                                        isToolTip={true}
                                        tooltipmsg={tooltip["RequestForEmpowermentReason"]}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-3">
                                    <FrmInput
                                        title={
                                            <>
                                                Underwriter granting<br></br>empowerment
                                            </>
                                        }
                                        name={"UnderwriterGrantingEmpowermentName"}
                                        value={formfield.UnderwriterGrantingEmpowermentName}
                                        type={"text"}
                                        handleChange={handleChange}
                                        handleClick={(e) => handleshowpeoplepicker("approver", e)}
                                        isRequired={true}
                                        isReadMode={isReadMode}
                                        validationmsg={"Mandatory field"}
                                        issubmitted={issubmitted}
                                        isdisabled={isfrmdisabled}
                                    />
                                </div>
                                {IncountryFlag === IncountryFlagConst.LATAM &&
                                    frmBranchOpts.length ? (
                                    <div className="col-md-3">
                                        <FrmSelect
                                            title={"Branch"}
                                            titlelinespace={true}
                                            name={"Branch"}
                                            value={formfield.Branch}
                                            handleChange={handleSelectChange}
                                            isRequired={true}
                                            isReadMode={isReadMode}
                                            validationmsg={"Mandatory field"}
                                            issubmitted={issubmitted}
                                            selectopts={frmBranchOpts}
                                        />
                                    </div>
                                ) : (
                                    ""
                                )}
                                {frmselectedRegion === regions.latam &&
                                    formfield.UnderwriterGrantingEmpowermentName === "" ? (
                                    ""
                                ) : (
                                    <div className="col-md-3">
                                        <FrmRadio
                                            title={"Organizational alignment"}
                                            titlelinespace={true}
                                            name={"OrganizationalAlignment"}
                                            value={
                                                formfield.OrganizationalAlignment
                                                    ? formfield.OrganizationalAlignment
                                                    : OrganizationalAlignment.global
                                            }
                                            handleChange={handleChange}
                                            isRequired={true}
                                            isReadMode={isReadMode}
                                            validationmsg={"Mandatory field"}
                                            isToolTip={true}
                                            tooltipmsg={tooltip["OrgnizationalAlignment"]}
                                            issubmitted={issubmitted}
                                            selectopts={frmorgnizationalalignment}
                                            isdisabled={
                                                (isfrmdisabled && isshowlocallink) ||
                                                IncountryFlag === IncountryFlagConst.LATAM
                                            }
                                        />
                                    </div>
                                )}
                                {formfield.OrganizationalAlignment ===
                                    OrganizationalAlignment.country && !IncountryFlag ? (
                                    <div className="col-md-3 btn-blue" onClick={showlogPopup}>
                                        Local country log
                                    </div>
                                ) : (
                                    ""
                                )}
                                <div className="col-md-3">
                                    <FrmInput
                                        title={
                                            <>
                                                Underwriter<i>(submitter)</i>
                                            </>
                                        }
                                        titlelinespace={true}
                                        name={"UnderwriterName"}
                                        value={formfield.UnderwriterName}
                                        type={"text"}
                                        handleChange={handleChange}
                                        handleClick={(e) =>
                                            handleshowpeoplepicker("underwriter", e)
                                        }
                                        isReadMode={isReadMode}
                                        isRequired={true}
                                        isdisabled={isfrmdisabled}
                                        validationmsg={"Mandatory field"}
                                        issubmitted={issubmitted}
                                    />
                                </div>
                            </div>
                            <div className="row border-bottom">
                                <div className="col-md-12">
                                    <FrmRichTextEditor
                                        title={<>Specific Details</>}
                                        name={"RFELogDetails"}
                                        value={
                                            formfield.RFELogDetails
                                                ? formfield.RFELogDetails
                                                : formIntialState.RFELogDetails
                                        }
                                        handleChange={handleSelectChange}
                                        isRequired={true}
                                        isReadMode={isReadMode}
                                        validationmsg={"Mandatory field"}
                                        issubmitted={issubmitted}
                                        isdisabled={isfrmdisabled}
                                        isToolTip={true}
                                        tooltipmsg={tooltip["SpecificDetails"]}
                                    />
                                </div>
                            </div>
                        </div>
                        {IncountryFlag === IncountryFlagConst.LATAM ? (
                            <div className="frm-field-bggray">
                                <div className="row ">
                                    <div className="col-md-3">
                                        <FrmSelect
                                            title={"Customer Segment"}
                                            name={"CustomerSegment"}
                                            value={formfield.CustomerSegment}
                                            handleChange={handleSelectChange}
                                            isRequired={true}
                                            isReadMode={isReadMode}
                                            validationmsg={"Mandatory field"}
                                            issubmitted={issubmitted}
                                            selectopts={frmSegmentOpts}
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <FrmSelect
                                            title={"New/Renewal"}
                                            name={"NewRenewal"}
                                            value={formfield.NewRenewal}
                                            handleChange={handleSelectChange}
                                            isRequired={true}
                                            isReadMode={isReadMode}
                                            validationmsg={"Mandatory field"}
                                            issubmitted={issubmitted}
                                            selectopts={inCountryOptsLATAM.frmNewRenewalOpts}
                                        />
                                    </div>

                                    <div className="col-md-3">
                                        <FrmInput
                                            title={"Policy Period"}
                                            name={"PolicyPeriod"}
                                            value={formfield.PolicyPeriod}
                                            type={"text"}
                                            handleChange={handleChange}
                                            isReadMode={isReadMode}
                                            isRequired={false}
                                            validationmsg={"Mandatory field"}
                                            issubmitted={issubmitted}
                                            isdisabled={isfrmdisabled}
                                        />
                                    </div>
                                </div>
                                <div className="row border-bottom">
                                    <div className="col-md-3">
                                        <FrmSelect
                                            title={"Currency"}
                                            name={"Currency"}
                                            value={formfield.Currency}
                                            handleChange={handleSelectChange}
                                            isRequired={false}
                                            isReadMode={isReadMode}
                                            validationmsg={"Mandatory field"}
                                            issubmitted={issubmitted}
                                            selectopts={frmCurrencyOpts}
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <FrmInput
                                            title={"Limit"}
                                            name={"Limit"}
                                            value={formfield.Limit}
                                            type={"text"}
                                            handleChange={handleChange}
                                            isReadMode={isReadMode}
                                            isRequired={false}
                                            validationmsg={"Mandatory field"}
                                            issubmitted={issubmitted}
                                            isdisabled={isfrmdisabled}
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <FrmInput
                                            title={"GWP"}
                                            name={"GWP"}
                                            value={formfield.GWP}
                                            type={"text"}
                                            handleChange={handleChange}
                                            isReadMode={isReadMode}
                                            isRequired={true}
                                            validationmsg={"Mandatory field"}
                                            issubmitted={issubmitted}
                                            isdisabled={isfrmdisabled}
                                        />
                                    </div>

                                    <div className="col-md-3">
                                        <FrmInput
                                            title={"Zurich Share"}
                                            name={"ZurichShare"}
                                            value={formfield.ZurichShare}
                                            type={"text"}
                                            handleChange={handleChange}
                                            isReadMode={isReadMode}
                                            isRequired={false}
                                            validationmsg={"Mandatory field"}
                                            issubmitted={issubmitted}
                                            isdisabled={isfrmdisabled}
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            ""
                        )}
                        <div class="frm-container-bggray">
                            <div className="row">
                                <div className="col-md-3">
                                    <FrmSelect
                                        title={<>CHZ Sustainability Desk / CHZ GI Credit Risk</>}
                                        name={"CHZ"}
                                        value={formfield.CHZ}
                                        isReadMode={true}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <FrmInput
                                        title={"Request for empowerment CC"}
                                        name={"RequestForEmpowermentCCName"}
                                        value={formfield.RequestForEmpowermentCCName}
                                        type={"text"}
                                        isReadMode={true}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <FrmDatePicker
                                        title={"Decision Date"}
                                        name={"DecisionDate"}
                                        value={formfield.DecisionDate}
                                        type={"date"}
                                        isReadMode={true}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-3">
                                    <FrmSelect
                                        title={
                                            <>
                                                Request for empowerment<br></br>status
                                            </>
                                        }
                                        name={"RequestForEmpowermentStatus"}
                                        value={formfield.RequestForEmpowermentStatus}
                                        isReadMode={true}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <FrmSelect
                                        title={<>Condition Applicable To</>}
                                        titlelinespace={true}
                                        name={"ConditionApplicableTo"}
                                        value={formfield.ConditionApplicableTo}
                                        isReadMode={true}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <FrmSelect
                                        title={<>Duration of approval (in years)</>}
                                        name={"DurationofApproval"}
                                        value={formfield.DurationofApproval}
                                        isReadMode={true}
                                    />
                                </div>
                            </div>
                            <div className="row ">
                                <div className="col-md-12">
                                    <FrmRichTextEditor
                                        title={
                                            "Underwriter granting empowerment comments / condition"
                                        }
                                        name={"UnderwriterGrantingEmpowermentComments"}
                                        value={formfield.UnderwriterGrantingEmpowermentComments}
                                        isReadMode={true}
                                    />
                                </div>
                            </div>
                            <div className="row border-bottom">
                                <div className="col-md-3">
                                    <FrmDatePicker
                                        title={
                                            "Date of reception of information needed by approver"
                                        }
                                        name={"ReceptionInformationDate"}
                                        value={formfield.ReceptionInformationDate}
                                        type={"date"}
                                        isReadMode={true}
                                        minDate={""}
                                        maxDate={moment().toDate()}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <FrmDatePicker
                                        title={"Date of response"}
                                        titlelinespace={true}
                                        name={"ResponseDate"}
                                        value={formfield.ResponseDate}
                                        type={"date"}
                                        isReadMode={true}
                                        minDate={moment(
                                            formfield.ReceptionInformationDate
                                        ).toDate()}
                                        maxDate={moment().toDate()}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>

                            <b>No version history will be saved for the Draft.</b>
                        </div>
                    </div>
                </div>
            </div>
        </Popup>
    );
}

export default RfELinkedPopupDetails;
