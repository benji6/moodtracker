import { useEffect, useRef } from "react";

export default function useInterval(
  callback: (clear: () => void) => void,
  delay: number,
) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const clear = () => clearInterval(intervalId);
    const intervalId = setInterval(() => savedCallback.current(clear), delay);
    return clear;
  }, [delay]);
}
