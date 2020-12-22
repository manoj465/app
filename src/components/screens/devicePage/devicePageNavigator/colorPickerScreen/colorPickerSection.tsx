import React from "react";
import { Dimensions, StyleSheet, View, Image } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { types } from "../../../../../@types/huelite";
import ColorPicker from "../../../../common/ColorPicker";
import { navigation_t, viewTypeEnum } from ".";
import { logger } from "../../../../../util/logger";

interface Props {
  hue: Animated.Value<number>;
  saturation: Animated.Value<number>;
  value: Animated.Value<number>;
  backgroundColor: Animated.Node<number>;
  device: types.HUE_DEVICE_t;
  navigation: navigation_t;
  log?: logger
}

const { width } = Dimensions.get("window");
export const ColorPickerSection = ({
  hue,
  saturation,
  value,
  backgroundColor,
  device,
  navigation,
  log
}: Props) => {

  log?.print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n" + log.printDeviceList([device]))
  return (
    <View style={styles.container}>
      {/* Sec: timer Button */}
      <RectButton
        activeOpacity={0}
        style={{
          position: "absolute",
          top: "4%",
          right: "6%",
        }}
        onPress={() => {
          navigation.replace("DeviceModesScreen", { device })
        }}
      >
        <Image source={require("../../../../../../assets/icons/preset.png")}
          style={{
            height: 50,
            width: 50
          }} />
      </RectButton>
      {/* Sec: setting button */}
      <RectButton
        activeOpacity={0}
        style={{
          position: "absolute",
          top: "4%",
          left: "6%",
        }}
      >
        <Image source={require("../../../../../../assets/icons/setting.png")}
          style={{
            height: 50,
            width: 50
          }} />
      </RectButton>
      {/* Sec: colorPicker */}
      <View
        style={{
          flex: 1,
          //backgroundColor: "red",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ColorPicker
          canvasWidth={width * 0.85}
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
