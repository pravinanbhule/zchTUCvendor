import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import TokenService from '../../services/Tokenservice';
import { useOktaAuth } from '@okta/okta-react';

const GenericDashboard = () => {
    const { oktaAuth } = useOktaAuth();
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const history = useHistory();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const accessToken = TokenService.getLocalAccessToken();
                const response = await fetch('https://oktadlzchapi.azurewebsites.net/api/branch/getallbranchlist', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();
                setData(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const removeUser = async () => {
        localStorage.clear();
        sessionStorage.clear();
        await oktaAuth.signOut({ clearTokensBeforeRedirect: true });
        sessionStorage.setItem('path', 'generic')
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <h1>
                <button onClick={removeUser}>log-Out</button>
            </h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
            <h1>
                <button onClick={removeUser}>log-Out</button>
            </h1>
        </div>
    );
};

export default GenericDashboard;
