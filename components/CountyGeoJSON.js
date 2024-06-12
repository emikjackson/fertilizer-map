'use client';

import { GeoJSON } from 'react-leaflet';
import geoJSON from '@/data/counties_with_fertilizer.json';
import L from 'leaflet';

// main: https://purple.vercel.app/#4/4/47/73/71/-66/9/47/FF7D53/255/125/83
// deeps: https://purple.vercel.app/#4/4/47/49/71/-41/9/47/871787/135/23/135
const COLOR_SCALE = [
  '#FFFCA3',
  '#FFE68F',
  '#FFCA7A',
  '#FFA666',
  '#FF7D53',
  '#E14049',
  '#A52283',
  '#A52283',
  '#871787',
  // extreme deep for end of scale jumps
  '#5C0F7D',
  '#330871',
  '#0D0264',
];

const BASE_SCALE = [1, 2, 3, 4, 5, 6, 7, 8, 8 * 2, 8 * 4, 8 * 6];

const getScaleByScalar = scalar => BASE_SCALE.map(num => num * scalar);

const KEY_SCALES = {
  P: {
    total: 300000,
    farm: 300000,
    nonf: 30000,
  },
  N: {
    total: 600000,
    farm: 600000,
    nonf: 60000,
  },
};

const getRgbaFromHex = (hexcode, index) => {
  const regexRes = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexcode);
  const getCode = regexIndex => parseInt(regexRes[regexIndex], 16);
  const opacity = index < 3 ? 0.3 : index < 6 ? 0.6 : 0.9;
  return `rgba(${getCode(1)}, ${getCode(2)}, ${getCode(3)}, ${opacity})`;
};

const getColorByValue = (summaryType, fertType, value) => {
  const scaleArray = getScaleByScalar(KEY_SCALES[fertType][summaryType]);
  let colorIndex = scaleArray.findIndex(num => value < num);
  if (colorIndex === -1) {
    colorIndex = COLOR_SCALE.length - 1;
  }
  return getRgbaFromHex(COLOR_SCALE[colorIndex], colorIndex);
};

export default function CountyGeoJSON({
  map,
  year,
  summaryType,
  fertType,
  markerRef,
  setMarkerPosition,
  selectedProperties,
  setSelectedProperties,
}) {
  const setColor = ({ properties }) => {
    // Check value based on currently selected farm type, fert type, and year
    // Example format for year value properties: 'farmfertN-kg-1987'
    const value = properties[`${summaryType}fert${fertType}-kg-${year}`];
    let fillColor = getColorByValue(summaryType, fertType, value);
    let strokeColor = fillColor;
    let weight = 1;
    let strokeOpacity = 0.9;
    if (value === 'N/A' || value === undefined) {
      fillColor = 'rgba(0,0,0,0.3)';
      strokeColor = fillColor;
    }
    if (properties['GEOID'] === selectedProperties['GEOID']) {
      weight = 1;
      strokeOpacity = 1;
      strokeColor = '#94571E';
    }
    return { fillColor, color: strokeColor, weight, opacity: strokeOpacity, fillOpacity: 1 };
  };

  const onEachFeature = (feature, layer) => {
    layer.on({
      click: () => {
        // Get center and north of geometry coordinates (leaflet weirdly flips these)
        const center = L.latLngBounds(feature.geometry.coordinates[0]).getCenter();
        const north_lat = L.latLngBounds(feature.geometry.coordinates[0]).getEast();
        const leafletPosition = [north_lat, center.lat];

        //
        // map.flyTo(leafletPosition);
        const marker = markerRef.current;
        setMarkerPosition(leafletPosition);
        setSelectedProperties(feature.properties);
        if (marker) {
          marker.openPopup();
        }
      },
    });
  };

  return (
    <GeoJSON
      data={geoJSON}
      key={`${year}${summaryType}${fertType}`}
      style={setColor}
      onEachFeature={onEachFeature}
    />
  );
}
