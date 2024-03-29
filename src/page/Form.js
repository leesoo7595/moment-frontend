import React, {useState, useReducer} from 'react';
import Button from "@material-ui/core/Button/index";
import TextField from "@material-ui/core/TextField/index";
import Box from "@material-ui/core/Box/index";
import Grid from "@material-ui/core/Grid/index";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Message from "../component/Message";
import Progress from "../component/CircularProgress";
import Modal from "../component/Modal";
import {auth} from "../credentials/firebase";

const _id = (() => {
    let currentId = 0;
    const map = new WeakMap();

    return (object) => {
        if (!map.has(object)) {
            map.set(object, ++currentId);
        }
        return map.get(object);
    }
})();

const useStyles = makeStyles(theme => ({
    spacing: {
        margin: theme.spacing(2)
    },
    button: {
        margin: theme.spacing(1),
    },
    input: {
        display: 'none',
    },
    img: {
        margin: theme.spacing(1),
        width: '100px',
        height: '100px',
    }
}));

export default function Form(props) {
    const {value, lat, lng, create} = props;
    const classes = useStyles();

    const formState = {
        title: "",
        category: "",
        address: value,
        summary: "",
        text: "",
        date: "2019-10-01",
        imgUrl: [],
        files: [],
    };

    const reducer = (form, action) => {
        switch (action.name) {
            case "reset":
                return formState;
            case "img":
                return {
                    ...form,
                    files: Object.values(action.value).map((e, i) => action.value[i]),
                    imgUrl: Object.values(action.value).map((e, i) => URL.createObjectURL(action.value[i]))
                };
            default:
                return {...form, [action.name]: action.value}
        }
    };

    const [form, dispatch] = useReducer(reducer, formState);
    const {title, category, address, summary, text, date, imgUrl, files} = {...form};
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState(false);
    const [progress, setProgress] = useState(false);

    const handleChange = e => {
        const name = e.target.name;
        const value = e.target.files || e.target.value;
        dispatch({name, value})
    };

    const handleOpenModal = () => {
        if (create) return setOpen(true);
        handleGetData();
        return setOpen(true);

    };

    const handleCloseModal = () => {
        setOpen(false);
        dispatch({name: "reset"});
    };

    const handleGetData = () => {
        auth.currentUser.getIdToken(true).then(idToken => {
            const headers = new Headers();
            headers.append("Authorization", idToken);
            headers.append("Content-Type", "application/json");
            fetch(`/api?address=${value}`, {
                method: "GET",
                headers: headers,
            })
                .then(data => data.json())
                .then(res => {
                    const {title, category, summary, text, date, img} = res;
                    const values = {title, category, summary, text, date, imgUrl: img};
                    Object.entries(values).map(([k, v]) => {
                        isNull(v || k)
                            ? dispatch({name: k, value: formState[k]})
                            : dispatch({name: k, value: v})
                    });
                    dispatch({name: "files", value: ""})
                }).catch(e => {
                setMessage({
                    msg: "해당 URL 정보를 불러오지 못하였습니다. \n" + e,
                    id: _id(e),
                });
            });
        });
    };

    const handleSubmit = e => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        data.set("files", files);
        data.set("lat", lat);
        data.set("lng", lng);
        // for (let e of data) {
        //     console.log(e);
        // }
        setProgress(true);
        auth.currentUser.getIdToken(true).then(idToken => {
            const headers = new Headers();
            headers.append("Authorization", idToken);
            fetch('/api', {
                method: "POST",
                headers: headers,
                body: data
            })
                .then(result => {
                    if (result.status < 200 || result.status >= 300) {
                        setMessage({
                            msg: "해당 URL 정보가 데이터베이스에 저장되지 못했습니다. \n There's something Error in Server",
                            id: _id(e),
                        });
                        throw new Error("Cannot Save");
                    }
                    return result;
                })
                .then(() => {
                    setProgress(false);
                    setOpen(false);
                })
                .then(() => {
                    setMessage({
                        msg: "해당 URL 정보가 데이터베이스에 성공적으로 저장되었습니다.",
                        id: _id({}),
                    })
                })
                .then(() => {
                    dispatch({name: "reset"});
                    return handleGetData();
                })
                .catch(e => {
                    setMessage({
                        msg: "해당 URL 정보가 데이터베이스에 저장되지 못했습니다. \n" + e,
                        id: _id(e),
                    });
                });
        });
    };

    return (
        <>
            <div>{address}</div>
            <Button color={"primary"} variant={"contained"} onClick={handleOpenModal}>
                {create ? "장소 등록하기" : "장소 수정하기"}</Button>
            {
                open && <Modal open={open} handleClose={handleCloseModal}>
                    <form onSubmit={handleSubmit} onChange={handleChange}>
                        <Box className={classes.spacing}>
                            <Grid container alignItems={"center"}>
                                <Grid item xs={5}>
                                    <TextField fullWidth id={"title"} name={"title"} label={"이름"} value={title}/>
                                </Grid>
                                <Grid item xs={2} className={classes.spacing}>
                                    <TextField fullWidth id={"category"} name={"category"} label={"종류"}
                                               value={category}/>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField fullWidth type={"date"} id={"date"} name={"date"} label={"날짜"}
                                               value={date}/>
                                </Grid>
                            </Grid>
                            <Grid container alignItems={"center"}>
                                <Grid item xs={8}>
                                    <TextField fullWidth id={"address"} name={"address"} label={"주소"}
                                               value={address}/>
                                </Grid>
                                <Grid item xs={3} className={classes.spacing}>
                                    <input
                                        accept="image/*" className={classes.input} name={"img"}
                                        id={"contained-button-file"} multiple type="file"/>
                                    <label htmlFor="contained-button-file">
                                        <Button variant="contained" color={"primary"} component="span"
                                                className={classes.button}>
                                            이미지 업로드
                                        </Button>
                                    </label>
                                    <TextField name={"imgUrl"} type={"text"} style={{"display": "none"}}
                                               value={imgUrl}/>
                                </Grid>
                            </Grid>
                            <TextField fullWidth id={"summary"} name={"summary"} label={"한 줄 정리"} value={summary}
                                       multiline/>
                            <TextField fullWidth id={"text"} name={"text"} label={"내용"} value={text} multiline
                                       rows={15}/>
                            {imgUrl && imgUrl.map((e, i) => <img key={i} className={classes.img} src={e} alt=""/>)}
                        </Box>
                        <Button type={"submit"} color={"primary"} variant={"contained"}>
                            저장
                        </Button>
                    </form>
                    <Progress show={progress}/>
                    <Message key={message.msg ? message.id : "none"} message={message}/>
                </Modal>
            }
        </>
    )
}

function isNull(value) {
    return value === undefined || value === null || value === "" || value === "undefined" || value === "null";
}