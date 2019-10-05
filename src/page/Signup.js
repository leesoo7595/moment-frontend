import React, {useReducer, useState} from 'react';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Modal from '../component/Modal';
import firebase, {auth} from "../credentials/firebase";

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

export default function Signup(props) {
    const {open, handleClose} = props;
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
    const [signupError, setSignupError] = useState(false);

    const handleChange = e => {
        const name = e.target.name;
        const value = e.target.files || e.target.value;
        dispatch({name, value})
    };

    const handleSubmit = e => {
        e.preventDefault();
        auth.createUserWithEmailAndPassword(email, password)
            .catch(e => {
                setSignupError(true);
            });
    };

    return (
        <>
            {
                open && <Modal open={open} handleClose={handleClose}>
                    <form onSubmit={handleSubmit} onChange={handleChange}>
                        <TextField id={"email"} name={"email"} type={"email"} variant={"outlined"} required
                                   margin={"normal"} fullWidth autoFocus autoComplete={"email"} label="Email"/>
                        <TextField id={"password"} name={"password"} type={"password"} variant={"outlined"} required
                                   margin={"normal"} fullWidth autoComplete={"current-password"} label="Password"/>

                        <Button className={classes.submit} fullWidth type={"submit"} variant={"contained"}
                                color={"primary"}>
                            Sign in
                        </Button>
                        {
                            signupError
                                ? (
                                    <Typography variant={"subtitle1"} color={"error"}>
                                        잘못된 정보를 입력하였습니다.
                                    </Typography>
                                )
                                : null
                        }
                    </form>
                </Modal>
            }
        </>
    )
}