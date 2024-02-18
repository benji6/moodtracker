/* eslint-disable @typescript-eslint/no-explicit-any */
import "./sentry";
import { FIREBASE_CONFIG } from "./constants";
import { getMessaging } from "firebase/messaging/sw";
import { initializeApp } from "firebase/app";

const CACHE_NAME = "v1";
const CACHE_FIRST_CACHE =
  process.env.NODE_ENV === "production"
    ? process.env.CACHE_FIRST_CACHE!.split(",")
    : [];
const NETWORK_FIRST_CACHE =
  process.env.NODE_ENV === "production"
    ? process.env.NETWORK_FIRST_CACHE!.split(",")
    : [];

const cacheList = [...CACHE_FIRST_CACHE, ...NETWORK_FIRST_CACHE];
const cacheSet = new Set(cacheList);
const cacheFirstSetWithFullUrls = new Set(
  CACHE_FIRST_CACHE.map((path) => String(new URL(path, location.origin))),
);
const networkFirstSetWithFullUrls = new Set(
  NETWORK_FIRST_CACHE.map((path) => String(new URL(path, location.origin))),
);

const sw: any = self;

const firebaseApp = initializeApp(FIREBASE_CONFIG);

getMessaging(firebaseApp);

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
    caches.open(CACHE_NAME).then((cache) => cache.addAll(cacheList)),
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
  const isInCacheFirstCache = cacheFirstSetWithFullUrls.has(event.request.url);
  const isInNetworkFirstCache = networkFirstSetWithFullUrls.has(
    event.request.url,
  );
  if (!isInCacheFirstCache && !isInNetworkFirstCache) return;
  if (isInNetworkFirstCache)
    return event.respondWith(
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
  event.respondWith(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.match(event.request))
      .then((cachedResponse) => {
        if (!cachedResponse)
          throw Error(`${event.request.url}: Not found in cache`);
        return cachedResponse;
      }),
  );
};
