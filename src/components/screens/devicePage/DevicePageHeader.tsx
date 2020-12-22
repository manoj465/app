import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useDispatch } from "react-redux";
import { types } from "../../../@types/huelite";
import { logger } from "../../../util/logger";
import { BrightnessSlider, onBrValueChange_Props } from "../../common/BrightnessSlider_ver_1";
import { navigation_t } from "./devicePageNavigator/colorPickerScreen";

interface Props {
  navigation: navigation_t;
  device: types.HUE_DEVICE_t;
  log?:logger
}

export const DevicePageHeader = ({ navigation, device, log }: Props) => {
  const [brVal, setBrVal] = useState(device.hsv.v);

  return (
    <View style={styles.container}>
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
          }}
        >
          <View
            style={{
              width: 70,
              height: 70,
              backgroundColor: "#fff",
              borderRadius: 50,
            }}
          ></View>
          <View
            style={{
              flex: 1,
              //backgroundColor: "green",
              justifyContent: "flex-end",
            }}
          >
            <Text style={styles.deviceName}>
              {device.deviceName ? device.deviceName : "unnamed"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.brightnessSliderContainer}>
        <Text style={styles.brightnessNumber}>{brVal}%</Text>
        {/* <View style={{ height: 50, backgroundColor: "red" }}> */}
        <BrightnessSlider
          color={"#eee"}
          initBrValue={device.hsv ? device.hsv.v : 65}
          deviceMac={[device.Mac]}
          log={log}
        />
        {/*   </View> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
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
    marginLeft: 20,
    marginBottom: 15,
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
