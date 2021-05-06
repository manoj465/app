import React, { useEffect, useState } from "react";
import { Dimensions, FlatList, Text, Vibration, View, TextInput, StyleProp, ViewStyle, KeyboardAvoidingView, Platform } from "react-native";
import Animated, { add, call, divide, interpolate, round, useCode } from "react-native-reanimated";
import { onScrollEvent, useValue } from "react-native-redash";
import { logger } from "../../../../@logger";
import useScanApiHook from "../../../../services/webApi/webHooks";
import { NewRectButtonWithChildren } from "../../../common/buttons/RectButtonCustom";
import { PairingFrame } from "."
import LottieView from "lottie-react-native";
import { useTimingTransition } from "react-native-redash";
import { MaterialIcons } from '@expo/vector-icons';
import usePairApiHook, { pairing_state_e } from "../../../../services/webApi/pairAPI_Hook";
import { ScanApiReturnType } from "../../../../@api/v1/device/scan.api";
import { NOTIFY } from "../../../common/notificationComp";
import { appOperator } from "../../../../app.operator";
import { getCurrentTimeStampInSeconds } from "../../../../util/DateTimeUtil";
import UNIVERSALS from "../../../../@universals";


const deviceNames = [
    "Bedroom Light",
    "Kitchen",
    "Garden Light",
    "Balcony",
    "SwimmingPool",
]

interface Props {
    navigation: any;
    setStep: React.Dispatch<React.SetStateAction<0 | 1 | 2>>
    show: boolean
    newDevice: UNIVERSALS.GLOBALS.DEVICE_t | undefined
    setNewDevice: React.Dispatch<React.SetStateAction<UNIVERSALS.GLOBALS.DEVICE_t | undefined>>
}

const { width, height } = Dimensions.get("window")



export default ({
    navigation,
    setStep,
    show,
    ...props
}: Props) => {
    const log = new logger("PAIRING_SCREEN_2");
    const [frame2steps, setFrame2steps] = useState<0 | 1 | 2>(0)
    const [Wifi, setWifi] = useState<undefined | String>("--HUE--")
    const [pass, setPass] = useState("")
    const [pairingCanceled, setPairingCanceled] = useState(false)
    const [dataScan, status, loading, error, load] = useScanApiHook({
        autoStart: false,
        log: new logger("--scan")
    })




    return (
        <PairingFrame
            cardSectionStyle={{
                justifyContent: "space-evenly",
            }}
            header={() => {
                return (

                    <View style={{
                        alignItems: "center",
                        backgroundColor: "#fff",
                    }}  >
                        <Text style={{ color: "#555", fontSize: 25, textAlign: "center", fontWeight: "bold", marginTop: 25 }}>Select Home Network</Text>
                        <Text
                            style={{
                                fontSize: 14,
                                color: "#555",
                                paddingTop: 10,
                                paddingHorizontal: 30,
                                textAlign: "center",
                            }}>Make sure the WiFi is on and your device is in range of the network. Turn off your mobile data</Text>
                        {/* Sec: Wifi refresh button */}
                        <NewRectButtonWithChildren
                            style={{
                                borderRadius: 15,
                                overflow: "hidden",
                                marginVertical: 15,
                            }}
                            onPress={() => {
                                if (frame2steps == 0) {
                                    log.print("refresh wifi scan api response")
                                    setWifi(undefined)
                                    load()
                                    Vibration.vibrate(50);
                                }
                            }}>
                            <View style={{
                                backgroundColor: "#fff",
                                paddingVertical: 5,
                                paddingHorizontal: 8,
                                borderRadius: 15,
                                borderColor: "#55f",
                                borderWidth: 1,
                            }} >
                                <Text style={{ fontSize: 10, fontWeight: "bold", color: "#55f" }}>{
                                    frame2steps == 0
                                        ? "Refresh WiFi Scan"
                                        : "Selected Network : " + Wifi
                                }</Text>
                            </View>
                        </NewRectButtonWithChildren>
                    </View>

                )
            }}>


            {/* removed Sec HeaderContainer */}
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
                    }}
                    placeholder="Light 1"
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
                                    marginHorizontal: 5
                                }}>
                                <Text
                                    style={{
                                        fontSize: 12,
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


            {/* Sec: SSID Selector */}
            {show && <PairingContainer
                frame2steps={frame2steps}
                setFrame2steps={setFrame2steps}
                Wifi={Wifi}
                setWifi={setWifi}
                pass={pass}
                setPass={setPass}
                load={load}
                dataScan={dataScan}
                loading={loading}
                pairingCanceled={pairingCanceled}
                setPairingCanceled={setPairingCanceled}
                navigation={navigation}
                newDevice={props.newDevice}
                setNewDevice={props.setNewDevice}
            />}

        </PairingFrame>
    )
}


const PairingContainer = (props: {
    children?: any,
    style?: StyleProp<ViewStyle>
    frame2steps: 0 | 1 | 2
    setFrame2steps: React.Dispatch<React.SetStateAction<0 | 1 | 2>>
    Wifi: String | undefined
    setWifi: React.Dispatch<React.SetStateAction<String | undefined>>
    loading: boolean
    dataScan: any
    load: () => Promise<void>
    pass: string
    setPass: React.Dispatch<React.SetStateAction<string>>
    pairingCanceled: boolean
    setPairingCanceled: React.Dispatch<React.SetStateAction<boolean>>
    navigation: any
    newDevice: UNIVERSALS.GLOBALS.DEVICE_t | undefined
    setNewDevice: React.Dispatch<React.SetStateAction<UNIVERSALS.GLOBALS.DEVICE_t | undefined>>
}) => {
    const transition = useTimingTransition(props.frame2steps)
    const [data, socket, pair, pairStatus, hitSaveAPI] = usePairApiHook({
        IP: "192.168.4.1",
        _onMsg: (msg) => {
            //console.log("socket msg on Pairing Screen---- " + JSON.stringify(msg));
        },
        log: new logger("pairing hook")
    })

    useEffect(() => {
        if (pairStatus == pairing_state_e.PAIR_WRONG_PASSWORD) {
            NOTIFY({
                topic: "PAIRING",
                title: "Incorrect Password",
                type: "ALERT"
            })
        } else if (pairStatus == pairing_state_e.PAIR_SUCCESS) {
            NOTIFY({
                topic: "PAIRING",
                title: "Device successfully paired",
                type: "SUCCESS"
            })
        } else if (pairStatus == pairing_state_e.SAVE_CONFIG_SUCCESS && data?.RES?.IP && props.Wifi && props.newDevice) {
            let _newDevice = props.newDevice
            _newDevice.ssid = props.Wifi
            _newDevice.IP = data.RES.IP
            // - [ ] clear all `PAIRING` notifications from redux store
            // BUG pairing notifications which were not finished in previous session are shown on new sessio entry
            appOperator.device({
                cmd: "ADD_UPDATE_DEVICES", newDevices: [_newDevice]
            })
            props.navigation.replace("setupDevice", { device: _newDevice })
        } else if (pairStatus == pairing_state_e.SAVE_CONFIG_ERROR) {
            NOTIFY({
                topic: "PAIRING",
                title: "Network Error !",
                subTitle: "Kindly make sure your are connected device via Wifi throught pairing process, and retry",
                type: "ALERT"
            })
        }
        return () => {

        }
    }, [pairStatus])


    return (
        <View
            style={[{
                flex: 1,
                flexGrow: 1,
                display: "flex",
                //marginTop: 300,
                justifyContent: "space-between"
            }, props.style]}>
            {(props.frame2steps != 2 || props.pairingCanceled)
                ? <Animated.View /* ssidSelector & password field */
                    style={{
                        flex: 1,
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "row",
                        width: width * 2,
                        marginLeft: interpolate(transition, {
                            inputRange: [0, 1],
                            outputRange: [0, -width],
                        }),
                    }}>
                    <WiFiSelector Wifi={props.Wifi} setWifi={props.setWifi} data={props.dataScan} loading={props.loading} load={props.load} />
                    <WiFiPasswordView pass={props.pass} setPass={props.setPass} />
                </Animated.View>
                : props.frame2steps == 2 /* pairing View */
                    ?
                    <PairingView pair={pair} pairStatus={pairStatus} ssid={props.Wifi} pass={props.pass} />
                    : null
            }


            {/* Sec: Bottom buttons */}
            <View
                style={{
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                {/* Enter password button */}
                <NewRectButtonWithChildren
                    onPress={() => {
                        if (props.frame2steps == 0) {
                            if (props.Wifi)
                                props.setFrame2steps(1)
                            else {
                                console.log("no wifi selected")
                                if (props.loading) {
                                    console.log("kindly wait for scanning")
                                    NOTIFY({
                                        topic: "PAIRING",
                                        title: "Wait till scan completes",
                                        type: "ALERT"
                                    })
                                }
                            }
                        } else if (props.frame2steps == 1) {
                            console.log("request to start pairing")
                            if (props.Wifi && props.pass && props.pass.length >= 8) {
                                props.setPairingCanceled(false)
                                props.setFrame2steps(2)
                                pair(props.Wifi, props.pass)
                            } else if (!props.pass || props.pass.length < 8) {
                                NOTIFY({
                                    topic: "PAIRING",
                                    title: "Password must be atleast 8 char long.",
                                    subTitle: "if your network is open, then we recommend to configure your wifi router with password prior pairing process",
                                    type: "ALERT"
                                })
                            }
                        } else if (props.frame2steps == 2) {
                            if (pairStatus == pairing_state_e.PAIR_SUCCESS) {
                                console.log("setupdevice now.............")
                                hitSaveAPI()
                            } else if (pairStatus == pairing_state_e.PAIR_WRONG_PASSWORD) {
                                props.setPass("")
                                console.log("cancelling pairing process in-between")
                                props.setPairingCanceled(true)
                                props.setFrame2steps(0)
                            } else if (pairStatus == pairing_state_e.SAVE_CONFIG_ERROR) {
                                if (props.Wifi && props.pass && props.pass.length >= 8)
                                    pair(props.Wifi, props.pass)
                                else {
                                    NOTIFY({
                                        topic: "PAIRING",
                                        title: "Kindly, re-enter Wifi & Password",
                                        type: "ALERT"
                                    })
                                    props.setPairingCanceled(true)
                                    props.setFrame2steps(0)
                                }
                            } else {
                                console.log("cancelling pairing process in-between")
                                props.setPairingCanceled(true)
                                props.setFrame2steps(0)
                            }
                        }
                    }}
                    style={{
                        opacity: 1,
                        backgroundColor: "#55f",
                        height: 50,
                        width: width * 0.8,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 25,
                    }}>
                    <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}>{
                        props.frame2steps == 0
                            ? props.Wifi
                                ? "Next"
                                : "Scanning"
                            : props.frame2steps == 1
                                ? "Pair"
                                : props.frame2steps == 2
                                    ? pairStatus == pairing_state_e.PAIR_SUCCESS
                                        ? "Setup Device"
                                        : pairStatus == pairing_state_e.PAIR_WRONG_PASSWORD
                                            ? "Re-enter password"
                                            : pairStatus == pairing_state_e.SAVE_CONFIG_ERROR
                                                ? "Retry"
                                                : "cancel"
                                    : ""
                    }
                    </Text>
                </NewRectButtonWithChildren>
                {/* skip wifi pairing button*/}
                <NewRectButtonWithChildren
                    style={{
                        marginBottom: 10,
                        backgroundColor: "#fff",
                        paddingVertical: 10,
                        width: width * 0.8,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 25,
                    }}
                    onPress={() => {
                        if (props.frame2steps == 0) {
                            /// -[ ] continue without pairing
                        } else if (props.frame2steps == 1) {
                            props.setFrame2steps(0)
                        }
                        else if (props.frame2steps == 2) {
                            if (pairStatus == pairing_state_e.PAIR_SUCCESS) {
                                props.setPairingCanceled(true)
                                props.setPass("")
                                props.setFrame2steps(0)
                            }
                        }
                    }}>
                    <Text style={{ fontSize: 12, fontWeight: "bold", color: "#555" }}>{
                        props.frame2steps == 0
                            ? "Continue without Wi-Fi Pairing"
                            : props.frame2steps == 1
                                ? "go back, to change selected Network"
                                : props.frame2steps == 2
                                    ? pairStatus == pairing_state_e.PAIR_SUCCESS
                                        ? "go back, to change network"
                                        : ""
                                    : ""
                    }</Text>
                </NewRectButtonWithChildren>
            </View>
        </View>
    )
}



const WiFiSelector = ({ Wifi, setWifi, loading, data, load }: {
    Wifi: String | undefined,
    setWifi: React.Dispatch<React.SetStateAction<String | undefined>>,
    loading: boolean,
    data: any,
    load: () => Promise<void>
}) => {
    const y = useValue(0);
    const onScroll = onScrollEvent({ y })
    const selected = round(divide(y, 60))


    useEffect(() => {
        if (!data && !loading)
            load()
        return () => {
        }
    }, [data])


    useCode(
        () => [
            call([selected], ([selected]) => {
                if (data?.RES?.networks && data?.RES?.networks[selected] && !loading) {
                    if (Wifi != data?.RES?.networks[selected].ssid) {
                        console.log("-- " + data?.RES?.networks[selected].ssid);
                        setWifi(data?.RES?.networks[selected].ssid);
                    }
                }
            }),
        ],
        [selected]
    )


    return (
        <View //WiFi Selector Container
            style={{
                flex: 1,
                flexGrow: 1,
                //backgroundColor: "green",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                overflow: "hidden"
            }}>
            {data?.RES?.networks != undefined
                ? <View //wifi scrollView Container
                    style={{
                        width: "100%",
                        height: 180,
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        //backgroundColor: "red",
                    }} >

                    <View //absolute highlight View
                        style={{
                            flex: 1,
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            //backgroundColor: "red",
                            width: width - 30,
                            justifyContent: "center"
                        }}>
                        <View style={{
                            backgroundColor: "#ccc",
                            height: 60
                        }}></View>
                    </View>

                    {(data?.RES?.networks?.length > 0) &&
                        <Animated.ScrollView
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
                                data?.RES?.networks.map((item: any, index: number) => {
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
                                                        fontSize: 12,
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
                : <View //While Scanner View
                    style={{
                        width: width - 30,//subtracted container margin
                        flex: 1,
                        flexGrow: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        //backgroundColor: "red",
                        display: "flex",
                        flexDirection: "column"
                    }}>
                    <Text style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "#333",
                        textAlign: "center",
                        position: "absolute",
                        top: 10,
                    }}>SCANNING...</Text>
                    <LottieView
                        ref={(animation) => {
                            //_animation = animation;
                        }}
                        style={{
                            width: width - 30, //removed horizontal margin of the container
                        }}
                        source={require("../../../../../assets/lottie/wifi_search_lottie.json")}
                        autoPlay
                        loop={true}
                    //progress={progress}
                    />
                </View>}
        </View>
    )
}


const WiFiPasswordView = (props: { pass: string, setPass: React.Dispatch<React.SetStateAction<string>> }) => {
    const [securePass, setSecurePass] = useState(true)


    return (
        <View
            style={{
                //backgroundColor: "#777",
                flex: 1,
            }}>
            <View
                style={{
                    //backgroundColor: "#777",
                    flex: 1,
                    marginHorizontal: 15, // to match the base container margin
                    justifyContent: "center",
                    paddingHorizontal: 10
                }}>
                <Text style={{ fontSize: 18, color: "#555", fontWeight: "bold" }}>Enter Wifi password</Text>
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        height: 60,
                        //backgroundColor: "red",
                        borderBottomWidth: 1,
                        borderColor: "#555",
                    }}>
                    <TextInput
                        style={{
                            height: 60,
                            fontSize: 20,
                            color: "#555",
                            fontWeight: "bold",
                            flex: 1,
                            flexGrow: 1,
                        }}
                        onChangeText={(text) => {
                            props.setPass(text)
                        }}
                        secureTextEntry={securePass}
                        textContentType="password"
                        placeholder={""}
                        value={props.pass}
                    />
                    <NewRectButtonWithChildren
                        onPress={() => {
                            setSecurePass(!securePass)
                        }}
                        style={{
                            //backgroundColor: "red",
                            marginTop: 0,
                        }}
                        innerCompStyle={{
                            //backgroundColor: "green",
                            width: 60,
                            height: 60,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                        <MaterialIcons name={securePass ? "visibility" : "visibility-off"} size={24} color="#55f" />
                    </NewRectButtonWithChildren>
                </View>
            </View>
        </View>
    )
}

interface PairingView_props {
    ssid?: String,
    pass: String,
    pairStatus: pairing_state_e,
    pair: (ssid: String, pass: String) => Promise<void>
}
const PairingView = ({ ssid, pass, pair, pairStatus }: PairingView_props) => {


    useEffect(() => {
        console.log("Pairing Begin... curr pairStatus" + pairStatus)
    }, [pairStatus])



    return (
        <View
            style={{
                flex: 1,
                flexGrow: 1,
                justifyContent: "center",
                alignItems: "center",
                //backgroundColor: "blue",
            }}>
            {(pairStatus == pairing_state_e.PAIR_REQUEST_SUCCESS_N_CONNECTING || pairStatus == pairing_state_e.PAIR_READY)
                ? <LottieView
                    ref={(animation) => {
                        //_animation = animation;
                    }}
                    style={{
                        width: width - 30, //removed horizontal margin of the container
                    }}
                    source={require("../../../../../assets/lottie/connecting.json")}
                    autoPlay
                    loop={true}
                //progress={progress}
                />
                : pairStatus == pairing_state_e.PAIR_SUCCESS
                    ? <LottieView
                        ref={(animation) => {
                            //_animation = animation;
                        }}
                        style={{
                            width: width - 30, //removed horizontal margin of the container
                        }}
                        source={require("../../../../../assets/lottie/success.json")}
                        autoPlay
                        loop={false}
                    //progress={progress}
                    />
                    : (pairStatus == pairing_state_e.PAIR_WRONG_PASSWORD || pairStatus == pairing_state_e.PAIR_UNKNOWN_ERROR || pairStatus == pairing_state_e.PAIR_NO_SSID)
                        ? <LottieView
                            ref={(animation) => {
                                //_animation = animation;
                            }}
                            style={{
                                width: width - 30, //removed horizontal margin of the container
                            }}
                            source={require("../../../../../assets/lottie/error.json")}
                            autoPlay
                            loop={true}
                        //progress={progress}
                        />
                        : <Text>...</Text>}
        </View>
    )
}