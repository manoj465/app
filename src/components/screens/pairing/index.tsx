import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import UNIVERSALS from "../../../@universals";
import { PairingConnectorScreen1 } from "./PairingConnectorScreen1";
import { PairingConnectorScreen3 } from "./PairingConnectorScreen3";

export type PairingStackParamList = {
  PairScreen_1: {};
  PairScreen_3: { newDevice: UNIVERSALS.GLOBALS.DEVICE_t };
};
const Stack = createStackNavigator<PairingStackParamList>();

interface Props { }

export const pairingRouter = ({ }: Props) => {
  return (
    <Stack.Navigator
      initialRouteName="PairScreen_1"
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen name="PairScreen_1" component={PairingConnectorScreen1} options={{ title: 'Add new device' }} />
      <Stack.Screen
        name="PairScreen_3"
        component={PairingConnectorScreen3}
      //initialParams={{ newDevice: { Mac: "deviceMac", ssid: "ssid", IP: "192.168sdgg", deviceName: "egv", localTimeStamp: 235, Hostname: "sdhg", hsv: { h: 0, s: 0, v: 0 }, timers: [] } }}
      />
    </Stack.Navigator>
  );
};







//TODO_CUR  pairing with new data setup 