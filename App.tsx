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
import { logger } from "./src/@logger";
import UNIVERSALS from "./src/@universals";
import mqtt from "./src/services/backGroundServices/mqtt"

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

    const tempDeviceList: UNIVERSALS.GLOBALS.DEVICE_t[] = [
      {
        "Mac": "BC:DD:C2:9D:30:15",
        "Hostname": "BDE_CL_F:3_BC:15",
        "timers": [

        ],
        "channel": {
          "state": 6,
          "deviceType": 1,
          "outputChannnel": [
            {
              "type": 0,
              "h": 346,
              "s": 63,
              "v": 100
            }
          ]
        },
        "ssid": "Homelink1",
        "deviceName": "SwimmingPool",
        "IP": "192.168.1.61",
        "localTimeStamp": 1614165902
      },
      {
        "Mac": "DC:4F:22:5F:65:76",
        "Hostname": "BDE_CL_A:3_DC:76",
        "timers": [

        ],
        "channel": {
          "state": 6,
          "deviceType": 1,
          "outputChannnel": [
            {
              "type": 0,
              "h": 180,
              "s": 100,
              "v": 100
            }
          ]
        },
        "ssid": "Homelink1",
        "deviceName": "Hall RGB 02",
        "IP": "192.168.1.70",
        "localTimeStamp": 1614174037
      },
      {
        "Mac": "2C:F4:32:57:74:00",
        "Hostname": "BDE_CL_E:3_2C:00",
        "timers": [

        ],
        "channel": {
          "state": 6,
          "deviceType": 1,
          "outputChannnel": [
            {
              "type": 0,
              "h": 180,
              "s": 100,
              "v": 100
            }
          ]
        },
        "ssid": "Homelink1",
        "deviceName": "Hall RGB 01",
        "IP": "192.168.1.71",
        "localTimeStamp": 1614174102
      },
      {
        "Mac": "40:F5:20:26:C5:02",
        "Hostname": "BDE_NW4_F:3_40:02",
        "timers": [

        ],
        "channel": {
          "state": 10,
          "deviceType": 3,
          "outputChannnel": [
            {
              "type": 1,
              "temprature": 3000,
              "v": 80
            },
            {
              "type": 1,
              "temprature": 3000,
              "v": 80
            },
            {
              "type": 1,
              "temprature": 3000,
              "v": 80
            },
            {
              "type": 1,
              "temprature": 3000,
              "v": 80
            }
          ]
        },
        "ssid": "Homelink1",
        "deviceName": "Hall White 01",
        "IP": "192.168.1.104",
        "localTimeStamp": 1614174214
      }
    ]


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