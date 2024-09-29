import MoodByTemperatureForPeriod from "./MoodByTemperatureForPeriod";
import MoodByWeatherForPeriod from "./MoodByWeatherForPeriod";
import { RootState } from "../../../../store";
import TemperatureForPeriod from "./TemperatureForPeriod";
import { UseQueryResult } from "@tanstack/react-query";
import { WeatherApiResponse } from "../../../../types";
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
  const weatherResultsDataForEnvelopingEvents = [];
  const weatherResultStatusesForEnvelopingEvents: UseQueryResult<
    WeatherApiResponse,
    Error
  >["status"][] = [];

  const weatherResultsDataForEventsInPeriod = [];
  const weatherResultStatusesForEventsInPeriod: UseQueryResult<
    WeatherApiResponse,
    Error
  >["status"][] = [];

  const weatherResultsDataForMoodsInPeriod = [];
  const weatherResultStatusesForMoodsInPeriod: UseQueryResult<
    WeatherApiResponse,
    Error
  >["status"][] = [];
  for (let i = 0; i < envelopingEventIdsWithLocation.length; i++) {
    const id = envelopingEventIdsWithLocation[i];

    // Reading status (and maybe data - I only tested status)
    // is expensive so we are minimizing this operation
    const { data, status } = weatherResultsForEnvelopingEvents[i];
    weatherResultStatusesForEnvelopingEvents.push(status);
    weatherResultsDataForEnvelopingEvents.push(data);
    if (id < dateFrom.toISOString() || id > dateTo.toISOString()) continue;
    eventIdsWithLocationInPeriod.push(id);
    weatherResultStatusesForEventsInPeriod.push(status);
    weatherResultsDataForEventsInPeriod.push(data);
    if (id in normalizedMoods.byId) {
      moodIdsWithLocationInPeriod.push(id);
      weatherResultStatusesForMoodsInPeriod.push(status);
      weatherResultsDataForMoodsInPeriod.push(data);
    }
  }

  return (
    <>
      <WeatherFrequencyForPeriod
        eventIds={eventIdsWithLocationInPeriod}
        weatherResultsData={weatherResultsDataForEventsInPeriod}
        weatherResultStatuses={weatherResultStatusesForEventsInPeriod}
      />
      <MoodByWeatherForPeriod
        moodIds={moodIdsWithLocationInPeriod}
        weatherResultsData={weatherResultsDataForMoodsInPeriod}
        weatherResultStatuses={weatherResultStatusesForMoodsInPeriod}
      />
      <MoodByTemperatureForPeriod
        moodIds={moodIdsWithLocationInPeriod}
        weatherResultsData={weatherResultsDataForMoodsInPeriod}
        weatherResultStatuses={weatherResultStatusesForMoodsInPeriod}
      />
      <TemperatureForPeriod
        centerXAxisLabels={centerXAxisLabels}
        dateFrom={dateFrom}
        dateTo={dateTo}
        eventIds={envelopingEventIdsWithLocation}
        weatherResultsData={weatherResultsDataForEnvelopingEvents}
        weatherResultStatuses={weatherResultStatusesForEnvelopingEvents}
        xLabels={xLabels}
      />
    </>
  );
}
