//@ts-ignore
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { NavigationContainer } from '@react-navigation/native';
//@ts-ignore
import AppLoading from 'expo-app-loading';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useState } from 'react';
import { Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
//import "react-native-gesture-handler"; // TODO this was recommended to be imported in app.js for proper functioning og gesture handler acroose the application
import Application from './src/Application';
import reduxStore from './src/redux';
import BGService from './src/services/backGroundServices';
import { getData, storeData } from './src/services/db/storage';
import { logger } from './src/@logger';
import UNIVERSALS from './src/@universals';
import mqtt from './src/services/backGroundServices/mqtt';
import { serverURL } from './src/@api/baseAxios';
import localStorage from './src/util/localStorage';

//LogBox.ignoreAllLogs(true)

//TODO LogBox.ignoreAllLogs(true);

//EXP: Create the client as outlined in the setup guide
const client = new ApolloClient({
  uri: serverURL,
  cache: new InMemoryCache(),
});

export default function App() {
  const [appLoading, setAppLoading] = useState(true);
  const [appCTX, deviceList] = localStorage({});
  const bgService = useMemo(
    () =>
      new BGService({
        interval: 5000,
        //log: new logger('bg service', log),
      }),
    []
  );

  const linking = {
    prefixes: ['https://app.example.com', 'hueliteapp://'],
    config: {
      screens: {
        getStarted: 'getstarted',
      },
    },
  };

  useEffect(() => {
    try {
      SplashScreen.preventAutoHideAsync();
    } catch (e) {}
    return () => {
      bgService.clearInterval();
    };
  }, []);

  useEffect(() => {
    if (appCTX != undefined && appLoading) {
      setTimeout(async () => {
        await SplashScreen.hideAsync();
        bgService.startInterval();
        setAppLoading(false);
      }, 100);
    }
  }, [appCTX, deviceList]);

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
          <StatusBar style="light" /*  hidden={true} */ />
        </NavigationContainer>
      </Provider>
    </ApolloProvider>
  );
}
