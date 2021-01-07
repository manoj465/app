import { types } from "../../../../@types/huelite";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import LottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import { Alert, Dimensions, FlatList, StyleSheet, Text, Vibration, View } from "react-native";
import { RectButton, TextInput } from "react-native-gesture-handler";
import Animated, { Value } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
//native imports
import { PairingStackParamList } from "..";
import { reduxStore } from "../../../../redux";
import { newDeviceSagaAction } from "../../../../redux/actions/pairingActions";
import usePairApiHook, { pairing_state_e } from "../../../../services/webApi/pairAPI_Hook";
import { dummyDevice, GROUP_TYPES } from "../../../../util/dummyData/DummyData";
import { HUE_CONTAINER_t, HUE_CONTAINER_TYPE_e } from "../../../../@types/huelite/container";
import { deviceListOperation } from "../../../../util/app.operator/device.operator";

const groupNames = ["Bedroom", "Kitchen", "Garden", "Drawing Lamps", "Stairs"];

const { width, height } = Dimensions.get("window");

type NavigationProp = StackNavigationProp<
  PairingStackParamList,
  "PairScreen_3"
>;

type _RouteProp = RouteProp<PairingStackParamList, "PairScreen_3">;

type connectProps = (ssid: string, pass: string) => Promise<boolean>;

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
  const [pass, setPass] = useState("Ioplmkjnb@1");
  const [groupName, setGroupName] = useState("");
  const progress = new Value(0);
  let _animation = null;
  const [socket, IP, pair, pairStatus] = usePairApiHook({
    IP: "192.168.4.1",
    _onMsg: (msg) => {
      //console.log("socket msg on Pairing Screen---- " + JSON.stringify(msg));
    },
  });

  const validateData = () => {
    if (!newDevice.ssid)
      return false
    return true
  }

  interface onInteraction_t { opID: "PAIR" | "BACK" }
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

      default:
        break;
    }
  }

  useEffect(() => {
    if (pairStatus == pairing_state_e.PAIR_READY)
      Vibration.vibrate(250);
    else if (pairStatus == pairing_state_e.SAVE_CONFIG_SUCCESS) {
      (async () => {
        const newContainerList = await deviceListOperation({ props: { cmd: "ADD_NEW_DEVICE", newDevice: { ...newDevice, IP, groupName }, forceUpdate: true } })
        //@ts-ignore
        navigation.replace("dashboard");
        navigation.reset({
          index: 0,
          routes: [{ name: "dashboard" }],
        });
      })()
    } else if (pairStatus == pairing_state_e.SAVE_CONFIG_ERROR) { }
    return () => { };
  }, [pairStatus]);


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
                <RectButton
                  onPress={() => {
                    setGroupName(item);
                    Vibration.vibrate(50);
                  }}
                  style={{ alignSelf: "flex-start", padding: 5 }}
                >
                  <View
                    style={{
                      borderWidth: 0.5,
                      borderColor: "#fff",
                      borderRadius: 18,
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                    }}
                  >
                    <Text style={{ fontSize: 12, color: "#fff" }}>{item}</Text>
                  </View>
                </RectButton>
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
            : pairStatus == pairing_state_e.PAIR_REQUEST_SENT || pairStatus == pairing_state_e.PAIR_REQUEST_SUCCESS_N_CONNECTING ? require("../../../../../assets/lottie/progress.json")
              : pairStatus == pairing_state_e.PAIR_TIMEOUT || pairStatus == pairing_state_e.PAIR_UNKNOWN_ERROR || pairStatus == pairing_state_e.PAIR_WRONG_PASSWORD ? require("../../../../../assets/lottie/error.json")
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
        <RectButton
          activeOpacity={0.3}
          style={styles.Button1}
          onPress={() => {
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
            {pairStatus < pairing_state_e.PAIR_READY
              ? "Waiting for Connection"
              : pairStatus == pairing_state_e.PAIR_READY
                ? "START PAIRING"
                : pairStatus == pairing_state_e.PAIR_REQUEST_SENT || pairStatus == pairing_state_e.PAIR_REQUEST_SUCCESS_N_CONNECTING
                  ? "Connecting..."
                  : pairStatus == pairing_state_e.PAIR_SUCCESS
                    ? "Go To Dashboard"
                    : pairStatus == pairing_state_e.PAIR_TIMEOUT || pairStatus == pairing_state_e.PAIR_UNKNOWN_ERROR || pairStatus == pairing_state_e.PAIR_WRONG_PASSWORD
                      ? "Try Again"
                      : ""}
          </Animated.Text>
        </RectButton>

        {/* Sec: goBack() */}
        <RectButton
          style={styles.goBackButton}
          onPress={() => onInteraction({ opID: "BACK" })}
        >
          <Text style={{ fontSize: 12, fontWeight: "bold", color: "#555" }}>
            Change WiFi or goBack()
          </Text>
        </RectButton>
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