import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { FlatList, RectButton } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { newDeviceSagaAction } from "../../../../../redux/actions/pairingActions";
import { _appState } from "../../../../../redux/rootReducer";
import {
  deviceContainerType,
  GROUP_TYPES,
} from "../../../../../util/dummyData/DummyData";
import { Ionicons } from "@expo/vector-icons";
import {
  appNegativeColor,
  appPositiveColor,
} from "../../../../../theme/colors/highlightColors";

interface Props {
  group: deviceContainerType;
}

export const GroupDeviceSelectorList = ({ group }: Props) => {
  const [currView, setCurrView] = useState<0 | 1>(0);
  return (
    <View style={styles.container}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontWeight: "bold",
            paddingVertical: 5,
            color: "#ccc",
          }}
        >
          Devices in {group.groupName} group
        </Text>
        <RectButton
          onPress={() => {
            if (currView == 0) {
              setCurrView(1);
            } else if (currView == 1) {
              setCurrView(0);
            }
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "bold",
              marginTop: 10,
              color:
                currView == 0 ? "#555" : currView == 1 ? appPositiveColor : "",
              //backgroundColor: "red",
              minWidth: 100,
              paddingVertical: 5,
              textAlign: "right",
            }}
          >
            {currView == 0 ? "Edit Group" : currView == 1 ? "Save" : ""}
          </Text>
        </RectButton>
      </View>
      <View style={styles.deviceListContainer}>
        {currView == 0 && <ShowDevicesList group={group} />}
        {currView == 1 && <EditorList group={group} />}
      </View>
    </View>
  );
};

interface EditorListProps {
  group: deviceContainerType;
}
const EditorList = ({ group }: EditorListProps) => {
  const dispatch = useDispatch();
  const deviceList = useSelector(
    (state: _appState) => state.deviceReducer.deviceList
  );
  const selectedGroup = deviceList.find(
    (item) => item.groupUUID == group.groupUUID
  );
  return deviceList.map((item, index) => {
    if (
      item.groupType == GROUP_TYPES.SINGLETON ||
      item.groupUUID == group.groupUUID
    ) {
      let deviceSelected = false;
      if (item.groupUUID == group.groupUUID) deviceSelected = true;
      return (
        <View>
          {item.devices.map((deviceItem, index) => {
            return (
              <RectButton
                style={{
                  height: 50,
                  borderRadius: 5,
                  backgroundColor: "#eee",
                  marginTop: 15,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
                onPress={() => {
                  console.log(deviceItem.deviceName);
                  if (deviceSelected) {
                    ///remove from group
                    dispatch(
                      newDeviceSagaAction({
                        newDevice: Object.assign({}, deviceItem, {
                          groupName: "group",
                        }),
                        conType: GROUP_TYPES.SINGLETON,
                      })
                    );
                  }
                  ///add to group
                  else {
                    dispatch(
                      newDeviceSagaAction({
                        newDevice: Object.assign({}, deviceItem, {
                          groupName: group.groupName,
                        }),
                        conType: GROUP_TYPES.MULTIPLE,
                      })
                    );
                  }
                }}
              >
                <View
                  style={{
                    height: 40,
                    width: 40,
                    borderRadius: 50,
                    backgroundColor: "#fff",
                    overflow: "hidden",
                    marginHorizontal: 20,
                  }}
                ></View>
                <Text style={{ fontWeight: "bold" }}>
                  {deviceItem.deviceName ? deviceItem.deviceName : "Unnamed"}
                </Text>
                <View
                  style={{
                    height: 40,
                    width: 40,
                    borderRadius: 5,
                    backgroundColor: "#fff",
                    position: "absolute",
                    right: 15,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {deviceSelected && (
                    <Ionicons
                      name="md-remove"
                      size={24}
                      color={appNegativeColor}
                    />
                  )}
                  {!deviceSelected && (
                    <Ionicons
                      name="md-add"
                      size={24}
                      color={appPositiveColor}
                    />
                  )}
                </View>
              </RectButton>
            );
          })}
        </View>
      );
    } else {
      return <View />;
    }
  });
};

interface ShowDevicesListProps {
  group: deviceContainerType;
}
const ShowDevicesList = ({ group }: ShowDevicesListProps) => {
  const selectedGroup = useSelector((state: _appState) =>
    state.deviceReducer.deviceList.find(
      (item) => item.groupUUID == group.groupUUID
    )
  );

  return (
    <FlatList
      data={selectedGroup?.devices}
      keyExtractor={(item, index) => {
        return "" + index;
      }}
      renderItem={({ item, index }) => {
        return (
          <View
            style={{
              backgroundColor: "#eee",
              height: 50,
              marginTop: 15,
              borderRadius: 5,
              alignItems: "center",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <View
              style={{
                height: 40,
                width: 40,
                borderRadius: 50,
                backgroundColor: "#fff",
                overflow: "hidden",
                marginHorizontal: 20,
              }}
            ></View>
            <Text style={{ fontWeight: "bold" }}>
              {item.deviceName ? item.deviceName : "unnamed"}
            </Text>
            <View
              style={{
                height: 40,
                width: 40,
                backgroundColor: "#fff",
                position: "absolute",
                right: 15,
              }}
            ></View>
          </View>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  deviceListContainer: {
    //backgroundColor: "red",
  },
  deviceObject: {},
});
