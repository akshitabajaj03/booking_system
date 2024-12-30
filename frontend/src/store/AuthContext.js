import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

const AuthContext = React.createContext({
    token: '',
    isLoggedIn: false,
    login: () => { },
    logout: () => { },
    user: null,
});

const retrieveStoredToken = () => {
    const storedToken = localStorage.getItem('token');
    return storedToken ? { token: storedToken } : { token: '' };
};

export const AuthContextProvider = (props) => {
    const tokenData = retrieveStoredToken();

    const [token, setToken] = useState(tokenData.token);
    const [user, setUser] = useState(null);

    const userIsLoggedIn = !!token;

    useEffect(() => {
        if (userIsLoggedIn && user === null) {
            const getData = async () => {
                try {
                    const response = await axios.get(`http://localhost:3000/auth/verify`, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    setUser(response?.data?.user);
                } catch (error) {
                    logoutHandler();
                }
            };

            getData();
        }
    }, [user, token, userIsLoggedIn]);

    const logoutHandler = useCallback(() => {
        setToken('');
        setUser(null);
        localStorage.removeItem('token');
    }, []);

    const loginHandler = (token, user) => {
        setToken(token);
        setUser(user);
        localStorage.setItem('token', token);
    };

    const contextValue = {
        token,
        isLoggedIn: userIsLoggedIn,
        login: loginHandler,
        logout: logoutHandler,
        user,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {props?.children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
