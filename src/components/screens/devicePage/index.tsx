import { RouteProp } from "@react-navigation/native";
import { CardStyleInterpolators, createStackNavigator, StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import UNIVERSALS from "../../../@universals";
import { MainRouterStackParamList } from "../../../routers/MainRouter";
import { DeviceColorPickerScreen } from "./devicePageNavigator/colorPickerScreen";
import { DeviceModesScreen } from "./devicePageNavigator/modesScreen";
import { DeviceSettingScreen } from "./devicePageNavigator/settingScreen";

export type devicePageStackParamList = {
  DeviceColorPicker: {
    device: UNIVERSALS.GLOBALS.DEVICE_t;
  };
  DeviceModesScreen: {
    device: UNIVERSALS.GLOBALS.DEVICE_t;
  };
  DeviceSettingScreen: {
    device: UNIVERSALS.GLOBALS.DEVICE_t
  };
};

type devicePageRouteProp = RouteProp<MainRouterStackParamList, "devicePage">;

type DevicePageNavigationProp = StackNavigationProp<
  MainRouterStackParamList,
  "devicePage"
>;

interface Props {
  navigation: DevicePageNavigationProp;
  route: devicePageRouteProp;
}
const Stack = createStackNavigator<devicePageStackParamList>();

const Component = ({
  navigation,
  route: {
    params: { device },
  },
}: Props) => {
  return (
    <Stack.Navigator
      initialRouteName="DeviceColorPicker"
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        cardStyle: {
          backgroundColor: "#fff",
          opacity: 1,
        },
      }}
    >
      <Stack.Screen
        name="DeviceColorPicker"
        component={DeviceColorPickerScreen}
        initialParams={{ device }}
      />

      <Stack.Screen
        name="DeviceModesScreen"
        component={DeviceModesScreen}
        initialParams={{ device }}
      />
      <Stack.Screen
        name="DeviceSettingScreen"
        component={DeviceSettingScreen}
        initialParams={{ device }}
      />
    </Stack.Navigator>
  );
};

export default Component
