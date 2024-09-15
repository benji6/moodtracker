import MoodByTemperatureForPeriod from "./MoodByTemperatureForPeriod";
import MoodByWeatherForPeriod from "./MoodByWeatherForPeriod";
import { RootState } from "../../../../store";
import TemperatureForPeriod from "./TemperatureForPeriod";
import WeatherFrequencyForPeriod from "./WeatherFrequencyForPeriod";
import eventsSlice from "../../../../store/eventsSlice";
import { useSelector } from "react-redux";
import { useWeatherQueries } from "../../../hooks/weatherHooks";

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
  const normalizedMoods = useSelector(eventsSlice.selectors.normalizedMoods);
  const envelopingEventIdsWithLocation = useSelector((state: RootState) =>
    eventsSlice.selectors.envelopingIdsWithLocation(state, dateFrom, dateTo),
  );
  const eventIdsWithLocationInPeriod = [];
  const moodIdsWithLocationInPeriod = [];
  const weatherResultsForEnvelopingEvents = useWeatherQueries(
    envelopingEventIdsWithLocation,
  );

  const weatherResultsForEventsInPeriod = [];
  const weatherResultsForMoodsInPeriod = [];
  for (let i = 0; i < envelopingEventIdsWithLocation.length; i++) {
    const id = envelopingEventIdsWithLocation[i];
    const weatherResult = weatherResultsForEnvelopingEvents[i];
    if (id < dateFrom.toISOString() || id > dateTo.toISOString()) continue;
    eventIdsWithLocationInPeriod.push(id);
    weatherResultsForEventsInPeriod.push(weatherResult);
    if (id in normalizedMoods.byId) {
      moodIdsWithLocationInPeriod.push(id);
      weatherResultsForMoodsInPeriod.push(weatherResult);
    }
  }

  return (
    <>
      <WeatherFrequencyForPeriod
        eventIds={eventIdsWithLocationInPeriod}
        weatherResults={weatherResultsForEventsInPeriod}
      />
      <MoodByWeatherForPeriod
        moodIds={moodIdsWithLocationInPeriod}
        weatherResults={weatherResultsForMoodsInPeriod}
      />
      <MoodByTemperatureForPeriod
        moodIds={moodIdsWithLocationInPeriod}
        weatherResults={weatherResultsForMoodsInPeriod}
      />
      <TemperatureForPeriod
        centerXAxisLabels={centerXAxisLabels}
        dateFrom={dateFrom}
        dateTo={dateTo}
        eventIds={envelopingEventIdsWithLocation}
        weatherResults={weatherResultsForEnvelopingEvents}
        xLabels={xLabels}
      />
    </>
  );
}
