//@ts-ignore
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { NavigationContainer } from "@react-navigation/native";
//@ts-ignore
import AppLoading from "expo-app-loading";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useState } from "react";
import { Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
//import "react-native-gesture-handler"; // TODO this was recommended to be imported in app.js for proper functioning og gesture handler acroose the application
import Application from "./src/Application";
import reduxStore from "./src/redux";
import BGService from "./src/services/backGroundServices";
import { getData, storeData } from "./src/services/db/storage";
import { logger } from "./src/util/logger";

//LogBox.ignoreAllLogs(true)

//TODO LogBox.ignoreAllLogs(true);

//EXP: Create the client as outlined in the setup guide
const client = new ApolloClient({
  uri: "http://192.168.1.6",
  cache: new InMemoryCache(),
});

export default function App() {
  const log = new logger("MAIN ACTIVITY")
  const [appLoading, setAppLoading] = useState(true);
  const [appCTX, setappCTX] = useState<any>(undefined);
  const bgService = useMemo(() => new BGService({ interval: 6000, log: new logger("bg service", log) }), [])
  const linking = {
    prefixes: ['https://app.example.com', 'hueliteapp://'],
    config: {
      screens: {
        getStarted: "getstarted"
      }
    }
  };

  const loadAppData = async () => {


    //EXP: store dummy data in storage
    //log("Dummy Data data ::  " + JSON.stringify(HallRGBGroupDummyData));
    //await storeData("deviceList", HallRGBGroupDummyData);
    //EXP: remove data from storage
    //await storeData("deviceList", null);//REMOVE
    //await storeData("appCTX", null);//REMOVE

    /* if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log("This is running as standalone.");
    } else if (window.matchMedia('(display-mode: browser)').matches) {
      console.log("This is running as browser.");
    }
    else {
      console.log("This is not running as standalone.");
    } */


    const deletedDeviceList = await getData("deletedDeviceList")
    if (deletedDeviceList) {
      log.print("deletedDeviceList " + JSON.stringify(deletedDeviceList, null, 1))
      reduxStore.store.dispatch(reduxStore.actions.deviceList.deletedDeviceListRedux({ deletedDeviceList, isDbState: true }))
    }

    const deviceList = await getData("deviceList");
    log.print("deviceList data ::  " + JSON.stringify(deviceList));
    if (deviceList)
      reduxStore.store.dispatch(reduxStore.actions.deviceList.deviceListRedux({ deviceList }));

    const _appCTX = await getData("appCTX");
    log.print("[APPCTX] >>" + JSON.stringify(_appCTX))
    if (_appCTX) {
      log.print("appCTX is  " + JSON.stringify(_appCTX));
      setappCTX(_appCTX)
      reduxStore.store.dispatch(reduxStore.actions.appCTX.appCtxSagaAction({ data: _appCTX, saveToDB: false /*, log */ }));
    }
    else
      setappCTX({})
    setTimeout(async () => {
      await SplashScreen.hideAsync();
      bgService.startInterval()
      setAppLoading(false);
    }, 100);
  }

  useEffect(() => {
    try {
      SplashScreen.preventAutoHideAsync();
    } catch (e) { }
    loadAppData();
    return () => {
      bgService.clearInterval()
    }
  }, [])



  if (appLoading) return <AppLoading />;
  return (
    <ApolloProvider client={client}>
      <Provider store={reduxStore.store}>
        <NavigationContainer /* linking={linking}  */ fallback={<Text>Loading...</Text>}>
          {/*  <BackgroundService /> */}
          <SafeAreaProvider>
            <StatusBar backgroundColor="transparent" />
            <ActionSheetProvider>
              <Application />
            </ActionSheetProvider>
          </SafeAreaProvider>
          <StatusBar style="light"/*  hidden={true} */ />
        </NavigationContainer>
      </Provider>
    </ApolloProvider>
  );
}