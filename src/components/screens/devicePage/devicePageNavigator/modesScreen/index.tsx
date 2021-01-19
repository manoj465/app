import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { devicePageStackParamList } from "../..";
import { Modes } from "../../../../common/Modes";
import { Timer } from "../../../../common/Timer";
import {
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome5,
} from "@expo/vector-icons";
import { RectButton } from "react-native-gesture-handler";
import { logger } from "../../../../../util/logger";

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
    <SafeAreaView style={{ display: "flex", flex: 1, backgroundColor: "#ffffff" }}>
      <View /* Sec1: header - back arrow */
        style={{ height: 60, justifyContent: "center", width: 200 }}>
        <RectButton
          style={{
            //backgroundColor: "red",
            flexDirection: "row",
            marginLeft: 20
          }}
          onPress={() => {
            navigation.replace("DeviceColorPicker", {
              device
            });
          }}
        >
          <Ionicons name="ios-arrow-back" size={30} color="#555" />
          <Text
            style={{
              color: "#555",
              fontSize: 22,
              fontWeight: "bold",
              marginLeft: 10,
            }}
          >
            Color Picker
            </Text>
        </RectButton>
      </View>
      <View /* Sec1: Modes container */
        style={{}}>
        <Text
          style={{
            color: "#555",
            fontSize: 20,
            fontWeight: "bold",
            marginTop: 10,
            marginLeft: 20,
            marginBottom: 5,
          }}
        >
          Modes
          </Text>
        <Text
          style={{
            color: "#aaa",
            fontSize: 14,
            marginLeft: 20,
            marginBottom: 10,
          }}
        >
          Choose from multiple modes
          </Text>
        <View style={{ marginLeft: 10, marginTop: 10 }}>
          <Modes device={device} />
        </View>
      </View>
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
    </SafeAreaView>
  );
};
