import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { Image, StyleProp, Text, TextInput, View, ViewStyle } from "react-native";
import { useSelector } from "react-redux";
import { appState } from "../../../redux";
import { MainRouterStackParamList } from "../../../routers/MainRouter";
import { appOperator } from "../../../app.operator";
import { logger } from "../../../@logger";
import { NewRectButtonWithChildren } from "../../common/buttons/RectButtonCustom";
import Container from "../../common/containers/SafeAreaWithAnimatedVerticalScrollView";
import { STYLES as styles } from "../../../@styles";
import LoginPage from "./userForms";

export type navigationProp = StackNavigationProp<
  MainRouterStackParamList,
  "user"
>
type routeProp = RouteProp<MainRouterStackParamList, "user">;

interface props {
  navigation: navigationProp
  route: routeProp;
}
const UserScreen = ({ navigation }: props) => {
  const log = new logger("user profile")
  const [userPageView, setUserPageView] = useState("LOGIN")



  if (userPageView == "USER")
    return (
      <Container style={{ backgroundColor: "#fff", paddingHorizontal: 15 }}>
        <View /* Sec2: header button container*/
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            height: 60
          }}>
          <NewRectButtonWithChildren /* Sec3: back button */
            style={{
              //backgroundColor: "green"
            }}
            onPress={() => {
              if (navigation.canGoBack())
                navigation.pop()
              else {
                navigation.replace("pairing")
              }
            }}>
            <Ionicons style={{}} name="ios-arrow-back" size={30} color="#222" />
          </NewRectButtonWithChildren>
          <NewRectButtonWithChildren /* Sec3: logoutButton */
            style={{
              //backgroundColor: "red"
            }}
            onPress={() => {
              appOperator.user({
                cmd: "LOGOUT",
                onLogout: () => {
                  log?.print("user logged out")
                }
              })
            }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                //backgroundColor: "red"
              }}>
              <Text style={[styles.H5]}>Logout</Text>
              <AntDesign style={{}} name="logout" size={28} color="#222" />
            </View>
          </NewRectButtonWithChildren>
        </View>
        <View /* Sec2: page heading text container */
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            height: 50,
            //backgroundColor: "red"
          }}>
          <Text style={{ color: "#222", fontSize: 35, fontWeight: "bold" }}>Settings</Text>
          <NewRectButtonWithChildren /* Sec3: back button */
            style={{
              //backgroundColor: "green"
            }}
            onPress={() => {
              setUserPageView("UPDATE")
            }}>
            <FontAwesome style={{}} name="edit" size={30} color="#222" />
          </NewRectButtonWithChildren>
        </View>
        <View style={{ alignItems: "center", marginTop: 50 }}>
          <FontAwesome name="user" size={100} color="#222" />
          <Text>[testemail]</Text>
          <Text>[testUsername]</Text>
        </View>
        <View style={{}}>
          <CustomTextField style={{ marginTop: 30 }} heading="Full Name" primaryColor="#777" />
          <CustomTextField style={{ marginTop: 25 }} heading="email" primaryColor="#777" />
        </View>
        <View style={{
          marginTop: 50,
          borderWidth: 0.3,
          //borderColor: "#777",
          borderRadius: 25,
          overflow: "hidden",
          justifyContent: "center",
          alignItems: "center",
        }}>
          <Text style={{ color: "#777", fontWeight: "bold" }}>Coming Next</Text>
          <Image style={{ width: "100%" }} source={require("../../../../assets/images/usageMeter.png")} />
        </View>
        {/*  <View style={{ alignItems: "center", paddingVertical: 20 }}>
        <Image style={{ height: 150, width: 150, opacity: 0.3 }} source={require("../../../../assets/icons/icon.png")} />
      </View> */}
      </Container>
    );
  else
    return (
      <LoginPage
        log={new logger("LOGIN/SIGNUP/UPDATE", log)}
        navigation={navigation}
        userPageView={userPageView}
        setUserPageView={setUserPageView} />
    )
};

export default UserScreen


interface TextFieldProps {
  heading?: string
  placeholder?: string
  style?: StyleProp<ViewStyle>
  primaryColor?: string
}
const CustomTextField = ({ heading, placeholder, style, primaryColor = "#000000" }: TextFieldProps) => {
  return (
    <View style={[{}, style]}>
      <Text style={{ marginLeft: 15, color: primaryColor, fontWeight: "bold" }}>{heading}</Text>
      <View style={{ borderWidth: 0.5, borderRadius: 10, borderColor: primaryColor }}>
        <TextInput style={{ height: 50, marginHorizontal: 10, fontSize: 15, color: primaryColor }} placeholder={placeholder} />
      </View>
    </View>
  )
}