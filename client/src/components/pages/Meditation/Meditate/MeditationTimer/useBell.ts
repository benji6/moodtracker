import { useEffect, useRef } from "react";
import useHasBeenActive from "../../../../hooks/useHasBeenActive";

const meditationBellUri = String(
  new URL("meditation-bell.mp3", import.meta.url),
);

const arrayBufferPromise = fetch(meditationBellUri).then((response) =>
  response.arrayBuffer(),
);

let audioBufferPromise: Promise<AudioBuffer>;

interface Bell {
  start(): void;
  stop(): void;
}

export default function useBell(): Bell | void {
  const bellRef = useRef<Bell>();
  const hasBeenActive = useHasBeenActive();

  useEffect(() => {
    if (!hasBeenActive) return;

    const audioContext = new AudioContext();
    let bufferSource: AudioBufferSourceNode | undefined;

    if (!audioBufferPromise)
      audioBufferPromise = arrayBufferPromise.then((arrayBuffer) =>
        audioContext.decodeAudioData(arrayBuffer),
      );

    bellRef.current = {
      async start() {
        stop();
        bufferSource = audioContext.createBufferSource();
        bufferSource.connect(audioContext.destination);
        bufferSource.buffer = await audioBufferPromise;
        bufferSource.onended = stop;
        bufferSource.start();
      },
      stop() {
        if (!bufferSource) return;
        bufferSource.stop();
        bufferSource.disconnect();
        bufferSource = undefined;
      },
    };
  }, [hasBeenActive]);

  return bellRef.current;
}
