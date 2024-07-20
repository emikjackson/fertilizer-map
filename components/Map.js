'use client';

import 'leaflet/dist/leaflet.css';
import './map.css';
import { useState } from 'react';
import { useRef } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import dataSummary from '@/data/counties_with_fertilizer_summary.json';
import CountyGeoJSON from './CountyGeoJSON';
import { manrope } from '@/app/fonts';
import MapHeader from './MapHeader';
import MapKey from './MapKey';

const INITIAL_POSITION = [38.850033, -95.6500523];

const TOTAL_YEARS = dataSummary.years.sort();

const clearIcon = L.divIcon({
  className: 'leaflet-mouse-marker',
  iconSize: [0, 0],
});

const voyager = {
  url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png',
  attr: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
};

const stamen = {
  url: 'https://tiles.stadiamaps.com/tiles/stamen_terrain_background/{z}/{x}/{y}{r}.png',
  attr: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
};

const darkMatter = {
  url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  attr: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
};

const light = {
  url: 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
  attr: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
};

const theme = stamen;

// https://leaflet-extras.github.io/leaflet-providers/preview/
const TILE_MAP_URL = theme.url;
const TILE_MAP_ATTR = theme.attr;

export default function Map() {
  const [year, setYear] = useState(TOTAL_YEARS[0]);
  const [summaryType, setSummaryType] = useState('total');
  const [fertType, setFertType] = useState('N');
  const [map, setMap] = useState(null);
  const markerRef = useRef(null);
  const [markerPosition, setMarkerPosition] = useState(INITIAL_POSITION);
  const [selectedProperties, setSelectedProperties] = useState({});
  const dataKey = `${summaryType}fert${fertType}-kg-${year}`;
  const zoom = 4.5;

  return (
    <div className="full-map-wrapper">
      <MapHeader
        year={year}
        setYear={setYear}
        summaryType={summaryType}
        setSummaryType={setSummaryType}
        fertType={fertType}
        setFertType={setFertType}
      />
      <MapContainer
        center={INITIAL_POSITION}
        zoom={zoom}
        maxZoom={8}
        minZoom={4}
        zoomSnap={0.5}
        scrollWheelZoom={true}
        maxBounds={[
          [54, -135],
          [20, -55],
        ]}
        maxBoundsViscosity={0.8}
        style={{ height: '650px', width: '100%' }}
        ref={setMap}
      >
        <TileLayer url={TILE_MAP_URL} attribution={TILE_MAP_ATTR} />
        {map && (
          <>
            <Marker ref={markerRef} position={markerPosition} icon={clearIcon}>
              <Popup>
                {selectedProperties && (
                  <div className={`${manrope.className} popup-content`}>
                    <h3>
                      {selectedProperties['NAME']} County, {selectedProperties['State']}
                    </h3>
                    <p className="popup-label">
                      Est. {summaryType === 'nonf' ? 'non-farm' : summaryType}{' '}
                      {fertType === 'P' ? 'phosphorus' : 'nitrogen'} usage in {year}
                    </p>
                    <p>
                      {selectedProperties[dataKey]
                        ? `${Math.round(selectedProperties[dataKey] / 1000).toLocaleString()} tons`
                        : 'Unavailable'}
                    </p>
                  </div>
                )}
              </Popup>
            </Marker>
            <CountyGeoJSON
              map={map}
              year={year}
              summaryType={summaryType}
              fertType={fertType}
              markerRef={markerRef}
              setMarkerPosition={setMarkerPosition}
              selectedProperties={selectedProperties}
              setSelectedProperties={setSelectedProperties}
            />
          </>
        )}
      </MapContainer>
      <MapKey summaryType={summaryType} fertType={fertType} />
    </div>
  );
}
