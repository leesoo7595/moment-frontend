import React from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';
import { makeStyles } from '@material-ui/core/styles/index';

const useStyles = makeStyles(theme => ({
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 400,
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        height: 28,
        margin: 4,
    },
}));

export default function SearchBar(props) {
    const {className, value, handleChangeValue, CustomizedInputBase} = props;

    return (
        <div className={className}>
            <PlacesAutocomplete value={value} onChange={handleChangeValue}>
                {CustomizedInputBase}
            </PlacesAutocomplete>
        </div>
    )
}