import React, {useContext} from 'react';
import {Route, Redirect} from 'react-router-dom';
import {useAuth} from "../context/AuthContext";

export const PrivateRoute = ({component: RouteComponent, ...rest}) => {
    const {checkAuth} = useAuth();

    return (
        <Route
            {...rest}
            render = {routeProps =>
            checkAuth.user ? (
                <RouteComponent {...routeProps} />
                ) : (
                    <Redirect to={"/signin"} />
            )}
        />
    )
};