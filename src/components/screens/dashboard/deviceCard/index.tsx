import { useActionSheet } from "@expo/react-native-action-sheet"
import { Entypo } from '@expo/vector-icons'
import { LinearGradient } from "expo-linear-gradient"
import React from "react"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { navigationProp } from ".."
import UNIVERSALS from "../../../../@universals"
import { convertHSVToRgb, _convertRGBToHex } from "../../../../util/Color"
import { logger } from "../../../../util/logger"
import BrightnessSlider from "../../../common/BrightnessSlider"
import BrightnessSliderNew from "../../../common/BrightnessSlider_optmizedForWeb"
/* import ColorBlending from "gl-react-color-blending" */


export const deviceCardHeight = 150;

interface props {
  navigation: navigationProp,
  device: UNIVERSALS.GLOBALS.DEVICE_t
  log?: logger
  setToBeDeletedDevice?: React.Dispatch<React.SetStateAction<string>>
}
export const DeviceCard = ({
  navigation,
  device,
  log,
  setToBeDeletedDevice
}: props) => {
  log = log ? new logger("DEVICE CARD", log) : undefined
  const { showActionSheetWithOptions } = useActionSheet();
  let rgb2, rgb1, hex1, hex2
  if (device.hsv) {
    rgb1 = convertHSVToRgb(device.hsv.h, device.hsv.s, 100);
    rgb2 = convertHSVToRgb(
      device.hsv.h + 40,
      device.hsv.s > 50 ? device.hsv.s : 50,
      100
    );
  } else {
    rgb1 = convertHSVToRgb(100, 80, 100)
    rgb2 = convertHSVToRgb(130, 80, 100)
  }
  hex1 = _convertRGBToHex(rgb1[0], rgb1[1], rgb1[2]);
  hex2 = _convertRGBToHex(rgb2[0], rgb2[1], rgb2[2]);

  return (
    <TouchableOpacity
      style={[styles.container, { height: deviceCardHeight }]}
      activeOpacity={0.9}
      onPress={() => {
        if (device.Hostname.includes(UNIVERSALS.venderConf.venderPrefix + "_OW") || device.Hostname.includes(UNIVERSALS.venderConf.venderPrefix + "_CW") || device.Hostname.includes(UNIVERSALS.venderConf.venderPrefix + "_WW")) {
        } else {
          navigation.navigate("devicePage", {
            device
          });
        }
      }}
    >
      <LinearGradient
        colors={[hex1, hex2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        <Image
          style={{
            opacity: 0.3,
            position: "absolute",
            top: 0,
            left: 0,
            flex: 1,
            width: "100%",
            height: "100%",
          }}
          source={require("../../../../../assets/images/background.jpg")}
        />
        {/* /// deviceCard Top section <deviceIcon | deviceName | menuIcon > */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {/* /// menuDots */}
          < TouchableOpacity
            style={{
              zIndex: 10,
              position: "absolute",
              top: 0,
              right: 0,
              paddingRight: 12,
              paddingTop: 8,
              paddingBottom: 5,
              paddingLeft: 10
            }}
            onPress={() => {
              console.log("show action sheet")
              const options = ["Delete device", "Share device", "cancel"]
              const destructiveButtonIndex = 2
              const cancelButtonIndex = 2
              showActionSheetWithOptions(
                {
                  options,
                  cancelButtonIndex,
                  destructiveButtonIndex,
                  showSeparators: true
                },
                async (index) => {
                  switch (index) {
                    case 0:
                      if (setToBeDeletedDevice)
                        setToBeDeletedDevice(device.Mac)
                      break;

                    default:
                      break;
                  }
                })
            }}
          >
            <Entypo name="dots-three-vertical" size={20} color="white" />
          </ TouchableOpacity >

          <View
            style={{
              margin: 10,
              height: 60,
              width: 60,
              backgroundColor: "#fff",
              borderRadius: 30,
            }}
          ></View>
          <Text style={[styles.deviceName, { color: "#fff" }]}>
            {device.deviceName ? device.deviceName : "unknown_device"}
          </Text>
        </View>
        {/* ///brightness container <percentageText &  brightnessBar> */}
        <View style={styles.brightnessSliderContainer}>
          {/*  <ReText style={styles.brightnessNumber} text={concat( BR )}/> */}
          <BrightnessSliderNew
            initBrValue={device.hsv ? device.hsv.v : 50}
            deviceMac={[device.Mac]}
            log={log}
          />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: "white",
    marginVertical: 5,
    backgroundColor: "#aaa",
    width: "100%",
    alignSelf: "center",
    borderRadius: 20,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  brightnessSliderContainer: {
    display: "flex",
    flexDirection: "column",
    paddingHorizontal: "5%",
    position: "relative",
    top: -20,
    //backgroundColor: "green",
  },
  deviceName: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 15,
  },
});