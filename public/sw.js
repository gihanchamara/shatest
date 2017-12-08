importScripts('bower_components/sw-toolbox/sw-toolbox.js');

const VERSION = '1.0';
const CACHENAME = 'Test';

//Uncomment to enable Service worker caching
toolbox.precache([
  //'/elements/views/dashboard/dashboard-view.html',
  '/bower_components/px-typography-design/type/GEInspiraSans.ttf',
  '/bower_components/px-typography-design/type/GEInspiraSans.woff',
  '/bower_components/px-typography-design/type/GEInspiraSans.woff2',
  '/bower_components/px-typography-design/type/GEInspiraSans-Bold.ttf',
  '/bower_components/px-typography-design/type/GEInspiraSans-Bold.woff',
  '/bower_components/px-typography-design/type/GEInspiraSans-Bold.woff2'
]);

self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

//Uncomment to enable Service worker caching

// toolbox.router.get('/(.*)', self.toolbox.fastest, {
//     'networkTimeoutSeconds': 2,
//     'cache': {
//       'name': CACHENAME +VERSION
//     }
// });

// toolbox.router.get(/external-site.DOT.COM/, self.toolbox.fastest, {
//   'cache': {
//     'name': CACHENAME +VERSION
//   }
// });
