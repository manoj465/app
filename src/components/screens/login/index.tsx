import { FontAwesome } from '@expo/vector-icons';
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { MainRouterStackParamList } from "../../../routers/MainRouter";
import { logFun_t } from "../../../util/logger";
import { LoginHeader, SignUpHeader } from "./header";
import { facebookLogIn, googleLogin, processLoginData } from "./loginHelper";


const _log: logFun_t = (s) => {
  console.log("< LOGIN INDEX > " + s);
}


export type GetStartedNavigationProp = StackNavigationProp<MainRouterStackParamList, "getStarted">;
type GetStartedRouteProp = RouteProp<MainRouterStackParamList, "getStarted">;
interface Props {
  navigation: GetStartedNavigationProp;
  route: GetStartedRouteProp;
}
const { width, height } = Dimensions.get("window");
export const GetStarted = ({ navigation, route: { params } }: Props) => {
  const [headerView, setHeaderView] = useState<1/* LOGIN */ | 2/* SIGNUP */>(1)


  return (
    <View style={styles.container}>
      {/* Sec: Body Section */}
      <View style={styles.header}>
        {headerView == 1 ? <LoginHeader setHeaderView={setHeaderView} navigation={navigation} /> : headerView == 2 ? <SignUpHeader setHeaderView={setHeaderView} navigation={navigation} /> : (<View></View>)}
      </View>
      {/* Sec: Footer */}
      <View style={styles.footer}>
        {/* Sec: Login buttons */}
        <View style={{ display: "flex", flexDirection: "row", width: 120, alignItems: "center", justifyContent: "center" }}>
          {false && <RectButton
            onPress={() => {
              googleLogin()

            }}>
            <View style={{ borderColor: "#fff", borderWidth: 0.5, height: 50, width: 50, borderRadius: 30, justifyContent: "center", alignItems: "center" }}>
              <FontAwesome name="google" size={30} color="#fff" />
            </View>
          </RectButton>}
          <RectButton
            onPress={() => {
              facebookLogIn(navigation, _log)
            }}>
            <View style={{ borderColor: "#fff", borderWidth: 0.5, height: 50, width: 50, borderRadius: 30, justifyContent: "center", alignItems: "center" }}>
              <FontAwesome name="facebook-f" size={30} color="#fff" />
            </View>
          </RectButton>
        </View>
        {/* Sec: Skip Login */}
        <RectButton
          style={{ position: "absolute", bottom: 10, paddingVertical: 10, }}
          onPress={() => {
            processLoginData({
              user: {
                id: undefined,/* this is to be ignored as temp user cannot have ID and 'processLoginData()' requires a 'HUE_User_t' serverside representation of HUElite user*/
                userName: "tempUser",
                email: ""
              }, navigation
            }, _log)
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "white",
            }}
          >
            Skip for now!{" "}
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              Will do Later
            </Text>
          </Text>
        </RectButton>
      </View>
    </View >
  );
};


const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: "#5555ff",
  },
  header: {
    flex: 0.7,
    borderBottomLeftRadius: width * 0.08,
    borderBottomRightRadius: width * 0.08,
    backgroundColor: "white",
  },
  footer: {
    flex: 0.3,
    zIndex: 10,
    backgroundColor: "#5555ff",
    alignItems: "center",
    justifyContent: "center",
  },
});
