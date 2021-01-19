import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
//native imports
import { deviceType } from "../../../util/dummyData/DummyData";
import { PairingConnectorScreen1 } from "./PairingConnectorScreen1";
import { PairingConnectorScreen2 } from "./PairingConnectorScreen2";
import { PairingConnectorScreen3 } from "./PairingConnectorScreen3";
import UNIVERSALS from "../../../@universals";

export type PairingStackParamList = {
  PairScreen_1: {};
  PairScreen_2: { newDevice: UNIVERSALS.GLOBALS.DEVICE_t };
  PairScreen_3: { newDevice: UNIVERSALS.GLOBALS.DEVICE_t };
};
const Stack = createStackNavigator<PairingStackParamList>();

interface Props { }

export const pairingRouter = ({ }: Props) => {
  return (
    <Stack.Navigator
      initialRouteName="PairScreen_1"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="PairScreen_1" component={PairingConnectorScreen1} />
      <Stack.Screen name="PairScreen_2" component={PairingConnectorScreen2} />
      <Stack.Screen name="PairScreen_3" component={PairingConnectorScreen3} />
    </Stack.Navigator>
  );
};







//TODO_CUR  pairing with new data setup 