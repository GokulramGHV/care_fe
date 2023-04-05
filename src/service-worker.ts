/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.

import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute } from "workbox-precaching";
// import { createHandlerBoundToURL } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";
import { NetworkFirst } from "workbox-strategies";

declare const self: ServiceWorkerGlobalScope;

clientsClaim();

const toPrecache = self.__WB_MANIFEST.filter((file) => {
  // Check if file is a string
  if (typeof file === "string") {
    return !file.includes("index.html");
  } else {
    return !file.url.includes("index.html");
  }
});

// Precache all of the assets generated by your build process.
// Their URLs are injected into the manifest variable below.
// This variable must be present somewhere in your service worker file,
// even if you decide not to use precaching. See https://cra.link/PWA
// precacheAndRoute(self.__WB_MANIFEST);
precacheAndRoute(toPrecache);

// Set up App Shell-style routing, so that all navigation requests
// are fulfilled with your index.html shell. Learn more at
// https://developers.google.com/web/fundamentals/architecture/app-shell
// const fileExtensionRegexp = new RegExp("/[^/?]+\\.[^/]+$");
// registerRoute(
//   // Return false to exempt requests from being fulfilled by index.html.
//   ({ request, url }: { request: Request; url: URL }) => {
//     // If this isn't a navigation, skip.
//     if (request.mode !== "navigate") {
//       return false;
//     }

//     // If this is a URL that starts with /_, skip.
//     if (url.pathname.startsWith("/_")) {
//       return false;
//     }

//     // If this looks like a URL for a resource, because it contains
//     // a file extension, skip.
//     if (url.pathname.match(fileExtensionRegexp)) {
//       return false;
//     }

//     // Return true to signal that we want to use the handler.
//     return true;
//   },
//   createHandlerBoundToURL(import.meta.env.REACT_PUBLIC_URL + "/index.html")
// );

registerRoute(
  ({ url }) => url.pathname.includes("index.html"),
  new NetworkFirst()
);

// An example runtime caching route for requests that aren't handled by the
// precache, in this case same-origin .png requests like those from in public/
registerRoute(
  // Add in any other file extensions or routing criteria as needed.
  ({ url }) =>
    url.origin === self.location.origin && url.pathname.endsWith(".png"),
  // Customize this strategy as needed, e.g., by changing to CacheFirst.
  new StaleWhileRevalidate({
    cacheName: "images",
    plugins: [
      // Ensure that once this runtime cache reaches a maximum size the
      // least-recently used images are removed.
      new ExpirationPlugin({ maxEntries: 50 }),
    ],
  })
);

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Any other custom service worker logic can go here.
self.addEventListener("push", async function (event) {
  if (event.data) {
    const data = JSON.parse(event.data.text());

    if (data?.type === "MESSAGE") {
      self.clients.matchAll().then((clients) => {
        clients[0].postMessage(data);
      });
    } else {
      event.waitUntil(
        self.registration.showNotification("Care - CoronaSafe Network", {
          body: data.title,
          tag: data.external_id,
        })
      );
    }
  }
});

// Notification click event listener
self.addEventListener("notificationclick", (e) => {
  // Close the notification popout
  e.notification.close();
  // Get all the Window clients
  e.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clientsArr) => {
      // If a Window tab matching the targeted URL already exists, focus that;
      const hadWindowToFocus = clientsArr.some((windowClient) =>
        windowClient.url === "/notifications/".concat(e.notification.tag)
          ? (windowClient.focus(), true)
          : false
      );
      // Otherwise, open a new tab to the applicable URL and focus it.
      if (!hadWindowToFocus)
        self.clients
          .openWindow("/notifications/".concat(e.notification.tag))
          .then((windowClient) => (windowClient ? windowClient.focus() : null));
    })
  );
});
