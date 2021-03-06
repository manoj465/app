//@ts-ignore
import * as IntentLauncher from 'expo-intent-launcher';
import LottieView from 'lottie-react-native';
import React, { createRef, useEffect, useRef } from 'react';
import { Dimensions, Linking, Platform, Text, View } from 'react-native';
import Animated, { Transition, Transitioning } from 'react-native-reanimated';
import api from '../../../../@api';
import { logger } from '../../../../@logger';
import { STYLES } from '../../../../@styles';
import Alert from '../../../common/Alert';
import { NewRectButtonWithChildren } from '../../../common/buttons/RectButtonCustom';
import { PairingFrame } from '.';
import reduxStore from '../../../../redux';
import { NOTIFY } from '../../../common/notificationComp';
import UNIVERSALS from '../../../../@universals';
import { getCurrentTimeStampInSeconds } from '../../../../util/DateTimeUtil';

const { width, height } = Dimensions.get('window');

export default (props: {
  show?: boolean;
  setStep: React.Dispatch<React.SetStateAction<0 | 1 | 2>>;
  newDevice: DEVICE_t | undefined;
  setNewDevice: React.Dispatch<React.SetStateAction<DEVICE_t | undefined>>;
  log?: logger;
}) => {
  let time = 0;

  return (
    <PairingFrame
      showFunctionComponent={props.show}
      functionComponent={() => {
        useEffect(() => {
          const interval = setInterval(async () => {
            const res = await api.deviceAPI.statusAPI.v1({
              IP: '192.168.4.1',
              //log: props.log ? new logger('status api') : undefined,
              //log: new logger('status api'),
            });
            console.log('[pairing frame 1] statusAPI response -- ' + JSON.stringify(res));
            if (res.RES?.Mac && res.RES.Hostname) {
              clearInterval(interval);
              console.log('step 1 done');
              // - [ ] get the initial defaults based on hostName as like default channel
              props.setNewDevice({
                Hostname: res.RES.Hostname,
                Mac: res.RES.Mac,
                IP: '192.168.4.1',
                deviceName: res.RES.Hostname,
                timers: [],
                channel: UNIVERSALS.GLOBALS.getDefaultOutputChannel({ Hostname: res.RES.Hostname }),
                localTimeStamp: getCurrentTimeStampInSeconds(),
                icon: 0,
                config: {
                  saveLastState: true,
                },
                deviceInfo: {
                  firmwareVersion: res?.RES?.firmwareVersion ? res?.RES?.firmwareVersion : 0.1,
                },
              });
              props.setStep(1);
            }
            time = time + 3;
            console.log('time passes = ' + time);
            if (time % 15 == 0) {
              NOTIFY({
                topic: 'PAIRING',
                title: 'Turn off mobile data',
                subTitle:
                  'Make sure your mobile data is turned off and you are connected to the smartlight device Wifi',
                type: 'ALERT',
              });
            }
          }, 3000);
          return () => {
            clearInterval(interval);
          };
        }, []);

        return null;
      }}
      header={() => {
        return (
          <View
            style={{
              flex: 1,
              backgroundColor: '#ffffff00',
            }}
          >
            <Text style={{ color: '#555', fontSize: 25, textAlign: 'center', fontWeight: 'bold', marginTop: 25 }}>
              Connect to your device
            </Text>
            <Text style={{ color: '#555', fontSize: 15, marginTop: 10, textAlign: 'center', marginHorizontal: 15 }}>
              To proceed with pairing go to your phone Wi-Fi Settings and connect to Wi-Fi naming{' '}
              <Text style={{ fontWeight: 'bold' }}>HUE:_XXXX_XX:XX</Text> with password{' '}
              <Text style={{ fontWeight: 'bold' }}>12345678</Text>
            </Text>
            <Text style={{ fontSize: 12, color: '#555', textAlign: 'center', marginTop: 5 }}>
              <Text style={{ color: STYLES.textColors.warning, fontWeight: 'bold' }}>NOTE:</Text> turn off your mobile
              data
            </Text>
          </View>
        );
      }}
    >
      <View
        style={{
          marginHorizontal: 15,
          backgroundColor: '#ffffff00',
          marginTop: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          flex: 1,
        }}
      >
        {/* lottie container */}
        <View
          style={{
            //backgroundColor: "#fff",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {props.show && (
            <LottieView
              ref={(animation) => {
                //_animation = animation;
              }}
              style={{
                width: width - 30, //removed horizontal margin of the container
              }}
              source={require('../../../../../assets/lottie/scanning.json')}
              autoPlay
              loop={true}
              //progress={progress}
            />
          )}
        </View>

        {/* buttons container */}
        <View>
          {/* wifi settings button */}
          <NewRectButtonWithChildren
            style={{ marginVertical: 0 }}
            innerCompStyle={{}}
            onPress={async () => {
              const unsupportedDialog = () => {
                Alert.alert(
                  `Jump not Supported`,
                  'You might want to try switching the HUElite app in background and then go to WiFi Settings'
                );
              };
              const supported = await Linking.canOpenURL('App-Prefs:root=WIFI');
              if (Platform.OS == 'ios') {
                if (supported) await Linking.openURL('App-Prefs:root=WIFI');
                else unsupportedDialog();
              } else if (Platform.OS == 'android') {
                IntentLauncher.startActivityAsync(IntentLauncher.ACTION_WIFI_SETTINGS);
              } else {
                unsupportedDialog();
              }
            }}
          >
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 3,
                borderWidth: 1,
                borderColor: '#55f',
                borderRadius: 50,
              }}
            >
              <Text style={{ color: '#55f', fontSize: 15 }}>goto Wifi settings</Text>
            </View>
          </NewRectButtonWithChildren>

          <NewRectButtonWithChildren
            onPress={() => {
              Linking.openURL('https://www.huelite.in/support/how_to_pair/');
            }}
            style={{ marginTop: 0 }}
          >
            <Text>Need help? we have got you</Text>
          </NewRectButtonWithChildren>
        </View>
      </View>
    </PairingFrame>
  );
};
