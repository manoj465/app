import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { Dimensions, FlatList, StyleSheet, Text, Vibration, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Animated, { add, call, divide, interpolate, round, useCode } from "react-native-reanimated";
import { onScrollEvent, useValue } from "react-native-redash";
import { SafeAreaView } from "react-native-safe-area-context";
import { PairingStackParamList } from "..";
import { logger } from "../../../../@logger";
import UNIVERSALS from "../../../../@universals";
import { appOperator } from "../../../../app.operator";
import reduxStore from "../../../../redux";
import useScanApiHook from "../../../../services/webApi/webHooks";
import { getCurrentTimeStampInSeconds } from "../../../../util/DateTimeUtil";
import Alert from "../../../common/Alert";
import { NewRectButtonWithChildren } from "../../../common/buttons/RectButtonCustom";

const deviceNames = [
    "Bedroom Light",
    "Kitchen",
    "Garden Light",
    "Balcony",
    "SwimmingPool",
]

interface Props {
    navigation: any;
    newDevice: any //UNIVERSALS.GLOBALS.DEVICE_t
}

const { width, height } = Dimensions.get("window")



export default ({
    navigation,
    newDevice,
}: Props) => {
    const log = new logger("PAIRING_SCREEN_2");
    const [data, status, loading, error, load] = useScanApiHook({
        log: log ? new logger("scan API Hook", log) : undefined,
        autoStart: true
    });
    const debug = true;
    const [Wifi, setWifi] = useState("");
    const [deviceName, setDeviceName] = useState("");
    const y = useValue(0);
    const onScroll = onScrollEvent({ y })
    const selected = round(divide(y, 60))



    useCode(
        () => [
            call([selected], ([selected]) => {
                if (data?.RES?.networks && data?.RES?.networks[selected]) {
                    if (Wifi != data?.RES?.networks[selected].ssid) {
                        log.print("-- " + data?.RES?.networks[selected].ssid);
                        setWifi(data?.RES?.networks[selected].ssid);
                    }
                }
            }),
        ],
        [selected]
    );



    return (
        <View
            style={{
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#fff",
                flex: 1
            }}>


            {/* Sec: HeaderContainer */}
            {false && <View style={{
                paddingHorizontal: 15,
                backgroundColor: "#55f",
                width: "95%",
                minHeight: 200,
                marginVertical: 20,
                borderRadius: 25,
                paddingVertical: 20,
            }} >
                <Text style={{ fontSize: 12, fontWeight: "bold", color: "white" }}>
                    Enter Device Name
          </Text>
                <TextInput
                    style={{
                        height: 50,
                        width: "100%",
                        borderColor: "#ffffff",
                        color: "#ffffff",
                        /*  borderWidth: 1,
                        borderRadius: 25, */
                        fontSize: 18,
                        fontWeight: "bold",
                        textAlign: "left",
                        alignSelf: "center",
                        marginTop: 5,
                        borderBottomWidth: 0.5,
                    }}
                    placeholderTextColor="#ccc"
                    onChangeText={(text) => {
                        setDeviceName(text);
                    }}
                    placeholder="Light 1"
                    value={deviceName}
                />
                <View
                    style={{
                        alignItems: "flex-start",
                        marginTop: 30,
                    }}
                >
                    <FlatList
                        data={deviceNames}
                        numColumns={3}
                        renderItem={({ item }) => (
                            <NewRectButtonWithChildren
                                onPress={() => {
                                    setDeviceName(item);
                                    //Vibration.vibrate(50); //TODO move this to useCode/call function for better feedback
                                }}
                                style={{
                                    alignSelf: "flex-start",
                                    height: 25,
                                    borderWidth: 0.5,
                                    borderColor: "#fff",
                                    borderRadius: 18,
                                    paddingHorizontal: 10,
                                    paddingVertical: 5,
                                    backgroundColor: deviceName == item ? "#fff" : "#55f",
                                    marginHorizontal: 5
                                }}>
                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: deviceName == item ? "#55f" : "#fff",
                                    }}
                                >
                                    {item}
                                </Text>
                            </NewRectButtonWithChildren>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            </View>}


            {/* Sec: Text section */}
            <View style={{
                alignItems: "center",
                backgroundColor: "#fff",
                paddingTop: 20,
            }}  >
                <Text
                    style={{
                        fontSize: 12,
                        color: "#555",
                        paddingTop: 10,
                        paddingHorizontal: 30,
                        textAlign: "center",
                    }}>
                    Make sure the WiFi is on and your device is in range of the network. Turn off your mobile data
          </Text>
                {/* Sec: Wifi refresh button */}
                <NewRectButtonWithChildren
                    style={{
                        borderRadius: 15,
                        overflow: "hidden",
                        marginVertical: 15,
                    }}
                    onPress={() => {
                        log.print("refresh wifi scan api response")
                        load()
                        Vibration.vibrate(50);
                    }}>
                    <View style={{
                        backgroundColor: "#fff",
                        paddingVertical: 5,
                        paddingHorizontal: 8,
                        borderRadius: 15,
                        borderColor: "#55f",
                        borderWidth: 1,
                    }} >
                        <Text style={{ fontSize: 10, fontWeight: "bold", color: "#55f" }}>
                            Refresh WiFi Scan
              </Text>
                    </View>
                </NewRectButtonWithChildren>
            </View>


            {/* Sec: SSID Selector */}
            <View style={{
                width: "100%",
                height: 180,
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
            }} >
                {(data?.RES?.networks && data?.RES?.networks?.length > 0) && <Animated.ScrollView
                    style={{
                        overflow: "hidden",
                    }}
                    snapToInterval={60}
                    decelerationRate="fast"
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    scrollEventThrottle={1}
                    {...{ onScroll }}>
                    {
                        data?.RES?.networks.map((item, index) => {
                            const positionY = add(y, -index * 60);
                            const opacity = interpolate(positionY, {
                                inputRange: [-60, 0, 60],
                                outputRange: [0.8, 1, 0.8],
                            });
                            const scale = interpolate(positionY, {
                                inputRange: [-60, 0, 60],
                                outputRange: [0.8, 1, 0.8],
                            });

                            return (
                                <View key={index}>
                                    {index == 0 && <View style={{
                                        height: 60,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                color: "#555",
                                                fontWeight: "bold",
                                            }}
                                        >Scroll to select</Text>
                                    </View>}
                                    <View
                                        style={{
                                            height: 60,
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Animated.Text
                                            style={{
                                                fontSize: 20,
                                                color: "#555",
                                                fontWeight: "bold",
                                                opacity: opacity,
                                                transform: [{ scaleX: scale }, { scaleY: scale }],
                                            }}
                                        >
                                            {item.ssid}
                                        </Animated.Text>
                                    </View>
                                    {(data?.RES?.networks && index == data?.RES?.networks?.length - 1) && (
                                        <View style={{ height: 60 }}></View>
                                    )}
                                </View>
                            );
                        })
                    }
                </Animated.ScrollView>
                }
            </View>


            {/* Sec: divider */}
            <View style={{
                height: 30
            }}></View>

            {/* Sec: Bottom buttons */}
            <View>
                <NewRectButtonWithChildren
                    style={{
                        opacity: deviceName.length > 6 ? 1 : 0.9,
                        backgroundColor: "#55f",
                        height: 50,
                        width: width * 0.8,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 25,
                    }}
                //onPress={() => onInteraction({ opID: "PAIR" })}
                >
                    <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}>
                        Pair Device
          </Text>
                </NewRectButtonWithChildren>
                <NewRectButtonWithChildren
                    style={{
                        marginBottom: 10,
                        marginTop: 10,
                        backgroundColor: "#fff",
                        paddingVertical: 10,
                        width: width * 0.8,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 25,
                    }}
                //onPress={() => onInteraction({ opID: "SKIP" })}
                >
                    <Text style={{ fontSize: 12, fontWeight: "bold", color: "#555" }}>
                        Continue without Wi-Fi Pairing
          </Text>
                </NewRectButtonWithChildren>
            </View>
        </View >
    );
};
