import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { useSelector } from 'react-redux'
import UNIVERSALS from '../../../@universals'
import { appState } from '../../../redux'
import { MainRouterStackParamList } from '../../../routers/MainRouter'
import RGBScreens from "./colorPickerScreen"
import TimerScreen from './timerScreen'

interface Props {
    navigation: StackNavigationProp<MainRouterStackParamList, "devicePage">
    route: RouteProp<MainRouterStackParamList, "devicePage">
}

export default ({ navigation, route: { params: { device: deviceFromProp } } }: Props) => {
    const [screen, setScreen] = useState<"colorPicker" | "timer" | "deviceSetting">("colorPicker")
    const device = useSelector<appState, UNIVERSALS.GLOBALS.DEVICE_t | undefined>(state => state.deviceReducer.deviceList.find(item => item.Mac == deviceFromProp.Mac))


    if (screen == "colorPicker" && device &&
        (device?.channel.deviceType == UNIVERSALS.GLOBALS.deviceType_e.deviceType_NW4
            || device?.channel.deviceType == UNIVERSALS.GLOBALS.deviceType_e.deviceType_RGB)
    )
        return <RGBScreens navigation={navigation} device={device} navigateToTimer={() => { setScreen("timer") }} />
    else if (screen == "timer" && device)
        return <TimerScreen navigation={navigation} device={device} navigateToColorPicker={() => { setScreen("colorPicker") }} />
    return ((() => {
        useEffect(() => {
            if (navigation.canGoBack()) {
                navigation.goBack()
            }
            else {
            }
            return () => {
            }
        }, [])
        return <View></View>
    })())
}
