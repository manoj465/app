import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Button,
} from "react-native";
import { withNavigationFocus, SafeAreaView } from "react-navigation";
import { heartBeatHandler } from "../../backGroundServices/Heartbeat";
import DeviceSettings from "react-native-device-settings";
import { connect } from "react-redux";
import { deviceListAction } from "../../../redux/deviceListReducer/actions/DeviceListAction";
import { ICON } from "../common/constants/ImageConstant";
import CardComponent from "./components/CardComponent";
import RouteHeader from "../common/customComponents/RouteHeader";
import Slider from "../common/customComponents/SliderAnimation";
import NetInfo from "@react-native-community/netinfo";
import { getDeviceListFromDb } from "../../database/table/DeviceTable";

class Dashboard extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidUpdate() {
    let dl = await getDeviceListFromDb();
    let { deviceList, deviceListAction } = this.props;
    //console.log("++++" + JSON.stringify(deviceList));
  }

  async componentDidMount() {
    let { SSID } = this.props.navigation.getParam(
      "otherParam",
      "default value"
    );
    if (SSID) {
      NetInfo.fetch().then((info) => {
        /**Condition needs to implement for redirection to wifi setting or pairing form screen */
        if (info.type === "wifi" && info.details.ssid === SSID) {
          // this.navigateToPairingForm();
        } else {
          Alert.alert(
            "Alert",
            `You need to connect your device from wifi '${SSID}'.`,
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "OK",
                onPress: () => DeviceSettings.wifi(),
              },
            ]
          );
        }
      });
    }
    let self = this;
    let { deviceList, deviceListAction } = self.props;
    //EXP_START: whats happening here
    if (window._interval) {
      clearInterval(window._interval);
    }
    window._interval = setInterval(async () => {
      let { deviceList, deviceListAction } = self.props;
      await heartBeatHandler(deviceList, deviceListAction);
    }, 3000);
    //EXP_STOP:
  }

  render() {
    let { deviceList, deviceListAction } = this.props;
    return (
      <View style={styles.container}>
        <SafeAreaView style={{ height: "100%" }}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("MainPanel");
              }}
            >
              <Image style={styles.image} source={ICON.HamburgerIcon} />
            </TouchableOpacity>
            <RouteHeader
              onPress={() => {
                this.props.navigation.navigate("WifiSearchScreen");
              }}
            />
          </View>
          <View style={styles.body}>
            <Text style={styles.textinput}>Dashboard</Text>
            <FlatList
              data={deviceList}
              keyExtractor={(item, index) => item.SSID + index}
              extraData={deviceList}
              renderItem={({ item, index }) => {
                return (
                  <Slider index={index}>
                    <CardComponent
                      device={item}
                      deviceList={deviceList}
                      deviceListAction={deviceListAction}
                      navigation={this.props.navigation}
                    />
                  </Slider>
                );
              }}
            />
          </View>
          <View style={[styles.warning, { display: "none" }]}>
            <Text>this is deffault text</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingRight: 0,
    paddingLeft: 0,
    height: "100%",
    backgroundColor: "#fff",
    flex: 1,
  },
  header: {
    height: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    borderWidth: 0,
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
    height: "100%",
    borderWidth: 0,
  },
  textinput: {
    paddingTop: 5,
    fontSize: 20,
    fontWeight: "bold",
    paddingBottom: 10,
  },
  image: {
    width: 30,
    height: 30,
  },
  warning: {
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ededed",
    borderTopLeftRadius: 30,
    borderTopEndRadius: 30,
  },
});

const mapStateToProps = (state) => {
  return {
    deviceList: state,
  };
};

export default withNavigationFocus(
  connect(mapStateToProps, { deviceListAction })(Dashboard)
);
