import React from "react";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress"


const useStyle = makeStyles(theme => ({
    root: {
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 999,
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.4)"
    }
}));

export default function Progress({show}) {
    const classes = useStyle();
    return show ? (
        <div className={classes.root}>
            <CircularProgress/>
        </div>
    ) : null;
}

Progress.propTypes = {
    show: PropTypes.bool.isRequired
};