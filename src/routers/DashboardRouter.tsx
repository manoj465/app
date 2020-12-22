import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Dashboard } from "../components/screens/dashboard";
import { Header } from "react-native/Libraries/NewAppScreen";
import { DeviceObjectPage } from "../components/screens/deviceObjectPage";
import { MainRouterStackParamList } from "./MainRouter";
import { deviceContainerType } from "../util/dummyData/DummyData";


export type DashboardRouterStackParamList = {
  _dashboard: undefined;
  deviceObjectPage: { group: deviceContainerType };
};
const Stack = createStackNavigator<DashboardRouterStackParamList>();

const DashboardRouter = () => {
  return (
    <Stack.Navigator initialRouteName="_dashboard">
      <Stack.Screen
        name="_dashboard"
        component={Dashboard}
        options={{ title: "Dashboard", headerShown: false }}
      />
      <Stack.Screen
        name="deviceObjectPage"
        component={DeviceObjectPage}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default DashboardRouter;
