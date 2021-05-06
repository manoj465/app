import { createStackNavigator, StackNavigationProp, CardStyleInterpolators } from "@react-navigation/stack";
import React from "react";
import UNIVERSALS from "../@universals";
import AppConfigScreen from "../components/screens/appConfig";
import { Dashboard } from "../components/screens/dashboard";
import DevicePage from "../components/screens/devicePage";
import { WelcomeScreen } from "../components/screens/onboarding/WelcomeScreen";
import PairingScreen from "../components/screens/pairing/PairingConnectorScreen1";
import UserProfileScreen from "../components/screens/userProfile";
import { deviceContainerType } from "../util/dummyData/DummyData";
import SetupDeviceScreen from "../components/screens/devicePage/SetupScreen";


export type MainRouterStackParamList = {
  //login_signup: undefined;
  setupDevice: { device: UNIVERSALS.GLOBALS.DEVICE_t }
  onboarding: undefined;
  pairing: undefined;
  //DashboardRouter: undefined;
  config: undefined;
  user: undefined;
  dashboard: undefined;
  devicePage: { device: UNIVERSALS.GLOBALS.DEVICE_t };
  deviceObjectPage: { group: deviceContainerType };
};

export type MainRouterNavigationProp = StackNavigationProp<MainRouterStackParamList>;
const Stack = createStackNavigator<MainRouterStackParamList>();
const MainRouter = (props: any) => {
  return (
    <Stack.Navigator
      initialRouteName={props.initialScreen ? props.initialScreen : "DashboardRouter"}
      //initialRouteName="user"
      screenOptions={{
        //headerShown: false,
        cardStyle: {
          opacity: 1,
          backgroundColor: "#fff",
        },
      }}
    >
      {/* <Stack.Screen name="login_signup" component={GetStarted} /> */}
      <Stack.Screen name="onboarding" component={WelcomeScreen} />
      <Stack.Screen
        name="pairing"
        component={PairingScreen}
        options={{ title: 'Add new device' }} />
      <Stack.Screen
        name="dashboard"
        component={Dashboard}
        options={{ headerShown: false }} />
      <Stack.Screen name="config" component={AppConfigScreen} />
      <Stack.Screen name="user" component={UserProfileScreen} />
      <Stack.Screen
        name="devicePage"
        component={DevicePage}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="setupDevice"
        component={SetupDeviceScreen}
        options={{
          title: 'Setup new device',
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: "vertical",
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          cardStyle: {
            backgroundColor: "#ffffffdd"
          }
        }}
      />
    </Stack.Navigator>
  );
};

export default MainRouter;
