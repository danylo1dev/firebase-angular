// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  useEmulators: true,
  firebase: {
    apiKey: "AIzaSyATfdAbLMKaAAR_l5jz5KJvmter4Hiu1Wg",
    authDomain: "fir-course-4aa8f.firebaseapp.com",
    projectId: "fir-course-4aa8f",
    storageBucket: "fir-course-4aa8f.appspot.com",
    messagingSenderId: "520722881249",
    appId: "1:520722881249:web:1458526565382d2a9875a0",
  },
  api: {},
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import "zone.js/plugins/zone-error"; // Included with Angular CLI.
