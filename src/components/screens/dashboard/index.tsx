import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { useValue } from "react-native-redash";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
//native imports
import { _appState } from "../../../redux/reducers";
import { MainRouterStackParamList } from "../../../routers/MainRouter";
import { logger } from "../../../util/logger";
import { DeviceCard } from "./containerItem/deviceCard";
import Header from './newHeader';

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
  const y = useValue(0)
  const scrollViewRef = useRef(null)
  //const state = useValue(State.UNDETERMINED)
  //const onScroll = onScrollEvent({ y })
  //const scroll = useRef(null);


  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} />
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
              <View>
                <DeviceCard
                  device={device}
                  navigation={navigation}
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
      {/* Sec2:  */}
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