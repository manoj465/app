import React from "react";
import {
  createStackNavigator,
  CardStyleInterpolators,
  StackNavigationProp,
} from "@react-navigation/stack";
import { DeviceModesScreen } from "./devicePageNavigator/modesScreen";
import { DeviceSettingScreen } from "./devicePageNavigator/settingScreen";
import {
  deviceContainerType,
  deviceType,
} from "../../../util/dummyData/DummyData";
import { DeviceColorPickerScreen } from "./devicePageNavigator/colorPickerScreen";
import { MainRouterStackParamList } from "../../../routers/MainRouter";
import { RouteProp } from "@react-navigation/native";
import { types } from "../../../@types/huelite";

export type devicePageStackParamList = {
  DeviceColorPicker: {
    device: types.HUE_DEVICE_t;
  };
  DeviceModesScreen: {
    device: types.HUE_DEVICE_t;
  };
  DeviceSettingScreen: undefined;
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
    </Stack.Navigator>
  );
};

export default Component
