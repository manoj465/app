import React, { useEffect, useState } from "react";
import { Dimensions, Image, Linking, Platform, StyleSheet, Text, View } from "react-native";
import { PairingStackParamList } from "..";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { RectButton } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import LottieView from "lottie-react-native";
//native imports
import api from "../../../../@api";
import { logFun, logger } from "../../../../@logger";
import { getCurrentTimeInSeconds } from "expo-auth-session/build/TokenRequest";
import Alert from "../../../common/Alert";
import { NewRectButtonWithChildren } from "../../../common/buttons/RectButtonCustom";
import STYLES from "../../../../styles"



type pairingScreen1NavigationProp = StackNavigationProp<PairingStackParamList, "PairScreen_1">;
type pairingScreen1RouteProp = RouteProp<PairingStackParamList, "PairScreen_1">;

interface Props {
  navigation: pairingScreen1NavigationProp;
  route: pairingScreen1RouteProp;
}

const { width, height } = Dimensions.get("window");
export const PairingConnectorScreen1 = ({ navigation }: Props) => {
  const log = new logger("PAIRING_SCREEN_1")
  const [groupName, setGroupName] = useState("BedRoom");
  const dispatch = useDispatch();
  let _animation = null;

  useEffect(() => {
    //navigation.replace("PairScreen_2", { newDevice: { Mac: "newDevice", Hostname: "hostname", localTimeStamp: getCurrentTimeInSeconds(), IP: "192.168.4.1", hsv: { h: 0, s: 100, v: 100 }, deviceName: "device Name", timers: [] } });
    const interval = setInterval(async () => {
      const res = await api.deviceAPI.authAPI.v1({ IP: "192.168.4.1", log: log ? new logger("auth api", log) : undefined })
      console.log("<><><> " + JSON.stringify(res))
      if (res.RES?.Mac) {
        clearInterval(interval)
        console.log("navigating to next screen - screen-2")
        navigation.replace("PairScreen_2", { newDevice: { ...res.RES, localTimeStamp: getCurrentTimeInSeconds(), IP: "192.168.4.1", hsv: { h: 0, s: 100, v: 100 }, deviceName: "", timers: [] } });
      }

    }, 3000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View
          style={{
            marginVertical: 20,
            backgroundColor: "#55f",
            height: 0.25 * height,
            width: "95%",
            alignSelf: "center",
            borderRadius: 25,
            justifyContent: "space-evenly",
            alignItems: "center",
            overflow: "hidden",
          }}
        >

          <Image
            style={{
              height: "100%",
              width: "100%",
              position: "absolute",
              top: 0,
              left: 0,
              opacity: 0.8,
            }}
            source={require("../../../../../assets/images/testIMG.jpg")}
          />
          <NewRectButtonWithChildren
            style={{
              height: 40,
              minWidth: 160,
              paddingHorizontal: 1,
              borderRadius: 25,
              overflow: "hidden",
              justifyContent: "center",
              position: "absolute",
              bottom: 20,
              right: 20,
            }}
            onPress={async () => {
              const supported = await Linking.canOpenURL("App-Prefs:root=WIFI");
              if (supported) {
                await Linking.openURL("App-Prefs:root=WIFI");
              } else {
                Alert.alert(
                  `Jump not Supported`,
                  "You might want to try switching the HUElite app in background and then go to WiFi Settings "
                );
              }
            }}
          >
            <View
              style={{
                height: 40,
                minWidth: 160,
                paddingHorizontal: 1,
                position: "absolute",
                backgroundColor: "#fff",
                borderRadius: 25,
                opacity: 0.7,
                top: 0,
                left: 0,
              }}
            ></View>
            <Text
              style={{ fontSize: 12, fontWeight: "bold", alignSelf: "center" }}
            >
              Go to Wi-Fi Settings
            </Text>
          </NewRectButtonWithChildren>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: "#fff",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {Platform.OS != "web" && <LottieView
            ref={(animation) => {
              _animation = animation;
            }}/* 
            style={{
              width: width * 0.8,
              height: width * 0.8,
              backgroundColor: "#fff",
            }} */
            source={require("../../../../../assets/lottie/scanning.json")}
            autoPlay
            loop={true}
          //progress={progress}
          />}
        </View>
        {/*/// Text Section */}
        <View
          style={{ backgroundColor: "#fff", justifyContent: "center", marginTop: 20, marginBottom: 10 }}
        >
          <Text
            style={{
              fontWeight: "bold",
              textAlign: "center",
              color: "#555",
              paddingHorizontal: 30,
            }}
          >
            Conect to your Device to proceed
          </Text>
          <Text
            style={{
              color: "#333",
              paddingHorizontal: 30,
              marginTop: 10,
              textAlign: "center",
              fontSize: 12,
            }}
          >
            To proceed with pairing go-to your
            phone Wi-Fi Settings and connect to Wi-Fi naming{" "}
            <Text style={{ fontWeight: "bold" }}>BDE_XXXX_XX:XX</Text>
            {" "}with password{" "}
            <Text style={{ fontWeight: "bold" }}>12345678</Text>
          </Text>
          <Text style={{ textAlign: "center", fontSize: 12 }}><Text style={{ color: STYLES.textColors.warning, fontWeight: "bold" }}>TIP:</Text>{" "}turn off your mobile data</Text>
        </View>
        {/* ///goBACK button */}
        <View
          style={{
            alignItems: "center",
          }}
        >
          {navigation.canGoBack() && <NewRectButtonWithChildren
            style={{
              overflow: "hidden",
              alignSelf: "flex-start",
              marginBottom: 10,
            }}
            onPress={() => {
              /* TODO_CUR dispatch(
                newDeviceSagaAction(
                  Object.assign({}, dummyDevice, {
                    SSID: "Homelink1",
                    wifiPass: "Ioplmkjnb@1",
                    Mac: "ED:98:FF:46:FF",
                    groupName: groupName.length > 3 ? groupName : null,
                  })
                )
              ); */
              navigation.pop();
            }}
          >
            <Text
              style={{
                fontSize: 17,
                fontWeight: "bold",
                alignSelf: "flex-start",
                marginLeft: 20,
                color: "#66F",
              }}
            >
              Go Back
            </Text>
          </NewRectButtonWithChildren>}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: "#ffffff",
  },
});
