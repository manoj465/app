import React from "react";
import { Dimensions, StyleSheet, View, Image } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import ColorPicker from "../../../../common/ColorPicker";
import { navigation_t, viewTypeEnum } from ".";
import { logger } from "../../../../../@logger";
import UNIVERSALS from "../../../../../@universals";

interface Props {
  hue: Animated.Value<number>;
  saturation: Animated.Value<number>;
  value: Animated.Value<number>;
  backgroundColor: Animated.Node<number>;
  device: UNIVERSALS.GLOBALS.DEVICE_t;
  navigation: navigation_t;
  log?: logger
}

export const ColorPickerSection = ({
  hue,
  saturation,
  value,
  backgroundColor,
  device,
  navigation,
  log
}: Props) => {

  return (
    <View style={styles.container}>
      {/* Sec: timer Button */}
      <View
        style={{
          flex: 1,
          //backgroundColor: "red",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ColorPicker
          hue={hue}
          saturation={saturation}
          backgroundColor={backgroundColor}
          device={device}
          log={log}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    //backgroundColor: "red",
    flex: 1,
  },
});
