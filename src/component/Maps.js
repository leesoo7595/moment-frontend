import React, {useState} from 'react';
import {GoogleMap, Marker, withGoogleMap, withScriptjs, InfoWindow} from 'react-google-maps'

export const Maps = withScriptjs(withGoogleMap((props) => {
    const {lat, lng, isMarkerShown, handleClickMap, zoom, center, markerText} = props;
    const [open, setOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const handleWindowOpen = () => {
        setOpen(true);
    };

    const handleWindowClose = () => {
        setOpen(false);
    };

    return (
        <GoogleMap
            onClick={handleClickMap}
            defaultZoom={10}
            defaultCenter={{lat: 37.541, lng: 126.986}}
            zoom={zoom}
            center={center}
        >
            <Marker onClick={handleWindowOpen} position={{lat, lng}}>
                {
                    open && <InfoWindow onCloseClick={handleWindowClose} position={{lat, lng}}>
                        {markerText}
                    </InfoWindow>
                }
            </Marker>

        </GoogleMap>

    )
}));