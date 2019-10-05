import React, {createContext, useContext} from "react";

const AddressContext = createContext({});
export default AddressContext;
export const useAddress = () => useContext(AddressContext);