import './page.css';
import dynamic from 'next/dynamic';

const DynamicMap = dynamic(() => import('../components/Map'), { ssr: false });

export default function Home() {
  return (
    <main>
      <div className="section primary">
        <div className="large-column">
          <h1>Estimated Fertilizer Usage by U.S. County, 1950 - 2017 (USGS)</h1>
          <p>
            Nitrogen & Phosphorus fertilizers are popularly used in both farm and non-farm settings
            across the United States. Although fertilizers can greatly increase agricultural and
            garden yields, fertilizer use and overuse may result in diminished soil health,
            diminished nutritional density of crops, and have negative downstream impacts on the
            environment. This map explores the estimated fertilizer usage for farm, non-farm, and
            combined total settings over time. Click on a county to view a specific county&apos;s
            values.
          </p>
          <p>Visualized with Leaflet, data prepared for mapping with Python.</p>
          <div class="break" />
          <p style={{ fontStyle: 'italic' }}>
            Source: Falcone, J.A., 2021, Tabular county-level nitrogen and phosphorus estimates from
            fertilizer and manure for approximately 5-year periods from 1950 to 2017: U.S.
            Geological Survey data release,{' '}
            <a href="https://doi.org/10.5066/P9VSQN3C" target="_blank" rel="noopener noreferrer">
              https://doi.org/10.5066/P9VSQN3C
            </a>
            .
          </p>
          <p style={{ fontStyle: 'italic' }}>
            Separated &apos;farm&apos; and &apos;non-farm&apos; values are only available from 1987
            onwards.
          </p>
        </div>
      </div>
      <div className="section secondary">
        <div className="large-column">
          <DynamicMap />
        </div>
      </div>
    </main>
  );
}
