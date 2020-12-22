import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { RectButton, State } from "react-native-gesture-handler";
import Animated, { add, max, min } from "react-native-reanimated";
import { hsv2color, useValue } from "react-native-redash";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { devicePageStackParamList } from "../..";
import { reduxStore } from "../../../../../redux";
import { deviceListOperation } from "../../../../../util/dataManipulator";
import { logger } from "../../../../../util/logger";
import { ColorPickerSection } from "./colorPickerSection";
import { DevicePageHeader } from "../../DevicePageHeader";

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

  return (
    <SafeAreaView style={[styles.container]}>
      {view == viewTypeEnum.DEVICE_COLOR_PICKER_SCREEN && (
        <View style={[styles.section2, { flex: 1 }]}>
          {/* Sec1:: Device Header */}
          <View style={styles.header_container}>
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
          {/* Sec5:: Color Picker */}
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
      )}
      {/* Sec3: Navigator Menu */}
      <View style={styles.navigatorMenu}>
        <RectButton
          onPress={() => {
            setView(viewTypeEnum.DEVICE_SETTING_SCREEN);
          }}
          style={{
            width: 70,
            //backgroundColor: "blue",
            borderRightWidth: 0.5,
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 5,
          }}
        >
          <Ionicons name="ios-settings" size={25} color="white" />
          <Text style={{ color: "white", fontSize: 12 }}>Setting</Text>
        </RectButton>
        <RectButton
          onPress={() => {
            setView(viewTypeEnum.DEVICE_COLOR_PICKER_SCREEN);
          }}
          style={{
            width: 70,
            //backgroundColor: "blue",
            borderRightWidth: 0.5,
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 5,
          }}
        >
          <MaterialIcons name="color-lens" size={25} color="white" />
          <Text style={{ color: "white", fontSize: 12 }}>Color</Text>
        </RectButton>
        <RectButton
          onPress={() => {
            setView(viewTypeEnum.DEVICE_MODES_SCREEN);
          }}
          style={{
            width: 70,
            //backgroundColor: "green"
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 5,
          }}
        >
          <MaterialIcons name="dashboard" size={25} color="white" />
          <Text style={{ color: "white", fontSize: 12 }}>More...</Text>
        </RectButton>
      </View>
    </SafeAreaView>
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
    flex: 0.3,
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
