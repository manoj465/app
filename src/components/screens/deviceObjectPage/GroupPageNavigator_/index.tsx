import React from "react";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { GroupColorPicker } from "./GroupColorPicker";
import { GroupModesScreen } from "./GroupModesScreen";
import { GroupSettings } from "./GroupSettings";
import Animated from "react-native-reanimated";
import { deviceContainerType } from "../../../../util/dummyData/DummyData";

export type GroupPageStackParamList = {
  GPN_s1: {
    hue: Animated.Value<number>;
    saturation: Animated.Value<number>;
    value: Animated.Value<number>;
    backgroundColor: Animated.Node<number>;
    group: deviceContainerType;
    selectedDevices: string[];
    setselectedDevices: (list: string[]) => void;
  };
  GPN_s2: { group: deviceContainerType };
  GPN_s3: { group: deviceContainerType };
};

interface Props {
  groupName: string;
  group: deviceContainerType;
  hue: Animated.Value<number>;
  saturation: Animated.Value<number>;
  value: Animated.Value<number>;
  backgroundColor: Animated.Node<number>;
  selectedDevices: string[];
  setselectedDevices?: (list: string[]) => void;
}

const Stack = createStackNavigator<GroupPageStackParamList>();
export const GroupPageNavigator = ({
  groupName,
  group,
  hue,
  saturation,
  value,
  backgroundColor,
  selectedDevices,
  setselectedDevices = () => {},
}: Props) => {
  return (
    <Stack.Navigator
      initialRouteName="GPN_s1"
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen
        name="GPN_s1"
        component={GroupColorPicker}
        initialParams={{
          hue,
          value,
          saturation,
          backgroundColor,
          group: group,
          selectedDevices,
          setselectedDevices: setselectedDevices,
        }}
      />
      <Stack.Screen
        name="GPN_s2"
        component={GroupModesScreen}
        initialParams={{ group: group }}
      />
      <Stack.Screen
        name="GPN_s3"
        component={GroupSettings}
        initialParams={{ group: group }}
      />
    </Stack.Navigator>
  );
};
