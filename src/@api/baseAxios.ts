import Constants from 'expo-constants';

export const serverURL =
  Constants.manifest.extra.ENVIRONMENT == 'development'
    ? 'http://122.160.78.24:4000/development'
    : 'http://server.huelite.in/backend';
//export const serverURL = 'http://server.huelite.in/backend';
//export const serverURL = 'http://192.168.1.6:4000/backend';
//export const serverURL = "http://223.190.29.65:4000/backend" /** local PC */
