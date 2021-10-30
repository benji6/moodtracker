const meditationBellUri = String(
  new URL("meditation-bell.mp3", import.meta.url)
);

const audioContext = typeof AudioContext !== "undefined" && new AudioContext();
let bufferSource: AudioBufferSourceNode | null = null;

const bufferPromise =
  audioContext &&
  fetch(meditationBellUri)
    .then((response) => response.arrayBuffer())
    .then((data) => audioContext.decodeAudioData(data));

const start = async () => {
  if (!audioContext || !bufferPromise) return;
  const buffer = await bufferPromise;
  stop();
  bufferSource = audioContext.createBufferSource();
  bufferSource.connect(audioContext.destination);
  bufferSource.buffer = buffer;
  bufferSource.onended = stop;
  bufferSource.start();
};

const stop = () => {
  if (!bufferSource) return;
  bufferSource.stop();
  bufferSource.disconnect();
  bufferSource = null;
};

export default { start, stop };
