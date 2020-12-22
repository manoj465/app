import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { RectButton, State } from "react-native-gesture-handler";
import { useValue, hsv2color, useTransition, mix } from "react-native-redash";
import Animated, { interpolate } from "react-native-reanimated";
import { MaterialIcons } from "@expo/vector-icons";
import ColorPicker from "../../../common/ColorPicker";
import { dummyDevice } from "../../../../util/dummyData/DummyData";
import { StackNavigationProp } from "@react-navigation/stack";
import { GroupPageStackParamList } from ".";
import { RouteParam } from "@react-navigation/native";
import { onColorValueChange_Props } from "../../devicePage";
import { useDispatch } from "react-redux";
import { colorUpdateSagaAction } from "../../../../redux/deviceListReducer/actions/DeviceListAction";
import { createConfigItem } from "@babel/core";

type groupColorPickerNavigationProp = StackNavigationProp<
  GroupPageStackParamList,
  "GPN_s1"
>;

type groupColorPickerRouteProp = RouteParam<GroupPageStackParamList, "GPN_s1">;

interface Props {
  navigation: groupColorPickerNavigationProp;
  route: groupColorPickerRouteProp;
}

export const GroupColorPicker = ({ navigation, route: { params } }: Props) => {
  const {
    hue,
    saturation,
    value,
    backgroundColor,
    group,
    selectedDevices,
    setselectedDevices,
  } = params;
  const dispatch = useDispatch();
  const [list, setList] = useState<string[]>([]);
  const [showDevices, setShowDevices] = useState<0 | 1>(0);
  const transition = useTransition(showDevices);
  const rotate = mix(transition, -Math.PI / 2, Math.PI / 2);
  const height = interpolate(transition, {
    inputRange: [0, 1],
    outputRange: [0, 85],
  });

  const onValueChange: onColorValueChange_Props = (state, { h, s, v }) => {
    const selectedDevice: Array<string> = [];
    dispatch(
      colorUpdateSagaAction({
        hsv: { h, s },
        deviceMac: list,
        groupUUID: group.groupUUID,
      })
    );
  };

  useEffect(() => {
    console.log("----> " + list.length);
    if (list.length == 0) {
      const _list = group.devices.map((item, index) => {
        return item.Mac;
      });
      setList(_list);
    }
    return () => { };
  }, []);

  return (
    <View
      style={{
        marginTop: 30,
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderRadius: 24,
        marginHorizontal: 10,
      }}
    >
      {/* ///Select Devices */}
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <RectButton
          style={{}}
          activeOpacity={0.1}
          onPress={() => {
            if (showDevices == 0) {
              setShowDevices(1);
            } else {
              setShowDevices(0);
            }
          }}
        >
          <Animated.View
            style={[
              {
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "white",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.22,
                shadowRadius: 1.22,
                elevation: 3,
              },
              { transform: [{ rotate: rotate }] },
            ]}
          >
            <MaterialIcons name="navigate-next" size={20} color="black" />
          </Animated.View>
        </RectButton>
        <Text style={{ fontSize: 15, fontWeight: "bold", marginLeft: 20 }}>
          Select Devices
        </Text>
      </View>
      {/* ///Devices Row */}
      <Animated.View
        style={{
          marginTop: 10,
          display: "flex",
          flexDirection: "row",
          height: height,
          overflow: "hidden",
        }}
      >
        <FlatList
          horizontal
          data={group.devices}
          keyExtractor={(item, index) => "" + index}
          renderItem={({ item, index }) => {
            return (
              <RectButton
                onPress={() => {
                  if (list.includes(item.Mac)) {
                    setList(
                      list.filter((mac, index) => {
                        if (mac == item.Mac) {
                          return false;
                        } else {
                          return true;
                        }
                      })
                    );
                  } else {
                    setList(Object.assign([], [...list, item.Mac]));
                    setselectedDevices(list);
                  }
                }}
                style={{ marginRight: 10 }}
              >
                <View
                  style={{
                    width: 120,
                    height: 80,
                    borderRadius: 10,
                    backgroundColor: list.includes(item.Mac) ? "#7f7" : "#ddd",
                    justifyContent: "space-between",
                    padding: 5,
                    paddingLeft: 10,
                    paddingTop: 10,
                  }}
                >
                  <View
                    style={{
                      height: 40,
                      width: 40,
                      borderRadius: 50,
                      backgroundColor: "#fff",
                    }}
                  ></View>
                  <Text style={{ fontWeight: "bold", opacity: 0.8 }}>
                    {item.deviceName ? item.deviceName : "unnamed"}
                  </Text>
                </View>
              </RectButton>
            );
          }}
        />
      </Animated.View>
      {/* ColorPicker */}
      <View style={{ marginTop: 40 }}>
        <ColorPicker
          hue={hue}
          saturation={saturation}
          backgroundColor={backgroundColor}
          device={Object.assign({}, dummyDevice, { hsv: { h: 0, s: 0, v: 0 } })}
          onValueChange={onValueChange}
        />
      </View>
    </View>
  );
};
