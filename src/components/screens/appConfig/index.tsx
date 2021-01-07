import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Image, Text, View } from "react-native";
import { MainRouterStackParamList } from "../../../routers/MainRouter";
import Container from "../../common/containers/SafeAreaWithAnimatedVerticalScrollView";
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { RectButton } from "react-native-gesture-handler";
import { NewRectButtonWithChildren } from "../../common/buttons/RectButtonCustom";
import { reduxStore } from "../../../redux";
import { appOperator } from "../../../util/app.operator";
import { logger } from "../../../util/logger";

type navigationProp = StackNavigationProp<
    MainRouterStackParamList,
    "config"
>
type routeProp = RouteProp<MainRouterStackParamList, "config">;

interface props {
    navigation: navigationProp
    route: routeProp;

}
const AppConfigScreen = ({ navigation }: props) => {
    const log = new logger("APP SETTING")


    return (
        <Container style={{ backgroundColor: "#fff", paddingHorizontal: 15 }}>
            <View>
                <RectButton onPress={() => {
                    if (navigation.canGoBack())
                        navigation.pop()
                }}>
                    <Ionicons style={{ paddingRight: 15, paddingBottom: 10, paddingTop: 15, marginTop: 10 }} name="ios-arrow-back" size={30} color="#222" />
                </RectButton>
            </View>
            <View style={{}}>
                <Text style={{ color: "#222", fontSize: 35, fontWeight: "bold" }}>Settings</Text>
            </View>
            {/* Sec: user profile settings */}
            <View style={{}}>
                <MenuHeading heading="User Profile" Icon={() => <FontAwesome style={{ paddingRight: 10 }} name="user-o" size={25} color="#555" />} />
                <MenuItem heading="User Profile" />
                <MenuItem heading="Change Password" />
                <MenuItem heading="Logout" onPress={() => {
                    appOperator.user({
                        cmd: "LOGOUT", onLogout: () => {
                            log?.print("logging out now")
                            navigation.replace("user")
                        }
                    })
                }} />
                <MenuHeading heading="Notification" Icon={() => <MaterialIcons style={{ paddingRight: 10 }} name="notifications-none" size={25} color="#555" />} />
                <MenuItem heading="App Notifications" Icon={() => <FontAwesome name="toggle-off" size={25} color="#555" />} />
                <MenuItem heading="Device Notifications" Icon={() => <FontAwesome name="toggle-off" size={25} color="#555" />} />
                <MenuHeading heading="More" Icon={() => <MaterialIcons style={{ paddingRight: 10 }} name="unfold-more" size={25} color="#555" />} />
                <MenuItem heading="Support" />
                <MenuItem heading="Contact Us" />
            </View>
            <View style={{ alignItems: "center", paddingVertical: 20 }}>
                <Image style={{ height: 150, width: 150, opacity: 0.3 }} source={require("../../../../assets/icons/splash-icon.png")} />
            </View>
        </Container>
    );
};

export default AppConfigScreen

interface MenuHeadingProps {
    Icon: any
    heading: string
}
const MenuHeading = ({ Icon, heading }: MenuHeadingProps) => {
    return (
        <View style={{ flexDirection: "row", alignItems: "flex-end", marginTop: 30, borderBottomColor: "#555", borderBottomWidth: 0.5, paddingBottom: 10 }}>
            <Icon />
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "#555" }}>{heading}</Text>
        </View>
    )
}

interface MenuItemProps {
    Icon?: any
    heading: string
    onPress?: () => void
}
const MenuItem = ({
    Icon = () => <Ionicons name="ios-arrow-forward" size={25} color="#777" />,
    heading,
    onPress = () => { }
}: MenuItemProps) => {
    return (
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", height: 50 }}>
            <Text style={{ fontSize: 15, color: "#777", fontWeight: "bold" }}>{heading}</Text>
            <NewRectButtonWithChildren onPress={onPress} style={{ shadowOpacity: 0, elevation: 0 }}>
                <Icon />
            </NewRectButtonWithChildren>
        </View>
    )
}