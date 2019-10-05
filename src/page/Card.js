import React, {useState} from 'react';
import clsx from "clsx";
import {Redirect} from "react-router-dom";
import {makeStyles} from '@material-ui/core/styles/index';
import Card from '@material-ui/core/Card/index';
import CardContent from '@material-ui/core/CardContent/index';
import CardMedia from '@material-ui/core/CardMedia/index';
import Typography from '@material-ui/core/Typography/index';
import IconButton from "@material-ui/core/IconButton/index";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Collapse from "@material-ui/core/Collapse/index";
import CardHeader from "@material-ui/core/CardHeader/index";
import Avatar from "@material-ui/core/Avatar/index";
import CardActions from "@material-ui/core/CardActions/index";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share"
import AddressContext, {useAddress} from "../context/AddressContext";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Message from "../component/Message";
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
    card: {
        position: 'relative',
        margin: theme.spacing(1),
        width: '480px'
    },
    details: {
        display: 'flex',
        width: '100%',
        height: '80px',
    },
    content: {
        flex: '1 0 auto',
        height: 100,
        padding: theme.spacing(1)
    },
    cover: {
        width: 120,
        height: 115,
        margin: theme.spacing(0.5, 0),
    },
    address: {
        fontSize: 12,
        height: 20,
        marginLeft: 100,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9,
        margin: theme.spacing(1, 0),
    },
    expand: {
        transform: 'rotate(0deg)',
        margin: theme.spacing(1, 2),
        padding: theme.spacing(0),
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    favIcon: {
        color: 'red'
    },
}));

export default function MediaControlCard(props) {
    const {title, summary, text, img, address, date, lat, lng} = props;
    const classes = useStyles();
    const [expanded, setExpanded] = useState(false);
    const [isFavor, setIsFavor] = useState(false);
    const [openSettings, setOpenSettings] = useState(null);
    const [message, setMessage] = useState({});
    const [redirect, setRedirect] = useState(false);
    const {setLat, setLng} = useAddress();

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleClick = e => {
        e.preventDefault();
        setLat(lat);
        setLng(lng);
    };

    const onClickFavorIcon = () => {
        setIsFavor(true);
    };

    const onClickOpenSettings = e => {
        setOpenSettings(e.currentTarget);
    };

    const onCloseSettings = () => {
        setOpenSettings(null);
    };

    const onDeleteCard = e => {
        e.preventDefault();
        auth.currentUser.getIdToken(true).then(idToken => {
            const headers = new Headers();
            headers.append("Authorization", idToken);
            headers.append("Content-Type", "application/json");
            fetch(`/api?address=${address}`, {
                method: "DELETE",
                headers: headers,
            })
                .then(res => {
                    if (res.status === 200) {
                        return setMessage({
                            msg: "삭제하였습니다. \n",
                            id: _id({}),
                        });
                    }
                    return setMessage({
                        msg: "삭제하지 못했습니다. \n",
                        id: _id({}),
                    })
                })
                .then(() => setRedirect(true))
                .catch(e => console.log(e));
        });
    };

    const onUpdateCard = e => {

    };

    //ToDo R
    // if (redirect) return (<Redirect to={"/"}/>);
    return (
        <Card key={`cards-${lat}-${lng}`} onClick={handleClick} className={classes.card}>
            <CardHeader
                avatar={
                    <Avatar aria-label="recipe" className={classes.avatar}>
                        R
                    </Avatar>
                }
                action={
                    <div>
                        <IconButton
                            aria-controls={`cards-${lat}-${lng}`}
                            onClick={onClickOpenSettings}
                            aria-label="settings"
                            aria-haspopup="true">
                            <MoreVertIcon/>
                        </IconButton>
                        <Menu
                            id={`cards-${lat}-${lng}`}
                            anchorEl={openSettings}
                            keepMounted
                            open={Boolean(openSettings)}
                            onClose={onCloseSettings}
                        >
                            <MenuItem onClick={onDeleteCard}>지우기</MenuItem>
                            <MenuItem onClick={onUpdateCard}>수정하기</MenuItem>
                        </Menu>
                    </div>
                }
                title={title}
                subheader={date}
            />
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                    {summary}</Typography>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton
                    aria-label="add to favorites"
                    className={clsx(isFavor && classes.favIcon)}
                    onClick={onClickFavorIcon}>
                    <FavoriteIcon />
                </IconButton>
                <IconButton aria-label="share">
                    <ShareIcon/>
                </IconButton>
                <Typography className={classes.address} variant="body2" color="textSecondary" component="p">
                    {address}</Typography>
                <IconButton
                    className={clsx(classes.expand, {
                        [classes.expandOpen]: expanded,
                    })}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon/>
                </IconButton>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <CardMedia
                        className={classes.media}
                        image={img}
                        title={title}
                    />
                    <Typography paragraph>
                        {text}
                    </Typography>
                </CardContent>
            </Collapse>
            <Message key={message.msg ? message.id : "none"} message={message}/>
        </Card>
    );
}
