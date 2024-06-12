export default function YearSlider({ yearList, yearSliderIndex, setYearSliderIndex, setYear }) {
  return (
    <input
      onChange={e => {
        setYearSliderIndex(e.target.value);
        setYear(yearList[e.target.value]);
      }}
      value={yearSliderIndex}
      type="range"
      min={0}
      max={yearList.length - 1}
      step={1}
    />
  );
}
