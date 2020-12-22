import React, { useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { GroupHeader } from "./GroupHeader";
import { DeviceCard, deviceCardHeight } from "./deviceCard";
import Animated, { interpolate, log } from "react-native-reanimated";
import { useValue, mix } from "react-native-redash";
import {
  deviceContainerType,
  deviceType,
  GROUP_TYPES,
} from "../../../../util/dummyData/DummyData";
import { useSpringTransition, useTimingTransition } from "../../../common/transitions/Transition";
import { ScrollView } from "react-native-gesture-handler";
import { HUE_CONTAINER_t, HUE_CONTAINER_TYPE_e } from "../../../../@types/huelite/globalTypes";
import { reduxStore } from "../../../../redux";

interface Props {
  navigation: any;
  containerObject: HUE_CONTAINER_t;
}

export const DeviceObjectContainer = ({
  containerObject: group,
  navigation,
}: Props) => {
  const open = useValue<0 | 1>(0);
  const transition = useSpringTransition(open);
  const deviceContainerheight = interpolate(transition, {
    inputRange: [0, 1],
    outputRange: [
      deviceCardHeight + 10 + group.devices.length * 5,
      group.devices.length * (deviceCardHeight + 15),
    ],
  });
  const deviceContainerHeaderIconSkew = mix(
    transition,
    -Math.PI / 2,
    Math.PI / 2
  );
  const groupButtonHeight = interpolate(transition, {
    inputRange: [0, 1],
    outputRange: [deviceCardHeight + group.devices.length * 5 + 30, 0],
  });

  const navigateToGroup = () => {
    console.log("navigating to group");
    navigation.navigate("deviceObjectPage", { group: group });
  };




  return (
    <View style={styles.groupContainer}>
      {(group.conName || group.groupName) && <View>
        <GroupHeader
          groupName={group?.conName}
          open={open}
          setOpen={"setOpen"}
          deviceContainerHeaderIconSkew={deviceContainerHeaderIconSkew}
          navigateToGroup={navigateToGroup}
        />
      </View>}
      <Animated.View
        style={[styles.devicesContainer, { height: deviceContainerheight }]}
      >
        {/*  <RectButton
            style={{ zIndex: 100, width: "100%" }}
            activeOpacity={0.9}
            onPress={() => {
              console.log("navigating to group");
              navigation.navigate("deviceObjectPage", { group: group });
            }}
          >
            <Animated.View
              style={{
                height: groupButtonHeight,
              }}
            ></Animated.View>
          </RectButton> */}
        {group.devices.length > 0 &&
          group.devices.map((device, d_index) => {
            const top = interpolate(transition, {
              inputRange: [0, 1],
              outputRange: [d_index * 5, d_index * (deviceCardHeight + 15)],
            });
            return (
              <Animated.View
                style={[
                  styles.device,
                  {
                    position: "absolute",
                    zIndex: group.devices.length - d_index,
                    top: top,
                  },
                ]}
              >
                <DeviceCard
                  device={device}
                  deviceContainer={group}
                  navigation={navigation}
                />
              </Animated.View>
            );
          })}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  groupContainer: {
    width: "100%",
    alignSelf: "center",
    overflow: "hidden",
    //backgroundColor: "#ff0",
  },
  devicesContainer: {
    //backgroundColor: "red",
    overflow: "hidden",
  },
  device: {
    width: "100%",
    alignSelf: "center",
  },
});
