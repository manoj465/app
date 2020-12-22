import React from "react";
import { View, Text } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { appNegativeColor } from "../../../../../theme/colors/highlightColors";

interface Props {
  setView: (view: number) => void;
}

export const DeviceSettingScreen = ({ setView }: Props) => {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <RectButton
        style={{
          backgroundColor: appNegativeColor,
          height: 50,
          width: "95%",
          borderRadius: 10,
          position: "absolute",
          bottom: 80,
          left: "2.5%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff" }}>Delete</Text>
      </RectButton>
      <RectButton
        style={{
          backgroundColor: appNegativeColor,
          height: 50,
          width: "95%",
          borderRadius: 10,
          position: "absolute",
          bottom: 20,
          left: "2.5%",
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => {
          setView(0);
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>
          BACK
        </Text>
      </RectButton>
    </View>
  );
};
