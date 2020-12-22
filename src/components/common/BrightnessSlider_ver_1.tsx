import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Dimensions, View } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated, { add, block, call, cond, eq, event, set, useCode } from "react-native-reanimated";
import { clamp, useValue } from "react-native-redash";
import { deviceListOperation } from "../../util/dataManipulator";
import { getCurrentTimeStamp, getTimeDiffNowInMs } from "../../util/DateTimeUtil";
import { logger } from "../../util/logger";

const sliderHeight = 35;
const sliderHeightExtension = 4;

export type onBrValueChange_Props = (value: number, state: State) => void;

interface Props {
  initBrValue?: number;
  deviceMac: string[];
  color?: string;
  bgColor?: [string, string];
  groupUUID?: string;
  log?: logger
}

const { width, height } = Dimensions.get("window");
export const BrightnessSlider = ({
  initBrValue = 0,
  bgColor = ["#ffffff00", "#ffffff77"],
  deviceMac,
  color = "#ffffff",
  log
}: Props) => {
  //console.log("initBr : " + initBrValue);
  const pinState = useValue(State.UNDETERMINED);
  const [sliderWidth, setSliderWidth] = useState(0);
  const offset = useValue((initBrValue / 100) * (width * 0.9));
  const offsetX = clamp(offset, 0, sliderWidth - 35);
  let timeStamp = getCurrentTimeStamp();

  const gestureHandler = event(
    [
      {
        //@ts-ignore
        nativeEvent: ({ x, state }) =>
          block([
            set(pinState, state),
            cond(eq(pinState, State.ACTIVE), set(offset, add(offset, x))),
          ]),
      },
    ],
    { useNativeDriver: true }
  );

  const updateColor = (v: number, gestureState: State, log?: logger) => {
    if (v < 5)
      v = 0
    deviceListOperation({
      props: {
        cmd: "COLOR_UPDATE",
        deviceMac,
        hsv: { v },
        gestureState,
        log
      },
    })
  }
  useCode(
    () => [
      call([offsetX, pinState], ([offsetX, pinState]) => {
        if (pinState == State.ACTIVE) {
          if (getTimeDiffNowInMs(timeStamp) > 200) {
            timeStamp = getCurrentTimeStamp();
            updateColor(Math.min(100, Math.round((offsetX / (sliderWidth - 45)) * 100)), pinState, log)
          }
        } else if (pinState == State.END) {
          setTimeout(() => {
            timeStamp = getCurrentTimeStamp();
            updateColor(Math.min(100, Math.round((offsetX / (sliderWidth - 45)) * 100)), pinState, log)
          }, 200);
        }
      }),
    ],
    [offsetX, pinState]
  );

  return (
    <View style={{ overflow: "visible", height: sliderHeight }}>
      <LinearGradient
        onLayout={(event) => {
          var { width } = event.nativeEvent.layout;
          setSliderWidth(width);
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={[bgColor[0], bgColor[1]]}
        style={{
          position: "absolute",
          justifyContent: "center",
          opacity: 1,
          top: 0,
          left: 0,
          height: sliderHeight,
          width: "100%",
          //backgroundColor: "#ffffff",
          borderRadius: 15,
          //opacity: 0.1,
          /* shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 0.5,
            },
            shadowOpacity: 0.22,
            shadowRadius: 1.22,
            elevation: 2, */
        }}
      >
        <PanGestureHandler
          onGestureEvent={gestureHandler}
          onHandlerStateChange={gestureHandler}
        >
          <Animated.View
            style={[
              {
                position: "absolute",
                height: sliderHeight + sliderHeightExtension,
                width: sliderHeight + sliderHeightExtension,
                borderRadius: 25,
                backgroundColor: "#ddd",
                top: -sliderHeightExtension / 2,
                alignItems: "center",
                justifyContent: "center",
              },
              {
                transform: [{ translateX: offsetX }],
              },
            ]}
          >
            <View
              style={{
                height: "80%",
                width: "80%",
                borderRadius: 50,
                backgroundColor: color,
                borderWidth: 10,
                borderColor: "#fff",
                alignItems: "center",
                justifyContent: "center",
              }}
            ></View>
          </Animated.View>
        </PanGestureHandler>
      </LinearGradient>
    </View>
  );
};
