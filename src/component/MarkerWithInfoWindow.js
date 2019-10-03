import React, {useState} from 'react';
import {Marker, InfoWindow} from "react-google-maps";

export default function MarkerWithInfoWindow(props) {
    const {i, position, icon, create, children} = props;
    const [open, setOpen] = useState(false);

    const handleWindowOpen = () => {
        setOpen(!open);
    };

    return (
        <Marker key={i} position={position} onClick={handleWindowOpen} icon={icon}>
            {open && <InfoWindow onCloseClick={handleWindowOpen}>
                {children}
            </InfoWindow>}
        </Marker>
    )
}