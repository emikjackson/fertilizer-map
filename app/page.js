import './page.css';
import dynamic from 'next/dynamic';

const DynamicMap = dynamic(() => import('../components/Map'), { ssr: false });

export default function Home() {
  return (
    <main>
      <div className="large-column">
        <h1>Fertilizer Usage by County, 1950 - 2017</h1>
        <p>Data Sources:</p>
        <ul>
          <li>
            Falcone, J.A., 2021, Tabular county-level nitrogen and phosphorus estimates from
            fertilizer and manure for approximately 5-year periods from 1950 to 2017: U.S.
            Geological Survey data release, https://doi.org/10.5066/P9VSQN3C.
          </li>
          <li>
            Brakebill, J.W. and Gronberg, J.M., 2017, County-Level Estimates of Nitrogen and
            Phosphorus from Commercial Fertilizer for the Conterminous United States, 1987-2012:
            U.S. Geological Survey data release, https://doi.org/10.5066/F7H41PKX.
          </li>
        </ul>
        <DynamicMap />
      </div>
    </main>
  );
}
