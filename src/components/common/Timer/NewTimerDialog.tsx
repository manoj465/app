import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { STYLES } from '../../../@styles';
import UNIVERSALS from '../../../@universals';
import API from '../../../@api';
import { appOperator } from '../../../app.operator';
import { getCurrentTimeStampInSeconds } from '../../../util/DateTimeUtil';
import { logger } from '../../../@logger';
import { generate_UUID_10_withVenderPrefix } from '../../../util/UUID_utils';
import Modal from '../../common/modal';
import { NewRectButtonWithChildren } from '../buttons/RectButtonCustom';
import { NewSelector } from '../NewSelector';

const daysSelectorArray = [
  { day: 'M' },
  { day: 'T' },
  { day: 'W' },
  { day: 'T' },
  { day: 'F' },
  { day: 'S' },
  { day: 'S' },
];
const hrs = [
  { _data: '01', val: 1 },
  { _data: '02', val: 2 },
  { _data: '03', val: 3 },
  { _data: '04', val: 4 },
  { _data: '05', val: 5 },
  { _data: '06', val: 6 },
  { _data: '07', val: 7 },
  { _data: '08', val: 8 },
  { _data: '09', val: 9 },
  { _data: '10', val: 10 },
  { _data: '11', val: 11 },
  { _data: '12', val: 12 },
];
const mins = [
  /*    { _data: "00", val: 0 },
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
   
       { _data: "55", val: 55 }, */
  { _data: '00', val: 0 },

  { _data: '01', val: 1 },
  { _data: '02', val: 2 },
  { _data: '03', val: 3 },
  { _data: '04', val: 4 },
  { _data: '05', val: 5 },
  { _data: '06', val: 6 },
  { _data: '07', val: 7 },
  { _data: '08', val: 8 },
  { _data: '09', val: 9 },
  { _data: '10', val: 10 },

  { _data: '11', val: 11 },
  { _data: '12', val: 12 },
  { _data: '13', val: 13 },
  { _data: '14', val: 14 },
  { _data: '15', val: 15 },
  { _data: '16', val: 16 },
  { _data: '17', val: 17 },
  { _data: '18', val: 18 },
  { _data: '19', val: 19 },
  { _data: '20', val: 20 },

  { _data: '21', val: 21 },
  { _data: '22', val: 22 },
  { _data: '23', val: 23 },
  { _data: '24', val: 24 },
  { _data: '25', val: 25 },
  { _data: '26', val: 26 },
  { _data: '27', val: 27 },
  { _data: '28', val: 28 },
  { _data: '29', val: 29 },
  { _data: '30', val: 30 },

  { _data: '31', val: 31 },
  { _data: '32', val: 32 },
  { _data: '33', val: 33 },
  { _data: '34', val: 34 },
  { _data: '35', val: 35 },
  { _data: '36', val: 36 },
  { _data: '37', val: 37 },
  { _data: '38', val: 38 },
  { _data: '39', val: 39 },
  { _data: '40', val: 40 },

  { _data: '41', val: 41 },
  { _data: '42', val: 42 },
  { _data: '43', val: 43 },
  { _data: '44', val: 44 },
  { _data: '45', val: 45 },
  { _data: '46', val: 46 },
  { _data: '47', val: 47 },
  { _data: '48', val: 48 },
  { _data: '49', val: 49 },
  { _data: '50', val: 50 },

  { _data: '51', val: 51 },
  { _data: '52', val: 52 },
  { _data: '53', val: 53 },
  { _data: '54', val: 54 },
  { _data: '55', val: 55 },
  { _data: '56', val: 56 },
  { _data: '57', val: 57 },
  { _data: '58', val: 58 },
  { _data: '59', val: 59 },
];
const daytimeSelectorData = [
  { _data: 'AM', val: 0 },
  { _data: 'PM', val: 1 },
];

interface Props {
  device?: DEVICE_t;
  timerInEditor: (Omit<TIMER_t, 'id'> & { id?: string }) | undefined;
  setTimerInEditor: React.Dispatch<React.SetStateAction<(Omit<TIMER_t, 'id'> & { id?: string }) | undefined>>;
  log?: logger;
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
  const [dtIndex, setDtIndex] = useState<number>(0);
  const [eventType, setEventType] = useState<TIMER_EVENT_TYPE_e>(timerInEditor?.ET ? timerInEditor.ET : 0);
  const [timers, setTimers] = useState<Array<TIMER_t> | undefined | 'error'>(undefined);
  const [days, setDays] = useState<TIMER_DAYS_t>([false, false, false, false, false, false, false]);

  useEffect(() => {
    if (timerInEditor) {
      setDays(timerInEditor.DAYS);
      setDtIndex(timerInEditor?.DT == TIMER_DAYTIME_e.AM ? 0 : 1);
      hrs.forEach((item, index) => {
        if (item.val == timerInEditor.H) setHrIndex(index);
      });
      mins.forEach((item, index) => {
        if (item.val == timerInEditor.M) setMinIndex(index);
      });
    }
    return () => {};
  }, [timerInEditor]);

  const resetDialog = () => {
    setTimerInEditor(undefined);
    setTimers(undefined);
    setDays([true, true, true, true, true, true, true]);
  };

  const isOnce = () => {
    let once = days.find((item) => item);
    if (once) return false;
    return true;
  };

  const isDaily = () => {
    let daily = true;
    days.forEach((element) => {
      if (!element) daily = false;
    });
    return daily;
  };

  return (
    <Modal /* Sec2: timer editor dialog */
      outerContainerStyle={{
        backgroundColor: '#00000000',
        justifyContent: 'flex-end',
        //alignItems: "flex-end"
      }}
      visible={timerInEditor != undefined}
      onShow={async () => {
        log?.print('onShow');
        if (device?.id) {
          const res = await API.cloudAPI.device.deviceTimersQuery.v1({
            id: device.id,
            //log: log ? new logger("device timers query", log) : undefined
          });
          /**
           * - [x] validate new timers data before updating state
           */
          if (res.RES) {
            try {
              log?.print('timers->>>>>>>' + JSON.stringify(res));
              if (res.RES.ts && device.ts && res.RES.ts >= device.ts) {
                // => if we have both local and cloud timestamp then compare and  update the latest timerStates in timers object
                log?.print('timers----------' + JSON.stringify(res));
                let timersObj = UNIVERSALS.GLOBALS.convertTimersStringToObj({
                  timersString: res.RES.timers,
                  log: log ? new logger('convert_timerString_toObject', log) : undefined,
                });
                log?.print('timersObj -- ' + JSON.stringify(timersObj));
                if (timersObj) {
                  log?.print('setting timer 1');
                  setTimers(timersObj);
                } else {
                  log?.print('setting error 1');
                  setTimers('error');
                }
              } else {
                log?.print('setting timers 2S');
                setTimers(device.timers);
              }
              log?.print('--------------------');
            } catch (error) {
              log?.print('timers->>>>>>><<<<<<<' + JSON.stringify(error));
              setTimers('error');
            }
          } else if (res.ERR) {
            /* if no timersObj is received then set timers state to error so as to set middle section to show error to user */
            // - [ ] handle deviceTimerQuery errors
            setTimers('error');
          } else {
            setTimers('error');
            // - [ ] handle unhandled respose
          }
        }
      }}
    >
      <View /* Sec3: Dialog container */
        style={[
          {
            width: '100%',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: 'white',
            overflow: 'hidden',
          },
          STYLES.shadow,
        ]}
      >
        <View
          style={{
            width: '100%',
            backgroundColor: '#dddddd',
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}
        >
          <Text style={[STYLES.H6, { textAlign: 'center' }]}>Set Time and Event type</Text>
        </View>

        <View
          style={{
            paddingHorizontal: 10,
            marginTop: 10,
          }}
        >
          {
            /* Sec4: middle container */
            timers == 'error' ? (
              <View style={_styles.middleContainerCommonView}>
                <Text>error loading</Text>
              </View>
            ) : timers == undefined ? (
              <View style={_styles.middleContainerCommonView}>
                <Text>LOADING... please wait</Text>
              </View>
            ) : (timers && timers?.length < 5) || (timers && timerInEditor?.id) ? (
              <View /* Sec5: middle container */>
                <View /* Sec6: Event type selector */
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Text style={[STYLES.H3, { color: STYLES.textColors.secondary }]}>
                    {'Lights ' + (eventType == TIMER_EVENT_TYPE_e.ON ? 'On' : 'Off')}
                  </Text>
                  <NewRectButtonWithChildren
                    onPress={() => {
                      if (eventType == TIMER_EVENT_TYPE_e.ON) setEventType(TIMER_EVENT_TYPE_e.OFF);
                      else setEventType(TIMER_EVENT_TYPE_e.ON);
                    }}
                    innerCompStyle={{
                      alignItems: eventType == TIMER_EVENT_TYPE_e.ON ? 'flex-end' : 'flex-start',
                      display: 'flex',
                    }}
                    style={[
                      STYLES.shadow,
                      {
                        height: 30,
                        width: 60,
                        backgroundColor: '#eee',
                        borderRadius: 50,
                        overflow: 'hidden',
                        margin: 2,
                      },
                    ]} /**toggle container */
                  >
                    <View /* toggle inner DOT*/
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 50,
                        backgroundColor:
                          eventType == TIMER_EVENT_TYPE_e.ON ? STYLES.textColors.success : STYLES.textColors.warning,
                      }}
                    />
                  </NewRectButtonWithChildren>
                </View>

                <View /* Sec6: Event repeatition selector */>
                  <Text style={[STYLES.H7, { color: STYLES.textColors.secondary, marginVertical: 10 }]}>
                    REPEAT EVENT
                  </Text>
                  <View /* Sec6: Days selectors buttons */
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                    }}
                  >
                    <NewRectButtonWithChildren /* Sec7: oncebutton for days selector */
                      onPress={() => {
                        setDays([false, false, false, false, false, false, false]);
                      }}
                      useReanimated={false}
                      style={[
                        {
                          width: 50,
                          height: 50,
                          backgroundColor: 'white',
                          borderRadius: 25,
                          marginHorizontal: 10,
                          marginVertical: 5,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderWidth: 0.5,
                          borderColor: isOnce() ? '#F39C12' : 'grey',
                        },
                        STYLES.shadow,
                      ]}
                    >
                      <Text
                        style={{
                          color: isOnce() ? '#F39C12' : 'grey',
                          fontSize: 10,
                          fontWeight: 'bold',
                        }}
                      >
                        ONCE
                      </Text>
                    </NewRectButtonWithChildren>

                    <NewRectButtonWithChildren /* Sec7: Daily button for days selector */
                      useReanimated={false}
                      onPress={() => {
                        setDays([true, true, true, true, true, true, true]);
                      }}
                      style={[
                        {
                          width: 50,
                          height: 50,
                          backgroundColor: 'white',
                          borderRadius: 25,
                          marginHorizontal: 10,
                          marginVertical: 5,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderWidth: 0.5,
                          borderColor: isDaily() ? '#F39C12' : 'grey',
                        },
                        STYLES.shadow,
                      ]}
                    >
                      <Text
                        style={{
                          color: isDaily() ? '#F39C12' : 'grey',
                          fontSize: 10,
                          fontWeight: 'bold',
                        }}
                      >
                        DAILY
                      </Text>
                    </NewRectButtonWithChildren>

                    <NewRectButtonWithChildren /* Sec7: Weekly button for days selector  */
                      useReanimated={false}
                      onPress={() => {
                        setDays([true, true, true, true, true, false, false]);
                      }}
                      style={[
                        {
                          width: 50,
                          height: 50,
                          backgroundColor: 'white',
                          borderRadius: 25,
                          marginHorizontal: 10,
                          marginVertical: 5,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderWidth: 0.5,
                          borderColor: !isDaily() && !isOnce() ? '#F39C12' : 'grey',
                        },
                        STYLES.shadow,
                      ]}
                    >
                      <Text
                        style={{
                          color: !isDaily() && !isOnce() ? '#F39C12' : 'grey',
                          fontSize: 10,
                          fontWeight: 'bold',
                        }}
                      >
                        WEEKLY
                      </Text>
                    </NewRectButtonWithChildren>
                  </View>
                  {!(() => {
                    /* check if days is set for once only */
                    let once = true;
                    days.forEach((item) => {
                      if (item) once = false;
                    });
                    return once;
                  })() &&
                    !(() => {
                      /* check if its set for daily */
                      let daily = true;
                      days.forEach((element) => {
                        if (!element) daily = false;
                      });
                      return daily;
                    })() && (
                      <View /* Sec6: Days selector */
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-evenly',
                          paddingVertical: 5,
                          paddingHorizontal: 15,
                        }}
                      >
                        {days.map((item, index) => {
                          return (
                            <NewRectButtonWithChildren
                              useReanimated={false}
                              style={{
                                flex: 1,
                              }}
                              onPress={() => {
                                log?.print('setting new Days');
                                let newDaysArray: any = days.map((_item, _index) => {
                                  if (_index == index) return !_item;
                                  return _item;
                                });
                                setDays(newDaysArray);
                              }}
                              key={index}
                            >
                              <Text
                                style={{
                                  color: days[index] ? STYLES.textColors.primary : STYLES.textColors.tertiary,
                                  fontWeight: days[index] ? 'bold' : '500',
                                }}
                              >
                                {daysSelectorArray[index].day}
                              </Text>
                            </NewRectButtonWithChildren>
                          );
                        })}
                      </View>
                    )}
                </View>

                <Text style={[STYLES.H6, { color: STYLES.textColors.secondary, marginVertical: 10 }]}>PICK TIME</Text>
                <View /* Sec6: time selector */
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-evenly',
                  }}
                >
                  <NewSelector
                    initValue={1}
                    heading="HRS"
                    maxVal={hrs.length}
                    value={hrs[hrIndex] ? hrs[hrIndex]._data : ''}
                    index={hrIndex}
                    setIndex={setHrIndex}
                  />
                  <NewSelector
                    initValue={5}
                    heading="MIN"
                    maxVal={mins.length}
                    value={mins[minIndex] ? mins[minIndex]._data : ''}
                    index={minIndex}
                    setIndex={setMinIndex}
                  />
                  <NewSelector
                    initValue={0}
                    heading="DAYTIME"
                    maxVal={daytimeSelectorData.length}
                    value={daytimeSelectorData[dtIndex] ? daytimeSelectorData[dtIndex]._data : ''}
                    index={dtIndex}
                    setIndex={setDtIndex}
                  />
                </View>
              </View>
            ) : timers && timers.length >= 5 ? (
              <View /* Sec5: max timer limit */ style={_styles.middleContainerCommonView}>
                <Text>max number of timer, either delete any or edit one</Text>
              </View>
            ) : (
              <View>
                <Text>unknown error occured</Text>
              </View>
            )
          }
        </View>
        <View /* Sec4: bottom Add/update/cancel button container */
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginBottom: 10,
          }}
        >
          <View /* Sec5: save/update button */ style={{ flex: 1, paddingHorizontal: 5 }}>
            <NewRectButtonWithChildren /* Sec5: add/update dialog button */
              onPress={() => {
                if (timers && timers != 'error' && device) {
                  let newTimer: TIMER_t = {
                    id: timerInEditor?.id ? timerInEditor.id : generate_UUID_10_withVenderPrefix(),
                    DAYS: days,
                    H: hrs[hrIndex].val,
                    M: mins[minIndex].val,
                    ET: eventType,
                    DT: daytimeSelectorData[dtIndex].val,
                    STATUS: (() => {
                      let once = true;
                      days.forEach((element) => {
                        if (element) once = false;
                      });
                      return once;
                    })()
                      ? TIMER_STATUS_e.ONCE
                      : TIMER_STATUS_e.REPEAT,
                  };
                  log?.print('new timer is ' + JSON.stringify(newTimer));
                  let timerFound = false;
                  let newTimersObj = timers.map((timer, index) => {
                    if (timer?.id && timer.id == timerInEditor?.id) {
                      timerFound = true;
                      return newTimer;
                    }
                    return timer;
                  });
                  if (!timerFound && newTimersObj.length < 5) newTimersObj.push(newTimer);
                  log?.print(
                    'new timer string is ' +
                      UNIVERSALS.GLOBALS.converLocalTimerObjectToBackendString({ timers: newTimersObj })
                  );
                  log?.print('sending timer to device');
                  appOperator.device({
                    cmd: 'ADD_UPDATE_DEVICES',
                    newDevices: [{ ...device, timers: newTimersObj, localTimeStamp: getCurrentTimeStampInSeconds() }],
                    log,
                  });
                  setTimerInEditor(undefined);
                }
                // - [x] print incoming timer
                // - [ ] process the timer addition/update here
                // - [ ] disable update button unless we have timers and not as 'error'
              }}
              useReanimated={false}
              style={{ backgroundColor: STYLES.textColors.success }}
            >
              <Text style={[STYLES.H7, { color: 'white' }]}>{timerInEditor?.id ? 'UPDATE' : 'ADD'}</Text>
            </NewRectButtonWithChildren>
          </View>

          <View /* Sec5: close dialog button */ style={{ flex: 1, paddingHorizontal: 5 }}>
            <NewRectButtonWithChildren
              onPress={() => {
                resetDialog();
              }}
              useReanimated={false}
              style={{ backgroundColor: STYLES.textColors.warning }}
            >
              <Text style={[STYLES.H7, { color: 'white' }]}>CANCEL</Text>
            </NewRectButtonWithChildren>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const _styles = StyleSheet.create({
  middleContainerCommonView: {
    minHeight: 150,
    width: '100%',
    //backgroundColor: "red",
    alignItems: 'center',
    justifyContent: 'center',
  },
});
