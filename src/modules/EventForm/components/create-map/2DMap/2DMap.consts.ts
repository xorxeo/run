import L from './index'
import 'leaflet/dist/leaflet.css'; // leaflet map doesn't work correctly without this import

export const MAP_TILE = L.tileLayer(
  `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`,
  {
    attribution:
      '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
  }
);
export const MAP_PARAMS: L.MapOptions = {
  center: L.latLng(37.0902, -95.7129),
  zoom: 12,
  zoomControl: true,
  maxBounds: L.latLngBounds(L.latLng(-150, -240), L.latLng(150, 240)),
  layers: [MAP_TILE],
  // scrollWheelZoom: false,
};

export enum FIGURE_TYPE {
  line = 'line',
  rectangle = 'rectangle',
}

export enum COLORS {
  red = 'red',
  green = 'green',
  blue = 'blue',
  yellow = 'yellow',
  black = 'black',
  brown = 'brown',
  white = 'white',
  orange = 'orange',
  purple = 'purple',
  pink = 'pink',
  gray = 'gray',
}


