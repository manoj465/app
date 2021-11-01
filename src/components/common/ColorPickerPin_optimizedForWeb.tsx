import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { add, block, cond, divide, eq, event, modulo, pow, set } from 'react-native-reanimated';
import { canvas2Polar, clamp, polar2Canvas, translate, useValue, vec } from 'react-native-redash';
import { outputChannelTypes_e } from '../../../sternet/helpers/universals/device/deviceEnum';
import { logger } from '../../@logger';

interface Props {
  canvasWidth: number;
  h: Animated.Value<number>;
  s: Animated.Value<number>;
  backgroundColor: Animated.Node<number>;
  device: DEVICE_t;
  log?: logger;
}

const ColorPickerPin = ({ canvasWidth, h, s, backgroundColor, device, log }: Props) => {
  const state = useValue(State.UNDETERMINED);
  const CENTER = { x: canvasWidth / 2, y: canvasWidth / 2 };
  const offset = useMemo(
    () =>
      polar2Canvas(
        {
          theta:
            device.channel.outputChannnel[0].type == outputChannelTypes_e.colorChannel_hsv
              ? device.channel.outputChannnel[0].h * (Math.PI / 180)
              : 0,
          radius:
            device.channel.outputChannnel[0].type == outputChannelTypes_e.colorChannel_hsv
              ? (canvasWidth / 2) * Math.sqrt(device.channel.outputChannnel[0].s / 100)
              : 0,
        },
        CENTER
      ),
    []
  );
  const translation = { x: useValue(0), y: useValue(0) };
  const { theta, radius } = canvas2Polar(vec.add(translation, offset), CENTER);
  const polarTranslation = { theta: theta, radius: clamp(radius, 0, canvasWidth / 2) };
  const gestureHandler = event(
    [
      {
        nativeEvent: ({ x: transX, y: transY, state: _state }: any) =>
          block([
            set(state, _state),
            cond(
              eq(state, State.ACTIVE),
              block([
                set(translation.x, add(translation.x, transX)),
                set(translation.y, add(translation.y, transY)),
                set(h, divide(modulo(polarTranslation.theta, 2 * Math.PI), 2 * Math.PI)),
                set(s, cond(eq(polarTranslation.radius, 0), 0, divide(polarTranslation.radius, canvasWidth / 2))),
              ])
            ),
          ]),
      },
    ],
    { useNativeDriver: true }
  );

  return (
    <View style={StyleSheet.absoluteFill}>
      <PanGestureHandler onGestureEvent={gestureHandler} onHandlerStateChange={gestureHandler}>
        <Animated.View
          style={{
            width: 50,
            height: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: [...translate(vec.add(polar2Canvas(polarTranslation, CENTER), { x: -25, y: -25 }))],
          }}
        >
          <View
            style={{
              backgroundColor: '#fff',
              borderWidth: 2,
              borderColor: '#aaaaaa',
              height: 30,
              width: 30,
              borderRadius: 15,
            }}
          />
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};
export default ColorPickerPin;
