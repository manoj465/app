import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useRef, useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { red, useValue } from "react-native-redash";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
//native imports
import { _appState } from "../../../redux/rootReducer";
import { MainRouterStackParamList } from "../../../routers/MainRouter";
import { logger } from "../../../util/logger";
import { DeviceCard } from "./deviceCard";
import Header from './Header';
import STYLES from "../../common/styles"
import { NewRectButton } from "../../common/buttons/RectButtonCustom";
import { LinearGradient } from "expo-linear-gradient";
import { appOperator } from "../../../util/app.operator";
//@ts-ignore
import Modal from "../../common/modal";

const navigationIconSize = 25;

export type navigationProp = StackNavigationProp<
  MainRouterStackParamList,
  "dashboard"
>;

type routeProp = RouteProp<MainRouterStackParamList, "dashboard">;

interface Props {
  navigation: navigationProp;
  route: routeProp;
}

export const Dashboard = ({ navigation, route: { params } }: Props) => {
  let log = new logger("DASHBOARD")
  const deviceList = useSelector(({ deviceReducer: { deviceList } }: _appState) => deviceList);
  const user = useSelector(({ appCTXReducer: { user } }: _appState) => user);
  //const user = useSelector(({ appCTXReducer: { user } }: _appState) => user);
  const scrollViewRef = useRef(null)
  const [state_deleteDeviceModal, set_state_deleteDeviceModal] = useState("")
  //const state = useValue(State.UNDETERMINED)
  //const onScroll = onScrollEvent({ y })
  //const scroll = useRef(null);

  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} user={user} />
      {/* /Sec1: deviceListContainer */}
      <Animated.ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        style={styles.deviceListContainer}
      >
        <View>
          {/* <View style={{ height: HEADER_MAX_HEIGHT + 60 }}></View> */}
          {deviceList.map((device, index) => {
            return (
              <View key={index}>
                <DeviceCard
                  device={device}
                  navigation={navigation}
                  setToBeDeletedDevice={set_state_deleteDeviceModal}
                  log={log}
                />
              </View>

            )
          })}

        </View>
      </Animated.ScrollView>
      {/*  <FlatList
        //ref={scroll}
        //onScroll={onScroll}
        showsVerticalScrollIndicator={false}
        data={containerList}
        keyExtractor={(item, index) =>
          "0" + index
        }
        extraData={containerList}
        renderItem={({ item, index }) => {
          return (
            <View />
          );
        }}
      /> */}
      <Modal /*///Modal */
        animationType="slide"
        transparent
        visible={state_deleteDeviceModal.length > 0}
      >
        <View /* Sec1: Modal outer container */
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <View /* Sec2: Modal inner container */
            style={[STYLES.shadow, {
              width: "85%",
              borderRadius: 20,
            }]}>
            <Text style={[STYLES.H6, STYLES.warningText, { marginVertical: 8 }]}>IMPORTANT NOTE</Text>
            <View style={{ paddingHorizontal: 20, width: "100%" }}>{/* Sec3: hint text container */}
              <Text style={[STYLES.H7, {
                marginVertical: 8,
                textAlign: "center",
              }]}>This will delete this device from this phone, to pair it with new phone, you have to reset the device manually. follow the following step to reset</Text>
              <Text style={[STYLES.H7, {}]}>1. Turn off the device </Text>
              <Text style={[STYLES.H7, {}]}>2. Now switch your HUElite device ON/OFF with a gap of 2 seconds between each toggle</Text>
              <Text style={[STYLES.H7, {}]}>3. Repeat the above step 5 times</Text>
              <Text style={[STYLES.H7, {}]}>4. Leave the device ON at last and wait for few seconds</Text>
              <Text style={[{ textAlign: "center", fontSize: 12, marginVertical: 15, paddingHorizontal: 20 }]}>your device should start blinking after 5 seconds and than restart after few more seconds. once completed you can initiate the pairing process</Text>
            </View>
            <View style={{/* Sec3: Buttons */
              display: "flex",
              flexDirection: "row",
              marginTop: 25,
            }}>
              <NewRectButton /* Sec3: delete button */
                useReanimated={false}
                buttonStyle={{
                  flex: 1,
                  marginHorizontal: 8
                }}
                text="delete"
                onPress={() => {
                  console.log("REMOVE DEVICE >> " + state_deleteDeviceModal)
                  appOperator.device({
                    cmd: "REMOVE_DEVICE",
                    Mac: state_deleteDeviceModal,
                    log: new logger("test function delete device")
                  })
                  set_state_deleteDeviceModal("")
                }} />
              <NewRectButton /* Sec3: cancel button */
                useReanimated={false}
                buttonStyle={{
                  flex: 1,
                  marginHorizontal: 8
                }}
                text="cancel"
                onPress={() => {
                  console.log("DEVICE REMOVE cancel : ")
                  set_state_deleteDeviceModal("")
                }} />
            </View>
            <View /* Sec3: modal footer */
              style={[STYLES.shadow, {
                width: "97%",
                height: 80,
                borderRadius: 15,
                backgroundColor: "red",
                marginHorizontal: "3%",
                marginTop: 15,
                marginBottom: 8,

              }]}
            >
              <LinearGradient
                style={[{
                  height: "100%",
                  width: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  borderRadius: 14,
                  overflow: "hidden",
                  backgroundColor: "transparent",
                }]}
                start={{ x: 0.3, y: 0 }}
                end={{ x: 1, y: 2 }}
                colors={["#00aaff", "#aa00aa"]} >
                <View style={[STYLES.absoluteFill, {
                  backgroundColor: "white",
                  opacity: 0.4
                }]} >
                  <Image source={require("../../../../assets/icons/icon-no-bg.png")} style={[STYLES.absoluteFill, { width: 200, height: "100%" }]} />
                  <Image source={require("../../../../assets/icons/icon-no-bg.png")} style={[STYLES.absoluteFill, { width: 50, height: "100%", left: "80%" }]} />
                </View>
              </LinearGradient>
            </View>
          </View>
        </View>
      </Modal>
      {/* Sec:  */}
      {false && <View style={styles.navigatorMenu}>
        <RectButton
          onPress={() => {
            //navigation.navigate("pairing");
            /* dispatch(
              newDeviceSagaAction({
                newDevice: Object.assign({}, dummyDevice, {
                  deviceName: "Kitchen TubeLight",
                  SSID: "Homelink1",
                  wifiPass: "Ioplmkjnb@1",
                  Mac: "ED:98:H3:49:f5",
                  groupName: "group",
                }),
                groupType: GROUP_TYPES.SINGLETON,
              })
            ); */
          }}
          style={{
            borderRightWidth: 0.5,
            justifyContent: "space-between",
            alignItems: "center",
            paddingRight: 10,
          }}
        >
          <View
            style={{
              //backgroundColor: "green",
              flex: 1,
              justifyContent: "center",
              height: 35,
            }}
          >
            <FontAwesome5
              name="layer-group"
              size={navigationIconSize}
              color="white"
            />
          </View>
          <View style={{ paddingVertical: 2 }}>
            <Text style={{ color: "white", fontSize: 12 }}>New Group</Text>
          </View>
        </RectButton>
        <RectButton
          onPress={() => {
            navigation.navigate("pairing");
          }}
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            paddingLeft: 10,
          }}
        >
          <View
            style={{
              //backgroundColor: "green",
              flex: 1,
              justifyContent: "center",
              height: 35,
            }}
          >
            <MaterialIcons
              name="add-circle-outline"
              size={navigationIconSize}
              color="white"
            />
          </View>
          <View style={{ paddingVertical: 2 }}>
            <Text style={{ color: "white", fontSize: 12 }}>Add Device</Text>
          </View>
        </RectButton>
      </View>}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    //backgroundColor: "#002",
    flex: 1,
  },
  ScreenName: {
    fontSize: 20,
    marginHorizontal: 100,
    transform: [{ translateX: 2 }],
  },
  deviceListContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    //backgroundColor: "#0aa",
    paddingHorizontal: "2%"
  },
  navigatorMenu: {
    backgroundColor: "#33f",
    paddingHorizontal: 10,
    borderRadius: 15,
    overflow: "hidden",
    alignSelf: "center",
    position: "absolute",
    bottom: 10,
    display: "flex",
    flexDirection: "row",
    /* shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 1, */
  },
});




//TODO setup dashboard with new DB-set
//TODO allOff button in dashboard
//TODO dashboard navigation block
//TODO device off on icon tap in deviceCard
//TODO deviceCard Icon selector