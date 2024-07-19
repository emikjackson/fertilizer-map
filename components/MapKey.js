import { BASE_SCALE, COLOR_SCALE, KEY_SCALES } from './CountyGeoJSON';
import { manrope } from '@/app/fonts';

// Return array of all colors and their associated value ranges
const getFullKey = (summaryType, fertType) => {
  return BASE_SCALE.map((scalar, index) => {
    const increment = KEY_SCALES[fertType][summaryType];
    return {
      min: index === 0 ? 0 : BASE_SCALE[index - 1] * increment,
      max: index === BASE_SCALE.length - 1 ? null : scalar * increment,
      color: COLOR_SCALE[index],
    };
  });
};

export default function MapKey({ summaryType, fertType }) {
  const keyArray = getFullKey(summaryType, fertType);

  return (
    <div className={`${manrope.className} key`}>
      {keyArray
        .sort((a, b) => b.min - a.min)
        .map(({ min, max, color }) => {
          let text;
          if (max) {
            text = `${(min / 1000).toLocaleString()} - ${Math.floor(
              (max - 1) / 1000
            ).toLocaleString()}`;
          } else {
            text = `${(min / 1000).toLocaleString()}+`;
          }
          return (
            <div key={`key_${min}`} className="key-row">
              <div className="color-block" style={{ backgroundColor: color }} /> {text} tons
            </div>
          );
        })}
    </div>
  );
}
