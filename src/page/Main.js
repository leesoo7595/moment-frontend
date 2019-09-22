import React, {useEffect, useState} from 'react';
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/core/SvgIcon/SvgIcon";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {geocodeByAddress, getLatLng} from "react-places-autocomplete";
import Geocode from "react-geocode";

import Drawer from '../component/Drawer';
import {Maps} from '../component/Maps';
import SearchBar from "../component/SearchBar";
import CreateForm from "./CreateForm";
import credentials from "../credentials/credentials"

Geocode.setApiKey(credentials["googleCloudPlatform"]["apiKey"]);

const useStyles = makeStyles({
    search: {
        width: "100px",
        height: "100px"
    },
    searchBar: {
        position: "absolute",
        top: "8px",
        right: "10px",
        color: "white"
    },
});

export default function Main() {
    const classes = useStyles();

    const [cards, setCards] = useState([]);
    const [value, setValue] = useState("");
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
    const [zoom, setZoom] = useState(10);
    const [center, setCenter] = useState({lat: 37.541, lng: 126.986});

    const handleGetCards = () => {
        fetch('https://cors-anywhere.herokuapp.com/' + credentials["serverAddress"], {
            method: "GET",
            headers: {"Content-Type": "application/json"}
        })
            .then(res => res.json())
            .then(cards => {
                // const {title, category, date, address, img, text} = result;
                setCards(cards);
                console.log(cards);
            }).catch(e => console.log(e));
    };

    const handleChangeValue = value => {
        setValue(value);
    };

    function handleClickMap(e) {
        setLat(e.latLng.lat());
        setLng(e.latLng.lng());
        setCenter({lat: e.latLng.lat(), lng: e.latLng.lng()});
        setZoom(16);
    }

    useEffect(() => {
        handleGetCards();
    }, []);

    useEffect(() => {
        Geocode.fromLatLng(lat, lng).then(
            response => {
                const address = response.results[0].formatted_address;
                setValue(address);

            },
            error => {
                console.error(error);
            }
        );
    }, [lat, lng]);

    useEffect(() => {
        if (!value || value === "") {
            setLat(0);
            setLng(0);
            setCenter({lat: 37.541, lng: 126.986});
            setZoom(10);
        }
    }, [value]);

    function handleSelectInputAddress() {
        geocodeByAddress(value)
            .then(result => getLatLng(result[0]))
            .then(({lat, lng}) => {
                setLat(lat);
                setLng(lng);
                setZoom(16);
                setCenter({lat, lng});
                console.log(lat, lng);
            })
            .catch(e => console.log(e));
    }

    const CustomizedInputBase = ({ getInputProps, getSuggestionItemProps, suggestions, loading }) => {
        return (
            <Paper style={{"width": "300px"}}>
                <IconButton aria-label="search">
                    <SearchIcon />
                </IconButton>
                <InputBase {...getInputProps()}
                           placeholder="Search Google Maps"
                           inputProps={{ 'aria-label': 'search google maps' }}
                />

                <Paper className="autocomplete-dropdown-container" style={{"width": "300px"}}>
                    {loading && <div>Loading...</div>}
                    {suggestions.map(suggestion => (
                        <div {...getSuggestionItemProps(suggestion)}>
                            <span>{suggestion.description}</span>
                            <Divider />
                        </div>
                    ))}
                </Paper>
            </Paper>
        );
    };

    console.log("cards", cards);

    return (
        <Drawer
            searchBar={<SearchBar className={classes.searchBar} value={value} handleChangeValue={handleChangeValue} CustomizedInputBase={CustomizedInputBase} handleSelect={handleSelectInputAddress}/>}
            cards={cards} >
            <Maps isMarkerShown lat={lat} lng={lng} handleClickMap={handleClickMap} zoom={zoom} center={center} value={value}
                  markerText={<CreateForm value={value} />}
                  googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${credentials["googleCloudPlatform"]["apiKey"]}&v=3.exp&libraries=geometry,drawing,places`}
                  loadingElement={<div style={{height: `100%`}}/>}
                  containerElement={<div style={{height: `940px`}}/>}
                  mapElement={<div style={{height: `100%`}}/>}/>
        </Drawer>
    )
}

