import { Ionicons } from "@expo/vector-icons";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { devicePageStackParamList } from "../..";
import { logger } from "../../../../../@logger";
import { NewRectButtonWithChildren } from "../../../../common/buttons/RectButtonCustom";
import { Modes } from "../../../../common/Modes";
import { Timer } from "../../../../common/Timer";

type DevicePageColorPickerNavigationProp = StackNavigationProp<
  devicePageStackParamList,
  "DeviceModesScreen"
>;
type devicePageColorPickerRouteProp = RouteProp<
  devicePageStackParamList,
  "DeviceModesScreen"
>;

interface Props {
  navigation: DevicePageColorPickerNavigationProp;
  route: devicePageColorPickerRouteProp;
}

export const DeviceModesScreen = ({
  navigation,
  route: {
    params: { device },
  },
}: Props) => {
  const log = new logger("device modes screen " + device.Mac)
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>

      <NewRectButtonWithChildren /** /// Appbar */
        style={{
          //backgroundColor: "red",
          marginLeft: 15
        }}
        innerCompStyle={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          marginTop: 5
        }}
        onPress={() => {
          navigation.replace("DeviceColorPicker", {
            device
          })
        }}>
        <Ionicons name="ios-arrow-back" size={30} color="#555" />
        <Text
          style={{
            color: "#555",
            fontSize: 22,
            fontWeight: "bold",
            marginLeft: 10,
          }}
        >Schedular</Text>
      </NewRectButtonWithChildren>


      <View /* Sec1: Timer container */
        style={{
          flex: 1,
          backgroundColor: "#fff",
          marginTop: 20,
          borderRadius: 10,
          paddingBottom: 15,
        }}
      >
        <Text
          style={{
            color: "#555",
            fontSize: 20,
            fontWeight: "bold",
            marginLeft: 20,
            marginTop: 10,
            marginBottom: 5,
          }}
        >
          Timer
          </Text>
        <Text
          style={{
            color: "#aaa",
            fontSize: 14,
            marginLeft: 20,
            marginBottom: 10,
          }}
        >
          From dawn to dusk, schedule your day with HUElite
          </Text>
        <Timer device={device} log={new logger("TIMER COMP", log)} />
      </View>


    </SafeAreaView >
  );
};
