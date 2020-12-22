import React, { useState } from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";
import { ScrollView, RectButton } from "react-native-gesture-handler";
import {
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome5,
} from "@expo/vector-icons";
import { TimerEditorDialog } from "./TimerEditorDialog";
import { deviceContainerType } from "../../../util/dummyData/DummyData";
import { useDispatch, useSelector } from "react-redux";
import { timerDialogShowHideReduxAction } from "../../../redux/actions/AppCTXActions";
import {
  appNegativeColor,
  appPositiveColor,
} from "../../../theme/colors/highlightColors";
import { _appState } from "../../../redux/reducers";
import {
  timerDaytimeType,
  timerEventType,
} from "../../../util/dummyData/timerTypes";
import { groupTimerSagaAction } from "../../../redux/actions/timerActions";
import { LinearGradient } from "expo-linear-gradient";
import { types } from "../../../@types/huelite";

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
  device: types.HUE_DEVICE_t
}

export const Timer = ({ device }: Props) => {
  return (
    <ScrollView style={{ width: "100%" }}>
      {/* <TimerEditorDialog group={group} /> */}
      {/* ///TimerEditor Dialog */}
      {/* Sec: ListView for Timers in the group */}
      {device.timers?.length && device?.timers.map((timerFromProp, index) => {
        return (
          <View style={styles.timerBlockConatiner}>
            {/* Sec: Left Side Section */}
            <View
              style={{
                backgroundColor: "#fff",
                margin: 10,
                paddingVertical: 10,
                display: "flex",
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  width: 1,
                  borderLeftColor:
                    timerFromProp?.ET == timerEventType.ON
                      ? appPositiveColor
                      : "#aaa",
                  borderLeftWidth: 2,
                }}
              ></View>
              <Text
                style={{
                  color: "#777",
                  fontSize: 14,
                  marginLeft: 10,
                  marginBottom: 10,
                }}
              >
                {timerFromProp.HR < 10 ? "0" : ""}
                {timerFromProp.HR}
                {":"}
                {timerFromProp.MIN < 10 ? "0" : ""}
                {timerFromProp.MIN + " "}
                {timerFromProp.DT == timerDaytimeType.AM ? "AM" : "PM"}
              </Text>
            </View>
            {/* Sec: Timer Card */}
            <View
              style={{
                flex: 1,
                marginVertical: 10,
                marginRight: 10,
                borderRadius: 15,
                backgroundColor: "#fff",
                overflow: "hidden",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.22,
                shadowRadius: 2.22,
                elevation: 3,
              }}
            >
              <LinearGradient
                colors={["#ae39fe", "#cf63ff"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0 }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: "100%",
                  width: "100%",
                }}
              />
              {/* Sec: Middle Sec for TIME & EVENT TYPE */}
              <RectButton
                /*  onPress={() => {
                   dispatch(
                     timerDialogShowHideReduxAction({
                       showTimerDialog: true,
                       timer: timerFromProp,
                     })
                   );
                 }} */
                style={{
                  flex: 1,
                  //backgroundColor: "#ff0",
                }}
              >
                {/* Sec: Event Type */}
                <View style={{ marginLeft: 20, marginTop: 10 }}>
                  <Text style={{ color: "white", fontSize: 12 }}>
                    {timerFromProp?.ET == timerEventType.ON
                      ? "TURN ON"
                      : "TURN OFF"}
                  </Text>
                </View>
                {/* Sec: Alarm Time */}
                <View
                  style={{
                    //backgroundColor: "#f00",
                    flex: 1,
                    marginLeft: 20,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 40,
                      //fontWeight: "bold",
                      color: "#fff",
                    }}
                  >
                    {timerFromProp?.HR + " : "}
                    {timerFromProp?.MIN && timerFromProp.MIN < 10 ? "0" : ""}
                    {timerFromProp?.MIN + " "}
                    {timerFromProp?.DT == timerDaytimeType.AM
                      ? "AM"
                      : "PM"}
                  </Text>
                </View>
              </RectButton>
              {/* Sec: Days Conatiner */}
              <View style={styles.weekDaysConatiner}>
                {timerFromProp?.DAYS.map((item, index) => {
                  return (
                    <View style={[styles.weekDayBlock]}>
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
              {/* Sec: BUTTON CONTAINER ==> EDIT / DELETE */}
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  borderTopColor: "#fff",
                  borderTopWidth: 0.5,
                  marginHorizontal: 10,
                }}
              >
                {/* Sec: EDIT BUTTON */}
                <RectButton
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    height: 30,
                  }}
                /* onPress={() => {
                  dispatch(
                    timerDialogShowHideReduxAction({
                      showTimerDialog: true,
                      timer: timerFromProp,
                    })
                  );
                }} */
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 12,
                      color: "#fff",
                    }}
                  >
                    EDIT
                    </Text>
                </RectButton>
                {/* Sec: Divider */}
                <View
                  style={{
                    width: 1,
                    borderRightColor: "#fff",
                    borderRightWidth: 0.5,
                    marginVertical: 5,
                  }}
                ></View>
                {/* Sec: DELETE BUTTON */}
                <RectButton
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    //backgroundColor: "#EC7063",
                  }}
                /* onPress={() => {
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
                }} */
                >
                  <Text
                    style={{
                      color: appNegativeColor,
                      fontWeight: "bold",
                      fontSize: 12,
                    }}
                  >
                    DELETE
                    </Text>
                </RectButton>
              </View>
            </View>
          </View>
        );
      })}
      {/* Sec: AddNew Event Button */}
      <RectButton
        style={[
          styles.timerBlockConatiner,
          { justifyContent: "center", alignItems: "center", minHeight: 120 },
        ]}
      /*   onPress={() => {
          dispatch(
            timerDialogShowHideReduxAction({
              showTimerDialog: true,
            })
          );
        }} */
      >
        <Ionicons name="ios-add-circle" size={50} color="#555" />
        <Text style={{ position: "absolute", bottom: 10, fontWeight: "bold" }}>
          ADD NEW EVENT
        </Text>
      </RectButton>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {},
  timerBlockConatiner: {
    width: "100%",
    backgroundColor: "#fff",
    overflow: "hidden",
    display: "flex",
    flexDirection: "row",
  },
  weekDaysConatiner: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    padding: 5,
    overflow: "hidden",
    justifyContent: "space-evenly",
  },
  weekDayBlock: {
    margin: 2,
    width: 30,
    justifyContent: "center",
    //borderWidth: 0.5,
    //borderColor: "white",
    //borderRadius: 20,
    /* shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2, */
  },
});
