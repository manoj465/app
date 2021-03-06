import { LinearGradient } from "expo-linear-gradient";
import React, { Component, useState } from "react";
import { Dimensions, Text, View } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated, { add, block, call, concat, cond, divide, eq, event, multiply, set, useCode } from "react-native-reanimated";
import { clamp, ReText, round, useValue } from "react-native-redash";
import { logger } from "../../@logger";
import { appOperator } from "../../app.operator";
import { getTimeDiffNowInMs } from "../../util/DateTimeUtil";

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
  onBrightnessChange?: (props: { value: number, pinState: number }) => void
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
  //const ref = useRef<any>(null)
  //const offset = useMemo(() => new Animated.Value((initBrValue / 100) * (width * 0.9)), [initBrValue])
  const offset = useValue((initBrValue / 100) * (width * 0.9))
  const offsetX = clamp(offset, 0, sliderWidth - sliderHeight);
  //@ts-ignore
  const BR = round(multiply(divide(offsetX, (sliderWidth - sliderHeight)), 100))
  let timeStamp = Date.now();

  useCode(
    () => [
      call([BR, pinState], ([BR, pinState]) => {
        if (getTimeDiffNowInMs(timeStamp) > 200 && pinState == State.ACTIVE) {
          console.log("<<<< Sending Bightness-*- >>>>")
          timeStamp = Date.now();
          props.onBrightnessChange && props.onBrightnessChange({ value: BR, pinState })
        }
        else {
          //console.log("<<<< cannot send Bightness- >>>>")
        }
      }),
    ],
    [BR, pinState]
  );

  /* useEffect(() => {
    console.log("setting v is >>>>>>>> " + initBrValue)
    //set(offset, ((initBrValue / 100) * (width * 0.9)))
    return () => {
    }
  }, [initBrValue]) */

  return (
    <View style={{ overflow: "visible" }}>
      <View style={{
        display: "flex",
        flexDirection: "row",
        alignSelf: "flex-end",
        marginBottom: 6,
        borderRadius: 15
      }}>
        <ReText
          style={{
            color: "#fff",
            fontSize: 18,
            fontWeight: "bold",
            textAlign: "right"
          }}
          text={concat(BR)} />
        <Text
          style={{
            color: "#fff",
            fontSize: 18,
            fontWeight: "bold",
          }}>%</Text>
      </View>
      <View
        onLayout={(event) => {
          var { width } = event.nativeEvent.layout;
          setSliderWidth(width);
        }}
        style={{
          justifyContent: "center",
          opacity: 1,
          height: sliderHeight,
          width: "100%",
          overflow: "visible",
          borderRadius: 15,
        }}
      >
        <LinearGradient
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            borderRadius: 15,
            height: "100%",
            width: "100%"
          }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={[bgColor[0], bgColor[1]]} />
        <BrightnessSlider
          pinState={pinState}
          offset={offset}
          offsetX={offsetX}
          sliderWidth={sliderWidth}
        >
        </BrightnessSlider>
      </View>
    </View>
  );
};





class BrightnessSlider extends Component<{
  pinState: Animated.Value<number>
  offset: Animated.Value<number>
  sliderWidth: number
  offsetX: Animated.Node<number>
}, any> {
  constructor(props: any) {
    super(props)
    this.state = {};
  }

  gestureHandler = event(
    [
      {
        nativeEvent: ({ x: translationX, state: temp1state }: any) =>
          block([
            set(this.props.pinState, temp1state),
            cond(eq(temp1state, State.ACTIVE), set(this.props.offset, add(this.props.offset, translationX))),
          ]),
      }],
    { useNativeDriver: true }
  );

  render() {
    return (
      <View style={{}}>
        <PanGestureHandler
          onGestureEvent={this.gestureHandler}
          onHandlerStateChange={this.gestureHandler}
        >
          <Animated.View
            style={[
              {
                position: "absolute",
                height: sliderHeight + sliderHeightExtension,
                width: sliderHeight + sliderHeightExtension,
                borderRadius: 25,
                backgroundColor: "#ddd",
                top: -(sliderHeight + sliderHeightExtension) / 2,
                alignItems: "center",
                justifyContent: "center",
              },
              {
                transform: [{ translateX: this.props.offsetX }],
              },
            ]}
          >
            <View
              style={{
                height: "80%",
                width: "80%",
                borderRadius: 50,
                backgroundColor: "#fff",
                borderWidth: 10,
                borderColor: "#fff",
                alignItems: "center",
                justifyContent: "center",
              }}
            ></View>
          </Animated.View>
        </PanGestureHandler>
      </View>
    )
  }
}