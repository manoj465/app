import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useRef, useState } from "react";
import { Text, View, TextInput, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
//native imports
import { _appState } from "../../../redux/rootReducer";
import { MainRouterStackParamList } from "../../../routers/MainRouter";
import STYLES from "../../../styles";
import { appOperator } from "../../../@operator";
import { logger } from "../../../@logger";
import { NewRectButton, NewRectButtonWithChildren } from "../../common/buttons/RectButtonCustom";
import useDeleteDeviceModal from "../../common/useDeleteDeviceModal";
import { DeviceCard } from "./deviceCard";
import Header from './Header';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

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
  const { DeleteModal, onDeleteAsk } = useDeleteDeviceModal({
    visible: (state_deleteDeviceModal.length > 0) ? true : false,
    onDeleteComplete: () => { set_state_deleteDeviceModal("") }
  })

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

      <DeleteModal
        outerContainerStyle={{
          backgroundColor: "#0000007f",
        }}
        style={{
          width: "85%",
          borderRadius: 15,
          backgroundColor: "#ffffff"
        }}
        Node={() => {
          const [unpairText, setUnpairText] = useState("")
          useEffect(() => {
            if (unpairText.toLowerCase() == "unpair") {
              onDeleteAsk({ Mac: state_deleteDeviceModal })
            }
            return () => { }
          }, [unpairText])


          return (
            <View /* Sec2: Modal inner container */ style={[STYLES.shadow, { borderRadius: 20, width: '80%' }]}>

              <View /* Sec3: textField container */
                style={{
                  paddingHorizontal: 20,
                  marginTop: 20,
                  //backgroundColor: "red"
                }}>
                <Text style={[STYLES.H5, { textAlign: "center" }]}>DELETE DEVICE</Text>
                <MaterialCommunityIcons name="delete-forever" size={200} color={STYLES.textColors.warning} style={{ alignSelf: "center", opacity: 0.5 }} />
                <TextInput
                  style={{
                    minWidth: 200,
                    borderBottomColor: "#555",
                    borderBottomWidth: 0.25,
                    textAlign: "center",
                    fontWeight: "bold",
                    marginTop: 20,
                    color: STYLES.warningText.color
                  }}
                  placeholder="type UNPAIR to delete"
                  value={unpairText}
                  onChangeText={(text) => {
                    setUnpairText(text)
                  }} />
              </View>

              <View style={{/* Sec3: Buttons */
                display: "flex",
                flexDirection: "row",
                marginTop: 25,
              }}>
                <NewRectButton /* Sec3: delete button */
                  useReanimated={false}
                  text="cancel"
                  shadow={false}
                  buttonStyle={{
                    width: "100%",
                    backgroundColor: "transparent"
                  }}
                  textStyle={{ fontSize: 16, fontWeight: "bold" }}
                  onPress={() => {
                    console.log("DEVICE REMOVE cancel : ")
                    set_state_deleteDeviceModal("")
                  }} />
              </View>


            </View>
          )
        }}
      />
      {/* Sec:  */}
      {false && <View style={styles.navigatorMenu}>
        <NewRectButtonWithChildren
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
        </NewRectButtonWithChildren>
        <NewRectButtonWithChildren
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
        </NewRectButtonWithChildren>
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
    paddingHorizontal: "2%",
    marginTop: 20
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