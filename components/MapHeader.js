'use client';

import { useState } from 'react';
import ReactSelect from 'react-select';
import dataSummary from '@/data/counties_with_fertilizer_summary.json';
import YearSlider from './YearSlider';
import { getNiceNumber } from '@/helpers/misc';
import { manrope } from '@/app/fonts';

const TOTAL_YEARS = dataSummary.years.sort();
const FARM_NONF_YEARS = dataSummary.years.filter(year => Number(year) > 1982);

const SUMMARY_OPTIONS = [
  { value: 'total', label: 'Total' },
  { value: 'farm', label: 'Farm' },
  { value: 'nonf', label: 'Non-farm' },
];

const FERT_OPTIONS = [
  { value: 'N', label: 'Nitrogen' },
  { value: 'P', label: 'Phosphorus' },
];

// Header with type dropdowns and year slider for updating map data.
// Also displays the year's sum for the current selection.
export default function MapHeader({
  year,
  setYear,
  summaryType,
  setSummaryType,
  fertType,
  setFertType,
}) {
  const [yearSliderIndex, setYearSliderIndex] = useState(0);

  return (
    <div className={`${manrope.className} header`}>
      <div className="selectors">
        <div className="dropdowns">
          <div className="input-wrapper">
            <label className={manrope.className} for="usage_selector">
              Usage
            </label>
            <ReactSelect
              id="usage_selector"
              value={SUMMARY_OPTIONS.find(obj => obj.value === summaryType)}
              onChange={obj => {
                const newYears = obj.value === 'total' ? TOTAL_YEARS : FARM_NONF_YEARS;
                // if switching out of total type and year is out of non-total range, update year
                if (obj.value !== 'total' && !newYears.some(opt => opt === `${year}`)) {
                  setYear(FARM_NONF_YEARS[0]);
                  setYearSliderIndex(0);
                } else {
                  // regularly align year in case switching categories
                  const newIndex = newYears.indexOf(`${year}`);
                  if (newIndex !== yearSliderIndex) {
                    setYearSliderIndex(newIndex);
                  }
                }
                setSummaryType(obj.value);
              }}
              options={SUMMARY_OPTIONS}
            />
          </div>
          <div className="input-wrapper">
            <label for="fertilizer_selector">Fertilizer</label>
            <ReactSelect
              id="fertilizer_selector"
              value={FERT_OPTIONS.find(obj => obj.value === fertType)}
              onChange={obj => setFertType(obj.value)}
              options={FERT_OPTIONS}
            />
          </div>
          <div className="input-wrapper slider">
            <label for="year_slider">Year</label>
            {summaryType === 'total' ? (
              <YearSlider
                id="year_slider"
                yearList={TOTAL_YEARS}
                yearSliderIndex={yearSliderIndex}
                setYearSliderIndex={setYearSliderIndex}
                setYear={setYear}
              />
            ) : (
              <YearSlider
                id="year_slider"
                yearList={FARM_NONF_YEARS}
                yearSliderIndex={yearSliderIndex}
                setYearSliderIndex={setYearSliderIndex}
                setYear={setYear}
              />
            )}
          </div>
          <h2>{year}</h2>
        </div>
        <div className="selection-total">
          <h3>
            Estimated annual {fertType === 'N' ? 'nitrogen' : 'phosphorus'} usage{' '}
            {summaryType === 'nonf' ? 'on non-farms' : summaryType === 'farms' ? 'on farms' : ''}{' '}
            across all states
          </h3>
          {/* Since values are estimates, for approximate yearly total will share approximate "nice" number */}
          <p>
            ~
            {getNiceNumber(
              dataSummary.max_min_sums[summaryType][fertType].sums_by_year[year] / 1000
            ).toLocaleString()}{' '}
            tons
          </p>
        </div>
      </div>
      <p>Click a county to view details</p>
    </div>
  );
}
