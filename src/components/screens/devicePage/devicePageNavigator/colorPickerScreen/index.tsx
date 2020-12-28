import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RectButton, ScrollView, State } from "react-native-gesture-handler";
import Animated, { add, max, min } from "react-native-reanimated";
import { hsv2color, useValue } from "react-native-redash";
import { SafeAreaView } from "react-native-safe-area-context";
import { devicePageStackParamList } from "../..";
import { deviceListOperation } from "../../../../../util/dataManipulator";
import { logger } from "../../../../../util/logger";
import { NewRectButtonWithChildren } from "../../../../common/buttons/RectButtonCustom";
import STYLES from "../../../../common/styles";
import { DevicePageHeader } from "../../DevicePageHeader";
import { ColorPickerSection } from "./colorPickerSection";

export enum viewTypeEnum {
  DEVICE_COLOR_PICKER_SCREEN = 0,
  DEVICE_MODES_SCREEN = 1,
  DEVICE_SETTING_SCREEN = 2,
}

export type navigation_t = StackNavigationProp<
  devicePageStackParamList,
  "DeviceColorPicker"
>;
type routeProp_t = RouteProp<
  devicePageStackParamList,
  "DeviceColorPicker"
>;

interface Props {
  navigation: navigation_t;
  route: routeProp_t;
}

export const DeviceColorPickerScreen = ({
  navigation,
  route: {
    params: { device },
  },
}: Props) => {
  const [view, setView] = useState<viewTypeEnum>(
    viewTypeEnum.DEVICE_COLOR_PICKER_SCREEN
  );
  const hue = useValue(0);
  const saturation = useValue(0);
  const value = useValue(1);
  const backgroundColor = hsv2color(hue, saturation, value);
  const headBackgroundColor = hsv2color(
    add(hue, 40),
    max(0.5, min(0.8, saturation)),
    value
  );
  const log = new logger("DEVICE COLOR PICKER")

  const colorSnippets = [
    { h: 0, s: 100, v: 100, hex: "#ff0000" },
    { h: 60, s: 100, v: 100, hex: "#ffff00" },
    { h: 119, s: 100, v: 100, hex: "#00ff00" },
    { h: 180, s: 100, v: 100, hex: "#00ffff" },
    { h: 240, s: 100, v: 100, hex: "#0000ff" },
    { h: 299, s: 100, v: 100, hex: "#ff00ff" },
  ]
  interface updateColorProps {
    h: number,
    s: number
  }
  const updateColor = ({ h, s }: updateColorProps) => {
    deviceListOperation({
      props: {
        cmd: "COLOR_UPDATE",
        deviceMac: [device.Mac],
        hsv: { h, s },
        gestureState: State.END,
        log
      },
    })
  }

  return (
    <SafeAreaView style={[styles.container]}>
      {view == viewTypeEnum.DEVICE_COLOR_PICKER_SCREEN && (
        <View style={[styles.section2, { flex: 1 }]}>
          <View /* Sec1: devicePage header */
            style={styles.header_container}>
            <Animated.View
              style={[styles.header_AnimatedView, { backgroundColor: headBackgroundColor }]}
            >
              <DevicePageHeader
                navigation={navigation}
                device={device}
                log={log}
              />
            </Animated.View>
          </View>
          <ScrollView style={{/* Sec1: color picker container scrollview */
            //backgroundColor: "green",
            height: "100%"
          }}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ minHeight: "10%" }}>{/* Sec2: Navigator */}
              <RectButton /* Sec3: modes button */
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
              <RectButton /* Sec3: setting button */
                activeOpacity={0}
                style={{
                  position: "absolute",
                  top: "4%",
                  left: "6%",
                }}
                onPress={() => {
                  navigation.replace("DeviceSettingScreen", { device })
                }}
              >
                <Image source={require("../../../../../../assets/icons/setting.png")}
                  style={{
                    height: 50,
                    width: 50
                  }} />
              </RectButton>
              {/* Sec: colorPicker */}

            </View>
            <View style={{/*  Sec2: Color Picker */
              flex: 1,
              // backgroundColor: "red",
            }}>
              <ColorPickerSection
                hue={hue}
                saturation={saturation}
                value={value}
                backgroundColor={backgroundColor}
                device={device}
                navigation={navigation}
                log={log}
              />
            </View>
            <View style={{/* Sec2: divider => colorPicker - colorSnippets */
            }}>
              <Text style={[STYLES.H1, { textAlign: "center", marginTop: "3%" }]}>More Colors</Text>
              <Text style={[STYLES.H7, STYLES.textFeather, { textAlign: "center", marginTop: 5, marginBottom: "5%", paddingHorizontal: "8%" }]}>
                Color is the power which directly influences human soul. colors are the smile of nature
                with <Text style={[STYLES.H7, { color: "#555" }]}>{" "}HUElite{" "}</Text> Express your self in colors, as colors is the most beautiful language
                </Text>
            </View>
            <View style={{ /* Sec2: Color snippets container  */
              flex: 1,
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              //backgroundColor: "blue",
              marginBottom: "50%"
            }}>
              {colorSnippets.map((color, index) => {
                return (
                  <NewRectButtonWithChildren
                    key={index}
                    buttonStyle={{
                      backgroundColor: color.hex,
                      margin: 10,
                      borderRadius: 30,
                      height: 60,
                      width: 60
                    }}
                    onPress={() => {
                      console.log("Color is :: " + color.hex)
                      updateColor({ h: color.h, s: color.s })
                    }}>

                  </NewRectButtonWithChildren>
                )
              })}
            </View>
          </ScrollView>
        </View>
      )
      }
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    flex: 1,
    backgroundColor: "#fff",
  },
  header_container: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    minHeight: 230,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  header_AnimatedView: {
    flex: 1,
    width: "100%",
    overflow: "hidden",
    borderRadius: 25,
  },
  section2: {
    width: "100%",
    alignSelf: "center",
    //backgroundColor: "#55f",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  navigatorMenu: {
    backgroundColor: "#33f",
    height: 60,
    width: 230,
    paddingHorizontal: 10,
    borderRadius: 15,
    overflow: "hidden",
    alignSelf: "center",
    //position: "absolute",
    //bottom: 10,
    //display: "flex",
    display: "none",
    flexDirection: "row",
    /* shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 1, */
  },
});
