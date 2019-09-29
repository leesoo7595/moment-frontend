import React from 'react';
import clsx from "clsx";
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Collapse from "@material-ui/core/Collapse";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import CardActions from "@material-ui/core/CardActions";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share"

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
}));

export default function MediaControlCard(props) {
    const {title, summary, text, img, address, date} = props;
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    return (
        <Card className={classes.card}>
            <CardHeader
                avatar={
                    <Avatar aria-label="recipe" className={classes.avatar}>
                        R
                    </Avatar>
                }
                action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon/>
                    </IconButton>
                }
                title={title}
                subheader={date}
            />
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                    {summary}</Typography>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                    <FavoriteIcon/>
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
        </Card>
    );
}
