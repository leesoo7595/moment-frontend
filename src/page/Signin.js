import React, {useState, useReducer} from "react";
import {Redirect} from 'react-router-dom';
import makeStyles from "@material-ui/core/styles/makeStyles";
import CircularProgress from "../component/CircularProgress";
import Grid from "@material-ui/core/Grid/index";
import Typography from "@material-ui/core/Typography/index";
import TextField from "@material-ui/core/TextField/index";
import firebase, {auth} from "../credentials/firebase";
import Button from "@material-ui/core/Button/index";
import {useAuth} from "../context/AuthContext";
import Signup from "../page/Signup";

const useStyles = makeStyles(theme => ({
    progress: {
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 999,
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.8)"
    },
    root: {
        height: "100vh",
        padding: theme.spacing(2)
    },
    left: {},
    loginFormPaper: {
        margin: theme.spacing(8, 4),
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function Auth() {
    const classes = useStyles();

    const initial = {
        email: "",
        password: ""
    };

    const reducer = (form, action) => {
        switch (action.name) {
            case "reset":
                return initial;
            default:
                return {...form, [action.name]: action.value}
        }
    };

    const [form, dispatch] = useReducer(reducer, initial);
    const {email, password} = {...form};
    const [signinError, setSigninError] = useState(false);
    const [openSignUpModal, setOpenSignUpModal] = useState(false);
    const {checkAuth} = useAuth();

    const handleChange = e => {
        const name = e.target.name;
        const value = e.target.value;
        dispatch({name, value})
    };

    const handleSignIn = e => {
        e.preventDefault();
        auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            .then(() => auth.signInWithEmailAndPassword(email, password)).then(console.log)
            .catch(e => {
                setSigninError(true);
            })
    };

    const handleOpenSignUpModal = () => {
        setOpenSignUpModal(true);
    };

    const handleCloseSignUpModal = () => {
        setOpenSignUpModal(false);
    };

    if (checkAuth.user) {
        return <Redirect to={"/"}/>
    }
    return (
        <div>
            <CircularProgress show={!checkAuth.hasBeenChecked}/>
            <Grid container id={"login"} component={"main"} className={classes.root} alignItems={"center"}
                  justify={"center"}>
                <Grid item xs={12} lg={4} xl={2}>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <form className={classes.form} onChange={handleChange} onSubmit={handleSignIn}>
                        <TextField id={"email"} name={"email"} type={"email"} variant={"outlined"} required
                                   margin={"normal"} fullWidth autoFocus autoComplete={"email"} label="Email"/>
                        <TextField id={"password"} name={"password"} type={"password"} variant={"outlined"} required
                                   margin={"normal"} fullWidth autoComplete={"current-password"} label="Password"/>

                        <Button className={classes.submit} fullWidth type={"submit"} variant={"contained"}
                                color={"primary"}>
                            Sign in
                        </Button>
                        {
                            signinError
                                ? (
                                    <Typography variant={"subtitle1"} color={"error"}>
                                        잘못된 로그인 정보입니다.
                                    </Typography>
                                )
                                : null
                        }
                    </form>
                    <Button className={classes.submit} fullWidth onClick={handleOpenSignUpModal} variant={"contained"}
                            color={"primary"}>
                        Sign up
                    </Button>
                    {openSignUpModal && <Signup open={openSignUpModal} handleClose={handleCloseSignUpModal} />}
                </Grid>
            </Grid>
        </div>
    )
}