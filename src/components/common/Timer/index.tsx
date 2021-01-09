import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import { RectButton, ScrollView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import types from "../../../@types/huelite";
import { appState } from "../../../redux";
import { appNegativeColor, appPositiveColor } from "../../../theme/colors/highlightColors";
import { timerDaytimeType, timerEventType } from "../../../util/dummyData/timerTypes";
import { logger } from "../../../util/logger";
import STYLES from "../../common/styles"
import { NewRectButtonWithChildren } from "../buttons/RectButtonCustom";
import { TimePicker } from "../TimePicker";

const days = [
  { day: "M" },
  { day: "T" },
  { day: "W" },
  { day: "T" },
  { day: "F" },
  { day: "S" },
  { day: "S" },
];
const hrs = [
  { _data: "01", val: 1 },
  { _data: "02", val: 2 },
  { _data: "03", val: 3 },
  { _data: "04", val: 4 },
  { _data: "05", val: 5 },
  { _data: "06", val: 6 },
  { _data: "07", val: 7 },
  { _data: "08", val: 8 },
  { _data: "09", val: 9 },
  { _data: "10", val: 10 },
  { _data: "11", val: 11 },
  { _data: "12", val: 12 },
];
const mins = [
  { _data: "00", val: 0 },
  { _data: "05", val: 5 },
  { _data: "10", val: 10 },
  { _data: "15", val: 15 },
  { _data: "20", val: 20 },
  { _data: "25", val: 25 },
  { _data: "30", val: 30 },
  { _data: "35", val: 35 },
  { _data: "40", val: 40 },
  { _data: "45", val: 45 },
  { _data: "50", val: 50 },

  { _data: "55", val: 55 },
  /* { _data: "12" },
  { _data: "13" },
  { _data: "14" },
  { _data: "15" },
  { _data: "16" },
  { _data: "17" },
  { _data: "18" },
  { _data: "19" },
  { _data: "20" },

  { _data: "21" },
  { _data: "22" },
  { _data: "23" },
  { _data: "24" },
  { _data: "25" },
  { _data: "26" },
  { _data: "27" },
  { _data: "28" },
  { _data: "29" },
  { _data: "30" },

  { _data: "41" },
  { _data: "42" },
  { _data: "43" },
  { _data: "44" },
  { _data: "45" },
  { _data: "46" },
  { _data: "47" },
  { _data: "48" },
  { _data: "49" },
  { _data: "50" },

  { _data: "51" },
  { _data: "52" },
  { _data: "53" },
  { _data: "54" },
  { _data: "55" },
  { _data: "56" },
  { _data: "57" },
  { _data: "58" },
  { _data: "59" }, */
];

interface Props {
  device: types.HUE_DEVICE_t
  log?: logger
}

export const Timer = ({ device, log }: Props) => {
  const deviceFromStore = useSelector((state: appState) => state.deviceReducer.deviceList.find(item => item.Mac == device.Mac))
  const [showTimerEditorDialog, setShowTimerEditorDialog] = useState<types.HUE_TIMER_t | undefined>(undefined)
  const [hrIndex, setHrIndex] = useState<number>(8);
  const [minIndex, setMinIndex] = useState<number>(0);

  log?.print("size of device timers list is " + JSON.stringify(device))

  return (
    <ScrollView /* Sec1: ListView for Timers in the group  */
      showsVerticalScrollIndicator={false}
      style={{
        width: "100%",
      }} >
      {device.timers?.length && device?.timers.map((timerFromProp, index) => {
        return (
          <View /* Sec2: timer block container */
            style={styles.timerBlockConatiner}
            key={index}>
            <View /* Sec3: Left Side Section */
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
                {timerFromProp.H < 10 ? "0" : ""}
                {timerFromProp.H}
                {":"}
                {timerFromProp.M < 10 ? "0" : ""}
                {timerFromProp.M + " "}
                {timerFromProp.DT == timerDaytimeType.AM ? "AM" : "PM"}
              </Text>
            </View>
            <View /* Sec3: Timer Card */
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
              <LinearGradient /* Sec4: */
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
              <View /* Sec4: Middle Sec for TIME & EVENT TYPE */
                style={{
                  flex: 1,
                  //backgroundColor: "#ff0",
                }}
              >
                <View /* Sec5: Event Type */
                  style={{ marginLeft: 20, marginTop: 10 }}>
                  <Text style={{ color: "white", fontSize: 12 }}>
                    {timerFromProp?.ET == timerEventType.ON
                      ? "TURN ON"
                      : "TURN OFF"}
                  </Text>
                </View>
                <View /* Sec5: Alarm Time */
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
                    {timerFromProp?.H + " : "}
                    {timerFromProp?.M && timerFromProp.M < 10 ? "0" : ""}
                    {timerFromProp?.M + " "}
                    {timerFromProp?.DT == timerDaytimeType.AM
                      ? "AM"
                      : "PM"}
                  </Text>
                </View>
              </View>
              <View /* Sec4: Days Conatiner */
                style={styles.weekDaysConatiner}>
                {timerFromProp?.DAYS.map((item, index) => {
                  return (
                    <View style={[styles.weekDayBlock]} key={index}>
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
              <View /* Sec4: BUTTON CONTAINER ==> EDIT / DELETE */
                style={{
                  display: "flex",
                  flexDirection: "row",
                  borderTopColor: "#fff",
                  borderTopWidth: 0.5,
                  marginHorizontal: 10,
                }}>
                <RectButton /* Sec5: EDIT BUTTON */
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    height: 30,
                  }}
                  onPress={() => {
                    setShowTimerEditorDialog(timerFromProp)

                  }}>
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
                <View /* Sec5: Divider */
                  style={{
                    width: 1,
                    borderRightColor: "#fff",
                    borderRightWidth: 0.5,
                    marginVertical: 5,
                  }}
                ></View>
                <RectButton /* Sec5: DELETE BUTTON */
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
      <RectButton /* Sec2: AddNew Event Button */
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
      <Modal /* Sec2: timer editor dialog */
        animationType="slide"
        transparent
        visible={showTimerEditorDialog != undefined} >
        <View /* Sec3: modal container */
          style={{
            flex: 1,
            //backgroundColor: "red",
            justifyContent: "center",
            alignItems: "center"
          }}>
          <View /* Sec3: modal inner container */
            style={[{
              width: "85%",
              minHeight: 300,
              backgroundColor: "white",
              borderRadius: 20
            }, STYLES.shadow]}>
            <View /* Sec4:  header */
              style={{
                backgroundColor: "green",
                borderRadius: 20,
                margin: 5,
                height: 100,
                width: "97%"
              }}>

            </View>
            <View /* Sec4: middle container */
              style={{
                display: "flex",
                flexDirection: "row"
              }}>
              <TimePicker
                initValue={1}
                heading="HRS"
                maxVal={hrs.length}
                value={hrs[hrIndex] ? hrs[hrIndex]._data : ""}
                index={hrIndex}
                setIndex={setHrIndex}
              />
              <TimePicker
                initValue={5}
                heading="MIN"
                maxVal={mins.length}
                value={mins[minIndex] ? mins[minIndex]._data : ""}
                index={minIndex}
                setIndex={setMinIndex}
              />
              <TimePicker
                initValue={5}
                heading="MIN"
                maxVal={mins.length}
                value={mins[minIndex] ? mins[minIndex]._data : ""}
                index={minIndex}
                setIndex={setMinIndex}
              />
            </View>
            <View /* Sec4: button container */
              style={{
                display: "flex",
                flexDirection: "row",
                marginBottom: 10
              }}>
              <View /* Sec5: save/update button */
                style={{ flex: 1, paddingHorizontal: 5 }}>
                <NewRectButtonWithChildren /* Sec5: close dialog button */
                  onPress={() => {
                    // - [ ] print incoming timer
                    // - [ ] process the timer addition/update here
                    // - [ ] update local state with local timetamp of device
                    // - [ ] update the new device tate to cloud
                  }}
                  useReanimated={false}
                  style={{ backgroundColor: "green" }}>
                  <Text>Update</Text>
                </NewRectButtonWithChildren>
              </View>
              <View /* Sec5: close dialog button */
                style={{ flex: 1, paddingHorizontal: 5 }}>
                <NewRectButtonWithChildren
                  onPress={() => {
                    setShowTimerEditorDialog(undefined)
                  }}
                  useReanimated={false}
                  style={{ backgroundColor: "red" }}>
                  <Text>cancel</Text>
                </NewRectButtonWithChildren>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {},
  timerBlockConatiner: {
    width: "100%",
    height: 160,
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
