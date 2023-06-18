export default navigator.serviceWorker.register(
  new URL("service-worker.ts", import.meta.url),
  { type: "module" }
);
