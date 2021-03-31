import { MaterialIcons } from '@expo/vector-icons'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { Text, View } from 'react-native'
import { add } from 'react-native-reanimated'
import { hsv2color, max, min, useValue } from 'react-native-redash'
import { SafeAreaView } from 'react-native-safe-area-context'
import { logger } from '../../../../@logger'
import { STYLES } from "../../../../@styles"
import UNIVERSALS from '../../../../@universals'
import { MainRouterStackParamList } from '../../../../routers/MainRouter'
import { NewRectButtonWithChildren } from '../../../common/buttons/RectButtonCustom'
import NW4_DeviceScreens from './c4_DeviceScreens'
import { DevicePageHeader } from './DevicePageHeader'
import RGB_deviceScreens from "./rgbDeviceScreens"


interface Props {
    navigation: StackNavigationProp<MainRouterStackParamList, "devicePage">
    device: UNIVERSALS.GLOBALS.DEVICE_t
    navigateToTimer?: () => void
    log?: logger
}
export default (props: Props) => {

    const hue = useValue(0);
    const saturation = useValue(0);
    const value = useValue(1);
    const backgroundColor = hsv2color(hue, saturation, value);
    const headBackgroundColor = hsv2color(
        add(hue, 40),
        max(0.5, min(0.8, saturation)),
        value
    );



    return (
        <SafeAreaView
            style={{
                width: "100%",
                display: "flex",
                flex: 1,
                backgroundColor: "#fff"
            }}>
            <View
                style={{
                    minHeight: 200,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    overflow: "hidden",
                    backgroundColor: "#fff",
                }} /* Sec1: devicePage header */>
                <DevicePageHeader
                    navigation={props.navigation}
                    device={props.device}
                    //log={props.log}
                    headBackgroundColor={headBackgroundColor} />
            </View>
            { props.device.channel.deviceType == UNIVERSALS.GLOBALS.deviceType_e.deviceType_NW4
                && <View style={{ flex: 1, /* backgroundColor: "red" */ }}>
                    <View style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingHorizontal: 15
                    }}>
                        <View>
                            <Text style={[STYLES.H2, { color: STYLES.textColors.secondary, marginTop: 10 }]}>Extended Controls</Text>
                            <Text style={[STYLES.H7, { color: STYLES.textColors.tertiary, marginBottom: 10 }]}>Control individual device from single page</Text>
                        </View>
                        <NewRectButtonWithChildren /* Sec3: timer button */
                            style={{}}
                            onPress={() => {
                                if (props.navigateToTimer) {
                                    console.log("go to timer")
                                    props.navigateToTimer()
                                }
                                else {
                                    console.log("cannot go to timer")

                                }
                            }}>
                            <MaterialIcons name="access-alarm" size={35} color="#333" />
                        </NewRectButtonWithChildren>
                    </View>
                    <NW4_DeviceScreens
                        device={props.device}
                        navigateToTimer={props.navigateToTimer} />
                </View>}

            {props.device.channel.deviceType == UNIVERSALS.GLOBALS.deviceType_e.deviceType_RGB
                && <View>
                    <RGB_deviceScreens
                        navigation={props.navigation}
                        device={props.device}
                        hue={hue}
                        saturation={saturation}
                        value={value}
                        backgroundColor={backgroundColor}
                        navigateToTimer={props.navigateToTimer} />
                </View>}
        </SafeAreaView >
    )
}


