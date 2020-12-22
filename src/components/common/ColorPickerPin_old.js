import React, { useEffect, useState, memo, useRef } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Svg, { Path } from "react-native-svg";
import Animated, {
  cond,
  divide,
  eq,
  modulo,
  pow,
  set,
  useCode,
  call,
} from "react-native-reanimated";
import {
  canvas2Polar,
  clamp,
  onGestureEvent,
  polar2Canvas,
  translate,
  vec,
  withOffset,
  useValue,
} from "react-native-redash";
import { convertHSVToRgb, _convertRGBToHex } from "../../util/Color";
import { useDispatch } from "react-redux";
import { colorUpdateAction } from "../../redux/actions/DeviceActions";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const quadraticIn = (t) => pow(t, 2);
const { width } = Dimensions.get("window");
const PICKER_WIDTH = 30;
const PICKER_HEIGHT = 60;
const STROKE_WIDTH = 4;
export const CANVAS_SIZE = width * 0.8;
const CENTER = {
  x: CANVAS_SIZE / 2,
  y: CANVAS_SIZE / 2,
};

export default ColorPickerPin = memo(({ h, s, backgroundColor, device }) => {
  const dispatch = useDispatch();
  const state = useValue(State.UNDETERMINED);
  //const translation = useRef(vec.createValue(0, 0)).current;
  const translation = {
    x: useValue(0),
    y: useValue(0),
  };

  const offset = {
    x: withOffset(translation.x, state),
    y: withOffset(translation.y, state),
  };

  const v2 = vec.add(offset, CENTER);

  const polar = canvas2Polar(v2, CENTER);
  const l = {
    theta: polar.theta,
    radius: clamp(polar.radius, 0, CANVAS_SIZE / 2),
  };
  const hue = divide(modulo(l.theta, 2 * Math.PI), 2 * Math.PI);
  const saturation = cond(
    eq(l.radius, 0),
    0,
    divide(l.radius, CANVAS_SIZE / 2)
  );

  const gestureHandler = onGestureEvent({
    translationX: translation.x,
    translationY: translation.y,
    state,
  });

  useCode(
    () => [
      set(h, hue),
      set(s, quadraticIn(saturation)),
      call([h, s, state], ([h, s, state]) => {
        //  dispatch(offsetUpdateAction(offX, offY, device.Mac));
        const rgb = convertHSVToRgb(h * 360, s * 100, 100);
        const hex = _convertRGBToHex(rgb[0], rgb[1], rgb[2]);
        if (state == State.ACTIVE) {
          //console.log("color changed");
          //dispatch(colorUpdateAction(hex, { h, s }, device));
        } else {
        }
      }),
    ],
    [h, hue, s, saturation, state, offset, v2]
  );

  return (
    <View style={StyleSheet.absoluteFill}>
      <PanGestureHandler {...gestureHandler}>
        <Animated.View
          style={{
            width: 50,
            height: 50,
            backgroundColor: "#00000000",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 12,
            },
            shadowOpacity: 0.58,
            shadowRadius: 25.0,
            elevation: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: [
              ...translate(polar2Canvas(l, CENTER)),
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
});
