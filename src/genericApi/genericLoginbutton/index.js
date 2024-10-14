import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';

const GenericLoginButton = () => {
    const { authState, oktaAuth } = useOktaAuth();
    const history = useHistory();

    useEffect(() => {
        sessionStorage.removeItem('path')
    },[])

    const handleClick = async () => {        
        if (authState.isAuthenticated) {
            history.push('/generic/dashboard');
        } else {
            oktaAuth.signInWithRedirect();
        }
    };

    return (
        <button onClick={handleClick}>
            Go to Dashboard
        </button>
    );
};

export default GenericLoginButton;
