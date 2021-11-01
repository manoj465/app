export type PairingStackParamList = {
  PairScreen_1: {};
  setupDevice: { newDevice: DEVICE_t };
};
/* import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import UNIVERSALS from "../../../@universals";
import { PairingConnectorScreen1 } from "./PairingConnectorScreen1";


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

    </Stack.Navigator>
  );
};







//TODO_CUR  pairing with new data setup  */
