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
import { types } from "./src/@types/huelite/globalTypes";
//import "react-native-gesture-handler";
import Application from "./src/Application";
import { reduxStore } from "./src/redux";
import { appCTXAction } from "./src/redux/actions/AppCTXActions";
import BGService from "./src/services/backGroundServices";
import { getData } from "./src/services/db/storage";
import { logFun } from "./src/util/logger";

console.disableYellowBox = true;

//TODO LogBox.ignoreAllLogs(true);

//EXP: Create the client as outlined in the setup guide
const client = new ApolloClient({
  uri: "http://192.168.1.6",
  cache: new InMemoryCache(),
});

export default function App() {
  const log = logFun("MAIN ACTIVITY", undefined, true)
  const [appLoading, setAppLoading] = useState(true);
  const [appCTX, setappCTX] = useState({});
  const bgService = useMemo(() => new BGService(6000, log), [])
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
    //await storeData("appCTX", null);//REMOVE

    const deviceList = await getData("deviceList");
    //REMOVElog("deviceList Size is  " + deviceList?.length);
    //let deviceList: types.HUE_DEVICE_t[] = []
    //deviceList = await getData("deviceList");
    if (deviceList) {
      log("deviceList data ::  " + JSON.stringify(deviceList));
      await reduxStore.store.dispatch(reduxStore.actions.deviceList.redux({ deviceList }));
    } else log("NO devices data Found in storage");


    const _appCTX = await getData("appCTX");
    console.log("[APPCTX] >>" + JSON.stringify(_appCTX))
    if (_appCTX) {
      log("appCTX is  " + JSON.stringify(_appCTX));
      await setappCTX(_appCTX)
      await reduxStore.store.dispatch(appCTXAction({ appCTX: _appCTX }));//TODO this is to be redux action and store only in saga side-effect. no need to store this data as it is from the memory itself 
    }
    setTimeout(async () => {
      await SplashScreen.hideAsync();
      setAppLoading(false);
    }, 100);
  };

  useEffect(() => {
    try {
      SplashScreen.preventAutoHideAsync();
    } catch (e) {
      //console.warn(e);
    }
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