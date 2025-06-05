import { captureException } from "../../sentry";
import { DeviceGeolocation } from "../../types";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import deviceSlice from "../../store/deviceSlice";
import settingsSlice from "../../store/settingsSlice";

export default function useGeolocation() {
  const shouldRecordLocation = useSelector(
    settingsSlice.selectors.recordLocation,
  );
  const dispatch = useDispatch();

  const idRef = useRef<number>(undefined);

  useEffect(() => {
    if (!shouldRecordLocation) {
      if (idRef.current !== undefined)
        navigator.geolocation.clearWatch(idRef.current);
      dispatch(deviceSlice.actions.clear());
      return;
    }
    const positionCallback: PositionCallback = ({
      coords: { accuracy, altitude, altitudeAccuracy, latitude, longitude },
    }) => {
      const geolocation: DeviceGeolocation = {
        // meters
        accuracy: Math.round(accuracy),
        // Should be accurate to around 10 meters https://en.wikipedia.org/wiki/Decimal_degrees#Precision
        // This should be sufficient given the accuracy value is typically in excess of that
        latitude: Number(latitude.toFixed(4)),
        longitude: Number(longitude.toFixed(4)),
      };
      if (altitude !== null) {
        geolocation.altitude = Math.round(altitude);
        if (altitudeAccuracy !== null)
          geolocation.altitudeAccuracy = Math.round(altitudeAccuracy);
      }
      dispatch(deviceSlice.actions.setGeolocation(geolocation));
    };
    navigator.geolocation.getCurrentPosition(
      positionCallback,
      captureException,
      // 10 seconds: `maximumAge` units are milliseconds
      { maximumAge: 1e4 },
    );
    idRef.current = navigator.geolocation.watchPosition(
      positionCallback,
      captureException,
      // 10 seconds: `maximumAge` units are milliseconds
      { maximumAge: 1e4 },
    );
  }, [dispatch, shouldRecordLocation]);
}
