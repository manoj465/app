import React from 'react'
import { View, Text, Image, Dimensions } from 'react-native'
import Animated, { add, cond, eq, Extrapolate, greaterOrEq, multiply, sub, useCode } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { _appState } from '../../../redux/reducers';
import { RectButton } from 'react-native-gesture-handler';
import { deviceListOperation } from '../../../util/dataManipulator';
import { logger } from '../../../util/logger';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
    log?: logger
    Heading?: string
    ScrollY: Animated.Value<number>
    navigation: any
}

export const HEADER_MAX_HEIGHT = 250
export const HEADER_MIN_HEIGHT = 160

const { width } = Dimensions.get("window")
export const Dash_header = ({ log, Heading = "Dashboard", ScrollY, navigation }: Props) => {
    const user = useSelector((state: _appState) => state.appCTXReducer.user)
    const userIconHeight_width = ScrollY.interpolate({
        inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
        outputRange: [70, 40],
        extrapolate: Extrapolate.CLAMP
    })
    const topMenuOpacity = ScrollY.interpolate({
        inputRange: [0, 50],
        outputRange: [0.75, 0.35],
        extrapolate: Extrapolate.CLAMP
    })
    const height = ScrollY.interpolate({
        inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
        outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
        extrapolate: Extrapolate.CLAMP
    })
    const borderRadius = ScrollY.interpolate({
        inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
        outputRange: [25, 5],
        extrapolate: Extrapolate.CLAMP
    })
    const bgImageOpacity = ScrollY.interpolate({
        inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
        outputRange: [1, 0.5],
        extrapolate: Extrapolate.CLAMP
    })

    return (
        <SafeAreaView style={{
            zIndex: 10,
            width: "100%",
            position: "absolute",
            marginTop: 10,
            //backgroundColor: "white"
        }}>
            <View style={{
                width: "100%",
                backgroundColor: "white"
            }}>
                <Animated.View style={{
                    height,
                    width: ScrollY.interpolate({
                        inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
                        outputRange: [width * 0.95, width * 0.98],
                        extrapolate: Extrapolate.CLAMP
                    }),
                    alignSelf: "center",
                    borderRadius,
                    overflow: "hidden",
                    backgroundColor: "white",
                    justifyContent: "flex-end",
                    alignItems: "flex-start",
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                }}>
                    {/* ///backggroundImage >>. absoluteFill */}
                    <Animated.View
                        style={{
                            position: "absolute",
                            flex: 1,
                            height: "105%",
                            width: "100%",
                            opacity: bgImageOpacity
                        }}>
                        <Image source={require("../../../../assets/images/dashboard/wall.jpg")}
                            style={{
                                height: "100%",
                                width: "100%"
                            }} />
                    </Animated.View>
                    {/* ///top-right button row */}
                    <View style={{
                        height: 40,
                        borderRadius: 25,
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                        position: "absolute",
                        top: 10,
                        right: 10,
                        overflow: "hidden",
                    }}>
                        <Animated.View style={{
                            backgroundColor: "white",
                            flex: 1,
                            height: "100%",
                            width: "100%",
                            position: "absolute",
                            opacity: /* topMenuOpacity */0.3
                        }} ></Animated.View>
                        <RectButton style={{ padding: 10, marginLeft: 10 }}
                            onPress={() => {
                                navigation.navigate("pairing");
                            }}>
                            <Ionicons name="ios-add" size={35} color="#777" />
                        </RectButton>
                        <RectButton style={{ padding: 10, margin: 0 }}
                            onPress={() => {
                                navigation.navigate("pairing");
                            }}>
                            <AntDesign name="setting" size={24} color="#777" />
                        </RectButton>
                        <RectButton style={{ padding: 10, marginRight: 10 }}
                            onPress={() => {
                                navigation.navigate("pairing");
                            }}>
                            <Entypo name="help-with-circle" size={24} color="#777" />
                        </RectButton>

                    </View>
                    {/* /// usericon row */}
                    <View
                        style={{
                            flexDirection: "row",
                            minHeight: 40,
                            marginLeft: 10,
                            marginBottom: 10,
                            alignContent: "center",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >

                        <Animated.View style={{
                            width: userIconHeight_width,
                            height: userIconHeight_width,
                            borderRadius: 70,
                            //backgroundColor: "red",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <FontAwesome name="user-circle" size={40} color="#777" />
                        </Animated.View>
                        <Text style={{
                            fontSize: 25,
                            fontWeight: "bold",
                            color: "#777",
                            marginLeft: 10,
                        }}>
                            Hi, {user?.userName ? user.userName : "User"}
                        </Text>
                    </View>
                    {/* ///quick action */}
                    <Animated.View
                        style={{
                            height: ScrollY.interpolate({
                                inputRange: [0, 100],
                                outputRange: [60, 0],
                                extrapolate: Extrapolate.CLAMP
                            }),
                            width: "100%",
                            flexDirection: "row",
                            justifyContent: "space-evenly",
                            alignItems: "center",
                            overflow: "hidden"
                        }}>
                        <View style={{ width: "100%", height: "100%", backgroundColor: "white", opacity: 0.4, position: "absolute", top: 0, left: 0 }} />
                        <RectButton style={{ /* backgroundColor: "white",  height: 50, width: 50,*/ opacity: 1, justifyContent: "center", alignItems: "center" }}
                            onPress={async () => {
                                log?.print("ADD DUMMY DEVICE")
                                const newContainerList = await deviceListOperation({
                                    props: {
                                        cmd: "ADD_NEW_DEVICE",
                                        newDevice: {
                                            Hostname: "",
                                            deviceName: "newLight 3",
                                            IP: "192.168.4.1",
                                            Mac: "TESTMAC 3",
                                            hsv: { h: 0, s: 75, v: 100 }
                                        }
                                    },
                                })
                                log?.print("DUMMY DEVICE ADDED :: " + JSON.stringify(newContainerList))
                            }}>
                            <Ionicons name="md-timer" size={30} color="#777" />
                        </RectButton>
                        <View style={{ /* backgroundColor: "white",  height: 50, width: 50,*/ opacity: 1, justifyContent: "center", alignItems: "center" }} >
                            <Ionicons name="md-timer" size={30} color="#777" />
                        </View>
                        <View style={{ /* backgroundColor: "white",  height: 50, width: 50,*/ opacity: 1, justifyContent: "center", alignItems: "center" }} >
                            <Ionicons name="md-timer" size={30} color="#777" />
                        </View>
                        <View style={{ /* backgroundColor: "white",  height: 50, width: 50,*/ opacity: 1, justifyContent: "center", alignItems: "center" }} >
                            <MaterialCommunityIcons name="toggle-switch-off-outline" size={40} color="#f55" />
                        </View>
                    </Animated.View>
                </Animated.View>
            </View>
            {/* ///divider gradient*/}
            <View style={{
                zIndex: -1,
                height: 60,
                position: "relative",
                width: "100%",
                //top: 2
                //backgroundColor: "blue"
            }}>
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    colors={["#ffffff", "#ffffff", "#ffffff00"]}
                    style={{
                        //position: "absolute",
                        width: "100%",
                        height: 60,
                        //backgroundColor: "#ffffff",
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
                ></LinearGradient>
            </View>
        </SafeAreaView>)
}
