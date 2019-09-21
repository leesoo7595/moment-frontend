import React from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';

export default function SearchBar(props) {
    const {className, value, handleChangeValue, CustomizedInputBase, handleSelect} = props;

    return (
        <div className={className}>
            <PlacesAutocomplete value={value} onChange={handleChangeValue}
            onSelect={handleSelect}>
                {CustomizedInputBase}
            </PlacesAutocomplete>
        </div>
    )
}