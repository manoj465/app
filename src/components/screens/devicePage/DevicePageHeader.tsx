import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import UNIVERSALS from "../../../@universals";
import { logger } from "../../../@logger";
import BrightnessSlider from "../../common/BrightnessSlider_optmizedForWeb";
import { NewRectButtonWithChildren } from "../../common/buttons/RectButtonCustom";
import { navigation_t } from "./devicePageNavigator/colorPickerScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { appOperator } from "../../../@operator";
import { State } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { appState } from "../../../redux";
import STYLES from "../../../styles"
import Animated from "react-native-reanimated";

interface Props {
  navigation: navigation_t;
  device: UNIVERSALS.GLOBALS.DEVICE_t;
  log?: logger
  headBackgroundColor: Animated.Node<number>
}

export const DevicePageHeader = ({ navigation, device: _device, headBackgroundColor, log }: Props) => {
  let device = useSelector<appState, UNIVERSALS.GLOBALS.DEVICE_t | undefined>(state => state.deviceReducer.deviceList.find(item => item.Mac == _device.Mac))
  if (!device)
    device = _device

  return (
    <Animated.View
      //@ts-ignore
      style={[styles.container, { backgroundColor: headBackgroundColor, elevation: 3 }]}>
      <Image
        style={{
          height: "100%",
          width: 150,
          position: "absolute",
          top: 0,
          right: 50,
          opacity: 0.3,
        }}
        source={require("../../../../assets/images/1.png")}
      />
      <View style={styles.nameContainer}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center"
          }}>
          <NewRectButtonWithChildren
            onPress={() => {
              appOperator.device({
                cmd: "COLOR_UPDATE",
                //@ts-ignore
                deviceMac: [device.Mac], hsv: { v: device.hsv.v ? 0 : 80 },
                gestureState: State.END,
                log
              })
            }}
            style={{
              width: 60,
              height: 60,
              backgroundColor: "#fff",
              borderRadius: 50,
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}>
            <MaterialCommunityIcons name={device.hsv.v ? "lightbulb-on-outline" : "lightbulb-off"} size={24} color="black" />
          </NewRectButtonWithChildren>

          <Text style={styles.deviceName}>
            {device.deviceName ? device.deviceName : "unnamed"}
          </Text>
        </View>
      </View>

      <View style={styles.brightnessSliderContainer}>
        <BrightnessSlider
          color={"#eee"}
          initBrValue={device.hsv ? device.hsv.v : 65}
          deviceMac={[device.Mac]}
          log={log}
        />
      </View>
    </Animated.View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "95%",
    marginVertical: 10,
    borderRadius: 25
  },
  nameContainer: {
    flex: 1,
    paddingHorizontal: 20,
    //backgroundColor: "#ff0",
    justifyContent: "center",
  },
  brightnessSliderContainer: {
    display: "flex",
    flexDirection: "column",
    paddingHorizontal: "5%",
    marginTop: 10,
    marginBottom: 20,
  },
  brightnessNumber: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "bold",
    alignSelf: "flex-end",
    marginBottom: 6,
  },
  deviceName: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "bold",
    marginLeft: 15,
  },
  backButton: {
    width: 60,
    height: 60,
    borderRadius: 25,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
