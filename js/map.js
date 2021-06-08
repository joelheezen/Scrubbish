import 'ol/ol.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

const map = new Map({
    target: 'map',
    layers: [
        new TileLayer({
            source: new OSM()
        })
    ],
    view: new View({
        center: [0, 0],
        zoom: 0
    })
});

mapboxgl.accessToken = 'pk.eyJ1Ijoic3VtbW9uZWRnZWVrIiwiYSI6ImNrb3ZhaDBrMjA2cTQydXI0aXc4aWd0dHYifQ.o4qgVeXg8z1WvgiH0XH64Q';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/summonedgeek/ckovaubi8e8ei17p964x6moxi'
    });