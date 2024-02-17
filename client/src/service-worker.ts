/* eslint-disable @typescript-eslint/no-explicit-any */
import "./sentry";
import { FIREBASE_CONFIG } from "./constants";
import { getMessaging } from "firebase/messaging/sw";
import { initializeApp } from "firebase/app";
import { join as pathJoin } from "path";

const CACHE_NAME = "v1";
const CACHE_LIST =
  process.env.NODE_ENV === "production"
    ? (process.env.CACHE_LIST as string).split(",")
    : [];

const sw: any = self;

const firebaseApp = initializeApp(FIREBASE_CONFIG);

getMessaging(firebaseApp);

const cacheSet = new Set(CACHE_LIST);
const cacheListWithHost = CACHE_LIST.map((resource) =>
  pathJoin(location.host, resource),
);

const rejectAfterTimeout = (t: number): Promise<never> =>
  new Promise((_, reject) =>
    setTimeout(() => reject(Error(`Timed out after ${t}ms`)), t),
  );

const customFetch = async (request: Request): Promise<Response> => {
  const response = await Promise.race([
    fetch(request),
    rejectAfterTimeout(1e3),
  ]);
  const { status } = response;
  if (status >= 500 && status < 600) throw Error(String(status));
  return response;
};

sw.oninstall = (event: any) =>
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CACHE_LIST)),
  );

sw.onactivate = (event: any) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const keys = await cache.keys();
      for (const request of keys) {
        const { pathname } = new URL(request.url);
        if (cacheSet.has(pathname === "/" ? "/" : pathname.slice(1))) continue;
        cache.delete(request);
      }
    })(),
  );
};

sw.onfetch = (event: any) => {
  if (!cacheListWithHost.some((item) => event.request.url.endsWith(item)))
    return;
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        const networkResponse = await customFetch(event.request);
        event.waitUntil(cache.put(event.request, networkResponse.clone()));
        return networkResponse;
      } catch (e) {
        const cachedResponse = await cache.match(event.request);
        if (!cachedResponse) throw e;
        return cachedResponse;
      }
    })(),
  );
};
