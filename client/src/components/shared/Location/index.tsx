import LocationMap from "../LocationMap";
import LocationString from "../LocationString";
import { Paper } from "eri";
import Weather from "./Weather";
import { floatDegreeFormatter } from "../../../formatters/numberFormatters";
import { integerMeterFormatter } from "../../../formatters/formatDistance";

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
        </p>
        <small>
          <table>
            <thead>
              <tr>
                <th>Coordinate</th>
                <th>Value</th>
              </tr>
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
              {altitude !== undefined && (
                <tr>
                  <td>Altitude</td>
                  <td>{integerMeterFormatter.format(altitude)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </small>
      </Paper>
      <Weather date={date} latitude={latitude} longitude={longitude} />
    </>
  );
}
