import { AntDesign, MaterialIcons } from '@expo/vector-icons'
import React from "react"
import { StyleSheet, Text, View } from "react-native"
import { ScrollView, State } from "react-native-gesture-handler"
import { add, max, min } from "react-native-reanimated"
import { hsv2color, useValue } from "react-native-redash"
import { SafeAreaView } from "react-native-safe-area-context"
import { logger } from "../../../../../@logger"
import { appOperator } from "../../../../../app.operator"
import STYLES from "../../../../../styles"
import { NewRectButtonWithChildren } from "../../../../common/buttons/RectButtonCustom"
import { Modes } from "../../../../common/Modes"
import { ColorPickerSection } from "./colorPickerSection"
import { DevicePageHeader } from "../DevicePageHeader"
import UNIVERSALS from '../../../../../@universals'
import { MainRouterStackParamList } from '../../../../../routers/MainRouter'
import { StackNavigationProp } from '@react-navigation/stack'


export enum viewTypeEnum {
    DEVICE_COLOR_PICKER_SCREEN = 0,
    DEVICE_MODES_SCREEN = 1,
    DEVICE_SETTING_SCREEN = 2,
}


interface Props {
    navigation: StackNavigationProp<MainRouterStackParamList, "devicePage">
    device: UNIVERSALS.GLOBALS.DEVICE_t
    navigateToTimer?: () => void
}
export default ({ navigation, device, ...props }: Props) => {
    const hue = useValue(0);
    const saturation = useValue(0);
    const value = useValue(1);
    const backgroundColor = hsv2color(hue, saturation, value);
    const headBackgroundColor = hsv2color(
        add(hue, 40),
        max(0.5, min(0.8, saturation)),
        value
    );
    const log = new logger("DEVICE COLOR PICKER")


    const colorSnippets = [
        { h: 0, s: 100, v: 100, hex: "#ff0000" },
        { h: 60, s: 100, v: 100, hex: "#ffff00" },
        { h: 119, s: 100, v: 100, hex: "#00ff00" },
        { h: 180, s: 100, v: 100, hex: "#00ffff" },
        { h: 240, s: 100, v: 100, hex: "#0000ff" },
        { h: 299, s: 100, v: 100, hex: "#ff00ff" },
    ]
    interface updateColorProps {
        h: number,
        s: number
    }
    const updateColor = ({ h, s }: updateColorProps) => {
        appOperator.device({
            cmd: "COLOR_UPDATE",
            deviceMac: [device.Mac],
            hsv: { h, s },
            gestureState: State.END,
            log
        })
    }

    return (
        <SafeAreaView style={[styles.container]}>

            <View style={styles.header_container} /* Sec1: devicePage header */>
                <DevicePageHeader
                    navigation={navigation}
                    device={device}
                    log={log}
                    headBackgroundColor={headBackgroundColor} />
            </View>


            <ScrollView style={{/* Sec1: color picker container scrollview */
                //backgroundColor: "green",
                height: "100%"
            }}
                showsVerticalScrollIndicator={false}>
                <View style={{/*  Sec2: Color Picker */
                    //backgroundColor: "blue",
                    marginTop: 20,
                }}>
                    <ColorPickerSection
                        hue={hue}
                        saturation={saturation}
                        value={value}
                        backgroundColor={backgroundColor}
                        device={device}
                        navigation={navigation}
                        log={log}
                    />
                    {false &&/** removed section for previos navigation icons */ <View style={{ position: "absolute", bottom: 0, right: 0, display: "flex", height: "100%", zIndex: 10, flexDirection: "column", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 10 }}>{/* Sec2: Navigator */}</View>}
                </View>

                <View /* Sec1: Modes container */
                    style={{}}>

                    <View /** /// modes headingSection container */
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingHorizontal: 20
                        }}>

                        <View /** /// headingText container */>
                            <Text
                                style={{
                                    color: "#555",
                                    fontSize: 20,
                                    fontWeight: "bold",
                                    marginTop: 10,
                                }}>Modes</Text>
                            <Text
                                style={{
                                    color: "#aaa",
                                    fontSize: 14,
                                }}>Choose from multiple modes</Text>
                        </View>

                        <View /** ///navigation icons */
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center"
                            }}>

                            {false && <NewRectButtonWithChildren /* Sec3: setting button */
                                onPress={() => {
                                    // navigation.replace("DeviceSettingScreen", { device })
                                }}>
                                <AntDesign name="setting" size={35} color="#333" />
                            </NewRectButtonWithChildren>}

                            <NewRectButtonWithChildren /* Sec3: timer button */
                                style={{}}
                                onPress={() => {
                                    props.navigateToTimer && props.navigateToTimer()
                                }}>
                                <MaterialIcons name="access-alarm" size={35} color="#333" />
                            </NewRectButtonWithChildren>
                        </View>

                    </View>

                    <View style={{ marginLeft: 10, marginTop: 10 }} /** /// modes section container */>
                        <Modes device={device} />
                    </View>

                </View>

                <View style={{/* Sec2: dividerText => colorPicker - colorSnippets */
                }}>
                    <Text style={[STYLES.H1, { textAlign: "center", marginTop: "3%" }]}>More Colors</Text>
                    <Text style={[STYLES.H7, STYLES.textFeather, { textAlign: "center", marginTop: 5, marginBottom: "5%", paddingHorizontal: "8%" }]}>
                        Color is the power which directly influences human soul. colors are the smile of nature
                with <Text style={[STYLES.H7, { color: "#555" }]}>{" "}HUElite{" "}</Text> Express your self in colors, as colors is the most beautiful language
                </Text>
                </View>

                <View style={{ /* Sec2: Color snippets container  */
                    flex: 1,
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    //backgroundColor: "blue",
                    marginBottom: "20%",
                    alignItems: "center",
                }}>
                    {colorSnippets.map((color, index) => {
                        return (
                            <NewRectButtonWithChildren
                                key={index}
                                style={[STYLES.shadow, {
                                    backgroundColor: color.hex,
                                    margin: 10,
                                    borderRadius: 30,
                                    height: 40,
                                    width: 40,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }]}
                                onPress={() => {
                                    console.log("Color is :: " + color.hex)
                                    updateColor({ h: color.h, s: color.s })
                                }}>
                            </NewRectButtonWithChildren>
                        )
                    })}
                </View>

            </ScrollView>
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        display: "flex",
        flex: 1,
        backgroundColor: "#fff",
    },
    header_container: {
        minHeight: 200,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        overflow: "hidden",
        backgroundColor: "#fff",
    },
});
