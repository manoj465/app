import { AntDesign, MaterialIcons, MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import { Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import { logger } from '../../../@logger';
import { appOperator } from '../../../app.operator';
import reduxStore, { appState } from '../../../redux';
import { getCurrentTimeStampInSeconds } from '../../../util/DateTimeUtil';
import { NewRectButtonWithChildren } from '../../common/buttons/RectButtonCustom';
import { navigationProp } from './index';

interface Props {
  navigation: navigationProp;
  user?: USER_t;
}

export default ({ navigation, user }: Props) => {
  return (
    <View style={{ paddingHorizontal: 10 }}>
      <View style={{ backgroundColor: '#fff', marginTop: 0 }}>
        <View /// headerTop buttons
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#fff',
            paddingRight: 10,
          }}
        >
          <NewRectButtonWithChildren /** appConfigScreen button */
            onPress={() => {
              navigation.navigate('config');
            }}
          >
            <AntDesign style={{ paddingRight: 10 }} name="menu-fold" size={26} color="black" />
          </NewRectButtonWithChildren>
          <View style={{ flexDirection: 'row' }} /**topRight buttons */>
            <NewRectButtonWithChildren
              onPress={() => {
                /* appOperator.device({
                  cmd: 'ADD_UPDATE_DEVICES',
                  newDevices: [
                    {
                      Mac: 'BC:DD:C2:9D:5D:33',
                      Hostname: 'HUE_CL_F:1_BC:33',
                      ssid: '',
                      IP: '192.168.1.124',
                      deviceName: 'HUE_CL_F:1_BC:33',
                      localTimeStamp: 1622593481,
                      timers: [],
                      channel: {
                        state: 6,
                        deviceType: 1,
                        outputChannnel: [
                          {
                            type: 0,
                            h: 180,
                            s: 100,
                            v: 100,
                          },
                        ],
                      },
                    },
                  ],
                }); */
                navigation.navigate('pairing');
              }}
            >
              <MaterialIcons style={{}} name="add-circle-outline" size={26} color="black" />
            </NewRectButtonWithChildren>
            {/* <NewRectButtonWithChildren onPress={() => {
                            navigation.navigate("user")
                        }}>
                            <FontAwesome style={{ marginHorizontal: 10 }} name="user-o" size={24} color="black" />
                        </NewRectButtonWithChildren> */}
          </View>
        </View>
        <View /// user Welcome Text
          style={{}}
        >
          <Text style={{ fontSize: 25, fontWeight: 'bold' }}>{'Hi, ' + (user?.userName ? user?.userName : '')}</Text>
        </View>
      </View>
    </View>
  );
};

const QuickActionsContainer = () => {
  const [snoozeBusy, setSnoozeBusy] = useState(false);
  const quickActions = useSelector((state: appState) => state.appCTXReducer.quickActions);
  const deviceList = useSelector((state: appState) => state.deviceReducer.deviceList);
  let isAllOff = true;

  let isPowerSavingOn = (() => {
    let powerSavingOn = true;
    deviceList.forEach((__item) => {
      __item.channel.outputChannnel.forEach((__channel) => {
        if (__channel.v) {
          isAllOff = false;
          if (__channel.v > 20) powerSavingOn = false;
        }
      });
    });
    return powerSavingOn;
  })();

  const updateColor = ({ v }: { v: number }) => {
    /* appOperator.device({
            cmd: "COLOR_UPDATE",
            deviceMac: [...reduxStore.store.getState().deviceReducer.deviceList.map((__item) => {
                return __item.Mac
            })],
            gestureState: State.END,
        }) */
  };

  return (
    <Animated.ScrollView
      showsHorizontalScrollIndicator={false}
      horizontal
      style={{
        backgroundColor: '#fff',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        marginTop: 5,
      }}
    >
      <QuickActionBlock /** snooze all events */
        Heading="Snooze all events"
        subHeading="ALL OFF"
        primaryColor="#58D68D"
        onPress={() => {
          if (!snoozeBusy) {
            setSnoozeBusy(true);
            console.log(
              'deviceList before Timers update' +
                JSON.stringify(reduxStore.store.getState().deviceReducer.deviceList, null, 2)
            );
            const newDeviceList = reduxStore.store.getState().deviceReducer.deviceList.map((device, deviceIndex) => {
              return {
                ...device,
                timers: device.timers.map((timer, timerIndex) => {
                  return { ...timer, STATUS: TIMER_STATUS_e.INACTIVE };
                }),
                localTimeStamp: getCurrentTimeStampInSeconds(),
              };
            });
            appOperator.device({
              cmd: 'ADD_UPDATE_DEVICES',
              newDevices: newDeviceList,
            });
            console.log('deviceList after Timers update' + JSON.stringify(newDeviceList, null, 2));
            setTimeout(() => {
              setSnoozeBusy(false);
            }, 2000);
          }
        }}
        Child={() => {
          return <MaterialIcons name="snooze" size={30} color={snoozeBusy ? '#555555' : '#5DADE2'} />;
        }}
      />
      <QuickActionBlock
        Heading="Power saving mode"
        subHeading={isPowerSavingOn ? 'TURN OFF' : 'TURN ON'}
        primaryColor="#48C9B0"
        onPress={() => {
          updateColor({ v: isPowerSavingOn ? 80 : 20 });
        }}
        Child={() => {
          return <SimpleLineIcons name="energy" size={30} color={isPowerSavingOn ? '#48C9B0' : 'red'} />;
        }}
      />
      <QuickActionBlock
        Heading="Shut Down Home"
        subHeading={isAllOff ? 'WELCOME BACK' : 'SAY, GOODBYE'}
        primaryColor="#EC7063"
        onPress={() => {
          updateColor({ v: isAllOff ? 80 : 0 });
        }}
        Child={() => {
          return <MaterialCommunityIcons name={isAllOff ? 'power-plug-off' : 'power-plug'} size={30} color="#EC7063" />;
        }}
      />
      <QuickActionBlock
        Heading="Tablet Mode"
        subHeading="STAY AWAKE"
        primaryColor="#f39c12"
        Child={() => {
          return (
            <MaterialCommunityIcons
              name="tablet-dashboard"
              size={30}
              color={quickActions.stayAwake ? '#f39c12' : '#f00'}
            />
          );
        }}
        onPress={() => {
          if (quickActions.stayAwake) {
            deactivateKeepAwake();
            console.log('De-activating stay awake');
          } else {
            activateKeepAwake();
            console.log('activating stay awake');
          }
          reduxStore.store.dispatch(
            reduxStore.actions.appCTX.quickActionsRedux({
              data: { stayAwake: quickActions.stayAwake ? false : true },
              log: new logger('set/unset stayAwake'),
            })
          );
        }}
      />
      <View style={{ width: 10 }} />
    </Animated.ScrollView>
  );
};

interface QAB_props {
  Heading: string;
  subHeading?: string;
  primaryColor?: string;
  Child: any;
  onPress?: () => void;
}
const QuickActionBlock = ({ Heading, subHeading, primaryColor = '#48C9B0', Child, onPress = () => {} }: QAB_props) => {
  return (
    <NewRectButtonWithChildren
      onPress={onPress}
      style={{
        width: 200,
        height: 150,
        borderRadius: 10,
        overflow: 'hidden',
        borderColor: primaryColor,
        borderWidth: 0.2,
        //backgroundColor: "green",
        marginRight: 10,
      }}
    >
      <View style={{ backgroundColor: primaryColor, padding: 10, flex: 1, height: 120, width: '100%' }}>
        <View
          style={{
            backgroundColor: '#fff',
            height: 50,
            width: 50,
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Child />
        </View>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff', marginTop: 10 }}>{Heading}</Text>
        <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#fff', marginTop: 10, marginBottom: 10 }}>
          {subHeading}
        </Text>
      </View>
    </NewRectButtonWithChildren>
  );
};
