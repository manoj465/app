import { FontAwesome } from '@expo/vector-icons';
import React, { useState } from "react";
import { Dimensions, Platform, StyleSheet, Text, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { reduxStore } from '../../../../redux';
import { appOperator } from '../../../../util/app.operator';
import { getCurrentTimeStampInSeconds } from '../../../../util/DateTimeUtil';
import { logger } from "../../../../util/logger";
import { NewRectButtonWithChildren } from '../../../common/buttons/RectButtonCustom';
import { navigationProp } from "../index";
import { LoginHeader } from "./loginForm";
import { SignUpHeader } from "./signupForm";
import { UserUpdateForm } from "./userUpdateForm";

interface Props {
  navigation: navigationProp
  userPageView?: string
  setUserPageView?: React.Dispatch<React.SetStateAction<string>>
  log?: logger
}
const { width, height } = Dimensions.get("window");
/** 
 * @description userFormsContainer responsible for switching view between login/signup/update
 * 
 * ## [login/Signup](https://app.clickup.com/t/1vf7hj)
 *    ##### LoginFunctionality
 *      - [x] login and switch view to userProfile upon success
 *      - [x] login and show errors as Alert on error
 *    ##### signupFunctionality
 *      - [x] signup and switch view to userProfile
 *      - [x] show Alert for error upon signup failed
 *    ##### updateUser Info
 *      - [ ] show userUpdateErorrs
 *      - [ ] switch view to user profile upon successful update
 */
export default ({ navigation, userPageView, setUserPageView, log }: Props) => {


  return (
    <View
      style={{
        display: "flex",
        flex: 1,
        backgroundColor: "#5555ff",
      }}>
      <View
        style={{
          flex: 1,
          borderBottomLeftRadius: width * 0.08,
          borderBottomRightRadius: width * 0.08,
          backgroundColor: "white",
        }} /* Sec2: Body Section for login/signup/update form*/ >
        {userPageView == "SIGNUP"
          ? <SignUpHeader
            setHeaderView={setUserPageView}
            navigation={navigation}
            log={log ? new logger("signup header", log) : undefined} />
          : userPageView == "UPDATE"
            ? <UserUpdateForm
              setHeaderView={setUserPageView}
              navigation={navigation}
              log={log ? new logger("login header", log) : undefined} />
            : userPageView == "LOGIN"
              ? <LoginHeader
                setHeaderView={setUserPageView}
                navigation={navigation}
                log={log ? new logger("login header", log) : undefined} />
              : (<View></View>)}
      </View>
      <View style={{
        zIndex: 10,
        backgroundColor: "#5555ff",
        alignItems: "center",
        justifyContent: "center",
      }} /* Sec2: Footer */ >
        {false && <View /* Sec3: Login buttons */
          style={{ display: "flex", flexDirection: "row", width: 120, alignItems: "center", justifyContent: "center" }}>
          {false && <NewRectButtonWithChildren
            onPress={() => {
              /* - [ ] googleLogin() */
            }}>
            <View style={{ borderColor: "#fff", borderWidth: 0.5, height: 50, width: 50, borderRadius: 30, justifyContent: "center", alignItems: "center" }}>
              <FontAwesome name="google" size={30} color="#fff" />
            </View>
          </NewRectButtonWithChildren>}
          <NewRectButtonWithChildren
            onPress={() => {
              appOperator.user({
                cmd: "FB_LOGIN",
                onFbLoginSuccess: (user) => {
                  navigation.replace("dashboard")
                },
                log: log ? new logger("fb login", log) : undefined
              })
            }}>
            <View style={{ borderColor: "#fff", borderWidth: 0.5, height: 50, width: 50, borderRadius: 30, justifyContent: "center", alignItems: "center" }}>
              <FontAwesome name="facebook-f" size={30} color="#fff" />
            </View>
          </NewRectButtonWithChildren>
        </View>}
        <NewRectButtonWithChildren /* Sec3: Skip Login */
          style={{
            //paddingVertical: 10,
            backgroundColor: "transparent"
          }}
          onPress={() => {
            appOperator.userStoreUpdateFunction({
              user: {
                email: "testmail@huelite.in",
                localTimeStamp: getCurrentTimeStampInSeconds()
              }
            })
            navigation.navigate("dashboard")
          }}
        >
          <Text style={{ textAlign: "center", color: "white", }} >
            Skip for now!{" "}
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              Will do Later
            </Text>
          </Text>
        </NewRectButtonWithChildren>
      </View>
    </View >
  );
};


const styles = StyleSheet.create({
  container: {},
  contentView: {},
  footer: {},
});
