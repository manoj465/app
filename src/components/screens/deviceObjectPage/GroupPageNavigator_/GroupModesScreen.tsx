import React from "react";
import { View, Text } from "react-native";
import { Modes } from "../../../common/Modes";
import { Timer } from "../../../common/Timer";
import { ScrollView } from "react-native-gesture-handler";
import { GroupPageStackParamList } from ".";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteParam, useRoute } from "@react-navigation/native";

type Screen2NavigationProp = StackNavigationProp<
  GroupPageStackParamList,
  "GPN_s2"
>;

type groupModesRouteProp = RouteParam<GroupPageStackParamList, "GPN_s1">;

interface Props {
  navigation: Screen2NavigationProp;
  route: groupModesRouteProp;
}

export const GroupModesScreen = ({
  navigation,
  route: {
    params: { group },
  },
}: Props) => {
  const activeRoute = useRoute();
  console.log("---------------" + activeRoute.name);
  return (
    <View>
      <Text
        style={{
          marginTop: 25,
          marginBottom: 10,
          marginHorizontal: 10,
          padding: 0,
          color: "#555",
          fontWeight: "bold",
        }}
      >
        Modes
      </Text>
      <View
        style={{
          marginHorizontal: 10,
          paddingHorizontal: 5,
          borderRadius: 15,
          backgroundColor: "white",
          /* shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5, */
        }}
      >
        <Modes group={group} />
      </View>
      <Text
        style={{
          marginTop: 25,
          marginBottom: 10,
          marginHorizontal: 10,
          padding: 0,
          color: "#555",
          fontWeight: "bold",
        }}
      >
        Timer & Schedular
      </Text>
      <View
        style={{
          marginHorizontal: 10,
          paddingHorizontal: 5,
          borderRadius: 15,
          backgroundColor: "white",
          /* shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5, */
        }}
      >
        <Timer group={group} />
      </View>
    </View>
  );
};
