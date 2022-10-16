import { Paper } from "eri";
import LocationMap from "../LocationMap";

interface Props {
  latitude: number;
  longitude: number;
}

export default function Location({ latitude, longitude }: Props) {
  return (
    <Paper>
      <h3>Location</h3>
      <LocationMap>
        <LocationMap.Marker latitude={latitude} longitude={longitude} />
      </LocationMap>
      <p className="center">
        <small>Latitude: {latitude}</small> |{" "}
        <small>Longitude: {longitude}</small>
      </p>
    </Paper>
  );
}
