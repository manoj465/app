import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { BaseRouter, RouteParam } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { GroupPageStackParamList } from "./index";
import { Feather } from "@expo/vector-icons";

type groupSettingNavigationProp = StackNavigationProp<
  GroupPageStackParamList,
  "GPN_s3"
>;

type groupSettingRouteProp = RouteParam<GroupPageStackParamList, "GPN_s3">;

interface Props {
  navigation: groupSettingNavigationProp;
  route: groupSettingRouteProp;
}

export const GroupSettings = ({ navigation, route }: Props) => {
  const { group } = route.params;
  const [name, setName] = useState("");
  return (
    <View style={styles.container}>
      <View style={styles.rename_container}>
        <Text style={{ fontSize: 12, fontWeight: "bold", marginTop: 10 }}>
          Edit Group Name
        </Text>
        <View style={{ justifyContent: "center" }}>
          <TextInput
            style={styles.rename}
            placeholderTextColor="#aaa"
            onChangeText={(text) => {
              setName(text);
            }}
            textContentType="none"
            placeholder={group.groupName}
            value={name}
          />
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              right: 10,
            }}
          >
            <Feather name="edit" size={25} color="#555" />
          </View>
        </View>
      </View>
      <View style={styles.deviceSelectorList}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "white",
    marginTop: 20,
    flex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  rename_container: {
    paddingHorizontal: 20,
  },
  rename: {
    height: 50,
    width: "100%",
    borderColor: "#ffffff",
    color: "#555",
    fontSize: 15,
    textAlign: "left",
    alignSelf: "center",
    marginTop: 5,
    borderBottomWidth: 0.5,
    fontWeight: "bold",
    backgroundColor: "#eee",
    borderRadius: 5,
  },
  deviceSelectorList: {
    backgroundColor: "red",
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 20,
  },
});
