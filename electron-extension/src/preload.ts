// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

// Preload Script
import { contextBridge } from 'electron';

// declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
// declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// this should print out the value of MY_ENVIRONMENT_VARIABLE
console.log(process.env);
console.log([
    // MAIN_WINDOW_WEBPACK_ENTRY,
    //MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
])

contextBridge.exposeInMainWorld('envVars', {
  APP_URL: process.env.APP_URL
});
