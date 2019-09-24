import React, {useState} from "react";
import {Modal} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import shadows from "@material-ui/core/styles/shadows";

const useStyles = makeStyles({
    modal: {
        position: "absolute",
        width: "400px",
        backgroundColor: "white",
        boxShadow: shadows[5],
        padding: "20px",
        outline: "none",
    },
});

function modalStyle() {
    return {
        top: `50%`,
        left: `50%`,
        transform: `translate(-50%, -50%)`,
    }
}

export default function MessageModal(props) {
    const {message} = props;
    const [getModalStyle] = useState(modalStyle);
    const [open, setOpen] = useState(!!message.msg);
    const handleClose = () => {
        setOpen(false);
    };
    const classes = useStyles();
    return (
        <div>
            {
                !!message
                    ? (
                        <Modal open={open} onClose={handleClose}>
                            <div className={classes.modal} style={getModalStyle}>
                                {message.msg}
                            </div>
                        </Modal>
                    )
                    : null
            }
        </div>
    )
}
