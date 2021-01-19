import React, { useEffect, useState } from 'react'
import STYLES from "../styles"
import { View, Text, Modal, StyleSheet } from "react-native"
import UNIVERSALS from '../../../@universals';
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons"
import { NewSelector } from '../NewSelector';
import { NewRectButtonWithChildren } from '../buttons/RectButtonCustom';
import { gql, useQuery } from '@apollo/client';
import API from '../../../services/api';
import { logger } from '../../../util/logger';
import { generate_UUID_10_withVenderPrefix } from '../../../util/UUID_utils';
import { appOperator } from '../../../util/app.operator';
import { getCurrentTimeStampInSeconds } from '../../../util/DateTimeUtil';

const daysSelectorArray = [
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
const daytimeSelectorData = [
    { _data: "AM", val: 1 },
    { _data: "PM", val: 2 },
];

interface Props {
    device: UNIVERSALS.GLOBALS.DEVICE_t | undefined
    timerInEditor: Omit<UNIVERSALS.GLOBALS.TIMER_t, "id"> & { id?: string } | undefined
    setTimerInEditor: React.Dispatch<React.SetStateAction<Omit<UNIVERSALS.GLOBALS.TIMER_t, "id"> & { id?: string } | undefined>>
    log?: logger
}
/**
 * ## Devices new timer dialog
 * 
 * ### @description
 * ##### working
 * - onShow fetches device timer from cloud as source of truth
 * - if timersString is received than update the `timers` state object with json object parsed from `timerString` received
 * 
 * #### @state
 * - `timers` - responsible for timerDialog Middle container rendering
 *      **dependentViews**
 *          - middleSecionContainer view conditions
 *              `undefined` => loading
 *              `"error"`=> loading error
 *              `timers` && `timers.length >= 5` => max Timers warning
 *              `timers` && `timers.length < 5` => time selector active
 *              
 * - `hrIndex` - holds hour index for current timer in editor
 * - `minIndex` - holds minute index for current timer in editor
 *  
 * #### @param { device, timerInEditor, setTimerInEditor, log }
 * 
 * #### @returns  timer editor dialog with reactNative Modal component
 * 
 * 
 * ### @changelog
 * 
 * 
 * ### @TODO
 * - [x] middleSectionContainer - show unhandled view
 * - [x] middleSectionContainer - show errors view
 * - [x] middleSectionContainer - show max timers limit reacthed view
 * - [x] middleSectionContainer - show time selector view upon response
 * - [ ] make days selectors functional and style accordingly `ACTIVE` `INACTIVE`
 * - [ ] amke daytime selector and eventtype selector function
 * - [ ] modify current timer in dialog
 * - [ ] update new timer to device state in redux store
 */
export const NewTimerDialog = ({ device, timerInEditor, setTimerInEditor, log }: Props) => {
    const [hrIndex, setHrIndex] = useState<number>(8);
    const [minIndex, setMinIndex] = useState<number>(0);
    const [dtIndex, setDtIndex] = useState<number>(0)
    const [timers, setTimers] = useState<Array<UNIVERSALS.GLOBALS.TIMER_t> | undefined | "error">(undefined)
    const [etIndex, setEtIndex] = useState<UNIVERSALS.GLOBALS.TIMER_EVENT_TYPE_e>(UNIVERSALS.GLOBALS.TIMER_EVENT_TYPE_e.ON)
    const [days, setDays] = useState<UNIVERSALS.GLOBALS.TIMER_DAYS_t>([false, false, false, false, false, false, false])

    useEffect(() => {
        if (timerInEditor) {
            setDays(timerInEditor.DAYS)
            setEtIndex(timerInEditor.ET)
            setDtIndex(timerInEditor.DT)
            setHrIndex(0)
            setMinIndex(0)
        }
        return () => { }
    }, [timerInEditor])

    const resetDialog = () => {
        setTimerInEditor(undefined)
        setTimers(undefined)
        setDays([true, true, true, true, true, true, true])
    }


    return (
        <Modal /* Sec2: timer editor dialog */
            animationType="slide"
            transparent
            visible={timerInEditor != undefined}
            onShow={async () => {
                log?.print("onShow")
                if (device?.id) {
                    const res = await API.cloudAPI.device.deviceTimersQuery.v1({
                        id: device.id,
                        //log: log ? new logger("device timers query", log) : undefined
                    })
                    /**
                     * - [x] validate new timers data before updating state
                     */
                    if (res.RES) {
                        try {
                            if (res.RES.ts && device.ts && res.RES.ts >= device.ts)// => if we have both local and cloud timestamp then compare and  update the latest timerStates in timers object 
                            {
                                let timersObj = UNIVERSALS.GLOBALS.convertTimersStringToObj({ timersString: res.RES.timers })
                                if (timersObj)
                                    setTimers(timersObj)
                                else
                                    setTimers("error")
                            }
                            else setTimers(device.timers)
                        } catch (error) {
                            log?.print(error)
                            setTimers("error")
                        }
                    }
                    else if (res.ERR) {/* if no timersObj is received then set timers state to error so as to set middle section to show error to user */
                        // - [ ] handle deviceTimerQuery errors
                        setTimers("error")
                    } else {
                        setTimers("error")
                        // - [ ] handle unhandled respose
                    }
                }
            }} >
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
                        backgroundColor: "white",
                        borderRadius: 20
                    }, STYLES.shadow]}>
                    <View /* Sec4:  header */
                        style={{
                            backgroundColor: "#F39C12",
                            //borderRadius: 20,
                            //margin: 5,
                            //height: 100,
                            width: "100%",
                            justifyContent: "flex-end",
                            paddingLeft: 10
                        }}>
                        <MaterialCommunityIcons
                            style={{
                                marginTop: 15
                            }}
                            name="toggle-switch-off"
                            size={20} color="white" />
                        <Text style={[STYLES.H7, {
                            margin: 0,
                            padding: 0,
                            color: "white"
                        }]}>TURN OFF</Text>
                        <View style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center"
                        }}>
                            <Text style={[
                                STYLES.H1
                                , {
                                    color: "white",
                                    marginBottom: 0,
                                    marginLeft: 0
                                }]}>{hrs[hrIndex]._data + " : " + mins[minIndex]._data + " " + daytimeSelectorData[dtIndex]._data}</Text>
                            <Feather name="sun" size={15} color="white" />
                        </View>
                    </View>
                    {/* Sec4: middle container */
                        (timers == "error") ? <View style={_styles.middleContainerCommonView}><Text>error loading</Text></View>
                            : (timers == undefined) ? (<View
                                style={_styles.middleContainerCommonView}>
                                <Text>LOADING... please wait</Text>
                            </View>)
                                : ((timers && timers?.length < 5) || (timers && timerInEditor?.id)) ? (<View /* Sec5: middle container */
                                    style={{
                                        width: "100%"
                                    }}>
                                    <View /* Sec5: Event repeatition selector */>
                                        <Text style={[STYLES.H7, { color: "#F39C12", marginTop: 10 }]}>EVENT TYPE</Text>
                                        <View
                                            style={{
                                                display: "flex",
                                                flexDirection: "row"
                                            }}>
                                            <NewRectButtonWithChildren
                                                useReanimated={false}
                                                onPress={() => {
                                                    setEtIndex(UNIVERSALS.GLOBALS.TIMER_EVENT_TYPE_e.ON)
                                                }}
                                                style={{
                                                    height: 50,
                                                    flex: 1,
                                                    backgroundColor: etIndex == UNIVERSALS.GLOBALS.TIMER_EVENT_TYPE_e.ON ? "#aaa" : "#eee",
                                                    marginHorizontal: 10,
                                                    marginVertical: 5,
                                                    justifyContent: "center",
                                                    alignItems: "center"
                                                }}>
                                                <Text>TURN ON</Text>
                                            </NewRectButtonWithChildren>
                                            <NewRectButtonWithChildren
                                                useReanimated={false}
                                                onPress={() => {
                                                    setEtIndex(UNIVERSALS.GLOBALS.TIMER_EVENT_TYPE_e.OFF)
                                                }}
                                                style={{
                                                    height: 50,
                                                    flex: 1,
                                                    backgroundColor: etIndex == UNIVERSALS.GLOBALS.TIMER_EVENT_TYPE_e.OFF ? "#aaa" : "#eee",
                                                    marginHorizontal: 10,
                                                    marginVertical: 5,
                                                    justifyContent: "center",
                                                    alignItems: "center"
                                                }}>
                                                <Text>TURN OFF</Text>
                                            </NewRectButtonWithChildren>
                                        </View>
                                    </View>
                                    <View /* Sec5: Event repeatition selector */>
                                        <Text style={[STYLES.H7, { color: "#F39C12", marginTop: 10 }]}>REPEAT EVENT</Text>
                                        <View /* Sec6: Days selectors buttons */
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                justifyContent: "space-evenly"
                                            }}>
                                            <NewRectButtonWithChildren /* Sec7: oncebutton for days selector */
                                                onPress={() => {
                                                    setDays([false, false, false, false, false, false, false])
                                                }}
                                                useReanimated={false}
                                                style={[{
                                                    width: 50,
                                                    height: 50,
                                                    backgroundColor: "white",
                                                    borderRadius: 25,
                                                    marginHorizontal: 10,
                                                    marginVertical: 5,
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    borderWidth: 0.5,
                                                    borderColor: "#F39C12"
                                                }, STYLES.shadow]} >
                                                <Text style={{
                                                    color: "#F39C12",
                                                    fontSize: 10,
                                                    fontWeight: (() => {
                                                        let once = true
                                                        days.forEach(item => {
                                                            if (item)
                                                                once = false
                                                        });
                                                        return once
                                                    })() ? "bold" : "400"
                                                }}>ONCE</Text>
                                            </NewRectButtonWithChildren>
                                            <NewRectButtonWithChildren /* Sec7: Daily button for days selector */
                                                useReanimated={false}
                                                onPress={() => {
                                                    setDays([true, true, true, true, true, true, true])
                                                }}
                                                style={[{
                                                    width: 50,
                                                    height: 50,
                                                    backgroundColor: "white",
                                                    borderRadius: 25,
                                                    marginHorizontal: 10,
                                                    marginVertical: 5,
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    borderWidth: 0.5,
                                                    borderColor: "#F39C12"
                                                }, STYLES.shadow]} >
                                                <Text style={{
                                                    color: "#F39C12",
                                                    fontSize: 10,
                                                    fontWeight: (() => {/* check if its set for daily */
                                                        let daily = true
                                                        days.forEach(element => {
                                                            if (!element)
                                                                daily = false
                                                        })
                                                        return daily
                                                    })() ? "bold" : "400"
                                                }}>DAILY</Text>
                                            </NewRectButtonWithChildren>
                                            <NewRectButtonWithChildren /* Sec7: Weekly button for days selector  */
                                                useReanimated={false}
                                                onPress={() => {
                                                    setDays([true, true, true, true, true, false, false])
                                                }}
                                                style={[{
                                                    width: 50,
                                                    height: 50,
                                                    backgroundColor: "white",
                                                    borderRadius: 25,
                                                    marginHorizontal: 10,
                                                    marginVertical: 5,
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    borderWidth: 0.5,
                                                    borderColor: "#F39C12"
                                                }, STYLES.shadow]} >
                                                <Text style={{
                                                    color: "#F39C12",
                                                    fontSize: 10,
                                                    fontWeight: (
                                                        !(() => {/* check if its set for daily */
                                                            let daily = true
                                                            days.forEach(element => {
                                                                if (!element)
                                                                    daily = false
                                                            })
                                                            return daily
                                                        })()
                                                        &&
                                                        !(() => {
                                                            let once = true
                                                            days.forEach(item => {
                                                                if (item)
                                                                    once = false
                                                            });
                                                            return once
                                                        })()) ? "bold" : "400"
                                                }}>WEEKLY</Text>
                                            </NewRectButtonWithChildren>
                                        </View>
                                        {(
                                            !(() => {/* check if days is set for once only */
                                                let once = true
                                                days.forEach(item => {
                                                    if (item)
                                                        once = false
                                                })
                                                return once
                                            })()
                                            &&
                                            !(() => {/* check if its set for daily */
                                                let daily = true
                                                days.forEach(element => {
                                                    if (!element)
                                                        daily = false
                                                })
                                                return daily
                                            })()) && <View /* Sec6: Days selector */
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    justifyContent: "space-evenly",
                                                    paddingVertical: 5,
                                                    paddingHorizontal: 15
                                                }}>
                                                {days.map((item, index) => {
                                                    return (
                                                        <NewRectButtonWithChildren
                                                            useReanimated={false}
                                                            style={{
                                                                flex: 1
                                                            }}
                                                            onPress={() => {
                                                                log?.print("setting new Days")
                                                                let newDaysArray: any = days.map((_item, _index) => {
                                                                    if (_index == index)
                                                                        return !_item
                                                                    return _item
                                                                })
                                                                setDays(newDaysArray)
                                                            }}
                                                            key={index}>
                                                            <Text style={{
                                                                color: days[index] ? STYLES.textColors.primary : STYLES.textColors.tertiary,
                                                                fontWeight: days[index] ? "bold" : "500"
                                                            }}>{daysSelectorArray[index].day}</Text>
                                                        </NewRectButtonWithChildren>
                                                    )
                                                })}
                                            </View>}
                                    </View>
                                    <Text style={[STYLES.H4, { color: "#F39C12", marginTop: 10 }]}>PICK TIME</Text>
                                    <View /* Sec5: time selector */
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            width: "100%",
                                            justifyContent: "space-evenly"
                                        }}>
                                        <NewSelector
                                            initValue={1}
                                            heading="HRS"
                                            maxVal={hrs.length}
                                            value={hrs[hrIndex] ? hrs[hrIndex]._data : ""}
                                            index={hrIndex}
                                            setIndex={setHrIndex}
                                        />
                                        <NewSelector
                                            initValue={5}
                                            heading="MIN"
                                            maxVal={mins.length}
                                            value={mins[minIndex] ? mins[minIndex]._data : ""}
                                            index={minIndex}
                                            setIndex={setMinIndex}
                                        />
                                        <NewSelector
                                            initValue={5}
                                            heading="DAYTIME"
                                            maxVal={daytimeSelectorData.length}
                                            value={daytimeSelectorData[dtIndex] ? daytimeSelectorData[dtIndex]._data : ""}
                                            index={dtIndex}
                                            setIndex={setDtIndex}
                                        />
                                    </View>
                                </View>)
                                    : (timers && timers.length >= 5) ? (<View /* Sec5: max timer limit */
                                        style={_styles.middleContainerCommonView}>
                                        <Text>max number of timer, either delete any or edit one</Text>
                                    </View>)
                                        : (<View><Text>unknown error occured</Text></View>)
                    }

                    <View /* Sec4: modal button container */
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            marginBottom: 10
                        }}>
                        <View /* Sec5: save/update button */
                            style={{ flex: 1, paddingHorizontal: 5 }}>
                            <NewRectButtonWithChildren /* Sec5: add/update dialog button */
                                onPress={() => {
                                    if (timers && timers != "error") {
                                        let newTimer: UNIVERSALS.GLOBALS.TIMER_t = {
                                            id: timerInEditor?.id ? timerInEditor.id : generate_UUID_10_withVenderPrefix(),
                                            DAYS: days,
                                            H: hrs[hrIndex].val,
                                            M: mins[minIndex].val,
                                            ET: etIndex,
                                            DT: dtIndex,
                                            STATUS: (() => {
                                                let once = true
                                                days.forEach(element => {
                                                    if (element)
                                                        once = false
                                                });
                                                return once
                                            })() ? UNIVERSALS.GLOBALS.TIMER_STATUS_e.ONCE : UNIVERSALS.GLOBALS.TIMER_STATUS_e.REPEAT
                                        }
                                        log?.print("new timer is " + JSON.stringify(newTimer))
                                        log?.print("previous timer string is " + JSON.stringify(timers, null, 2))
                                        let timerFound = false
                                        let newTimersObj = timers.map((timer, index) => {
                                            if (timer?.id && timer.id == timerInEditor?.id) {
                                                timerFound = true
                                                return newTimer
                                            }
                                            return { ...timer, DAYS: days }
                                        })
                                        if (!timerFound && newTimersObj.length < 5)
                                            newTimersObj.push(newTimer)
                                        log?.print("new timer string is " + UNIVERSALS.GLOBALS.converLocalTimerObjectToBackendString({ timers: newTimersObj }))
                                        if (device) {
                                            appOperator.device({
                                                cmd: "ADD_UPDATE_DEVICES",
                                                newDevices: [{ ...device, timers: newTimersObj, localTimeStamp: getCurrentTimeStampInSeconds() }],
                                                log
                                            })
                                            setTimerInEditor(undefined)
                                        }
                                    }
                                    // - [x] print incoming timer
                                    // - [ ] process the timer addition/update here
                                    // - [ ] update local state with local timetamp of device
                                    // - [ ] update the new device tate to cloud
                                    // - [ ] disable update button unless we have timers and not as 'error'
                                }}
                                useReanimated={false}
                                style={{ backgroundColor: "green" }}>
                                <Text>{timerInEditor?.id ? "UPDATE" : "ADD"}</Text>
                            </NewRectButtonWithChildren>
                        </View>
                        <View /* Sec5: close dialog button */
                            style={{ flex: 1, paddingHorizontal: 5 }}>
                            <NewRectButtonWithChildren
                                onPress={() => {
                                    resetDialog()
                                }}
                                useReanimated={false}
                                style={{ backgroundColor: "red" }}>
                                <Text>MAYBE LATER</Text>
                            </NewRectButtonWithChildren>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>

    )
}

const _styles = StyleSheet.create({
    middleContainerCommonView: {
        minHeight: 150,
        width: "100%",
        //backgroundColor: "red",
        alignItems: "center",
        justifyContent: "center"
    }
})
