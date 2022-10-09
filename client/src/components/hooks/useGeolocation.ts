import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { settingsRecordLocationSelector } from "../../selectors";
import deviceSlice from "../../store/deviceSlice";
import { DeviceGeolocation } from "../../types";

export default function useGeolocation() {
  const shouldRecordLocation = useSelector(settingsRecordLocationSelector);
  const dispatch = useDispatch();

  const idRef = React.useRef<number | undefined>();

  React.useEffect(() => {
    if (!shouldRecordLocation) {
      if (idRef.current !== undefined)
        navigator.geolocation.clearWatch(idRef.current);
      dispatch(deviceSlice.actions.clear());
      return;
    }
    idRef.current = navigator.geolocation.watchPosition(
      ({ coords: { accuracy, latitude, longitude } }) => {
        const geolocation: DeviceGeolocation = {
          // meters
          accuracy: Math.round(accuracy),

          // Should be accurate to around 10 meters https://en.wikipedia.org/wiki/Decimal_degrees#Precision
          // This should be sufficient given the accuracy value is typically in excess of that
          latitude: Number(latitude.toFixed(4)),
          longitude: Number(longitude.toFixed(4)),
        };

        dispatch(deviceSlice.actions.setGeolocation(geolocation));
      }
    );
  }, [dispatch, shouldRecordLocation]);
}
