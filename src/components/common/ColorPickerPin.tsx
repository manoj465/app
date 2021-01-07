import React from "react";
import { StyleSheet, View } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated, { add, block, call, cond, divide, eq, event, modulo, pow, set, useCode } from "react-native-reanimated";
import { canvas2Polar, clamp, polar2Canvas, translate, useValue, vec } from "react-native-redash";
//import { Path } from "react-native-svg";
import { types } from "../../@types/huelite";
import { deviceListOperation } from "../../util/app.operator/device.operator";
import {
  getCurrentTimeStamp,
  getTimeDiffNowInMs
} from "../../util/DateTimeUtil";
import { logger } from "../../util/logger";

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
  device: types.HUE_DEVICE_t;
  log?: logger
}

const ColorPickerPin = ({
  canvasWidth,
  h,
  s,
  backgroundColor,
  device,
  log
}: Props) => {
  const state = useValue(State.UNDETERMINED);
  let timeStamp = getCurrentTimeStamp();
  const CENTER = { x: canvasWidth / 2, y: canvasWidth / 2, };
  const v = polar2Canvas({ theta: (device.hsv?.h ? device.hsv?.h : 0) * (Math.PI / 180), radius: (canvasWidth / 2) * Math.sqrt((device.hsv?.s ? device.hsv?.s : 100) / 100), }, CENTER);
  const offset = { x: useValue(0), y: useValue(0) };
  const v2 = vec.add(offset, v);
  const { theta, radius } = canvas2Polar(v2, CENTER);
  const l = { theta: theta, radius: clamp(radius, 0, canvasWidth / 2) };
  const hue = divide(modulo(l.theta, 2 * Math.PI), 2 * Math.PI);
  const saturation = cond(eq(l.radius, 0), 0, divide(l.radius, canvasWidth / 2));

  const gestureHandler = event(
    [
      {
        //@ts-ignore
        nativeEvent: ({ x: transX, y: transY, state: _state }) =>
          block([
            set(state, _state),
            cond(
              eq(state, State.ACTIVE),
              block([
                set(offset.x, add(offset.x, transX)),
                set(offset.y, add(offset.y, transY)),
              ])
            ),
          ]),
      },
    ],
    { useNativeDriver: true }
  );

  const updateColor = (h: number, s: number, gestureState: State, log?: logger) => {
    deviceListOperation({
      props: {
        cmd: "COLOR_UPDATE",
        deviceMac: [device.Mac],
        hsv: { h: Math.min(Math.round(h * 360), 360), s: Math.min(Math.round(s * 100), 100) },
        gestureState,
        log
      },
    })
  }

  useCode(
    () => [
      set(h, hue),
      set(s, quadraticIn(saturation)),
      call(
        [h, s, state],
        ([h, s, state]) => {
          /* if (getTimeDiffNowInMs(timeStamp) > 200) {
            console.log("<<<< Sending Color- >>>>")
            timeStamp = getCurrentTimeStamp();
            updateColor(h, s, State.ACTIVE, log)
          }
          else {
            //console.log("<<<< cannot send Bightness- >>>>")
          } */
          if (state == State.ACTIVE) {
            console.log("Sending hex >>>>>>>>>>>>>>>>")
            if (getTimeDiffNowInMs(timeStamp) > 200) {
              //console.log("can send")
              timeStamp = getCurrentTimeStamp();
              updateColor(h, s, state, log)
            } else {
              //console.log("cannot send")
            }
          } else if (state == State.END) {
            console.log("Sending hex >>>>>>>>>>>>>>>>")
            setTimeout(() => {
              timeStamp = getCurrentTimeStamp();
              updateColor(h, s, state, log)
            }, 200);
          }
        }
      ),
    ],
    [h, hue, s, state, saturation, timeStamp]
  );

  return (
    <View style={StyleSheet.absoluteFill}>
      <PanGestureHandler
        onGestureEvent={gestureHandler}
        onHandlerStateChange={gestureHandler}
      >
        <Animated.View
          style={{
            width: 50,
            height: 50,
            backgroundColor: "#00000000" /* backgroundColor */,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 12,
            },
            shadowOpacity: 0.58,
            shadowRadius: 25.0,
            elevation: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: [
              ...translate(
                polar2Canvas(l, CENTER)
              ) /* ...translate(
                polar2Canvas(
                  {
                    theta: 240 * (Math.PI / 180),
                    radius: (canvasWidth / 2) * Math.pow(0.667, 2),
                  },
                  CENTER
                )
              ), */,
              ...translate({
                x: -25,
                y: -25,
              }),
            ],
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderWidth: 2,
              borderColor: "#aaa",
              height: 30,
              width: 30,
              borderRadius: 15,
            }}
          />
          {/*  <Svg
                        width={100}
                        height={200}
                        style={{ top: -PICKER_HEIGHT / 2 }}
                        viewBox={`-${STROKE_WIDTH / 2} -${STROKE_WIDTH / 2} ${44 +
                            STROKE_WIDTH} ${60 + STROKE_WIDTH}`}>
                        <AnimatedPath
                            d="m13.937573,20.35588l-0.188524,-6.981805c0.063533,0.10728 1.438438,-4.5174 3.688282,-0.392685c2.249844,4.124715 3.624749,3.124784 2.124853,3.999723c-1.499896,0.874939 -5.624611,3.374767 -5.624611,3.374767z"
                            fill={backgroundColor}
                            stroke="#fff"
                            strokeWidth={STROKE_WIDTH}
                            fillRule="evenodd"
                        />
                    </Svg> */}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};
export default ColorPickerPin;
