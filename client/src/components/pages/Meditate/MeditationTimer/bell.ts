const meditationBellUri = String(
  new URL("meditation-bell.mp3", import.meta.url)
);

const audioContext = new AudioContext();
let bufferSource: AudioBufferSourceNode | undefined;

const bufferPromise = fetch(meditationBellUri)
  .then((response) => response.arrayBuffer())
  .then((data) => audioContext.decodeAudioData(data));

const start = async () => {
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
  bufferSource = undefined;
};

export default { start, stop };
