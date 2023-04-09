import { Paper } from "eri";
import LocationString from "../LocationString";
import LocationMap from "../LocationMap";
import Weather from "./Weather";
import {
  floatDegreeFormatter,
  integerMeterFormatter,
} from "../../../formatters/numberFormatters";

interface Props {
  altitude?: number;
  date: Date;
  latitude: number;
  longitude: number;
}

export default function Location({
  altitude,
  date,
  latitude,
  longitude,
}: Props) {
  return (
    <>
      <Paper>
        <h3>Location</h3>
        <LocationMap>
          <LocationMap.Marker latitude={latitude} longitude={longitude} />
        </LocationMap>
        <p className="center">
          <LocationString
            latitude={latitude}
            longitude={longitude}
            successPostfix={<br />}
          />
          <small>
            <table>
              <thead>
                <th>Coordinate</th>
                <th>Value</th>
              </thead>
              <tbody>
                <tr>
                  <td>Latitude</td>
                  <td>{floatDegreeFormatter.format(latitude)}</td>
                </tr>
                <tr>
                  <td>Longitude</td>
                  <td>{floatDegreeFormatter.format(longitude)}</td>
                </tr>
                {altitude && (
                  <tr>
                    <td>Altitude</td>
                    <td>{integerMeterFormatter.format(altitude)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </small>
        </p>
      </Paper>
      <Weather date={date} latitude={latitude} longitude={longitude} />
    </>
  );
}
