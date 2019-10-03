import React from 'react';
import {GoogleMap, withGoogleMap, withScriptjs} from 'react-google-maps'
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
                {<Form create={true} value={address} lat={lat} lng={lng}/>}
            </MarkerWithInfoWindow>
            {
                cards ? cards.map((e) => (
                    <MarkerWithInfoWindow key={e.id} i={e.id} icon={blueMarker} position={{lat: parseFloat(e.lat), lng: parseFloat(e.lng)}}>
                        {/*{children}*/}
                        {<Form create={false} value={e.address} lat={parseFloat(e.lat)} lng={parseFloat(e.lng)}/>}
                    </MarkerWithInfoWindow>
                )) : null
            }
        </GoogleMap>

    )
}));