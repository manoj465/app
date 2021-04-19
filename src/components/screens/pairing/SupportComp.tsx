import React, { useState } from "react"
import { Dimensions, Text, View } from "react-native"
import { State } from "react-native-gesture-handler"
import Animated, { block, call, event, interpolate, set, useCode } from "react-native-reanimated"
import { useTimingTransition, useValue } from "react-native-redash"
import { NewRectButtonWithChildren } from "../../common/buttons/RectButtonCustom"



const { width, height } = Dimensions.get("window")
export default () => {
    const state = useValue<State>(State.UNDETERMINED);
    const hex = useValue("#ff0000");
    const [open, setOpen] = useState(false)
    const transition = useTimingTransition(open)
    const supportHeight = interpolate(transition, {
        inputRange: [0, 1],
        outputRange: [60, height * 0.6],
    })


    const gestureHandler = event(
        [
            {
                nativeEvent: ({ x: transX, y: transY, state: _state }: any) =>
                    block([
                        set(state, _state)
                    ]),
            },
        ],
        { useNativeDriver: true }
    )

    useCode(
        () => [
            call(
                [],
                ([state]) => {
                    if (state == State.ACTIVE) {
                        set(hex, "#00ff00")
                    }
                }
            ),
        ],
        [state]
    );


    return (
        <Animated.View
            style={{
                height: supportHeight,
                position: "absolute",
                bottom: 0,
                width: "100%",
                //justifyContent: "flex-end",
                paddingVertical: open ? 10 : 0,
                paddingHorizontal: 10,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                overflow: "hidden"
            }}>

            <View style={{
                backgroundColor: open ? "#eeeeee" : "#777777",
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                overflow: "hidden",
            }}>



                {open && <View /** background Image container */
                    style={{
                        display: "flex",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        flex: 1,
                        width: "100%",
                        height: "100%",
                        //backgroundColor: "red",
                        zIndex: 1
                    }}></View>}

                {open && <View /** header lines */
                    style={{
                        backgroundColor: "#777777",
                        height: 5,
                        position: "absolute",
                        width: "100%",
                        top: 0,
                        left: 0,
                    }}></View>}

                <Animated.ScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={true}
                    style={{
                        zIndex: 2,
                        marginTop: open ? 15 : 0
                    }}
                    contentContainerStyle={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                    {open && <View>
                        {/* <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 18 }}>Troubleshoot</Text> */}

                        <Text style={{ fontWeight: "bold", marginHorizontal: 15, fontSize: 35 }}>No device found?</Text>
                        <Text style={{ fontWeight: "bold", marginHorizontal: 15, fontSize: 10 }}>Huelite device doesn't appear in the avaliable Wi-Fi network list?.Huelite device doesn't appear in the avaliable Wi-Fi network list?</Text>

                        <Text style={{ marginTop: 10, marginHorizontal: 15, fontSize: 20 }}>{'\u2022  '}Make sure the Huelite device is installed within your home network range. (While pairing, your smartphone is required to be within 5 meter radius of huelite device providing no direct obstruction)</Text>
                        <Text style={{ marginTop: 10, marginHorizontal: 15, fontSize: 20 }}>{'\u2022  '}If the device Wi-Fi doesn't appear in the Wi-Fi settings kindly factory reset the device.</Text>





                        <Text style={{ marginTop: 20, fontWeight: "bold" }}>FAQ: How to reset HUElite device?</Text>
                        <Text style={{ marginTop: 10 }}>{'\u2022  '}Set the device in ON state, then toggle the device power ON and OFF (in an interval of 3-5 seconds) repeatdly for 5 times. leave the device in ON state afterwords and wait until your device restarts (usually within 10 seconds)</Text>
                        <Text style={{ marginTop: 10, color: "red" }}>{'\u2022  '}In case your device is paired with your app then you can also reset the device from device menu options</Text>

                        <Text style={{ textAlign: "center", fontWeight: "bold", marginTop: 50 }}>Require further Assistance? Visit us at</Text>
                        <Text style={{ textAlign: "center", marginTop: 0 }}>www.huelite.in/support</Text>
                    </View>}

                    <NewRectButtonWithChildren
                        style={{
                            backgroundColor: "#ffffff00",
                            zIndex: 3,
                            maxWidth: open ? 300 : "100%",
                            marginHorizontal: open ? "15%" : 0,
                            minHeight: 50,
                        }}
                        innerCompStyle={{
                            backgroundColor: open ? "#777777" : "#ffffff00",
                            minWidth: 200
                        }}
                        onPress={() => {
                            setOpen(!open)
                        }}>
                        <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "bold" }}>
                            {open ? "Go back" : "Need Support?"}
                        </Text>
                    </NewRectButtonWithChildren>

                </Animated.ScrollView>


            </View>
        </Animated.View >
    )
}
