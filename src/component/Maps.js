import React, {useEffect, useState} from 'react';
import {GoogleMap, Marker, withGoogleMap, withScriptjs, InfoWindow} from 'react-google-maps'
import MarkerWithInfoWindow from './MarkerWithInfoWindow';
import Form from "../page/Form";
import blueMarker from "../img/blue-dot.png";

export const Maps = withScriptjs(withGoogleMap((props) => {
    const {lat, lng, handleClickMap, zoom, center, cards, address} = props;

    return (
        <GoogleMap
            onClick={handleClickMap}
            defaultZoom={10}
            defaultCenter={{lat: 37.541, lng: 126.986}}
            zoom={zoom}
            center={center}
        >
            <MarkerWithInfoWindow position={{lat, lng}}>
                {/*{children}*/}
                {<Form create={true} value={address}/>}
            </MarkerWithInfoWindow>
            {
                cards ? cards.map(e => {
                    return <MarkerWithInfoWindow icon={blueMarker} position={{lat: e.lat, lng: e.lng}}>
                        {/*{children}*/}
                        {<Form create={false} value={e.address} />}
                    </MarkerWithInfoWindow>
                }) : null
            }
        </GoogleMap>

    )
}));