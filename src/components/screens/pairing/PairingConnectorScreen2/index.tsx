import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { Dimensions, FlatList, StyleSheet, Text, Vibration, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Animated, { add, call, divide, interpolate, round, useCode } from "react-native-reanimated";
import { onScrollEvent, useValue } from "react-native-redash";
import { SafeAreaView } from "react-native-safe-area-context";
import { PairingStackParamList } from "..";
import { logger } from "../../../../@logger";
import { appOperator } from "../../../../app.operator";
import reduxStore from "../../../../redux";
import useScanApiHook from "../../../../services/webApi/webHooks";
import { getCurrentTimeStampInSeconds } from "../../../../util/DateTimeUtil";
import Alert from "../../../common/Alert";
import { NewRectButtonWithChildren } from "../../../common/buttons/RectButtonCustom";

const deviceNames = [
  "Bedroom Light",
  "Kitchen",
  "Garden Light",
  "Balcony",
  "SwimmingPool",
];

type pairingScreen2NavigationProp = StackNavigationProp<
  PairingStackParamList,
  "PairScreen_2"
>;

type pairingScreen2RouteProp = RouteProp<PairingStackParamList, "PairScreen_2">

interface Props {
  navigation: pairingScreen2NavigationProp;
  route: pairingScreen2RouteProp;
}

const { width, height } = Dimensions.get("window");
export const PairingConnectorScreen2 = ({
  navigation,
  route: {
    params: { newDevice },
  },
}: Props) => {
  const log = new logger("PAIRING_SCREEN_2");
  const [data, status, loading, error, load] = useScanApiHook({
    log: log ? new logger("scan API Hook", log) : undefined,
    autoStart: true
  });
  const debug = true;
  const [Wifi, setWifi] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const y = useValue(0);
  const onScroll = onScrollEvent({ y });
  const selected = round(divide(y, 60));


  useCode(
    () => [
      call([selected], ([selected]) => {
        if (data?.RES?.networks && data?.RES?.networks[selected]) {
          if (Wifi != data?.RES?.networks[selected].ssid) {
            log.print("-- " + data?.RES?.networks[selected].ssid);
            setWifi(data?.RES?.networks[selected].ssid);
            Vibration.vibrate(25);
          }
        }
      }),
    ],
    [selected]
  );

  const validateNewDeviceData = (opID: "PAIR" | "SKIP") => {

    const validateDeviceName = () => {
      if (deviceName.length < 6) {
        Alert.alert(
          "DEVICE NAME LENGTH !!",
          "device length must be atleast 6 characters",
          [
            {
              text: "Got it",
              //onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
          ],
          { cancelable: false }
        );
        return false
      } else if ((() => {
        let sameDeviceNameFound = false
        reduxStore.store.getState().deviceReducer.deviceList.forEach((__device) => {
          if (__device.deviceName == deviceName)
            sameDeviceNameFound = true
        })
        return sameDeviceNameFound
      })()) {
        log.print("validating device name >>")
        Alert.alert(
          "DUPLICATE DEVICE NAME",
          "device name  \"" + deviceName + "\", try another name for this device",
          [
            {
              text: "Got it",
              //onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
          ],
          { cancelable: false }
        );
        return false
      }
      return true
    }

    const validateWiFi = () => {
      if (!Wifi.length) {
        Alert.alert(
          "No WiFi Selected !!",
          "Select a network to pair with, else continue without pairing at the bottom of the screen.",
          [
            {
              text: "Got it",
              style: "cancel",
            },
          ],
          { cancelable: false }
        );
        return false
      }
      return true
    }

    switch (opID) {
      case "PAIR":
        return validateDeviceName() && validateWiFi()
        break;

      case "SKIP":
        return validateDeviceName()
        break;

      default:
        break;
    }
  }


  interface onInteraction_t {
    opID: "PAIR" | "SKIP"
  }
  const onInteraction = async ({ opID }: onInteraction_t) => {
    switch (opID) {
      case "PAIR":
        log.print("now pairing")
        if (validateNewDeviceData("PAIR")) {
          navigation.replace("PairScreen_3", { newDevice: { ...newDevice, ssid: Wifi, deviceName } });
        }
        break;

      case "SKIP":
        log.print('SKIP LOGIN')
        if (validateNewDeviceData("SKIP")) {
          log.print("validation passed, adding new device without pairing")
          const newContainerList = appOperator.device({ cmd: "ADD_UPDATE_DEVICES", newDevices: [{ ...newDevice, deviceName, localTimeStamp: getCurrentTimeStampInSeconds() }] })
          console.log("updated conatiner list >> >> " + JSON.stringify(newContainerList))
          //@ts-ignore
          navigation.replace("dashboard");
          navigation.reset({
            index: 0,
            //@ts-ignore
            routes: [{ name: "dashboard" }],
          });
        }
        else {
          log.print("validation failed")

        }
        break;

      default:
        break;
    }

  };

  return (
    <SafeAreaView style={styles.conatiner}>

      {/* Sec: HeaderContainer */}
      <View style={styles.headerContainer} >
        <Text style={{ fontSize: 12, fontWeight: "bold", color: "white" }}>
          Enter Device Name
          </Text>
        <TextInput
          style={styles.headerContainerText}
          placeholderTextColor="#ccc"
          onChangeText={(text) => {
            setDeviceName(text);
          }}
          placeholder="Light 1"
          value={deviceName}
        />
        <View
          style={{
            alignItems: "flex-start",
            marginTop: 30,
          }}
        >
          <FlatList
            data={deviceNames}
            numColumns={3}
            renderItem={({ item }) => (
              <NewRectButtonWithChildren
                onPress={() => {
                  setDeviceName(item);
                  //Vibration.vibrate(50); //TODO move this to useCode/call function for better feedback
                }}
                style={{
                  alignSelf: "flex-start",
                  height: 25,
                  borderWidth: 0.5,
                  borderColor: "#fff",
                  borderRadius: 18,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  backgroundColor: deviceName == item ? "#fff" : "#55f",
                  marginHorizontal: 5
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: deviceName == item ? "#55f" : "#fff",
                  }}
                >
                  {item}
                </Text>
              </NewRectButtonWithChildren>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
      {/* Sec: SSID Selector */}
      <View style={styles.ssidSelectorContainer}  >
        <Text style={{ fontSize: 15, fontWeight: "bold", color: "#555" }}>
          Select your Home Wi-Fi Network
          </Text>
        <Text
          style={{
            fontSize: 12,
            color: "#555",
            paddingTop: 10,
            paddingHorizontal: 30,
            textAlign: "center",
          }}>
          Make sure the WiFi is on and your device is in range of the network. Turn off your mobile data
          </Text>
        {/* Sec: Wifi refresh button */}
        <NewRectButtonWithChildren
          style={styles.refreshButton}
          onPress={() => {
            log.print("refresh wifi scan api response")
            load()
            Vibration.vibrate(50);
          }}>
          <View style={styles.refreshButton_textCon} >
            <Text style={{ fontSize: 10, fontWeight: "bold", color: "#55f" }}>
              Refresh WiFi Scan
              </Text>
          </View>
        </NewRectButtonWithChildren>
        {/* Sec: Selector */}
        <View style={styles.selectorList} >
          <Animated.ScrollView
            style={{
              overflow: "hidden",
            }}
            snapToInterval={60}
            decelerationRate="fast"
            showsVerticalScrollIndicator={false}
            bounces={false}
            scrollEventThrottle={1}
            {...{ onScroll }}
          >
            {data?.RES?.networks && data?.RES?.networks?.length > 0 &&
              data?.RES?.networks.map((item, index) => {
                const positionY = add(y, -index * 60);
                const opacity = interpolate(positionY, {
                  inputRange: [-60, 0, 60],
                  outputRange: [0.5, 1, 0.5],
                });
                const scale = interpolate(positionY, {
                  inputRange: [-60, 0, 60],
                  outputRange: [0.7, 1, 0.7],
                });

                return (
                  <View key={index}>
                    {index == 0 && <View style={{ height: 60 }}></View>}
                    <View
                      style={{
                        height: 60,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Animated.Text
                        style={{
                          fontSize: 20,
                          color: "#555",
                          fontWeight: "bold",
                          opacity: opacity,
                          transform: [{ scaleX: scale }, { scaleY: scale }],
                        }}
                      >
                        {item.ssid}
                      </Animated.Text>
                    </View>
                    {(data?.RES?.networks && index == data?.RES?.networks?.length - 1) && (
                      <View style={{ height: 60 }}></View>
                    )}
                  </View>
                );
              })}

            {(data?.RES?.networks && data?.RES?.networks.length == 0) && (
              <View
                style={{
                  justifyContent: "center",
                  height: 180,
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 30,
                    color: "#555",
                    textAlign: "center",
                  }}
                >
                  Scanning...
                  </Text>
              </View>
            )}
          </Animated.ScrollView>
        </View>
      </View>
      {debug && <Text style={{}}>{Wifi}</Text>}
      {/* Sec: Bottom buttons */}
      <NewRectButtonWithChildren
        style={[styles.pairButton, { opacity: deviceName.length > 6 ? 1 : 0.9, }]}
        onPress={() => onInteraction({ opID: "PAIR" })}>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}>
          Pair Device
          </Text>
      </NewRectButtonWithChildren>
      <NewRectButtonWithChildren
        style={styles.skipButton}
        onPress={() => onInteraction({ opID: "SKIP" })}
      >
        <Text style={{ fontSize: 12, fontWeight: "bold", color: "#555" }}>
          Continue without Wi-Fi Pairing
          </Text>
      </NewRectButtonWithChildren>
    </SafeAreaView >
  );
};


const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",

  },
  ssidSelectorContainer: {
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
    paddingTop: 20,
  },
  refreshButton: {
    borderRadius: 15,
    overflow: "hidden",
    marginVertical: 15,
  },
  refreshButton_textCon: {
    backgroundColor: "#fff",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 15,
    borderColor: "#55f",
    borderWidth: 1,
  },
  selectorList: {
    width: "100%",
    height: 180,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginTop: 10,
  },
  headerContainer: {
    paddingHorizontal: 15,
    backgroundColor: "#55f",
    width: "95%",
    minHeight: 200,
    marginVertical: 20,
    borderRadius: 25,
    paddingVertical: 20,
  },
  headerContainerText: {
    height: 50,
    width: "100%",
    borderColor: "#ffffff",
    color: "#ffffff",
    /*  borderWidth: 1,
    borderRadius: 25, */
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
    alignSelf: "center",
    marginTop: 5,
    borderBottomWidth: 0.5,
  },
  skipButton: {
    marginBottom: 10,
    marginTop: 10,
    backgroundColor: "#fff",
    paddingVertical: 10,
    width: width * 0.8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
  },
  pairButton: {
    backgroundColor: "#55f",
    height: 50,
    width: width * 0.8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
  }
})
