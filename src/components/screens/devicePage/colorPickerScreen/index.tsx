import { MaterialIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Dimensions, Platform, Text, View } from 'react-native';
import { add, useCode, call } from 'react-native-reanimated';
import { hsv2color, max, min, useValue } from 'react-native-redash';
import { SafeAreaView } from 'react-native-safe-area-context';
import { logger } from '../../../../@logger';
import { STYLES } from '../../../../@styles';
import UNIVERSALS from '../../../../@universals';
import { MainRouterStackParamList } from '../../../../routers/MainRouter';
import { NewRectButtonWithChildren } from '../../../common/buttons/RectButtonCustom';
import NW4_DeviceScreens from './c4_DeviceScreens';
import { DevicePageHeader } from './DevicePageHeader';
import RGB_deviceScreens from './rgbDeviceScreens';
import {
  channelState_e,
  deviceType_e,
  outputChannelTypes_e,
} from '../../../../../sternet/helpers/universals/device/deviceEnum';
import { getTimeDiffNowInMs } from '../../../../util/DateTimeUtil';
import { appOperator } from '../../../../app.operator';
import { State } from 'react-native-gesture-handler';

const { height, width } = Dimensions.get('screen');
interface Props {
  navigation: StackNavigationProp<MainRouterStackParamList, 'devicePage'>;
  device: DEVICE_t;
  navigateToTimer?: () => void;
  log?: logger;
}
export default (props: Props) => {
  const hue = useValue(
    props.device.channel.outputChannnel[0].type == outputChannelTypes_e.colorChannel_hsv
      ? props.device.channel.outputChannnel[0].h / 360
      : 0
  );
  const saturation = useValue(
    props.device.channel.outputChannnel[0].type == outputChannelTypes_e.colorChannel_hsv
      ? props.device.channel.outputChannnel[0].s / 100
      : 0
  );
  const value = useValue(1);
  const backgroundColor = hsv2color(hue, saturation, value);
  const headBackgroundColor = hsv2color(add(hue, 40), max(0.5, min(0.8, saturation)), value);
  let timeStamp = Date.now();

  const updateColor = (h: number, s: number, gestureState: State, log?: logger) => {
    appOperator.device({
      cmd: 'COLOR_UPDATE',
      deviceMac: [props.device.Mac],
      stateObject: {
        state: channelState_e.CH_STATE_RGB,
        hsv: { h: Math.min(Math.round(h * 360), 360), s: Math.min(Math.round(s * 100), 100) },
      },
      gestureState,
      onActionComplete: ({ newDeviceList }) => {
        appOperator.device({
          cmd: 'ADD_UPDATE_DEVICES',
          newDevices: newDeviceList,
          //log: new logger("debug", undefined)
        });
      },
      log,
    });
  };

  useCode(
    () => [
      call([hue, saturation], ([hue, saturation]) => {
        if (getTimeDiffNowInMs(timeStamp) > 200) {
          //console.log('Sending contineous hex. H - ' + hue + ', S - ' + saturation);
          timeStamp = Date.now();
          updateColor(hue, saturation, 4);
        }
      }),
    ],
    [hue, saturation, timeStamp]
  );

  return (
    <SafeAreaView
      style={{
        width: '100%',
        display: 'flex',
        flex: 1,
        backgroundColor: '#fff',
      }}
    >
      {Platform.OS == 'ios' && (
        <View /// goBack sign, slide to go back
          style={{
            position: 'absolute',
            top: height / 2 - 75,
            left: 0,
            height: 150,
            width: 30,
            borderTopRightRadius: 15,
            borderBottomRightRadius: 15,
            backgroundColor: '#00000022',
            zIndex: 1,
            padding: 5,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            //transform: [{ rotate: '90deg' }],
          }}
        >
          <Text
            style={{
              width: 150,
              //backgroundColor: 'red',
              color: '#777',
              textAlign: 'center',
              fontSize: 15,
              fontWeight: 'bold',
              transform: [{ rotateZ: '90deg' }],
            }}
          >
            slide to go back
          </Text>
        </View>
      )}
      <View
        style={{
          minHeight: 200,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          overflow: 'hidden',
          backgroundColor: '#fff',
        }} /* Sec1: devicePage header */
      >
        <DevicePageHeader
          navigation={props.navigation}
          device={props.device}
          //log={props.log}
          headBackgroundColor={headBackgroundColor}
        />
      </View>
      {props.device.channel.deviceType == deviceType_e.deviceType_NW4 && (
        <View style={{ flex: 1 /* backgroundColor: "red" */ }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 15,
            }}
          >
            <View>
              <Text style={[STYLES.H2, { color: STYLES.textColors.secondary, marginTop: 10 }]}>Extended Controls</Text>
              <Text style={[STYLES.H7, { color: STYLES.textColors.tertiary, marginBottom: 10 }]}>
                Control individual device from single page
              </Text>
            </View>
            <NewRectButtonWithChildren /* Sec3: timer button */
              style={{}}
              onPress={() => {
                if (props.navigateToTimer) {
                  console.log('go to timer');
                  props.navigateToTimer();
                } else {
                  console.log('cannot go to timer');
                }
              }}
            >
              <MaterialIcons name="access-alarm" size={35} color="#333" />
            </NewRectButtonWithChildren>
          </View>
          <NW4_DeviceScreens device={props.device} navigateToTimer={props.navigateToTimer} />
        </View>
      )}

      {props.device.channel.deviceType == deviceType_e.deviceType_RGB && (
        <View>
          <RGB_deviceScreens
            navigation={props.navigation}
            device={props.device}
            hue={hue}
            saturation={saturation}
            value={value}
            backgroundColor={backgroundColor}
            navigateToTimer={props.navigateToTimer}
          />
        </View>
      )}
    </SafeAreaView>
  );
};
