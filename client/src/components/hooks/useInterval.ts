import * as React from "react";

export default function useInterval(
  callback: (clear: () => void) => void,
  delay: number
) {
  const savedCallback = React.useRef(callback);

  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  React.useEffect(() => {
    const clear = () => clearInterval(intervalId);
    const intervalId = setInterval(() => savedCallback.current(clear), delay);
    return clear;
  }, [delay]);
}
