import { FontAwesome, Ionicons, Feather, AntDesign, } from '@expo/vector-icons';
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Image, StyleProp, Text, TextStyle, View } from "react-native";
import { MainRouterStackParamList } from "../../../routers/MainRouter";
import { STYLES as styles } from '../../../@styles';
import { appOperator } from "../../../app.operator";
import { logger } from "../../../@logger";
import { NewRectButtonWithChildren } from "../../common/buttons/RectButtonCustom";
import Container from "../../common/containers/SafeAreaWithAnimatedVerticalScrollView";
import { useSelector } from 'react-redux';
import { appState } from '../../../redux';
import { LinearGradient } from 'expo-linear-gradient';
import UNIVERSALS from '../../../@universals';

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
    const User = useSelector((state: appState) => state.appCTXReducer.user)


    return (
        <Container style={{ backgroundColor: "#fff", flex: 1, paddingHorizontal: 10 }}>

            <View /** header container */ >
                <NewRectButtonWithChildren onPress={() => {
                    if (navigation.canGoBack())
                        navigation.pop()
                }}
                    innerCompStyle={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        //backgroundColor: "blue"
                    }}>
                    <Ionicons style={{}} name="ios-arrow-back" size={30} color="#555" />
                    <Text style={{ color: "#555", fontSize: 22, fontWeight: "bold", marginLeft: 10 }}>Settings</Text>
                </NewRectButtonWithChildren>
            </View>

            <View /** content container */ style={{}}>


                <LinearGradient /** user headerCard container */
                    colors={["#79b6f7", "#a872fe"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.shadow, {
                        overflow: "visible",
                        backgroundColor: "#eee",
                        width: "100%",
                        height: 200,
                        borderRadius: 10,
                    }]}>
                    <FontAwesome name="user" size={200} color="white" style={{ position: "absolute", right: "10%", top: 10, opacity: 0.3 }} />

                    <NewRectButtonWithChildren /** logout button */
                        style={
                            {
                                width: 40,
                                height: 40,
                                margin: 15,
                                position: "absolute",
                                right: 0,
                                top: 0,
                                backgroundColor: "transparent"
                            }}
                        innerCompStyle={[styles.center, {}]}
                        onPress={() => {
                            appOperator.user({
                                cmd: "LOGOUT", onLogout: () => {
                                    log?.print("logging out now")
                                    navigation.replace("user")
                                }
                            })
                        }}>
                        <AntDesign name="logout" size={24} color="#eee" />
                    </NewRectButtonWithChildren>


                    <View /** header user icon */
                        style={[styles.shadow, {
                            height: 100,
                            width: 100,
                            borderRadius: 50,
                            backgroundColor: "#fff",
                            position: "absolute",
                            bottom: -30,
                            left: 20,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }]}>
                        <Feather name="user" size={45} color="#555" />
                    </View>

                    <Text style={[styles.H3, { position: "absolute", bottom: 10, left: 130, color: "white" }]}>{"Hi, " + User?.userName}</Text>

                </LinearGradient>

                <View /** settings and other support */ style={{ width: "100%", marginTop: 50, padding: 5 }}>
                    <Text style={[styles.H7, { color: "#555", opacity: 0.6 }]}>GENERAL</Text>
                    <View style={[styles.shadow, { backgroundColor: "#fff", borderRadius: 10, marginTop: 10, paddingVertical: 10 }]}>
                        <MenuHeading textStyles={{ fontSize: 16 }} heading="Change Password" Icon={() => <></>} />
                    </View>
                </View>

                <View style={{ width: "100%", marginTop: 50, padding: 5 }}>
                    <Text style={[styles.H7, { color: "#555", opacity: 0.6 }]}>HELP</Text>
                    <View style={[styles.shadow, { backgroundColor: "#fff", borderRadius: 10, marginTop: 10, paddingVertical: 10 }]}>
                        <MenuHeading textStyles={{ fontSize: 16 }} heading="Terms & Conditions" Icon={() => <></>} />
                        <MenuHeading textStyles={{ fontSize: 16 }} heading="Privacy Policy" Icon={() => <></>} />
                        <MenuHeading textStyles={{ fontSize: 16 }} heading="Support" Icon={() => <></>} />
                    </View>
                    <View style={{
                        width: "100%",
                        marginVertical: 25
                    }}>
                        <Text style={[styles.H7, {
                            fontWeight: "normal",
                            color: "#555",
                            textAlign: "center"
                        }]}>Powered by <Text style={{ fontWeight: "bold" }}>STERNET INDUSTRIES</Text></Text>
                        <Text style={[styles.H7, { fontWeight: "normal", textAlign: "center" }]}>ver - 1.1.0</Text>
                    </View>
                </View>

            </View>


        </Container>
    );
};

export default AppConfigScreen

interface MenuHeadingProps {
    Icon: any
    heading: string
    textStyles?: StyleProp<TextStyle>
    onPress?: () => void
}
const MenuHeading = ({ Icon, heading, textStyles, onPress = () => { } }: MenuHeadingProps) => {
    return (
        <NewRectButtonWithChildren
            style={{
                borderBottomColor: "#555",
                borderBottomWidth: 0,
                width: "100%",
                paddingHorizontal: 10,
                marginVertical: 10,
                backgroundColor: "transparent"
            }}
            innerCompStyle={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                //backgroundColor: "red",
                width: "100%"
            }}
            onPress={onPress}>
            <Text style={[{ fontSize: 25, fontWeight: "bold", color: "#555" }, textStyles]}>{heading}</Text>
            <Icon />
        </NewRectButtonWithChildren>
    )
}
