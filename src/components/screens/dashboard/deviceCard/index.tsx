import { useActionSheet } from "@expo/react-native-action-sheet"
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons'
import { LinearGradient } from "expo-linear-gradient"
import React from "react"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { State } from "react-native-gesture-handler"
import { navigationProp } from ".."
import { logger } from "../../../../@logger"
import UNIVERSALS from "../../../../@universals"
import { appOperator } from "../../../../app.operator"
import BrightnessSliderNew from "../../../common/BrightnessSlider_deprivated"
import { NewRectButtonWithChildren } from "../../../common/buttons/RectButtonCustom"
import { hsv2hex } from "../../../../util/Color"
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
  const { showActionSheetWithOptions } = useActionSheet()



  return (
    <TouchableOpacity
      style={[styles.container, { /* height: deviceCardHeight */ }]}
      activeOpacity={0.9}
      onPress={() => {
        if (device.channel.deviceType == UNIVERSALS.GLOBALS.deviceType_e.deviceType_NW4
          || device.channel.deviceType == UNIVERSALS.GLOBALS.deviceType_e.deviceType_RGB
          || device.channel.deviceType == UNIVERSALS.GLOBALS.deviceType_e.deviceType_RGBW) {
          navigation.navigate("devicePage", { device })
        }
        else {
          console.log("cannot open device page for device type " + device.channel.deviceType)
        }
      }} >
      <LinearGradient
        /**
         * #todo
         * - [ ] gradient for natural/warm/cool white 
         */
        colors={
          (() => {
            /** inCase deviceType is deviceType_wDownlight_C4 */
            if (
              (device.channel.deviceType == UNIVERSALS.GLOBALS.deviceType_e.deviceType_NW4
                || device.channel.deviceType == UNIVERSALS.GLOBALS.deviceType_e.deviceType_NW)
              && device.channel.outputChannnel[0].temprature < 4000) {
              return ["#ff0000", "#ff00ff"]
            }
            else if (device.channel.deviceType == UNIVERSALS.GLOBALS.deviceType_e.deviceType_RGB) {
              return [hsv2hex({ hsv: [device.channel.outputChannnel[0].h, device.channel.outputChannnel[0].s > 60 ? device.channel.outputChannnel[0].s : 60, 100] }),
              hsv2hex({ hsv: [device.channel.outputChannnel[0].h + 60, device.channel.outputChannnel[0].s > 60 ? device.channel.outputChannnel[0].s : 60, 100] })]
            }
            else { /** ///default case */
              return ["#ff0000", "#0000ff"]
            }
          })()
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          width: "100%",
        }}>

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
              const options = ["Device Settings", "Share device", "Delete device", "cancel"]
              const destructiveButtonIndex = 3
              const cancelButtonIndex = 3
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
                      navigation.navigate("setupDevice", {
                        device
                      })
                      break;

                    case 2:
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
                stateObject: {
                  state: device.channel.state == UNIVERSALS.GLOBALS.channelState_e.CH_STATE_OFF
                    ? device.channel.preState ? device.channel.preState : UNIVERSALS.GLOBALS.channelState_e.CH_STATE_1
                    : UNIVERSALS.GLOBALS.channelState_e.CH_STATE_OFF
                },
                gestureState: State.END,
                log,
                onActionComplete: ({ newDeviceList }) => {
                  appOperator.device({
                    cmd: "ADD_UPDATE_DEVICES",
                    newDevices: newDeviceList,
                    log
                  })
                },
              })
            }}>
            <MaterialCommunityIcons name={device.channel.state == UNIVERSALS.GLOBALS.channelState_e.CH_STATE_OFF ? "lightbulb-off" : "lightbulb-on-outline"} size={24} color="black" />
          </NewRectButtonWithChildren>

          <Text  /**device name */
            style={[styles.deviceName, { color: "#fff" }]}>
            {device.deviceName ? device.deviceName : "unknown_device"}
          </Text>

        </View>


        <View style={styles.brightnessSliderContainer} /* ///brightness container  */>
          <BrightnessSliderNew
            initBrValue={device.channel.outputChannnel[0].v}
            deviceMac={[device.Mac]}
            onBrightnessChange={({ value, pinState }) => {
              if (device.channel.deviceType == UNIVERSALS.GLOBALS.deviceType_e.deviceType_NW4
                || device.channel.deviceType == UNIVERSALS.GLOBALS.deviceType_e.deviceType_NW
                || device.channel.deviceType == UNIVERSALS.GLOBALS.deviceType_e.deviceType_RGB)
                appOperator.device({
                  cmd: "COLOR_UPDATE",
                  deviceMac: [device.Mac],
                  /**
                   * - [ ] send the active channel based on deviceType with different lengthTypes
                   */
                  channelBrightnessObject: { value, activeChannel: [true, true, true, true, true] },
                  gestureState: pinState,
                  log,
                  onActionComplete: ({ newDeviceList }) => {
                    appOperator.device({
                      cmd: "ADD_UPDATE_DEVICES",
                      newDevices: newDeviceList,
                      log
                    })
                  },
                })
            }}
            /**
             * 
             */
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
})