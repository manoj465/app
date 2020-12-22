import {
  createStackNavigator,
  StackNavigationProp
} from "@react-navigation/stack";
import React from "react";
import { types } from "../@types/huelite";
import { HUE_CONTAINER_t } from "../@types/huelite/container";
import AppConfigScreen from "../components/screens/appConfig";
import { Dashboard } from "../components/screens/dashboard";
import DevicePage from "../components/screens/devicePage";
import { GetStarted } from "../components/screens/login";
import { WelcomeScreen } from "../components/screens/onboarding/WelcomeScreen";
import { pairingRouter } from "../components/screens/pairing";
import UserProfileScreen from "../components/screens/userProfile";
import { deviceContainerType } from "../util/dummyData/DummyData";

export type MainRouterStackParamList = {
  getStarted: undefined;
  onboarding: undefined;
  pairing: undefined;
  //DashboardRouter: undefined;
  config: undefined;
  user: undefined;
  dashboard: undefined;
  devicePage: { device: types.HUE_DEVICE_t };
  deviceObjectPage: { group: deviceContainerType };
};

export type MainRouterNavigationProp = StackNavigationProp<MainRouterStackParamList>;
const Stack = createStackNavigator<MainRouterStackParamList>();
const MainRouter = (props: any) => {
  return (
    <Stack.Navigator
      initialRouteName={
        props.initialScreen ? props.initialScreen : "DashboardRouter"
      }
      //initialRouteName="test"
      screenOptions={{
        headerShown: false,
        cardStyle: {
          opacity: 1,
          backgroundColor: "#fff",
        },
      }}
    >
      <Stack.Screen name="getStarted" component={GetStarted} />
      <Stack.Screen name="onboarding" component={WelcomeScreen} />
      <Stack.Screen name="pairing" component={pairingRouter} />
      <Stack.Screen name="dashboard" component={Dashboard} />
      <Stack.Screen name="config" component={AppConfigScreen} />
      <Stack.Screen name="user" component={UserProfileScreen} />
      <Stack.Screen
        name="devicePage"
        component={DevicePage}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default MainRouter;
