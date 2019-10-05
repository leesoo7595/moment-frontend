import React, {useEffect, useState} from 'react';
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {geocodeByAddress, getLatLng} from "react-places-autocomplete";
import Geocode from "react-geocode";
import Drawer from '../component/Drawer';
import {Maps} from '../component/Maps';
import SearchBar from "../component/SearchBar";
import List from "./List";
import Message from "../component/Message";
import AddressContext from "../context/AddressContext";
import credentials from "../credentials/credentials";
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

const useStyles = makeStyles({
    search: {
        width: "100px",
        height: "100px"
    },
    searchBar: {
        position: "absolute",
        top: "80px",
        right: "20px",
        color: "white"
    },
});

export default function Main() {
    const classes = useStyles();

    const [cards, setCards] = useState([]);
    const [address, setAddress] = useState("");
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
    const [zoom, setZoom] = useState(10);
    const [center, setCenter] = useState({lat: 37.541, lng: 126.986});
    const [message, setMessage] = useState(false);

    const handleGetCards = () => {
        auth.currentUser.getIdToken(true).then(idToken => {
            const headers = new Headers();
            headers.append("Authorization", idToken);
            headers.append("Content-Type", "application/json");
            fetch('/api', {
                method: "GET",
                headers: headers,
            })
                .then(res => res.json())
                .then(cards => {
                    // const {title, category, date, address, img, summary, text, lat, lng} = result;
                    setCards(cards);
                    // console.log(cards);
                }).catch(e => {
                setMessage({
                    msg: "저장소에서 정보를 불러오지 못하였습니다. \n" + e,
                    id: _id(e),
                });
            });
        });
    };

    const handleChangeAddress = value => {
        setAddress(value);
    };

    function handleClickMap(e) {
        setLat(e.latLng.lat());
        setLng(e.latLng.lng());
        setCenter({lat: e.latLng.lat(), lng: e.latLng.lng()});
        setZoom(16);
    }

    useEffect(() => {
        Geocode.setApiKey(credentials.googleCloudPlatform.apiKey);
        handleGetCards();
    }, []);

    useEffect(() => {
        Geocode.fromLatLng(lat, lng).then(
            response => {
                const address = response.results[0].formatted_address;
                setAddress(address);
            },
            error => {
                console.error(error);
            }
        );
    }, [lat, lng]);

    useEffect(() => {
        if (!address || address === "") {
            setLat(0);
            setLng(0);
            setCenter({lat: 37.541, lng: 126.986});
            setZoom(10);
        }
        handleSelectInputAddress(address);
    }, [address]);

    function handleSelectInputAddress(address) {
        geocodeByAddress(address)
            .then(result => getLatLng(result[0]))
            .then(({lat, lng}) => {
                setLat(lat);
                setLng(lng);
                setZoom(16);
                setCenter({lat, lng});
                // console.log(lat, lng);
            })
            .catch(e => console.log(e));
    }

    const CustomizedInputBase = ({getInputProps, getSuggestionItemProps, suggestions, loading}) => {
        return (
            <Paper style={{"width": "300px"}}>
                <IconButton aria-label="search">
                    <SearchIcon/>
                </IconButton>
                <InputBase {...getInputProps()}
                           placeholder="Search Google Maps"
                           inputProps={{'aria-label': 'search google maps'}}
                />

                <Paper className="autocomplete-dropdown-container" style={{"width": "300px"}}>
                    {loading && <div>Loading...</div>}
                    {suggestions.map(suggestion => (
                        <div {...getSuggestionItemProps(suggestion)}>
                            <span>{suggestion.description}</span>
                            <Divider/>
                        </div>
                    ))}
                </Paper>
            </Paper>
        );
    };

    return (
        <AddressContext.Provider value={{setLat, setLng}}>
            <Drawer
                searchBar={<SearchBar className={classes.searchBar} value={address}
                                      handleChangeValue={handleChangeAddress}
                                      CustomizedInputBase={CustomizedInputBase}
                                      handleSelect={handleSelectInputAddress}/>}
                drawerList={<List cards={cards}/>}>
                <Maps isMarkerShown lat={lat} lng={lng} handleClickMap={handleClickMap} zoom={zoom} center={center}
                      address={address} cards={cards}
                      googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${credentials.googleCloudPlatform.apiKey}&v=3.exp&libraries=geometry,drawing,places`}
                      loadingElement={<div style={{height: `100%`}}/>}
                      containerElement={<div style={{height: `940px`}}/>}
                      mapElement={<div style={{height: `100%`}}/>}/>
                {/*<Form />*/}
            </Drawer>
        </AddressContext.Provider>
    )
}

