import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { add, block, call, cond, divide, eq, event, modulo, pow, set, useCode } from 'react-native-reanimated';
import { canvas2Polar, clamp, polar2Canvas, translate, useValue, vec } from 'react-native-redash';
import UNIVERSALS from '../../@universals';
import { appOperator } from '../../app.operator';
//import { Path } from "react-native-svg";
import { getTimeDiffNowInMs } from '../../util/DateTimeUtil';
import { logger } from '../../@logger';

//const AnimatedPath = Animated.createAnimatedComponent(Path);
const quadraticIn = (t: any) => pow(t, 2);
const PICKER_WIDTH = 30;
const PICKER_HEIGHT = 60;
const STROKE_WIDTH = 4;

interface Props {
  canvasWidth: number;
  h: Animated.Value<number>;
  s: Animated.Value<number>;
  backgroundColor: Animated.Node<number>;
  device: UNIVERSALS.GLOBALS.DEVICE_t;
  log?: logger;
}

const ColorPickerPin = ({ canvasWidth, h, s, backgroundColor, device, log }: Props) => {
  const state = useValue(State.UNDETERMINED);
  let timeStamp = Date.now();
  const CENTER = { x: canvasWidth / 2, y: canvasWidth / 2 };
  const offset = { x: useValue(0), y: useValue(0) };
  const { theta, radius } = canvas2Polar(
    vec.add(
      offset,
      polar2Canvas({ theta: (device.hsv?.h ? device.hsv?.h : 0) * (Math.PI / 180), radius: (canvasWidth / 2) * Math.sqrt((device.hsv?.s ? device.hsv?.s : 100) / 100) }, CENTER)
    ),
    CENTER
  );
  const l = { theta: theta, radius: clamp(radius, 0, canvasWidth / 2) };
  const hue = divide(modulo(l.theta, 2 * Math.PI), 2 * Math.PI);
  const saturation = cond(eq(l.radius, 0), 0, divide(l.radius, canvasWidth / 2));

  const gestureHandler = event(
    [
      {
        nativeEvent: ({ x: transX, y: transY, state: _state }: any) =>
          block([set(state, _state), cond(eq(state, State.ACTIVE), block([set(offset.x, add(offset.x, transX)), set(offset.y, add(offset.y, transY))]))]),
      },
    ],
    { useNativeDriver: true }
  );

  const updateColor = (h: number, s: number, gestureState: State, log?: logger) => {
    appOperator.device({
      cmd: 'COLOR_UPDATE',
      deviceMac: [device.Mac],
      stateObject: {
        state: UNIVERSALS.GLOBALS.channelState_e.CH_STATE_RGB,
        hsv: { h: Math.min(Math.round(h * 360), 360), s: Math.min(Math.round(s * 100), 100) },
      },
      gestureState,
      onActionComplete: ({ newDeviceList }) => {
        console.log('terrrrrrrrrrrr');
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
      set(h, hue),
      set(s, quadraticIn(saturation)),
      call([h, s, state], ([h, s, state]) => {
        if (state == State.ACTIVE) {
          if (getTimeDiffNowInMs(timeStamp) > 200) {
            console.log('Sending contineous hex');
            timeStamp = Date.now();
            updateColor(h, s, state, log);
          } else {
            //console.log("cannot send")
          }
        } /*  else if (state == State.END) {
          console.log('Sending end hex');
          setTimeout(() => {
            timeStamp = Date.now();
            updateColor(h, s, state, log);
          }, 200);
        } */
      }),
    ],
    [h, hue, s, state, saturation, timeStamp]
  );

  return <ColorPickerPin_copy gestureHandler={gestureHandler} CENTER={CENTER} offset={offset} state={state} l={l} />;
};
export default ColorPickerPin;

class ColorPickerPin_copy extends Component<
  {
    gestureHandler: (...args: any[]) => void;
    CENTER: { x: number; y: number };
    offset: { x: Animated.Value<0>; y: Animated.Value<0> };
    l: { theta: Animated.Node<number>; radius: Animated.Node<number> };
    state: Animated.Value<State>;
  },
  any
> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={StyleSheet.absoluteFill}>
        <PanGestureHandler onGestureEvent={this.props.gestureHandler} onHandlerStateChange={this.props.gestureHandler}>
          <Animated.View
            style={{
              width: 50,
              height: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: [
                ...translate(
                  vec.add(polar2Canvas(this.props.l, this.props.CENTER), {
                    x: -25,
                    y: -25,
                  })
                ),
              ],
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
  }
}
