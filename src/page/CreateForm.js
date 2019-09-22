import React, {useState, useReducer} from 'react';
import Button from "@material-ui/core/Button/index";
import TextField from "@material-ui/core/TextField/index";
import Box from "@material-ui/core/Box/index";
import Grid from "@material-ui/core/Grid/index";
import makeStyles from "@material-ui/core/styles/makeStyles";

import Modal from "../component/Modal";

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

export default function CreateForm(props) {
    const {value} = props;
    const classes = useStyles();

    const formState = {
        title: "",
        category: "",
        address: value,
        text: "",
        date: "2019-10-01",
        img: [],
        files: [],
    };

    const reducer = (form, action) => {
        switch (action.name) {
            case "reset":
                return formState;
            case "imgFiles":
                return {...form, files: action.value, img: Object.values(action.value).map((e, i) =>URL.createObjectURL(action.value[i]))};
            default:
                return {...form, [action.name]: action.value}
        }
    };

    const [form, dispatch] = useReducer(reducer, formState);
    const {title, category, address, text, date, img, files} = {...form};
    const [open, setOpen] = useState(false);

    const handleChange = e => {
        const name = e.target.name;
        const value = e.target.files || e.target.value;
        dispatch({name, value})
    };

    const handleOpenModal = () => {
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
        dispatch({name:"reset"});
    };

    const handleSubmit = e => {
        e.preventDefault();
        console.log("DB에 보내기");
    };

    console.log("files : " + files,"img : " +  img);
    return (
        <>
            <div>{address}</div>
            <Button color={"primary"} variant={"contained"} onClick={handleOpenModal}>
                장소 등록하기</Button>
            {
                open && <Modal open={open} handleClose={handleCloseModal}>
                    <form onSubmit={handleSubmit} onChange={handleChange}>
                        <Box className={classes.spacing}>
                            <Grid container alignItems={"center"}>
                                <Grid item xs={5}>
                                    <TextField fullWidth id={"title"} name={"title"} label={"이름"} value={title}/>
                                </Grid>
                                <Grid item xs={2} className={classes.spacing}>
                                    <TextField fullWidth id={"category"} name={"category"} label={"종류"} value={category}/>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField fullWidth type={"date"} id={"date"} name={"date"} label={"날짜"} value={date}  defaultValue={"2017-05-24"} />
                                </Grid>
                            </Grid>
                            <Grid container alignItems={"center"}>
                                <Grid item xs={8}>
                                    <TextField fullWidth id={"address"} name={"address"} label={"주소"} value={address} />
                                </Grid>
                                <Grid item xs={3} className={classes.spacing}>
                                    <input
                                        accept="image/*" className={classes.input} name={"imgFiles"} id={"contained-button-file"} multiple type="file"/>
                                    <label htmlFor="contained-button-file">
                                        <Button variant="contained" color={"primary"} component="span" className={classes.button}>
                                            이미지 업로드
                                        </Button>
                                    </label>
                                    <TextField name={"img"} type={"text"} style={{"display": "none"}} value={img}/>
                                </Grid>
                            </Grid>
                            <TextField fullWidth id={"text"} name={"text"} label={"내용"} value={text} multiline rows={15} />
                            {img && img.map(e => <img className={classes.img} src={e} alt=""/>)}
                        </Box>
                        <Button type={"submit"} color={"primary"} variant={"contained"}>
                            저장
                        </Button>
                    </form>
                </Modal>
            }
        </>
    )
}