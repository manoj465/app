import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useState } from 'react'
import { Dimensions, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Animated, { interpolate } from 'react-native-reanimated'
import { useTimingTransition } from 'react-native-redash'
import { useSelector } from 'react-redux'
import reduxStore, { appState } from '../../../redux'
import { notificationType_e } from '../../../redux/helperSideEffect/reducers/AppCTXReducer'

const { height, width } = Dimensions.get("window")

interface Props {
    topic?: String
}
export default (props: Props) => {
    let notifications = useSelector(
        (state: appState) => props.topic
            ? state.appCTXReducer.notifications.filter(item => item.topic == props.topic)
            : state.appCTXReducer.notifications)

    if (notifications == undefined)
        notifications = []
    return (
        <View style={{
            position: "absolute",
            width,
            top: 0,
            left: 0,
            zIndex: 10,
        }}>
            { notifications.map((notification, index) => {
                return (
                    <Card
                        key={index}
                        index={index}
                        notification={notification}
                        notifications={notifications}
                    />
                )
            })}
        </View>
    )
}

const Card = (props: {
    notification: any,
    notifications: any,
    index: number
}) => {
    const [show, setShow] = useState<0 | 1 | 2>(0)
    const transition = useTimingTransition(show)
    let timer1: undefined | NodeJS.Timeout = undefined
    let timer2: undefined | NodeJS.Timeout = undefined
    let cardColor = props.notification.type == notificationType_e.ALERT
        ? "#e74c3c"
        : "#2dff70"

    useEffect(() => {

        if (show == 0)
            (async () => {
                setShow(1)
                timer1 = await setTimeout(async () => {
                    setShow(0)
                    timer2 = await setTimeout(async () => {
                        reduxStore.store.dispatch(reduxStore.actions.appCTX.notificationsRedux({
                            notifications: props.notifications.filter((item: any) => item.id != props.notification.id)
                        }))
                    }, 3000)
                }, 4000)
            })()
        return () => {
            if (timer1)
                clearTimeout(timer1)
            if (timer2)
                clearTimeout(timer2)
        }
    }, [])

    return (
        <Animated.View
            style={{
                opacity: interpolate(transition, {
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                }),
                minHeight: 70,
                overflow: "hidden",
                position: "absolute",
                top: 0,
                //top: props.index * 70,
                left: 0,
                width
            }}>
            <View
                style={{
                    display: "flex",
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderRadius: 5,
                    overflow: "hidden",
                    margin: 10,
                }}>
                {/* main content section */}
                <View
                    style={{
                        backgroundColor: cardColor,
                        flex: 1,
                        justifyContent: "center"
                    }}>
                    <Text style={{
                        fontWeight: "bold",
                        fontSize: 15,
                        color: "white",
                        marginLeft: 10,
                        marginTop: 5,
                        marginBottom: 5
                    }}>{props.notification.title}</Text>
                    {props.notification.subTitle &&
                        <Text
                            style={{
                                fontSize: 13,
                                color: "white",
                                marginLeft: 10,
                                marginBottom: 5
                            }}>
                            {props.notification.subTitle}</Text>}
                </View>
                {/* close button */}
                <TouchableOpacity
                    style={{
                        width: 60,
                        height: "100%",
                        borderRadius: 0,
                        elevation: 0,
                        marginTop: 0,
                        borderLeftColor: "white",
                        borderLeftWidth: 5,
                        zIndex: 10
                    }}
                    onPress={() => {
                        console.log("uuuuuuuuuuuuuuu")
                        if (timer1)
                            clearTimeout(timer1)
                        if (timer2)
                            clearTimeout(timer2)
                        reduxStore.store.dispatch(reduxStore.actions.appCTX.notificationsRedux({
                            removeNotificationWithId: props.notification.id
                        }))
                    }}>
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: cardColor,
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                        <Ionicons name="close" size={24} color="white" />
                    </View>
                </TouchableOpacity>
            </View>

        </Animated.View>
    )
}


export const NOTIFY = (props: {
    topic: "PAIRING" | "UNIVERSAL"
    title: String
    subTitle?: String,
    color?: String
    type: "NORMAL" | "ALERT" | "ERROR" | "SUCCESS"
}) => {
    reduxStore.store.dispatch(reduxStore.actions.appCTX.notificationsRedux({
        newNotification: {
            topic: props.topic,
            title: props.title,
            subTitle: props.subTitle,
            color: props.color,
            type: props.type == "ALERT"
                ? notificationType_e.ALERT
                : notificationType_e.NORMAL
        }
    }))
}
