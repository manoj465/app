import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { NavigationContainer } from "@react-navigation/native";
import AppLoading from "expo-app-loading";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useState } from "react";
import { Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
//import "react-native-gesture-handler"; // TODO this was recommended to be imported in app.js for proper functioning og gesture handler acroose the application
import Application from "./src/Application";
import { reduxStore } from "./src/redux";
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
  const [appCTX, setappCTX] = useState({});
  const bgService = useMemo(() => new BGService(6000), [])
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
    //await storeData("containers", null);//REMOVE
    await storeData("appCTX", null);//REMOVE

    const deviceList = await getData("deviceList");
    //REMOVElog("deviceList Size is  " + deviceList?.length);
    //let deviceList: types.HUE_DEVICE_t[] = []
    //deviceList = await getData("deviceList");
    if (deviceList) {
      log.print("deviceList data ::  " + JSON.stringify(deviceList));
      reduxStore.store.dispatch(reduxStore.actions.deviceList.redux({ deviceList }));
    } else log.print("NO devices data Found in storage");


    const _appCTX = await getData("appCTX");
    log.print("[APPCTX] >>" + JSON.stringify(_appCTX))
    if (_appCTX) {
      log.print("appCTX is  " + JSON.stringify(_appCTX));
      setappCTX(_appCTX)
      reduxStore.store.dispatch(reduxStore.actions.appCTX.appCtxSagaAction({ data: _appCTX, saveToDB: true /*, log */ }));
      bgService.startInterval()
    }
    setTimeout(async () => {
      await SplashScreen.hideAsync();
      setAppLoading(false);
    }, 100);
  };

  useEffect(() => {
    try {
      SplashScreen.preventAutoHideAsync();
    } catch (e) { }
    loadAppData();
    return () => {
    }
  }, [])

  useEffect(() => {
    bgService.startInterval()
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
            <ActionSheetProvider>
              <Application />
            </ActionSheetProvider>
          </SafeAreaProvider>
          <StatusBar style="auto" />
        </NavigationContainer>
      </Provider>
    </ApolloProvider>
  );
}