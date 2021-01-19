import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { RectButton, ScrollView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import UNIVERSALS from "../../../@universals";
import { appState } from "../../../redux";
import { appNegativeColor, appPositiveColor } from "../../../theme/colors/highlightColors";
import { appOperator } from "../../../util/app.operator";
import { getCurrentTimeStampInSeconds } from "../../../util/DateTimeUtil";
import { logger } from "../../../util/logger";
import { NewTimerDialog } from "./NewTimerDialog";

const days = [
  { day: "M" },
  { day: "T" },
  { day: "W" },
  { day: "T" },
  { day: "F" },
  { day: "S" },
  { day: "S" },
];

interface Props {
  device: UNIVERSALS.GLOBALS.DEVICE_t
  log?: logger
}
/** 
 * 
 * ## todo
 * featureRequest timer delete action conformation to avoid unwanted delete operation
 */
export const Timer = ({ device, log }: Props) => {
  const deviceFromStore = useSelector((state: appState) => state.deviceReducer.deviceList.find(item => item.Mac == device.Mac))
  const [timerInEditor, setTimerInEditor] = useState<Omit<UNIVERSALS.GLOBALS.TIMER_t, "id"> & { id?: string } | undefined>(undefined)



  return (
    <ScrollView /* Sec1: ListView for Timers in the group  */
      showsVerticalScrollIndicator={false}
      style={{
        width: "100%",
      }} >
      {deviceFromStore && deviceFromStore.timers.map((timerFromProp, index) => { /* Sec2: timer block container */
        return (
          <View
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
                    timerFromProp?.ET == UNIVERSALS.GLOBALS.TIMER_EVENT_TYPE_e.ON
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
                {timerFromProp.DT == UNIVERSALS.GLOBALS.TIMER_DAYTIME_e.AM ? "AM" : "PM"}
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
                    {timerFromProp?.ET == UNIVERSALS.GLOBALS.TIMER_EVENT_TYPE_e.ON
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
                    {timerFromProp?.DT == UNIVERSALS.GLOBALS.TIMER_DAYTIME_e.AM
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
                    setTimerInEditor(timerFromProp)

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
                  onPress={() => {
                    log?.print("currentTimersList is " + JSON.stringify(deviceFromStore.timers))
                    let newTimers: UNIVERSALS.GLOBALS.TIMER_t[] = []
                    deviceFromStore.timers.forEach((deleteTimerObj, deleteTimerObjIndex) => {
                      if (deleteTimerObj.id == timerFromProp.id) {
                        log?.print("timer to be deleted at index " + deleteTimerObjIndex + ", timerId is " + deleteTimerObj.id)
                      }
                      newTimers.push(deleteTimerObj)
                    })
                    log?.print("timersList after deletion " + JSON.stringify({ ...device, timers: newTimers }))
                    appOperator.device({
                      cmd: "ADD_UPDATE_DEVICES",
                      newDevices: [{ ...device, timers: newTimers, localTimeStamp: getCurrentTimeStampInSeconds() }],
                      log
                    })
                  }}
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
      {(deviceFromStore && deviceFromStore.timers?.length < 5) && <RectButton /* Sec2: AddNew Event Button */
        style={[
          {
            justifyContent: "center",
            alignItems: "center",
            minHeight: 120
          },
        ]}
        onPress={() => {
          setTimerInEditor({
            DAYS: [true, true, true, true, true, false, false],
            H: 10,
            M: 0,
            ET: UNIVERSALS.GLOBALS.TIMER_EVENT_TYPE_e.ON,
            DT: UNIVERSALS.GLOBALS.TIMER_DAYTIME_e.AM,
            STATUS: 1
          })
        }}
      >
        <Ionicons name="ios-add-circle" size={50} color="#555" />
        <Text style={{ position: "absolute", bottom: 10, fontWeight: "bold" }}>
          ADD NEW EVENT
        </Text>
      </RectButton>}
      <NewTimerDialog /* Sec2: timer dialog */
        device={deviceFromStore} // IMP send device from redux state so that receiving component can have latest state of device always
        timerInEditor={timerInEditor}
        setTimerInEditor={setTimerInEditor}
        log={log ? new logger("timer editor dialog", log) : undefined} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {},
  timerBlockConatiner: {
    width: "100%",
    minHeight: 120,
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
