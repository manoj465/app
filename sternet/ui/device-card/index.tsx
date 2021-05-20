import { useActionSheet } from '@expo/react-native-action-sheet';
import { Entypo, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { State } from 'react-native-gesture-handler';
import Animated, { interpolate } from 'react-native-reanimated';
import { useTransition } from 'react-native-redash';
import { logger } from '../../../src/@logger';
import UNIVERSALS from '../../../src/@universals';
import { appOperator } from '../../../src/app.operator';
import BrightnessSliderNew from '../../../src/components/common/BrightnessSlider_deprivated';
import { NewRectButtonWithChildren } from '../../../src/components/common/buttons/RectButtonCustom';
import { navigationProp } from '../../../src/components/screens/dashboard';
import { hsv2hex } from '../../../src/util/Color';

export const deviceCardHeight = 160;

interface props {
  /** @description navigation object from previous/parent screen */
  navigation: navigationProp;
  device: UNIVERSALS.GLOBALS.DEVICE_t;
  log?: logger;
  /** @description function/method to activate deviceDeletePopUp on Dashboard screen */
  setToBeDeletedDevice?: React.Dispatch<React.SetStateAction<string>>;
}
export default ({ navigation, device, log, setToBeDeletedDevice }: props) => {
  log = log ? new logger('DEVICE CARD', log) : undefined;
  const { showActionSheetWithOptions } = useActionSheet();

  const [snoozeBusy, setSnoozeBusy] = useState(false);

  const [menuOpen, setMenuOpen] = useState<0 | 1>(0);
  const transition = useTransition(menuOpen);
  let deviceCardContainerBorderRadius = 20;

  return (
    <Animated.View
      style={{
        height: interpolate(transition, {
          inputRange: [0, 1],
          outputRange: [deviceCardHeight, deviceCardHeight + 50],
        }),
      }}
    >
      <TouchableOpacity
        style={{
          borderColor: 'white',
          backgroundColor: '#aaa',
          width: '100%',
          height: 160,
          overflow: 'hidden',
          borderRadius: deviceCardContainerBorderRadius,
          display: 'flex',
          flexDirection: 'column',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.2,
          shadowRadius: 1.41,
          elevation: 2,
        }}
        activeOpacity={0.9}
        onPress={() => {
          if (
            device.channel.deviceType == UNIVERSALS.GLOBALS.deviceType_e.deviceType_NW4 ||
            device.channel.deviceType == UNIVERSALS.GLOBALS.deviceType_e.deviceType_RGB ||
            device.channel.deviceType == UNIVERSALS.GLOBALS.deviceType_e.deviceType_RGBW
          ) {
            navigation.navigate('devicePage', { device });
          } else {
            console.log('cannot open device page for device type ' + device.channel.deviceType);
          }
        }}
      >
        <LinearGradient
          style={{
            width: '100%',
            height: '100%',
          }}
          /**
           * #todo
           * - [ ] gradient for natural/warm/cool white
           */
          colors={(() => {
            /** inCase deviceType is deviceType_wDownlight_C4 */
            if (
              (device.channel.deviceType == UNIVERSALS.GLOBALS.deviceType_e.deviceType_NW4 || device.channel.deviceType == UNIVERSALS.GLOBALS.deviceType_e.deviceType_NW) &&
              device.channel.outputChannnel[0].temprature < 4000
            ) {
              return ['#ff0000', '#ff00ff'];
            } else if (device.channel.deviceType == UNIVERSALS.GLOBALS.deviceType_e.deviceType_RGB) {
              return [
                hsv2hex({
                  hsv: [device.channel.outputChannnel[0].h, device.channel.outputChannnel[0].s > 60 ? device.channel.outputChannnel[0].s : 60, 100],
                }),
                hsv2hex({
                  hsv: [device.channel.outputChannnel[0].h + 60, device.channel.outputChannnel[0].s > 60 ? device.channel.outputChannnel[0].s : 60, 100],
                }),
              ];
            } else {
              /** ///default case */
              return ['#ff0000', '#0000ff'];
            }
          })()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Image /**background image [absolute]*/
            style={{
              opacity: 0.35,
              position: 'absolute',
              top: 0,
              left: 0,
              flex: 1,
              width: '100%',
              height: '100%',
            }}
            //@-#bug_minor > get this image source via dynamic function, as the bit components are compiled in node_modules directory, and relative path won't work
            source={require('../../../assets/images/dashboard/dashboardCardBg/vector_1.jpg')}
          />

          <View /* /// deviceCard Top section <deviceIcon | deviceName | menuIcon > */
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity /* /// menuDots */
              style={{
                zIndex: 10,
                position: 'absolute',
                top: 0,
                right: 0,
                paddingRight: 12,
                paddingTop: 8,
                paddingBottom: 5,
                paddingLeft: 10,
                transform: [
                  {
                    rotate: menuOpen ? '90deg' : '0deg',
                  },
                ],
              }}
              onPress={() => {
                if (menuOpen) setMenuOpen(0);
                else setMenuOpen(1);
                /*   console.log("show action sheet")
                                  const options = ["Device Settings", "Share device", "Delete device", "cancel"]
                                  const destructiveButtonIndex = 3
                                  const cancelButtonIndex = 3
                                  showActionSheetWithOptions(
                                      {
                                          options,
                                          cancelButtonIndex,
                                          destructiveButtonIndex,
                                          showSeparators: true
                                      },
                                      async (index) => {
                                          switch (index) {
  
                                              case 0:
                                                  navigation.navigate("setupDevice", {
                                                      device
                                                  })
                                                  break;
  
                                              case 2:
                                                  if (setToBeDeletedDevice) {
                                                      setToBeDeletedDevice(device.Mac)
                                                  }
                                                  break;
  
                                              default:
                                                  break;
                                          }
                                      }) */
              }}
            >
              <Entypo name="dots-three-vertical" size={20} color="white" />
            </TouchableOpacity>

            <NewRectButtonWithChildren /** device icon - turn on/off button */
              style={{
                backgroundColor: device.channel.state == UNIVERSALS.GLOBALS.channelState_e.CH_STATE_OFF ? '#777' : '#fff',
                height: 60,
                width: 60,
                overflow: 'hidden',
                borderRadius: 30,
                borderColor: device.channel.state == UNIVERSALS.GLOBALS.channelState_e.CH_STATE_OFF ? '#555' : '#bbb',
                borderWidth: 2,
                justifyContent: 'center',
                alignItems: 'center',
                margin: 10,
              }}
              onPress={() => {
                appOperator.device({
                  cmd: 'COLOR_UPDATE',
                  deviceMac: [device.Mac],
                  stateObject: {
                    state:
                      device.channel.state == UNIVERSALS.GLOBALS.channelState_e.CH_STATE_OFF
                        ? device.channel.preState
                          ? device.channel.preState
                          : UNIVERSALS.GLOBALS.channelState_e.CH_STATE_1
                        : UNIVERSALS.GLOBALS.channelState_e.CH_STATE_OFF,
                  },
                  gestureState: State.END,
                  log,
                  onActionComplete: ({ newDeviceList }) => {
                    appOperator.device({
                      cmd: 'ADD_UPDATE_DEVICES',
                      newDevices: newDeviceList,
                      log,
                    });
                  },
                });
              }}
            >
              <Image /**background image [absolute]*/
                style={{
                  width: 40,
                  height: 40,
                }}
                source={getDeviceIcon(device.icon)}
              />
            </NewRectButtonWithChildren>

            <Text /**device name */
              style={{
                color: '#fff',
                fontSize: 18,
                fontWeight: 'bold',
                marginLeft: 15,
              }}
            >
              {device.deviceName ? device.deviceName : 'unknown_device'}
            </Text>
          </View>

          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              paddingHorizontal: '5%',
              marginBottom: 10,
              zIndex: 2,
              //backgroundColor: "green",
            }} /* ///brightness container  */
          >
            <BrightnessSliderNew
              initBrValue={device.channel.outputChannnel[0].v}
              deviceMac={[device.Mac]}
              onBrightnessChange={({ value, pinState }) => {
                if (
                  device.channel.deviceType == UNIVERSALS.GLOBALS.deviceType_e.deviceType_NW4 ||
                  device.channel.deviceType == UNIVERSALS.GLOBALS.deviceType_e.deviceType_NW ||
                  device.channel.deviceType == UNIVERSALS.GLOBALS.deviceType_e.deviceType_RGB
                )
                  appOperator.device({
                    cmd: 'COLOR_UPDATE',
                    deviceMac: [device.Mac],
                    /**
                     * - [ ] send the active channel based on deviceType with different lengthTypes
                     */
                    channelBrightnessObject: { value, activeChannel: [true, true, true, true, true] },
                    gestureState: pinState,
                    log,
                    onActionComplete: ({ newDeviceList }) => {
                      appOperator.device({
                        cmd: 'ADD_UPDATE_DEVICES',
                        newDevices: newDeviceList,
                        log,
                      });
                    },
                  });
              }}
              log={log}
            />
          </View>
        </LinearGradient>
      </TouchableOpacity>

      <View // device menuContainer
        style={{
          position: 'absolute',
          bottom: 0,
          backgroundColor: '#ddd',
          height: 100,
          borderBottomRightRadius: deviceCardContainerBorderRadius,
          borderBottomLeftRadius: deviceCardContainerBorderRadius,
          width: '100%',
          zIndex: -1,
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <View
          style={{
            width: '100%',
            height: 50,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            //backgroundColor: "red",
            paddingHorizontal: 20,
          }}
        >
          <NewRectButtonWithChildren
            onPress={() => {
              if (!snoozeBusy) {
                setSnoozeBusy(true);
                appOperator.device({
                  cmd: 'UPDATE_DEVICE',
                  newDevice: {
                    ...device,
                    timers: device.timers.map((timer, timerIndex) => {
                      return {
                        ...timer,
                        STATUS: UNIVERSALS.GLOBALS.TIMER_STATUS_e.INACTIVE,
                        log,
                      };
                    }),
                  },
                });
                setTimeout(() => {
                  setSnoozeBusy(false);
                }, 1500);
              }
            }}
          >
            {snoozeBusy ? <ActivityIndicator color={'#aaa'} size={22} /> : <MaterialCommunityIcons name="alarm-snooze" size={24} color="#888" />}
          </NewRectButtonWithChildren>
          <View>
            <Ionicons name="share-outline" size={24} color="#bbb" />
          </View>
          <NewRectButtonWithChildren
            onPress={() => {
              if (setToBeDeletedDevice) {
                setToBeDeletedDevice(device.Mac);
              }
            }}
          >
            <MaterialIcons name="delete" size={24} color="#ec7063" />
          </NewRectButtonWithChildren>
          <NewRectButtonWithChildren
            onPress={() => {
              navigation.navigate('setupDevice', {
                device,
              });
            }}
          >
            <Ionicons name="settings" size={24} color="#888" />
          </NewRectButtonWithChildren>
        </View>
      </View>
    </Animated.View>
  );
};

const getDeviceIcon = (iconIndex?: number) => {
  switch (iconIndex) {
    case 0:
      return require('../../../assets/icons/deviceIcons/ceiling-lamp.png');
      break;

    case 1:
      return require('../../../assets/icons/deviceIcons/desk-lamp.png');
      break;

    case 2:
      return require('../../../assets/icons/deviceIcons/led-strip.png');
      break;

    case 3:
      return require('../../../assets/icons/deviceIcons/double-bed.png');
      break;
    case 4:
      return require('../../../assets/icons/deviceIcons/lamp.png');
      break;

    case 5:
      require('../../../assets/icons/deviceIcons/kitchen-outline.png');
      break;

    case 6:
      return require('../../../assets/icons/deviceIcons/kitchen.png');
      break;

    case 7:
      return require('../../../assets/icons/deviceIcons/bar.png');
      break;

    case 8:
      return require('../../../assets/icons/deviceIcons/lightbulb.png');
      break;

    case 9:
      return require('../../../assets/icons/deviceIcons/table-lamp.png');
      break;

    case 10:
      return require('../../../assets/icons/deviceIcons/monitor.png');
      break;

    case 11:
      return require('../../../assets/icons/deviceIcons/television.png');
      break;

    default:
      return require('../../../assets/icons/deviceIcons/led-strip.png');
      break;
  }
};
const styles = StyleSheet.create({
  brightnessSliderContainer: {},
  deviceName: {},
});
