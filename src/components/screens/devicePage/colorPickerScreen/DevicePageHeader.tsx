import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { State } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { useSelector } from "react-redux";
import { logger } from "../../../../@logger";
import UNIVERSALS from "../../../../@universals";
import { appOperator } from "../../../../app.operator";
import { appState } from "../../../../redux";
import { MainRouterStackParamList } from "../../../../routers/MainRouter";
import BrightnessSlider from "../../../common/BrightnessSlider_deprivated";
import { NewRectButtonWithChildren } from "../../../common/buttons/RectButtonCustom";


interface Props {
  navigation: StackNavigationProp<MainRouterStackParamList, "devicePage">
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
        source={require("../../../../../assets/images/1.png")}
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
                deviceMac: [device.Mac],
                stateObject: {
                  state: device?.channel?.preState ? device.channel.preState : UNIVERSALS.GLOBALS.channelState_e.CH_STATE_1
                },
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
            <MaterialCommunityIcons name={device.channel.state == UNIVERSALS.GLOBALS.channelState_e.CH_STATE_OFF ? "lightbulb-off" : "lightbulb-on-outline"} size={24} color="black" />
          </NewRectButtonWithChildren>

          <Text style={styles.deviceName}>
            {device.deviceName ? device.deviceName : "unnamed"}
          </Text>
        </View>
      </View>

      <View style={styles.brightnessSliderContainer}>
        <BrightnessSlider
          color={"#eee"}
          initBrValue={device.channel.outputChannnel[0].v}
          deviceMac={[device.Mac]}
          onBrightnessChange={({ value, pinState }) => {
            appOperator.device({
              cmd: "COLOR_UPDATE",
              //@ts-ignore --description as device cannot be undefined
              deviceMac: [device.Mac],
              /**
               * - [ ] send the active channel based on deviceType with different lengthTypes
               */
              channelBrightnessObject: { value, activeChannel: [true, true, true, true, true] },
              gestureState: pinState,
              log
            })
          }}
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
