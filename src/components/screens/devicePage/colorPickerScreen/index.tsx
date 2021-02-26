import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { add } from 'react-native-reanimated'
import { hsv2color, max, min, useValue } from 'react-native-redash'
import { SafeAreaView } from 'react-native-safe-area-context'
import { device } from '../../../../@api/v1/cloud'
import { logger } from '../../../../@logger'
import UNIVERSALS from '../../../../@universals'
import { MainRouterStackParamList } from '../../../../routers/MainRouter'
import { DevicePageHeader } from './DevicePageHeader'
import NW4_DeviceScreens from './c4_DeviceScreens'
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
                    <Text style={[UNIVERSALS.STYLES.H2, { color: UNIVERSALS.STYLES.textColors.secondary, marginLeft: 15, marginTop: 15 }]}>Extended Controls</Text>
                    <Text style={[UNIVERSALS.STYLES.H7, { color: UNIVERSALS.STYLES.textColors.tertiary, marginLeft: 15, marginBottom: 15 }]}>Control individual device from single page</Text>
                    <NW4_DeviceScreens device={props.device} />
                </View>}

            {props.device.channel.deviceType == UNIVERSALS.GLOBALS.deviceType_e.deviceType_RGB
                && <View>
                    <RGB_deviceScreens
                        navigation={props.navigation}
                        device={props.device}
                        hue={hue}
                        saturation={saturation}
                        value={value}
                        backgroundColor={backgroundColor} />
                </View>}
        </SafeAreaView >
    )
}


