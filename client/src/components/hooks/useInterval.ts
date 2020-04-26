import * as React from "react";

export default function useInterval(callback: () => void, delay: number) {
  const savedCallback = React.useRef(callback);
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  React.useEffect(() => {
    const intervalId = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(intervalId);
  }, [delay]);
}
