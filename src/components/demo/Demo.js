import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getUrlParameter } from "../../helpers";
import { commonActions } from "../../actions";

function Demo(props) {
    const {
        demoAPI
    } = props;

    const [isLodaing, setIsLoading] = useState(false);

    useEffect(async () => {
        setIsLoading(true);
        if (getUrlParameter("CustId")) {
            const response = await demoAPI({ CustId: getUrlParameter("CustId") })
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
                    Please wait we processing your request....
                </>
            ) : (
                <>
                    Your request Approved
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
    demoAPI: commonActions.demoAPI
}
export default connect(mapStateToProp, mapActions)(Demo);
