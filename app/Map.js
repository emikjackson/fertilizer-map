'use client';

// IMPORTANT: the order matters!
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { MapContainer, GeoJSON, Popup, TileLayer } from 'react-leaflet';
import shp from 'shpjs';
import ecomp from './data/ecomp.json';
import seg from './data/seg.json';
import counties from './data/counties.json';

import L, { divIcon } from 'leaflet';

export default function Map() {
  const position = [38.850033, -95.6500523];
  const zoom = 4.5;

  const setIcon = ({ properties }, latlng) => {
    return L.marker(latlng, { icon: customMarkerIcon(properties.Name) });
  };
  const setColor = ({ properties }) => {
    return { weight: 1 };
  };

  return (
    <MapContainer
      center={position}
      zoom={zoom}
      scrollWheelZoom={true}
      style={{ height: '600px', width: '800px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoJSON data={counties} style={setColor} />
    </MapContainer>
  );
}
