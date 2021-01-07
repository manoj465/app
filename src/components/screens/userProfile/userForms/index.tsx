import { FontAwesome } from '@expo/vector-icons';
import React, { useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import types from '../../../../@types/huelite';
import { reduxStore } from '../../../../redux';
import { logger } from "../../../../util/logger";
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
    <View style={styles.container}>
      {/* Sec: Body Section for login/signup/update form*/}
      <View style={styles.contentView}>
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
      {/* Sec: Footer */}
      <View style={styles.footer}>
        {/* Sec: Login buttons */}
        <View style={{ display: "flex", flexDirection: "row", width: 120, alignItems: "center", justifyContent: "center" }}>
          {false && <RectButton
            onPress={() => {
              /* - [ ] googleLogin() */
            }}>
            <View style={{ borderColor: "#fff", borderWidth: 0.5, height: 50, width: 50, borderRadius: 30, justifyContent: "center", alignItems: "center" }}>
              <FontAwesome name="google" size={30} color="#fff" />
            </View>
          </RectButton>}
          <RectButton
            onPress={() => {
              /* - [ ] facebookLogIn(navigation, _log) */
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
            reduxStore.store.dispatch(reduxStore.actions.appCTX.userRedux({
              user: {
                email: "testmail@huelite.in"
              }
            }))
            navigation.navigate("dashboard")
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
  contentView: {
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
