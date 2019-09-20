import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {Card, CardContent, CardMedia, Typography, Button}from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    card: {
        margin: theme.spacing(1),
        width: '480px',
        height: '100px',
    },
    details: {
        display: 'flex',
        width: '100%',
        height: '80px',
    },
    content: {
        flex: '1 0 auto',
    },
    cover: {
        width: 80,
    },
    button: {
        width: '10px',
        height: '20px',
        fontSize: '10px',
        padding: 0,
    }
}));

export default function MediaControlCard(props) {
    const {title, text, img} = props;
    const classes = useStyles();

    return (
        <Card className={classes.card}>
            <div className={classes.details}>
                <CardContent className={classes.content}>
                    <Typography>
                        {title}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        {text}
                    </Typography>
                </CardContent>
                <CardMedia
                    className={classes.cover}
                    image={img}
                    title={title}
                />
            </div>
            <Button className={classes.button}>
                more
            </Button>
        </Card>
    );
}
