import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { RectButton, TextInput } from "react-native-gesture-handler";
import { BaseRouter, RouteParam } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { GroupPageStackParamList } from "../index";
import { Feather } from "@expo/vector-icons";
import { GroupDeviceSelectorList } from "./GroupDeviceSelectorList";
import { useDispatch, useSelector } from "react-redux";
import { groupPropsModification_saga_action } from "../../../../../redux/actions/groupActions/groupPropsModification";
import { dummyGroup } from "../../../../../util/dummyData/DummyData";
import { _appState } from "../../../../../redux/rootReducer";
import { NewRectButtonWithChildren } from "../../../../common/buttons/RectButtonCustom";

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
  const dispatch = useDispatch();
  const { group: groupAsProp } = route.params;
  const [name, setName] = useState("");
  const groupFromSelector = useSelector((state: _appState) =>
    state.deviceReducer.deviceList.find(
      (item) => item.groupUUID == groupAsProp.groupUUID
    )
  );
  console.log("GroupNam is >> " + groupFromSelector?.groupName);
  return (
    <View style={styles.container}>
      <View style={styles.rename_container}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: "bold",
            marginTop: 10,
            color: "#ccc",
          }}
        >
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
            placeholder={groupFromSelector?.groupName}
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
            {name.length > 0 && groupFromSelector?.groupName != name ? (
              <NewRectButtonWithChildren
                style={{}}
                onPress={() => {
                  console.log("Rename Group");
                  dispatch(
                    groupPropsModification_saga_action({
                      newGroup: Object.assign({}, groupAsProp, {
                        groupName: name,
                      }),
                      pre_groupUUID: groupAsProp.groupUUID,
                    })
                  );
                }}
              >
                <Feather name="save" size={24} color="#58D68D" />
              </NewRectButtonWithChildren>
            ) : (
                <Feather name="edit" size={25} color="#555" />
              )}
          </View>
        </View>
      </View>
      <View style={styles.deviceSelectorList}>
        <GroupDeviceSelectorList group={groupAsProp} />
        <View style={{ height: 80 }}></View>
      </View>
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
    //backgroundColor: "red",
    flex: 1,
    marginTop: 15,
    paddingHorizontal: 20,
  },
});
