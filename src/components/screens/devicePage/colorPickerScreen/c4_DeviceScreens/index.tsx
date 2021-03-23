import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { PanGestureHandler, State } from 'react-native-gesture-handler'
import Animated, { add, block, cond, eq, event, set, useCode, call, greaterThan, sub, lessThan } from 'react-native-reanimated'
import { useValue } from 'react-native-redash'
import UNIVERSALS from '../../../../../@universals'
import { appOperator } from '../../../../../app.operator'
import { getTimeDiffNowInMs } from '../../../../../util/DateTimeUtil'
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { STYLES } from "../../../../../@styles"

interface Props {
    device: UNIVERSALS.GLOBALS.DEVICE_t
}
export default (props: Props) => {


    return (
        <View style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "space-around" }}>
            {props.device.channel.deviceType == UNIVERSALS.GLOBALS.deviceType_e.deviceType_NW4 && props.device.channel.outputChannnel.map((channel, index) => {
                const _state = useValue((channel.v / 100) * 190)
                const pinState = useValue(State.UNDETERMINED)
                const [height, setHeight] = useState(0)
                let timestamp = Date.now()

                const gestureHandler = event(
                    [{
                        nativeEvent: ({ y: Y, state: temp1state, translationY }: any) =>
                            block([
                                set(pinState, temp1state),
                                cond(
                                    greaterThan(translationY, 0),
                                    cond(greaterThan(_state, 0), set(_state, sub(_state, 2))),
                                    cond(lessThan(_state, 190), set(_state, add(_state, 2))),
                                ),
                            ]),
                    }],
                    { useNativeDriver: true }
                )


                useCode(
                    () => [
                        call([_state], ([_state]) => {
                            if (getTimeDiffNowInMs(timestamp) > 200) {
                                let brPercentage = Math.round((_state / 190) * 100)
                                //console.log("state------------------------------------------" + brPercentage)
                                timestamp = Date.now();
                                appOperator.device({
                                    cmd: "COLOR_UPDATE",
                                    deviceMac: [props.device.Mac],
                                    channelBrightnessObject: {
                                        value: brPercentage,
                                        activeChannel: (() => {
                                            //@ts-ignore
                                            return props.device.channel.outputChannnel.map((temp__channel__: any, temp__index__: number) => {
                                                if (temp__index__ == index) {
                                                    return true
                                                }
                                                return false
                                            })
                                        })()
                                    },
                                    gestureState: 0,
                                    onActionComplete: ({ newDeviceList }) => {
                                        appOperator.device({
                                            cmd: "ADD_UPDATE_DEVICES",
                                            newDevices: newDeviceList,
                                            //log: new logger("debug", undefined)
                                        })
                                    },
                                    //log
                                })
                            } else {
                                //console.log("_----------cannot send due to time gap error------------_")
                            }
                        }),
                    ],
                    [_state]
                )

                return (<View
                    key={"_" + index}
                    style={[
                        STYLES.shadow, {
                            width: "40%",
                            height: 200,
                            backgroundColor: "#ffffffee",
                            margin: 10,
                            borderRadius: 10,
                            flexDirection: "row",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            paddingRight: 10,
                            overflow: "hidden"
                        }]}>
                    <View style={{
                        flex: 1,
                        //backgroundColor: "green",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end"
                    }}>
                        <View style={[STYLES.shadow, {
                            width: 50,
                            height: 50,
                            backgroundColor: "white",
                            borderRadius: 50,
                            marginLeft: 10,
                            marginBottom: 10,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }]}>
                            <MaterialCommunityIcons name={props.device.channel.state == UNIVERSALS.GLOBALS.channelState_e.CH_STATE_OFF ? "lightbulb-off" : "lightbulb-on-outline"} size={24} color="black" />
                        </View>
                        <Text style={[STYLES.H6, { color: STYLES.textColors.secondary, marginBottom: 10 }]}>{props.device.deviceName + "-" + (index + 1)}</Text>
                    </View>
                    <View
                        style={[STYLES.shadow, {
                            backgroundColor: "#eee",
                            height: "90%",
                            width: "40%",
                            borderRadius: 10,
                            overflow: "hidden"
                        }]}>
                        <PanGestureHandler
                            onGestureEvent={gestureHandler}
                            onHandlerStateChange={gestureHandler}>
                            <Animated.View /** vertical brightness bar */
                                style={{
                                    //backgroundColor: "#0000ff66",
                                    height: "100%",
                                    width: "100%",
                                    zIndex: 2
                                }}>
                            </Animated.View>
                        </PanGestureHandler>
                        <View
                            onLayout={(event) => {
                                var { height } = event.nativeEvent.layout;
                                setHeight(height);
                            }}
                            style={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                backgroundColor: "transparent"
                            }}>
                            <Animated.View
                                style={{
                                    position: "absolute",
                                    bottom: 0,
                                    left: 0,
                                    width: "100%",
                                    height: _state,
                                    backgroundColor: "white"
                                }}>
                            </Animated.View>
                        </View>
                    </View>
                </View>)
            })}
        </View>
    )
}
