import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import LottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import { Dimensions, FlatList, StyleSheet, Text, Vibration, View } from "react-native";
import { RectButton, TextInput } from "react-native-gesture-handler";
import Animated, { Value } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
//native imports
import { PairingStackParamList } from "..";
import usePairApiHook, { pairing_state_e } from "../../../../services/webApi/pairAPI_Hook";
import { appOperator } from "../../../../app.operator";
import { getCurrentTimeStampInSeconds } from "../../../../util/DateTimeUtil";
import { logger } from "../../../../@logger";
import { NewRectButtonWithChildren } from "../../../common/buttons/RectButtonCustom";

const groupNames = ["Bedroom", "Kitchen", "Garden", "Drawing Lamps", "Stairs"];

const { width, height } = Dimensions.get("window");

type NavigationProp = StackNavigationProp<
  PairingStackParamList,
  "PairScreen_3"
>;

type _RouteProp = RouteProp<PairingStackParamList, "PairScreen_3">;


interface Props {
  navigation: NavigationProp;
  route: _RouteProp;
}

export const PairingConnectorScreen3 = ({
  navigation,
  route: {
    params: { newDevice },
  },
}: Props) => {
  const log = new logger("PAIRING_SCREEN_3")
  //const [pass, setPass] = useState("Ioplmkjnb@1");
  const [pass, setPass] = useState("");
  const [groupName, setGroupName] = useState("");
  let _animation = null;
  const [data, socket, pair, pairStatus, hitSaveAPI] = usePairApiHook({
    IP: "192.168.4.1",
    _onMsg: (msg) => {
      //console.log("socket msg on Pairing Screen---- " + JSON.stringify(msg));
    },
    log: log ? new logger("pairing hook", log) : undefined
  });

  const validateData = () => {
    if (!newDevice.ssid)
      return false
    return true
  }

  interface onInteraction_t { opID: "PAIR" | "BACK" | "SAVE_CONF" }
  const onInteraction = ({ opID }: onInteraction_t) => {
    switch (opID) {
      case "BACK":
        navigation.replace("PairScreen_2", { newDevice });
        break;

      case "PAIR":
        if (validateData())
          //@ts-ignore varified _newDevice.ssid_ in _validateData_
          pair(newDevice.ssid, pass);
        break;

      case "SAVE_CONF":
        hitSaveAPI()
        break;

      default:
        break;
    }
  }

  useEffect(() => {
    if (pairStatus == pairing_state_e.PAIR_READY)
      Vibration.vibrate(250)
    else if (pairStatus == pairing_state_e.PAIR_SUCCESS) {
      console.log("paired successfully " + JSON.stringify(data, null, 2));
    } else if (pairStatus == pairing_state_e.SAVE_CONFIG_SUCCESS) {
      (async () => {
        if (data?.RES?.IP) {
          appOperator.device({ cmd: "ADD_UPDATE_DEVICES", newDevices: [{ ...newDevice, IP: data.RES.IP, ssid: newDevice.ssid, localTimeStamp: getCurrentTimeStampInSeconds() }] })
          //@ts-ignore
          navigation.replace("dashboard")
          //@ts-ignore
          navigation.reset({ index: 0, routes: [{ name: "dashboard" }], })
        } else {
        }
      })()
    } else if (pairStatus == pairing_state_e.SAVE_CONFIG_ERROR) { }
    return () => { }
  }, [pairStatus, data])


  return (
    <SafeAreaView style={styles.
      container}>
      {/* Sec: HEADER */}
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: "#55f",
            width: width * 0.95,
            minHeight: 150,
            alignSelf: "center",
            marginVertical: 20,
            borderRadius: 25,
          },
        ]}
      >
        {/* Sec: BLOCK => WiFi Password */}
        <View
          style={{
            paddingHorizontal: 15,
            width: "100%",
            borderRadius: 25,
            paddingVertical: 20,
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: "bold", color: "white" }}>
            Enter WiFi Password
          </Text>
          <TextInput
            style={{
              height: 50,
              width: "100%",
              borderColor: "#ffffff",
              color: "#ffffff",
              fontSize: 18,
              fontWeight: "bold",
              textAlign: "left",
              alignSelf: "center",
              marginTop: 5,
              borderBottomWidth: 0.5,
            }}
            secureTextEntry={true}
            placeholderTextColor="#ccc"
            onChangeText={(text) => {
              setPass(text);
            }}
            placeholder="***"
            value={pass}
          />
        </View>
        {/* Sec: BLOCK => Group Selector */}
        <View
          style={{
            paddingHorizontal: 15,
            width: "100%",
            borderRadius: 25,
            paddingVertical: 10,
          }}
        >
          {/* Sec: groupName TextInput */}
          <TextInput
            style={{
              height: 50,
              width: "100%",
              borderColor: "#ffffff",
              color: "#ffffff",
              fontSize: 14,
              textAlign: "left",
              alignSelf: "center",
              marginTop: 5,
              borderBottomWidth: 0.5,
            }}
            placeholderTextColor="#ddd"
            onChangeText={(text) => {
              setGroupName(text);
            }}
            placeholder="Create new group"
            value={groupName}
          />
          <Text
            style={{
              fontSize: 12,
              fontWeight: "bold",
              color: "white",
              marginTop: 10,
            }}
          >
            Suggested group names
          </Text>
          {/* Sec: CONTAINER => groupName suggestion blocks */}
          <View
            style={{
              alignItems: "flex-start",
              paddingVertical: 10,
            }}
          >
            {/* Sec: groupName suggestion blocks */}
            <FlatList
              horizontal
              data={groupNames}
              //numColumns={6}
              renderItem={({ item }) => (
                <NewRectButtonWithChildren
                  onPress={() => {
                    setGroupName(item);
                    Vibration.vibrate(50)
                  }}
                  style={{
                    height: 25,
                    alignSelf: "flex-start",
                    padding: 5,
                    borderWidth: 0.5,
                    borderColor: "#fff",
                    borderRadius: 18,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    marginHorizontal: 5,
                    backgroundColor: "transparent"
                  }}>
                  <Text style={{ fontSize: 12, color: "#fff" }}>{item}</Text>
                </NewRectButtonWithChildren>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>
      </Animated.View>

      {/* Sec: LOTTIE Section */}
      <View
        style={{ width: "100%", backgroundColor: "#fff", alignItems: "center" }}
      >
        <LottieView
          ref={(animation) => {
            _animation = animation;
          }}
          style={{
            width: width * 0.8,
            height: width * 0.8,
            backgroundColor: "#fff",
          }}
          source={pairStatus == pairing_state_e.PAIR_SUCCESS ? require("../../../../../assets/lottie/success.json")
            : pairStatus == pairing_state_e.PAIR_REQUEST_SUCCESS_N_CONNECTING ? require("../../../../../assets/lottie/progress.json")
              : (pairStatus == pairing_state_e.SAVE_CONFIG_ERROR || pairStatus == pairing_state_e.PAIR_NO_SSID || pairStatus == pairing_state_e.PAIR_UNKNOWN_ERROR || pairStatus == pairing_state_e.PAIR_WRONG_PASSWORD) ? require("../../../../../assets/lottie/error.json")
                : require("../../../../../assets/lottie/progress.json")
          }
          autoPlay
          loop={pairStatus == pairing_state_e.PAIR_SUCCESS ? false : true}
        //progress={progress}
        />
      </View>

      {/* Sec: Bottom buttons */}
      <View
        style={[
          styles.Button1_Container,
          {
            backgroundColor: "#fff",
            overflow: "hidden",
            alignSelf: "center",
            position: "absolute",
            bottom: 0,
            alignItems: "center",
          },
        ]}
      >
        {/* Sec: BUTTON => Pair || Next || Cancel || Finish */}
        <NewRectButtonWithChildren
          activeOpacity={0.3}
          style={styles.Button1}
          onPress={() => {
            if (pairStatus == pairing_state_e.PAIR_SUCCESS)
              onInteraction({ opID: "SAVE_CONF" })
            else
              onInteraction({ opID: "PAIR" })
          }}
        >
          <Animated.Text
            style={[
              styles.Button1_Text,
              {
                color: "#fff",
                fontSize: 20,
              },
            ]}
          >
            {pairStatus == pairing_state_e.IDLE ? "Waiting for Connection"
              : pairStatus == pairing_state_e.PAIR_READY ? "START PAIRING"
                : pairStatus == pairing_state_e.PAIR_REQUEST_SUCCESS_N_CONNECTING ? "Connecting..."
                  : pairStatus == pairing_state_e.PAIR_SUCCESS ? "Go To Dashboard"
                    : pairStatus == pairing_state_e.PAIR_NO_SSID ? "no ssid, Try Again"
                      : pairStatus == pairing_state_e.PAIR_UNKNOWN_ERROR ? "Try Again"
                        : pairStatus == pairing_state_e.PAIR_WRONG_PASSWORD ? "wrong, pass, Try Again"
                          : ""}
          </Animated.Text>
        </NewRectButtonWithChildren>

        {/* Sec: goBack() */}
        <NewRectButtonWithChildren
          style={styles.goBackButton}
          onPress={() => onInteraction({ opID: "BACK" })}
        >
          <Text style={{ fontSize: 12, fontWeight: "bold", color: "#555" }}>
            Change WiFi or goBack()
          </Text>
        </NewRectButtonWithChildren>
      </View>
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    flex: 1,
  },
  card: {},
  BGLayer_layout1: {
    flex: 0.8,
    backgroundColor: "#5555ff",
    alignItems: "center",
    justifyContent: "center",
  },
  BGLayer_layout1_TextInput: {
    height: 50,
    width: width * 0.8,
    borderColor: "#ffffff",
    color: "#ffffff",
    borderWidth: 1,
    borderRadius: 25,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
    alignSelf: "center",
    marginTop: 20,
  },
  BGLayer_layout2: {
    flex: 1.2,
    backgroundColor: "white",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  Button1_Container: {
    justifyContent: "center",
    overflow: "hidden",
  },
  Button1: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#55f",
    height: 50,
    borderRadius: 25,
    width: width * 0.9,
  },
  Button1_Text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  Button2_Container: {
    position: "absolute",
    alignSelf: "center",
    overflow: "hidden",
    width: width * 0.8,
    height: 50,
    borderRadius: 25,
  },
  Button2: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },

  Button2_Text: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  goBackButton: {
    marginBottom: 10,
    marginTop: 10,
    backgroundColor: "#fff",
    paddingVertical: 10,
    width: width * 0.8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
  }
});