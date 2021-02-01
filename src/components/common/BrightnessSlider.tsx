import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Dimensions, Text, View } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated, { add, block, call, concat, cond, divide, eq, event, multiply, set, useCode } from "react-native-reanimated";
import { clamp, ReText, round, useValue } from "react-native-redash";
import { appOperator } from "../../@operator";
import { getTimeDiffNowInMs } from "../../util/DateTimeUtil";
import { logger } from "../../@logger";

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
export default ({
  initBrValue = 0,
  bgColor = ["#ffffff00", "#ffffff77"],
  deviceMac,
  color = "#ffffff",
  log,
  ...props
}: Props) => {
  //console.log("initBr : " + initBrValue);
  const pinState = useValue(State.UNDETERMINED);
  const [sliderWidth, setSliderWidth] = useState(0);
  const offset = useValue((initBrValue / 100) * (width * 0.9));
  const offsetX = clamp(offset, 0, sliderWidth - sliderHeight);
  //@ts-ignore
  const BR = round(multiply(divide(offsetX, (sliderWidth - sliderHeight)), 100))
  let timeStamp = Date.now();

  const gestureHandler = event(
    [
      {
        //@ts-ignore
        nativeEvent: ({ translationX, state: temp1state }) =>
          block([
            set(pinState, temp1state),
            cond(eq(temp1state, State.ACTIVE), set(offset, add(offset, translationX))),
          ]),
      },
    ],
    { useNativeDriver: true }
  );

  const updateColor = (v: number, gestureState: State, log?: logger) => {
    if (v < 5)
      v = 0
    appOperator.device({
      cmd: "COLOR_UPDATE",
      deviceMac,
      hsv: { v },
      gestureState,
      log
    })
  }

  useCode(
    () => [
      call([BR, pinState], ([BR, pinState]) => {
        if (getTimeDiffNowInMs(timeStamp) > 200 && pinState == State.ACTIVE) {
          console.log("<<<< Sending Bightness- >>>>")
          timeStamp = Date.now();
          updateColor(BR, pinState, log)
        }
        else {
          //console.log("<<<< cannot send Bightness- >>>>")
        }
        /* if (pinState == State.ACTIVE) {
          if (getTimeDiffNowInMs(timeStamp) > 200) {
            timeStamp = getCurrentTimeStamp();
            updateColor(Math.min(100, Math.round(BR)), pinState, log)
          }
        } else if (pinState == State.END) {
          console.log("<<<< --Sending Bightness- >>>>")
          setTimeout(() => {
            timeStamp = getCurrentTimeStamp();
            updateColor(Math.min(100, Math.round(BR)), pinState, log)
          }, 200);
        } */
      }),
    ],
    [BR, pinState]
  );

  return (
    <View style={{ overflow: "visible" }}>
      <View style={{
        display: "flex",
        flexDirection: "row",
        alignSelf: "flex-end",
        marginBottom: 6,
      }}>
        <ReText
          style={{
            color: "#fff",
            fontSize: 25,
            fontWeight: "bold",
          }}
          text={concat(BR)} />
        <Text
          style={{
            color: "#fff",
            fontSize: 25,
            fontWeight: "bold",
          }}>%</Text>
      </View>
      <LinearGradient
        onLayout={(event) => {
          var { width } = event.nativeEvent.layout;
          setSliderWidth(width);
        }}
        style={{
          justifyContent: "center",
          opacity: 1,
          height: sliderHeight,
          width: "100%",
          borderRadius: 15,
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={[bgColor[0], bgColor[1]]}
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
