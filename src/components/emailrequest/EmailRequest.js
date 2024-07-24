import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getUrlParameter } from "../../helpers";
import { commonActions } from "../../actions";

function EmailRequest(props) {
    const {
        EmailRequestAPI
    } = props;

    const [isLodaing, setIsLoading] = useState(false);
    const [responseMsg, setResponseMsg] = useState('')

    useEffect(async () => {
        setIsLoading(true);
        if (getUrlParameter("rfelog")) {
            const response = await EmailRequestAPI({ 
                RFELogId: getUrlParameter("rfelog"), 
                RequestForEmpowermentStatus: getUrlParameter("status")
            })
            setResponseMsg(response)
            if (response) {
                setTimeout(() => {
                    setIsLoading(false);
                    setTimeout(() => {
                        window.close()
                    }, 3000);
                }, 2000);
            }
        }
    }, [])
    return (
        <div className="unauthorized-message">
            {isLodaing ? (
                <>
                    Please wait we are processing your request....
                </>
            ) : (
                <>
                    {responseMsg}
                </>
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
    EmailRequestAPI: commonActions.EmailRequestAPI
}
export default connect(mapStateToProp, mapActions)(EmailRequest);
