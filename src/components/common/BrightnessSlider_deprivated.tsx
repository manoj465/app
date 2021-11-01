import { LinearGradient } from 'expo-linear-gradient';
import React, { Component, useState } from 'react';
import { Dimensions, Text, View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, {
  add,
  block,
  call,
  concat,
  cond,
  divide,
  eq,
  event,
  multiply,
  set,
  useCode,
} from 'react-native-reanimated';
import { clamp, ReText, round, useValue } from 'react-native-redash';
import { logger } from '../../@logger';
import { getTimeDiffNowInMs } from '../../util/DateTimeUtil';

const sliderHeight = 35;
const sliderHeightExtension = 4;

export type onBrValueChange_Props = (value: number, state: State) => void;

interface Props {
  initBrValue?: number;
  deviceMac: string[];
  color?: string;
  bgColor?: [string, string];
  groupUUID?: string;
  log?: logger;
  onBrightnessChange?: (props: { value: number; pinState: number; groupOpen?: Animated.Value<any> }) => void;
  groupOpen?: Animated.Value<any>;
}

export default ({
  groupOpen,
  initBrValue = 0,
  bgColor = ['#ffffff00', '#ffffff77'],
  deviceMac,
  color = '#ffffff',
  log,
  ...props
}: Props) => {
  const [sliderWidth, setSliderWidth] = useState(0);

  return (
    <View
      style={{
        overflow: 'visible',
      }}
      onLayout={(event) => {
        var { width } = event.nativeEvent.layout;
        setSliderWidth(width);
      }}
    >
      {sliderWidth > 0 && (
        <BrightnessSlider
          groupOpen={groupOpen}
          sliderWidth={sliderWidth}
          initBrValue={initBrValue}
          onBrightnessChange={props.onBrightnessChange}
        />
      )}
    </View>
  );
};

const BrightnessSlider = (props: {
  sliderWidth: number;
  initBrValue: number;
  groupOpen?: Animated.Value<any>;
  onBrightnessChange?: (props: { value: number; pinState: number; groupOpen?: Animated.Value<any> }) => void;
}) => {
  const pinState = useValue(State.UNDETERMINED);
  const offset = useValue((props.initBrValue / 100) * (props.sliderWidth - sliderHeight));
  //@ts-ignore
  const BR = round(multiply(divide(offset, props.sliderWidth - sliderHeight), 100));
  let timeStamp = Date.now();

  const gestureHandler = event(
    [
      {
        nativeEvent: ({ x: translationX, state: temp1state }: any) =>
          block([
            set(pinState, temp1state),
            cond(
              eq(temp1state, State.ACTIVE),
              set(offset, clamp(add(offset, translationX), 0, props.sliderWidth - sliderHeight))
            ),
          ]),
      },
    ],
    { useNativeDriver: true }
  );

  useCode(
    () => [
      call([BR, pinState, props.groupOpen ? props.groupOpen : new Animated.Value(1)], ([BR, pinState, groupOpen]) => {
        if (getTimeDiffNowInMs(timeStamp) > 200 && pinState == State.ACTIVE) {
          console.log('<<<< Sending Bightness-*- >>>>');
          timeStamp = Date.now();
          //@ts-ignore
          props.onBrightnessChange && props.onBrightnessChange({ value: BR, pinState, groupOpen });
        } else {
          //console.log("<<<< cannot send Bightness- >>>>")
        }
      }),
    ],
    [BR, pinState, props.groupOpen]
  );

  return (
    <View
      style={{
        width: '100%',
      }}
    >
      <View /// brightness percentage view
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignSelf: 'flex-end',
          marginBottom: 6,
          borderRadius: 15,
        }}
      >
        <ReText
          style={{
            color: '#fff',
            fontSize: 18,
            fontWeight: 'bold',
            textAlign: 'right',
          }}
          text={concat(BR)}
        />
        <Text
          style={{
            color: '#fff',
            fontSize: 18,
            fontWeight: 'bold',
          }}
        >
          %
        </Text>
      </View>

      <View
        style={{
          width: '100%',
          height: sliderHeight,
        }}
      >
        <LinearGradient
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            borderRadius: 15,
            height: '100%',
            width: '100%',
          }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={['#ffffff00', '#ffffff77']}
        />
        <PanGestureHandler onGestureEvent={gestureHandler} onHandlerStateChange={gestureHandler}>
          <Animated.View
            style={[
              {
                position: 'absolute',
                height: sliderHeight + sliderHeightExtension,
                width: sliderHeight + sliderHeightExtension,
                borderRadius: 25,
                backgroundColor: '#ddd',
                top: -(sliderHeightExtension / 2),
                alignItems: 'center',
                justifyContent: 'center',
              },
              {
                transform: [{ translateX: offset }],
              },
            ]}
          >
            <View
              style={{
                height: '80%',
                width: '80%',
                borderRadius: 50,
                backgroundColor: '#fff',
                borderWidth: 10,
                borderColor: '#fff',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            ></View>
          </Animated.View>
        </PanGestureHandler>
      </View>
    </View>
  );
};
