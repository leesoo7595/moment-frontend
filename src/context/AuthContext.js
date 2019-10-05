import React, {createContext, useContext} from 'react';

const AuthContext = createContext({});
export default AuthContext;
export const useAuth = () => useContext(AuthContext);