import React, {useState, useEffect} from 'react';
import {Switch, BrowserRouter, Route} from "react-router-dom";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import {MuiThemeProvider} from "@material-ui/core/styles";
import {PrivateRoute} from "./component/PrivateRoute";
import AuthContext from "./context/AuthContext";
import {Main, Auth} from "./page/index";
import firebase, {auth} from "./credentials/firebase";
import credentials from "./credentials/credentials";

const theme = createMuiTheme({
    palette: {
        background: {
            default: "#eeeeee",
            paper: "white"
        }
    },
});

export default function App() {
    const [loaded, error] = useScript(
        `https://maps.googleapis.com/maps/api/js?key=${credentials.googleCloudPlatform.apiKey}&libraries=places`
    );
    const [checkAuth, setCheckAuth] = useState({user: auth.currentUser, hasBeenChecked: false});
    const signInCb = (user) => setCheckAuth({user, hasBeenChecked: true});
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(signInCb);
        return ()=>{
            unsubscribe(signInCb);
        }
    }, []);
    return (
        <MuiThemeProvider theme={theme}>
            <AuthContext.Provider value={{checkAuth}}>
                <div>
                    Script loaded: <b>{loaded.toString()}</b>
                </div>
                {loaded && !error && (
                    <BrowserRouter>
                        <Switch>
                            <Route path={"/signin"} component={Auth}/>
                            <PrivateRoute exact path={"/"} component={Main} />
                        </Switch>
                    </BrowserRouter>
                )}
            </AuthContext.Provider>
        </MuiThemeProvider>
    );
}

// Hook
let cachedScripts = [];

function useScript(src) {
    // Keeping track of script loaded and error state
    const [state, setState] = useState({
        loaded: false,
        error: false
    });

    useEffect(
        () => {
            // If cachedScripts array already includes src that means another instance ...
            // ... of this hook already loaded this script, so no need to load again.
            if (cachedScripts.includes(src)) {
                setState({
                    loaded: true,
                    error: false
                });
            } else {
                cachedScripts.push(src);

                // Create script
                let script = document.createElement('script');
                script.src = src;
                script.async = true;

                // Script event listener callbacks for load and error
                const onScriptLoad = () => {
                    setState({
                        loaded: true,
                        error: false
                    });
                };

                const onScriptError = () => {
                    // Remove from cachedScripts we can try loading again
                    const index = cachedScripts.indexOf(src);
                    if (index >= 0) cachedScripts.splice(index, 1);
                    script.remove();

                    setState({
                        loaded: true,
                        error: true
                    });
                };

                script.addEventListener('load', onScriptLoad);
                script.addEventListener('error', onScriptError);

                // Add script to document body
                document.body.appendChild(script);

                // Remove event listeners on cleanup
                return () => {
                    script.removeEventListener('load', onScriptLoad);
                    script.removeEventListener('error', onScriptError);
                };
            }
        },
        [src] // Only re-run effect if script src changes
    );

    return [state.loaded, state.error];
}