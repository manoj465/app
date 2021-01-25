import React from 'react'
import { View, Text, Image } from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';
import { MaterialIcons, SimpleLineIcons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';
import { navigationProp } from "./index"
//@ts-ignore
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import { NewRectButton, NewRectButtonWithChildren } from "../../common/buttons/RectButtonCustom"
import UNIVERSALS from '../../../@universals';

interface Props {
    navigation: navigationProp
    user?: UNIVERSALS.GLOBALS.USER_t
}

export default ({ navigation, user }: Props) => {
    return (
        <View style={{ paddingHorizontal: 10 }}>
            <View style={{ backgroundColor: "#fff", marginTop: 25, marginBottom: 15 }}>
                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff", paddingRight: 10, marginBottom: 15 }}>
                    <NewRectButtonWithChildren onPress={() => {
                        navigation.navigate("config")
                    }}>
                        <AntDesign style={{ paddingRight: 10 }} name="menu-fold" size={24} color="black" />
                    </NewRectButtonWithChildren>
                    <View style={{ flexDirection: "row" }}>
                        <NewRectButtonWithChildren onPress={() => {
                            navigation.navigate("pairing")
                        }}>
                            <MaterialIcons style={{ marginHorizontal: 10 }} name="add-circle-outline" size={26} color="black" />
                        </NewRectButtonWithChildren>
                        <NewRectButtonWithChildren onPress={() => {
                            //navigation.navigate("user")
                            navigation.navigate("user")
                        }}>
                            <FontAwesome style={{ marginHorizontal: 10 }} name="user-o" size={24} color="black" />
                        </NewRectButtonWithChildren>
                    </View>
                </View>
                <View style={{}}>
                    <Text style={{ fontSize: 25, fontWeight: "bold", }}>{"Hi, " + (user?.userName ? user?.userName : "")}</Text>
                </View>
            </View>
            {/* <Animated.ScrollView horizontal style={{ flexDirection: "row", backgroundColor: "#fff", width: "100%", paddingBottom: 10 }}>
                <View style={{ borderWidth: 0.2, borderRadius: 5, marginRight: 15 }}><Text style={{ paddingHorizontal: 5, paddingVertical: 3 }}>Alexa Support</Text></View>
                <View style={{ borderWidth: 0.2, borderRadius: 5, marginRight: 15 }}><Text style={{ paddingHorizontal: 5, paddingVertical: 3 }}>Connect with Google Assistant</Text></View>
            </Animated.ScrollView> */}
            <Animated.ScrollView showsHorizontalScrollIndicator={false} horizontal style={{ backgroundColor: "#fff", width: "100%", display: "flex", flexDirection: "row", marginBottom: 15, }}>
                <QuickActionBlock Heading="Snooze all events" subHeading="ALL OFF" primaryColor="#5DADE2" Child={() => { return (<MaterialIcons name="snooze" size={30} color="#5DADE2" />) }} />
                <QuickActionBlock Heading="Power saving mode" subHeading="TURN ON" primaryColor="#48C9B0" Child={() => { return (<SimpleLineIcons name="energy" size={30} color="#48C9B0" />) }} />
                <QuickActionBlock Heading="Shut Down Home" subHeading="SAY, GOODBYE" primaryColor="#EC7063" Child={() => { return (<MaterialCommunityIcons name="power-plug-off" size={30} color="#EC7063" />) }} />
                <QuickActionBlock Heading="Tablet Mode" subHeading="STAY AWAKE" primaryColor="#f39c12" Child={() => { return (<MaterialCommunityIcons name="tablet-dashboard" size={30} color="#f39c12" />) }}
                    onPress={() => {
                        console.log("ONPRESS")
                        activateKeepAwake()
                    }} />
                <View style={{ width: 10 }} />
            </Animated.ScrollView>
        </View>
    )
}



interface QAB_props {
    Heading: string,
    subHeading?: string,
    primaryColor?: string
    Child: any
    onPress?: () => void
}
const QuickActionBlock = ({ Heading, subHeading, primaryColor = "#48C9B0", Child, onPress = () => { } }: QAB_props) => {

    return (

        <NewRectButtonWithChildren
            onPress={onPress}
            style={{
                width: 140,
                height: 160,
                borderRadius: 10,
                overflow: "hidden",
                borderColor: primaryColor,
                borderWidth: 0.2,
                backgroundColor: "green",
                marginRight: 10
            }}>
            <View style={{ backgroundColor: primaryColor, padding: 10, flex: 1, height: 120 }}>
                <View style={{ backgroundColor: "#fff", height: 50, width: 50, borderRadius: 30, justifyContent: "center", alignItems: "center" }} >
                    <Child />
                </View>
                <Text style={{ fontSize: 18, fontWeight: "bold", color: "#fff", marginTop: 10 }} >{Heading}</Text>
                <Text style={{ fontSize: 12, fontWeight: "bold", color: "#fff", marginTop: 10, marginBottom: 10 }} >{subHeading}</Text>
            </View>
        </NewRectButtonWithChildren>
    )
}