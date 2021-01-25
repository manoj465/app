import React from "react";
import { FlatList, Image, Text, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import UNIVERSALS from "../../../@universals";
import { _appState } from "../../../redux/rootReducer";
import { NewRectButtonWithChildren } from "../buttons/RectButtonCustom";

const modes = [
  {
    name: "AURORA",
    img: require("../../../../assets/images/presetImages/scenes/aurora.png"),
  },
  {
    name: "AUTUMN",
    img: require("../../../../assets/images/presetImages/scenes/autumn.png"),
  },
  {
    name: "DEEP OPCEAN",
    img: require("../../../../assets/images/presetImages/scenes/deepocean.png"),
  },
  {
    name: "SPRING",
    img: require("../../../../assets/images/presetImages/scenes/spring1.png"),
  },
  {
    name: "SUNRISE",
    img: require("../../../../assets/images/presetImages/scenes/sunrise.png"),
  },
  {
    name: "SUNSET",
    img: require("../../../../assets/images/presetImages/scenes/sunset.png"),
  },
  {
    name: "MODE 7",
    img: require("../../../../assets/images/presetImages/scenes/winter.png"),
  },
];

interface Props {
  device: UNIVERSALS.GLOBALS.DEVICE_t;
}

export const Modes = ({ device }: Props) => {
  const dispatch = useDispatch();
  const deviceFromStore = useSelector((state: _appState) =>
    state.deviceReducer.deviceList.find(
      (item) => item.Mac == device.Mac
    )
  );

  return (
    <View
      style={{
        //backgroundColor: "#555",
        width: "100%",
      }}
    >
      <FlatList
        horizontal
        data={modes}
        keyExtractor={(_, index) => {
          return "" + index;
        }}
        renderItem={({ item, index }) => {
          return (
            <View
              style={{
                borderRadius: 10,
                marginHorizontal: 8,
                overflow: "hidden",
              }}
            >
              <NewRectButtonWithChildren
                /*  onPress={() => {
                   dispatch(
                     groupModes_saga_action({
                       Mode: item.name,
                       groupUUID: group.groupUUID,
                       deviceMac: deviceMacFromNavigator
                         ? deviceMacFromNavigator
                         : deviceMac
                           ? deviceMac
                           : [],
                     })
                   );
                 }} */
                style={{
                  width: 150,
                  height: 210,
                  backgroundColor: "#eee",
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 2,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/*     <LinearGradient
                  style={{
                    height: 120,
                    width: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                  colors={["#fd746c", "#ff9068"]}
                  start={{ x: 1, y: 1 }}
                  end={{ x: 0, y: 0 }}
                ></LinearGradient> */}
                <Image
                  style={{
                    height: 210,
                    width: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                  source={item.img}
                />

                {/* {groupFromSelector?.activeMode == item.name ? (
                  <AntDesign
                    name="pausecircleo"
                    size={20}
                    color="#fff"
                    style={{ position: "absolute", bottom: 10, right: 10 }}
                  />
                ) : (
                    <AntDesign
                      name="playcircleo"
                      size={20}
                      color="#fff"
                      style={{ position: "absolute", bottom: 10, right: 10 }}
                    />
                  )} */}
                <Text
                  style={{ fontSize: 15, color: "#fff", fontWeight: "bold" }}
                >
                  {item.name}
                </Text>
              </NewRectButtonWithChildren>
            </View>
          );
        }}
      />
    </View>
  );
};
