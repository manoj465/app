import React, { useState } from "react";
import { View, FlatList, Text, StyleSheet, Image } from "react-native";
import { ScrollView, RectButton } from "react-native-gesture-handler";
import {
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome5,
} from "@expo/vector-icons";
import { TimerEditorDialog } from "./TimerEditorDialog";
import { deviceContainerType } from "../../../util/dummyData/DummyData";
import { Dialog } from "react-native-simple-dialogs";
import { useDispatch, useSelector } from "react-redux";
import { timerDialogShowHideReduxAction } from "../../../redux/actions/AppCTXActions";
import { appPositiveColor } from "../../../theme/colors/highlightColors";
import { _appState } from "../../../redux/rootReducer";
import {
  timerDaytimeType,
  timerEventType,
} from "../../../util/dummyData/timerTypes";
import { groupTimerSagaAction } from "../../../redux/actions/timerActions";
import { LinearGradient } from "expo-linear-gradient";

const days = [
  { day: "M" },
  { day: "T" },
  { day: "W" },
  { day: "T" },
  { day: "F" },
  { day: "S" },
  { day: "S" },
];
const timers = [{}, {}, {}, {}, {}, {}];
interface Props {
  group: deviceContainerType;
  deviceMacFromNavigator?: string;
}

export const Timer = ({ group, deviceMacFromNavigator }: Props) => {
  const dispatch = useDispatch();
  const groupFromSelector = useSelector((state: _appState) =>
    state.deviceReducer.deviceList.find(
      (item) => item.groupUUID == group.groupUUID
    )
  );
  return (
    <ScrollView horizontal style={{ width: "100%" }}>
      {/* ///TimerEditor Dialog */}
      <TimerEditorDialog group={group} />
      {/* Sec: ListView for Timers in the group */}
      {groupFromSelector?.timers.map((timerFromProp, index) => {
        if (
          !deviceMacFromNavigator ||
          (deviceMacFromNavigator &&
            timerFromProp?.devicesMac.includes(deviceMacFromNavigator))
        )
          return (
            <View style={[styles.timerBlockConatiner]}>
              <LinearGradient
                style={{
                  width: "100%",
                  height: "100%",
                  top: 0,
                  left: 0,
                  position: "absolute",
                }}
                colors={["#5555ff", "#ff55ff"]}
                start={{ x: 0, y: 1 }}
                end={{ x: 1.3, y: 0 }}
              ></LinearGradient>
              {/* Sec: Middle Sec for TIME & EVENT TYPE */}
              <RectButton
                onPress={() => {
                  dispatch(
                    timerDialogShowHideReduxAction({
                      showTimerDialog: true,
                      timer: timerFromProp,
                    })
                  );
                }}
                style={{
                  //backgroundColor: "#fff",
                  flex: 1,
                  alignItems: "center",
                  display: "flex",
                }}
              //activeOpacity={0.1}
              >
                <View
                  style={
                    {
                      //backgroundColor: "red",
                    }
                  }
                >
                  <View style={{ marginTop: 10, marginLeft: 10 }}>
                    <MaterialCommunityIcons
                      name="clock-fast"
                      size={40}
                      color="#fff"
                    />
                  </View>
                  {/* Sec: Time and event container */}
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    {/* Sec: Time */}
                    <Text
                      style={{
                        fontSize: 25,
                        fontWeight: "bold",
                        color: "#fff",
                        marginLeft: 10,
                      }}
                    >
                      {timerFromProp?.hr + " : "}
                      {timerFromProp?.min < 10 ? "0" : ""}
                      {timerFromProp?.min + " "}
                      {timerFromProp?.daytime == timerDaytimeType.AM
                        ? "AM"
                        : "PM"}
                    </Text>
                    {/* Sec: Event Type */}
                    <View
                      style={{
                        //backgroundColor: "#fff",
                        width: 50,
                        alignItems: "center",
                        justifyContent: "space-evenly",
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      {timerFromProp.eventType == timerEventType.ON ? (
                        <Ionicons name="ios-sunny" size={35} color="#fff" />
                      ) : (
                          <MaterialCommunityIcons
                            name="power-sleep"
                            size={35}
                            color="#fff"
                          />
                        )}
                    </View>
                  </View>
                </View>
                {/* Sec: Days Conatiner */}
                <View style={styles.weekDaysConatiner}>
                  {timerFromProp.weekDays.map((item, index) => {
                    return (
                      <View
                        style={[
                          styles.weekDayBlock,
                          {
                            /*  backgroundColor: item ? appPositiveColor : "#fff", */
                          },
                        ]}
                      >
                        <Text
                          style={{
                            textAlign: "center",
                            color: item ? "#fff" : "#555",
                            fontWeight: "bold",
                            fontSize: 12,
                          }}
                        >
                          {days[index].day}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </RectButton>
              {/* Sec: BUTTON CONTAINER update & cancel */}
              <View style={{ display: "flex", flexDirection: "row" }}>
                <RectButton
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    height: 30,
                  }}
                  onPress={() => {
                    dispatch(
                      timerDialogShowHideReduxAction({
                        showTimerDialog: true,
                        timer: timerFromProp,
                      })
                    );
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 12,
                    }}
                  >
                    EDIT
                  </Text>
                </RectButton>
                <RectButton
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#EC70634f",
                    opacity: 0.8,
                  }}
                  onPress={() => {
                    if (!deviceMacFromNavigator) {
                      dispatch(
                        groupTimerSagaAction({
                          timer: Object.assign({}, timerFromProp, {
                            devicesMac: [],
                          }),
                          groupUUID: group.groupUUID,
                        })
                      );
                    } else {
                      dispatch(
                        groupTimerSagaAction({
                          timer: Object.assign({}, timerFromProp, {
                            devicesMac: timerFromProp.devicesMac.filter(
                              (item) => item != deviceMacFromNavigator
                            ),
                          }),
                          groupUUID: group.groupUUID,
                        })
                      );
                    }
                  }}
                >
                  <Text
                    style={{ color: "white", fontWeight: "bold", fontSize: 12 }}
                  >
                    DELETE
                  </Text>
                </RectButton>
              </View>
            </View>
          );
      })}
      {/* Sec: AddNew Event Button */}
      <View style={[styles.timerBlockConatiner]}>
        <RectButton
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            dispatch(
              timerDialogShowHideReduxAction({
                showTimerDialog: true,
              })
            );
          }}
        >
          <Ionicons name="ios-add-circle" size={50} color="#999" />
          <Text
            style={{
              position: "absolute",
              bottom: 10,
              fontWeight: "bold",
              color: "#999",
            }}
          >
            ADD NEW EVENT
          </Text>
        </RectButton>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {},
  timerBlockConatiner: {
    minHeight: 150,
    minWidth: 150,
    backgroundColor: "#ddd",
    marginHorizontal: 10,
    borderRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  weekDaysConatiner: {
    minHeight: 30,
    minWidth: 150,
    display: "flex",
    flexDirection: "row",
    padding: 5,
    overflow: "hidden",
    //backgroundColor: "green",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  weekDayBlock: {
    justifyContent: "center",
  },
});
