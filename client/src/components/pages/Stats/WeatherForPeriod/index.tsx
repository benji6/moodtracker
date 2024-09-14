import MoodByTemperatureForPeriod from "./MoodByTemperatureForPeriod";
import MoodByWeatherForPeriod from "./MoodByWeatherForPeriod";
import TemperatureForPeriod from "./TemperatureForPeriod";
import WeatherFrequencyForPeriod from "./WeatherFrequencyForPeriod";

interface Props {
  centerXAxisLabels?: boolean;
  dateFrom: Date;
  dateTo: Date;
  xLabels: string[];
}

export default function WeatherForPeriod({
  centerXAxisLabels = false,
  dateFrom,
  dateTo,
  xLabels,
}: Props) {
  return (
    <>
      <WeatherFrequencyForPeriod dateFrom={dateFrom} dateTo={dateTo} />
      <MoodByWeatherForPeriod dateFrom={dateFrom} dateTo={dateTo} />
      <MoodByTemperatureForPeriod dateFrom={dateFrom} dateTo={dateTo} />
      <TemperatureForPeriod
        centerXAxisLabels={centerXAxisLabels}
        dateFrom={dateFrom}
        dateTo={dateTo}
        xLabels={xLabels}
      />
    </>
  );
}
