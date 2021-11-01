import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { add, block, call, cond, eq, set, useCode, event, divide, neq } from 'react-native-reanimated';
import { clamp, useValue, withOffset } from 'react-native-redash';
import { channelState_e, deviceType_e } from '../../../../../../sternet/helpers/universals/device/deviceEnum';
import { STYLES } from '../../../../../@styles';
import { appOperator } from '../../../../../app.operator';
import { getTimeDiffNowInMs } from '../../../../../util/DateTimeUtil';
import { Modes } from '../../../../common/Modes';

interface Props {
  device: DEVICE_t;
  navigateToTimer?: () => void;
}
export default (props: Props) => {
  return (
    <Animated.ScrollView showsVerticalScrollIndicator={false}>
      <View /// Extended controlls
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
        }}
      >
        {props.device.channel.deviceType == deviceType_e.deviceType_NW4 &&
          props.device.channel.outputChannnel.map((channel, index) => {
            return <ExtendedWhiteChannel key={'_' + index} device={props.device} index={index} channel={channel} />;
          })}
      </View>
      <View style={{ marginLeft: 20, marginTop: 10, marginBottom: 50 }} /** /// modes section container */>
        <View /// headingText
          style={{
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          <Text
            style={[
              STYLES.H3,
              {
                color: '#555',
                fontWeight: 'bold',
              },
            ]}
          >
            Modes
          </Text>
        </View>

        <Modes device={props.device} />
      </View>
    </Animated.ScrollView>
  );
};

interface ExtendedWhiteChannel_props {
  channel: outputChannel_tempratureValue_i;
  index: number;
  device: DEVICE_t;
}
const ExtendedWhiteChannel = (props: ExtendedWhiteChannel_props) => {
  const [height, setHeight] = useState(0);
  const width = 60;

  return (
    <View
      style={{
        width: '42%',
        height: 200,
        backgroundColor: '#ffffff',
        overflow: 'hidden',
        ///margin & paddings
        margin: 10,
        paddingRight: 10,
        ///alignments
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        ///borders
        borderRadius: 10,
        borderColor: '#ff000066',
        borderWidth: 0.4,
        ///shadow styles
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 5,
      }}
    >
      <View /// Info section
        style={{
          flex: 1,
          //backgroundColor: "green",
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        <View
          style={[
            STYLES.shadow,
            {
              width: 50,
              height: 50,
              backgroundColor: 'white',
              borderRadius: 50,
              marginLeft: 10,
              marginBottom: 10,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}
        >
          <MaterialCommunityIcons
            name={props.device.channel.state == channelState_e.CH_STATE_OFF ? 'lightbulb-off' : 'lightbulb-on-outline'}
            size={24}
            color="black"
          />
        </View>
        <View style={{ marginLeft: 10, marginBottom: 10 }}>
          <Text style={[STYLES.H6, { color: STYLES.textColors.secondary }]}>{'Channel ' + (props.index + 1)}</Text>
          <Text style={[STYLES.H7, { color: STYLES.textColors.secondary }]}>{'of ' + props.device.deviceName}</Text>
        </View>
      </View>
      <View /// brightness Bar
        onLayout={({ nativeEvent }) => {
          console.log('Extended controll height is  ' + nativeEvent.layout.height);
          if (height == 0 && nativeEvent.layout.height) setHeight(nativeEvent.layout.height);
        }}
        style={[
          STYLES.shadow,
          {
            backgroundColor: '#eee',
            height: '90%',
            width,
            borderRadius: 50,
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'flex-end',
          },
        ]}
      >
        {height > 0 && (
          <ChannelBrightnessBar
            device={props.device}
            index={props.index}
            height={height}
            width={width}
            channel={props.channel}
          />
        )}
      </View>
    </View>
  );
};

const ChannelBrightnessBar = (props: {
  device: DEVICE_t;
  index: number;
  height: number;
  width: number;
  channel: outputChannel_tempratureValue_i;
}) => {
  const pinState = useValue(State.UNDETERMINED);
  const offsetY = useValue(-((props.channel.v / 100) * (props.height - props.width)));
  let timestamp = Date.now();

  const gestureHandler = event(
    [
      {
        nativeEvent: ({ y: translationY, state: temp1state }: any) =>
          block([
            set(pinState, temp1state),
            cond(
              eq(temp1state, State.ACTIVE),
              set(offsetY, clamp(add(offsetY, translationY), -(props.height - props.width), 0))
            ),
          ]),
      },
    ],
    { useNativeDriver: true }
  );

  useCode(
    () => [
      call([offsetY], ([offsetY]) => {
        if (getTimeDiffNowInMs(timestamp) > 200) {
          let brPercentage = Math.round(((-1 * offsetY) / (props.height - props.width)) * 100);
          console.log('state for channel ' + props.index + ' = ' + brPercentage);
          timestamp = Date.now();
          appOperator.device({
            cmd: 'COLOR_UPDATE',
            deviceMac: [props.device.Mac],
            channelBrightnessObject: {
              value: brPercentage,
              activeChannel: (() => {
                return props.device.channel.outputChannnel.map((temp__channel__: any, temp__index__: number) => {
                  if (temp__index__ == props.index) {
                    return true;
                  }
                  return false;
                });
              })(),
            },
            gestureState: 0,
            onActionComplete: ({ newDeviceList }) => {
              appOperator.device({
                cmd: 'ADD_UPDATE_DEVICES',
                newDevices: newDeviceList,
                //log: new logger("debug", undefined)
              });
            },
            //log
          });
        } else {
          //console.log("_----------cannot send due to time gap error------------_")
        }
      }),
    ],
    [offsetY]
  );

  return (
    <PanGestureHandler onGestureEvent={gestureHandler} onHandlerStateChange={gestureHandler}>
      <Animated.View /** vertical brightness bar */
        style={{
          position: 'absolute',
          backgroundColor: '#ffffff',
          height: props.width,
          width: props.width,
          borderRadius: 50,
          borderColor: '#ff000066',
          borderWidth: 0.5,
          zIndex: 2,
          transform: [
            {
              translateY: offsetY,
            },
          ],
          ///shadow styles
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.25,
          shadowRadius: 2,
          elevation: 5,
        }}
      />
    </PanGestureHandler>
  );
};

// #TODO add key to Extended channel control
// #TODO setup useCode to send brightness

/*    useCode(
    () => [
      call([offsetY], ([offsetY]) => {
        if (getTimeDiffNowInMs(timestamp) > 200) {
          let brPercentage = Math.round((offsetY / 190) * 100);
          //console.log("state------------------------------------------" + brPercentage)
          timestamp = Date.now();
          appOperator.device({
            cmd: 'COLOR_UPDATE',
            deviceMac: [props.device.Mac],
            channelBrightnessObject: {
              value: brPercentage,
              activeChannel: (() => {
                //@ts-ignore
                return props.device.channel.outputChannnel.map(
                  (temp__channel__: any, temp__index__: number) => {
                    if (temp__index__ == index) {
                      return true;
                    }
                    return false;
                  }
                );
              })(),
            },
            gestureState: 0,
            onActionComplete: ({ newDeviceList }) => {
              appOperator.device({
                cmd: 'ADD_UPDATE_DEVICES',
                newDevices: newDeviceList,
                //log: new logger("debug", undefined)
              });
            },
            //log
          });
        } else {
          //console.log("_----------cannot send due to time gap error------------_")
        }
      }),
    ],
    [offsetY]
  ); */
