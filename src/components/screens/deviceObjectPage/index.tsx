import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DeviceObjectHeader } from "./DeviceObjectHeader";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { RectButton } from "react-native-gesture-handler";
import { GroupPageNavigator } from "./GroupPageNavigator_";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainRouterStackParamList } from "../../../routers/MainRouter";
import { RouteParam } from "@react-navigation/native";
import { hsv2color, useValue } from "react-native-redash";
import { max } from "react-native-reanimated";
import { NewRectButtonWithChildren } from "../../common/buttons/RectButtonCustom";

type groupNavigationProp = StackNavigationProp<
  MainRouterStackParamList,
  "deviceObjectPage"
>;

type groupRouteProp = RouteParam<MainRouterStackParamList, "deviceObjectPage">;

interface Props {
  navigation: groupNavigationProp;
  route: groupRouteProp;
}

export const DeviceObjectPage = ({ navigation, route: { params } }: Props) => {
  const hue = useValue(0);
  const saturation = useValue(0);
  const value = useValue(1);
  const backgroundColor = hsv2color(hue, max(0.2, saturation), value);
  const [selectedDevices, setselectedDevices] = useState<string[]>([]);

  const _setselectedDevices = (list: string[]) => {
    setselectedDevices(list);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Sec1: Header */}
      <View style={styles.header}>
        <DeviceObjectHeader
          groupName={params.group.groupName}
          groupUUID={params.group.groupUUID}
          backgroundColor={backgroundColor}
          selectedDevices={selectedDevices}
        />
      </View>
      {/* Sec2: Device Selector and Colorpicker */}
      <View style={{ flex: 1 }}>
        <GroupPageNavigator
          groupName={params.group.groupName}
          group={params.group}
          hue={hue}
          saturation={saturation}
          value={value}
          backgroundColor={backgroundColor}
          selectedDevices={selectedDevices}
          setselectedDevices={_setselectedDevices}
        />
      </View>
      {/* Sec3: Navigator  block*/}
      <View
        style={{
          backgroundColor: "#33f",
          height: 60,
          width: 230,
          paddingHorizontal: 10,
          borderRadius: 15,
          overflow: "hidden",
          alignSelf: "center",
          position: "absolute",
          bottom: 10,
          display: "flex",
          flexDirection: "row",
          /* shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 1, */
        }}
      >
        <NewRectButtonWithChildren
          onPress={() => {
            navigation.replace("GPN_s3", {
              groupName: params.group.groupName,
            });
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
        </NewRectButtonWithChildren>
        <NewRectButtonWithChildren
          onPress={() => {
            navigation.replace("GPN_s1");
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
        </NewRectButtonWithChildren>
        <NewRectButtonWithChildren
          onPress={() => {
            navigation.replace("GPN_s2");
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
        </NewRectButtonWithChildren>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    //backgroundColor: "red",
    //height: 200,
    flex: 1,
  },
  header: {
    marginTop: 25,
  },
});
