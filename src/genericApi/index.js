import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { Security, LoginCallback, useOktaAuth } from '@okta/okta-react';
import GenericLoginButton from './genericLoginbutton';
import GenericDashboard from './genericDashboard';
import TokenService from '../services/Tokenservice';
import { oktaAuth } from './genericOktaauth/GenericConfig';

const Generic = () => {
    return <Router>
        <Security
            oktaAuth={oktaAuth}
            restoreOriginalUri={async (_oktaAuth, originalUri) => {
                window.location.replace('/generic');
            }}
        >
            <Switch>
                <Route
                    exact
                    path="/generic/login/callback"
                    component={LoginCallback}
                />
                <Route
                    exact
                    path="/generic"
                    component={GenericLoginButton}
                />
                <Route
                    path="/generic/dashboard"
                    exact
                    render={(props) => {
                        return TokenService.getLocalAccessToken() ? (
                            <GenericDashboard />
                        ) : (
                            <Redirect
                                to={{
                                    pathname: "/generic",
                                }}
                            />
                        );
                    }}
                />
            </Switch>
        </Security>
    </Router>
};

export default Generic;
