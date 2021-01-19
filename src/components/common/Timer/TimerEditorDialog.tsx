import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Dialog } from "react-native-simple-dialogs";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { timerDialogShowHideReduxAction } from "../../../redux/actions/AppCTXActions";
import { deviceTimerSagaAction } from "../../../redux/actions/timerActions";
import { _appState } from "../../../redux/rootReducer";
import { appPositiveColor } from "../../../theme/colors/highlightColors";
import { deviceContainerType } from "../../../util/dummyData/DummyData";
import { EmptyWeekDayList, timerDaytimeType, timerEventType, timerType, weekDaysType } from "../../../util/dummyData/timerTypes";
import { uuidv4 } from "../../../util/UUID_utils";
import { NewSelector } from "../NewSelector";

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

const dayTimeTable = [
  { _data: "AM", val: timerDaytimeType.AM },
  { _data: "PM", val: timerDaytimeType.PM },
];

const weekDays = ["M", "T", "W", "T", "F", "S", "S"];

interface Props {
  group: deviceContainerType;
  dispatch: Dispatch;
  DialogCTX: { showTimerDialog: boolean; timer: timerType };
}

const Item = ({
  group,
  dispatch,
  DialogCTX: {
    showTimerDialog,
    timer = {
      hr: 8,
      min: 0,
      daytime: 1,
      eventType: 1,
      timerUUID: "",
      weekDays: EmptyWeekDayList,
      devicesMac: group.devices.map((item, index) => {
        return item.Mac;
      }),
    },
  },
}: Props) => {
  const [view, setView] = useState<0 | 1>(0);
  const [hrIndex, setHrIndex] = useState<number>(timer.hr - 1);
  const [minIndex, setMinIndex] = useState<number>(timer.min / 5);
  const [dayTimeIndex, setDayTimeIndex] = useState<timerDaytimeType>(timer.daytime);
  const [eventType, setEventType] = useState<timerEventType>(timer.eventType);
  const [selectedDevices, setSelectedDevices] = useState<string[]>(
    timer.devicesMac
  );
  const [selectedDays, setSelectedDays] = useState<weekDaysType>(
    timer.weekDays
  );

  useEffect(() => {
    let Empty = true;
    selectedDays?.forEach((item, index) => {
      if (item) {
        Empty = false;
      }
    });
    if (Empty) {
      setView(0);
    } else {
      setView(1);
    }
    return () => { };
  }, [selectedDays]);

  return (
    <View>
      {/* Sec: Edit Timer View*/}

      <View style={{ backgroundColor: "#fff" }}>
        {/* Sec: EVENT_TYPE SELECTOR CONTAINER */}
        <View>
          {/* Sec: Container Heading */}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 20,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "bold", color: "#555" }}>
              Select Event Type
            </Text>
            <Text style={{ fontSize: 12, fontWeight: "bold", color: "#555" }}>
              ON/OFF
            </Text>
          </View>
          {/* Sec: Event type selector Button Container */}
          <View
            style={{
              height: 60,
              //backgroundColor: "#eee",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
              paddingHorizontal: 20,
            }}
          >
            {/* Sec: EVENT_TYPE ON => Button */}
            <TouchableOpacity
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: eventType == 1 ? "#58D68D" : "#fff",
                height: "80%",
                overflow: "hidden",
                borderRadius: 80,
              }}
              onPress={() => {
                if (eventType != 1) {
                  setEventType(1);
                }
              }}
            >
              <Ionicons
                name="ios-sunny"
                size={24}
                color={eventType == 1 ? "#fff" : "#58D68D"}
              />
            </TouchableOpacity>
            {/* Sec: EVENT_TYPE OFF => Button */}
            <TouchableOpacity
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: eventType == 1 ? "#fff" : "#ccc",
                height: "80%",
                overflow: "hidden",
                borderRadius: 80,
              }}
              onPress={() => {
                if (eventType != 0) {
                  setEventType(0);
                }
              }}
            >
              <MaterialCommunityIcons
                name="power-sleep"
                size={24}
                color={"#555"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Sec: WeekDay Selector  */}
        <View
          style={{
            //backgroundColor: "red",
            display: "flex",
            flexDirection: "row",
            paddingHorizontal: 20,
            justifyContent: "space-evenly",
            alignItems: "center",
            height: 50,
          }}
        >
          {view == 0 ? (
            <TouchableOpacity
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => {
                if (view == 0) setView(1);
                else if (view == 1) setView(0);
              }}
            >
              <Text
                style={{
                  width: "100%",
                  fontSize: 15,
                  marginRight: 20,
                  textAlign: "right",
                  //fontWeight: "bold",
                  color: "#555",
                }}
              >
                Repeat Event
              </Text>
            </TouchableOpacity>
          ) : (
              weekDays.map((item, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      const updatedDaysList = selectedDays?.map(
                        (item, indexx) => {
                          if (index == indexx) {
                            return !selectedDays[indexx];
                          }
                          return item;
                        }
                      );
                      setSelectedDays(updatedDaysList);
                    }}
                    style={{
                      //backgroundColor: "red",
                      flex: 1,
                      height: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "bold",
                        color: selectedDays[index] ? appPositiveColor : "#aaa",
                      }}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })
            )}
        </View>

        {/* Sec: Event Time Selector Container */}
        <View
          style={{
            marginTop: 10,
            //backgroundColor: "#eee",
          }}
        >
          {/* Sec: Event Time Selector Container Heading Block */}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              //display: "none",
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "bold", color: "#555" }}>
              Select Event Time
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                color: "#555",
              }}
            >
              {hrs[hrIndex]._data +
                ":" +
                mins[minIndex]._data +
                " " +
                dayTimeTable[dayTimeIndex]._data}
            </Text>
          </View>
          {/* Sec: Event Time Picker */}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              //backgroundColor: "red",
              justifyContent: "space-evenly",
            }}
          >
            {/* Sec: HOUR SELECTOR */}
            <View>
              <NewSelector
                initValue={1}
                heading="HRS"
                maxVal={hrs.length}
                value={hrs[hrIndex] ? hrs[hrIndex]._data : ""}
                index={hrIndex}
                setIndex={setHrIndex}
              />
            </View>
            {/* Sec: Minute SELECTOR */}
            <View>
              <NewSelector
                initValue={5}
                heading="MIN"
                maxVal={mins.length}
                value={mins[minIndex] ? mins[minIndex]._data : ""}
                index={minIndex}
                setIndex={setMinIndex}
              />
            </View>
            {/* Sec: Daytime SELCETOR */}
            <View>
              <NewSelector
                initValue={0}
                heading="DAYTIME"
                maxVal={dayTimeTable.length}
                value={
                  dayTimeTable[dayTimeIndex]
                    ? dayTimeTable[dayTimeIndex]._data
                    : ""
                }
                index={dayTimeIndex}
                setIndex={setDayTimeIndex}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Sec: Devices Selector View */}

      <View style={{ display: "flex", paddingHorizontal: 20 }}>
        <Text
          style={{
            fontWeight: "bold",
            color: "#555",
            marginLeft: 5,
            fontSize: 12,
          }}
        >
          Select Devices
        </Text>
        <FlatList
          horizontal
          keyExtractor={(_, _index) => {
            return "" + _index;
          }}
          data={group.devices}
          renderItem={({
            item: selectorListdeviceFromProp,
            index: selectorListdeviceFromPropIndex,
          }) => {
            const included = selectedDevices.includes(
              selectorListdeviceFromProp.Mac
            );
            /* Sec: Device SelectorList Item */
            return (
              <TouchableOpacity
                onPress={() => {
                  if (
                    selectedDevices.includes(selectorListdeviceFromProp.Mac)
                  ) {
                    console.log(
                      "device contain Item" + selectorListdeviceFromProp.Mac
                    );
                    console.log("Full LIst");
                    console.log(JSON.stringify(selectedDevices));
                    const list = selectedDevices.map((_item, index) => {
                      if (_item == selectorListdeviceFromProp.Mac) {
                        console.log(
                          "match found to delete at " +
                          index +
                          " device is " +
                          _item
                        );
                        return null;
                      } else return _item;
                    });
                    setSelectedDevices(list.filter((item) => item));
                  } else {
                    const LIST = Object.assign([], selectedDevices);
                    LIST.push(selectorListdeviceFromProp.Mac);
                    setSelectedDevices(LIST);
                  }
                }}
                style={{
                  //height: 80,
                  //width: 80,
                  borderRadius: 5,
                  //borderWidth: included ? 0.5 : 0,
                  borderColor: appPositiveColor,
                  margin: 5,
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    marginTop: 5,
                    marginBottom: 10,
                    height: 60,
                    width: 60,
                    borderRadius: 30,
                    overflow: "hidden",
                    backgroundColor: included ? appPositiveColor : "#e7e7e7",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name="ios-sunny"
                    size={50}
                    color={included ? "#fff" : "#ccc"}
                  />
                </View>
                <Text
                  style={{
                    fontWeight: "bold",
                    marginHorizontal: 10,
                    marginBottom: 10,
                    color: included ? appPositiveColor : "#555",
                  }}
                >
                  {selectorListdeviceFromProp.deviceName}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Sec: Bottom Buttons View Container */}
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          paddingHorizontal: 20,
          marginBottom: 20,
          marginTop: 10,
        }}
      >
        {/* Sec: Update Button */}
        <TouchableOpacity
          style={{
            backgroundColor: "#58D68D",
            marginVertical: 10,
            height: 45,
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            borderTopLeftRadius: 25,
            borderBottomLeftRadius: 25,
          }}
          onPress={() => {
            dispatch(
              //TODO if (its a device than dispatch device timer saga action)
              deviceTimerSagaAction({
                timer: {
                  deviceMac: selectedDevices,
                  timerUUID:
                    timer.timerUUID.length > 0 ? timer.timerUUID : uuidv4(),
                  HR: hrs[hrIndex] ? hrs[hrIndex].val : 1,
                  MIN: mins[minIndex] ? mins[minIndex].val : 0,
                  DAYS: 85,//TODO do bit operation for this number
                  DT: 1,
                  ET: 1,
                  ldb: {
                    TS: 123,
                    DST: 1,
                    DBS: 1
                  }
                },
                groupUUID: group.groupUUID,
              })
            );
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "#fff",
              fontWeight: "bold",
              fontSize: 18,
            }}
          >
            Update
          </Text>
        </TouchableOpacity>
        {/* Sec: Cancel Button */}
        <TouchableOpacity
          onPress={() => {
            ///setShow(false);
            dispatch(
              timerDialogShowHideReduxAction({
                showTimerDialog: false,
                timer: undefined,
              })
            );
          }}
          style={{
            backgroundColor: "#f55",
            marginVertical: 10,
            height: 45,
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            borderTopRightRadius: 25,
            borderBottomRightRadius: 25,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "#fff",
              fontWeight: "bold",
              fontSize: 18,
            }}
          >
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

interface Dialog_Props {
  group: deviceContainerType;
}

export const TimerEditorDialog = ({ group }: Dialog_Props) => {
  const DialogCTX = useSelector(
    (state: _appState) => state.appCTXReducer.timerDialog
  );
  const dispatch = useDispatch();
  return (
    <Dialog
      visible={DialogCTX.showTimerDialog}
      title="Set up Event"
      dialogStyle={{
        borderRadius: 10,
      }}
      contentStyle={{ padding: 0 }}
      titleStyle={{
        color: "#555",
        fontSize: 18,
        fontWeight: "bold",
        marginHorizontal: 20,
      }}
      onTouchOutside={() => {
        dispatch(
          timerDialogShowHideReduxAction({
            showTimerDialog: false,
            timer: undefined,
          })
        );
      }}
    >
      <Item group={group} dispatch={dispatch} DialogCTX={DialogCTX} />
    </Dialog>
  );
};

const styles = StyleSheet.create({
  container: {},
});
