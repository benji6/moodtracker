/* eslint-disable @typescript-eslint/no-explicit-any */
import "./sentry";
import { join as pathJoin } from "path";

const CACHE_NAME = "v1";
const CACHE_LIST = (process.env.CACHE_LIST as string).split(",");

const sw: any = self;

const cacheListWithHost = CACHE_LIST.map((resource) =>
  pathJoin(location.host, resource)
);

const rejectAfterTimeout = (t: number): Promise<never> =>
  new Promise((_, reject) =>
    setTimeout(() => reject(Error(`Timed out after ${t}ms`)), t)
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

sw.oninstall = (event: any) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      return cache.addAll(CACHE_LIST);
    })()
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
    })()
  );
};
