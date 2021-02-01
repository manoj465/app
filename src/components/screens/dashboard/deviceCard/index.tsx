import { useActionSheet } from "@expo/react-native-action-sheet"
import { Entypo } from '@expo/vector-icons'
import { LinearGradient } from "expo-linear-gradient"
import React from "react"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { State } from "react-native-gesture-handler"
import { navigationProp } from ".."
import UNIVERSALS from "../../../../@universals"
import { appOperator } from "../../../../@operator"
import { convertHSVToRgb, _convertRGBToHex } from "../../../../util/Color"
import { logger } from "../../../../@logger"
import BrightnessSlider from "../../../common/BrightnessSlider"
import BrightnessSliderNew from "../../../common/BrightnessSlider_optmizedForWeb"
import { NewRectButtonWithChildren } from "../../../common/buttons/RectButtonCustom"
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
      style={[styles.container, { /* height: deviceCardHeight */ }]}
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
          width: "100%",
        }} >

        <Image /**background image */
          style={{
            opacity: 0.35,
            position: "absolute",
            top: 0,
            left: 0,
            flex: 1,
            width: "100%",
            height: "100%",
          }}
          source={require("../../../../../assets/images/dashboard/dashboardCardBg/vector_1.jpg")} />


        <View /* /// deviceCard Top section <deviceIcon | deviceName | menuIcon > */
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          < TouchableOpacity /* /// menuDots */
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
                      if (setToBeDeletedDevice) {
                        setToBeDeletedDevice(device.Mac)
                      }
                      break;

                    default:
                      break;
                  }
                })
            }}
          >
            <Entypo name="dots-three-vertical" size={20} color="white" />
          </ TouchableOpacity >

          <NewRectButtonWithChildren /** device icon - turn on/off button */
            style={{
              //backgroundColor: "red",
              height: 60,
              width: 60,
              overflow: "hidden",
              borderRadius: 30,
              justifyContent: "center",
              alignItems: "center",
              margin: 10
            }}
            onPress={() => {
              appOperator.device({
                cmd: "COLOR_UPDATE",
                deviceMac: [device.Mac],
                hsv: { v: device.hsv.v ? 0 : 80 },
                gestureState: State.END,
                log
              })
            }}>
            <MaterialCommunityIcons name={device.hsv.v ? "lightbulb-on-outline" : "lightbulb-off"} size={24} color="black" />
          </NewRectButtonWithChildren>

          <Text  /**device name */
            style={[styles.deviceName, { color: "#fff" }]}>
            {device.deviceName ? device.deviceName : "unknown_device"}
          </Text>

        </View>


        <View style={styles.brightnessSliderContainer} /* ///brightness container  */>
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
    marginBottom: 10
    //backgroundColor: "green",
  },
  deviceName: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 15,
  },
});