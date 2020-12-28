import React, { useState } from "react";
import { View, Text, Dimensions, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BrightnessSlider from "../../common/BrightnessSlider";
import { RectButton } from "react-native-gesture-handler";
import { ToggleSwitch } from "../../common/ToggleSwitch";
import Animated from "react-native-reanimated";
import { useDispatch } from "react-redux";
import { brightnessUpdateSagaAction } from "../../../redux/deviceListReducer/actions/DeviceListAction";

const { height, width } = Dimensions.get("window");
interface Props {
  groupName: string;
  groupUUID: string;
  backgroundColor: Animated.Node<number>;
  selectedDevices: string[];
  _height?: number;
  _width?: number;
}

export const DeviceObjectHeader = ({
  groupName,
  groupUUID,
  backgroundColor,
  selectedDevices,
  _height,
  _width,
}: Props) => {
  const dispatch = useDispatch();

  const onBrValueChange = (value, state) => {
    //setBrVal(value);
    dispatch(
      brightnessUpdateSagaAction({
        value,
        deviceMac: selectedDevices,
        groupUUID: groupUUID,
      })
    );
  };

  return (
    <View
      style={{
        width: "95%",
        alignSelf: "center",
        backgroundColor: "#fff",
        height: height * 0.3 > 250 ? 250 : height * 0.3,
        borderRadius: 25,
        padding: "2.5%",
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 1.22,
        elevation: 3,
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
        source={require("../../../../assets/images/background.jpg")}
      />
      <View
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "row",
          //backgroundColor: "red",
          alignItems: "center",
        }}
      >
        <View
          style={{
            alignItems: "flex-end",
            position: "absolute",
            right: 15,
            top: 15,
          }}
        >
          {/* ///Toggle switch Container */}
          <ToggleSwitch
            onPress={(state: boolean) => {
              if (state) {
                console.log("Switch ON");
              } else {
                console.log("Switch OFF");
              }
            }}
          />
        </View>
        <Animated.View
          style={{
            width: 60,
            height: 60,
            backgroundColor: backgroundColor,
            borderRadius: 50,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.22,
            shadowRadius: 1.22,
            elevation: 3,
          }}
        ></Animated.View>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 20 }}>
          {groupName}
        </Text>
      </View>
      <BrightnessSlider
        onBrValueChange={onBrValueChange}
        color={"#eee"}
        bgColor={["#ffffff44", "#ddddddff"]}
      />
    </View>
  );
};
