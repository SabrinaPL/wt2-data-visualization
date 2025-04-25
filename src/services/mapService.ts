import { map, latLng, tileLayer } from 'leaflet' // TODO: Import geoJSON from leaflet
import type { MapOptions } from 'leaflet' // TODO: Import GeoJSON types from leaflet

// Setup code taken from source: 'https://docs.maptiler.com/leaflet/examples/ts-get-started/' and slightly tweaked
export function initMap(containerId: string) {
  // Initialize the map with a center and zoom level
  const options: MapOptions = {
    center: latLng(40.731253, -73.996139),
    zoom: 12,
  }

const mymap = map(containerId, options)
const key = import.meta.env.VITE_MAPTILER_API_KEY

tileLayer(`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${key}`,{ 
    tileSize: 512,
    zoomOffset: -1,
    minZoom: 1,
    attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
    crossOrigin: true
  }).addTo(mymap)
}