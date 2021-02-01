import React, { useRef, useState } from "react";
import { Text, View } from "react-native";
import TextField from "../../../../common/text/textField"
import { SafeAreaView } from "react-native-safe-area-context";
import { devicePageStackParamList } from "../..";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { NewRectButtonWithChildren } from "../../../../common/buttons/RectButtonCustom";
import STYLES from "../../../../../styles"
import { useSelector } from "react-redux";
import { _appState } from "../../../../../redux/rootReducer";
import UNIVERSALS from "../../../../../@universals";
import { appOperator } from "../../../../../@operator";
import Alert from "../../../../common/Alert";

type navigation_t = StackNavigationProp<
  devicePageStackParamList,
  "DeviceColorPicker"
>;
type routeProp_t = RouteProp<
  devicePageStackParamList,
  "DeviceColorPicker"
>;



interface Props {
  navigation: navigation_t;
  route: routeProp_t;
}
export const DeviceSettingScreen = ({
  navigation,
  route: {
    params: { device },
  },
}: Props) => {
  const [name, setName] = useState("")
  const deviceFromStore = useSelector((state: _appState) => state.deviceReducer.deviceList.find(item => item.Mac == device.Mac))

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <TextField
        heading="Device Name"
        placeholder={deviceFromStore?.deviceName}
        setValue={setName}
        value={name}
      />
      <NewRectButtonWithChildren style={{
        height: 50,
        width: 250,
        borderRadius: 25,
        backgroundColor: "#fff",
        alignSelf: "center",
        marginTop: 200,
        borderWidth: 0.5,
        justifyContent: "center",
        borderColor: name.length >= 6 ? "#00ff00" : "#777777"
      }}
        onPress={() => {
          if (name.length >= 6) {
            //console.log("old device is " + JSON.stringify(device, null, 2))
            let tempDevice: UNIVERSALS.GLOBALS.DEVICE_t = { ...device, deviceName: name }
            //console.log("new device is " + JSON.stringify(tempDevice, null, 2))
            appOperator.device({ cmd: "ADD_UPDATE_DEVICES", newDevices: [tempDevice] })
            setName("")
          } else if (name.length) {
            Alert.alert("DEVICE NAME TOO SHORT", "Device name must be atleast 6 characters log. consider using suffix or prefix with " + name)
          }
        }}
      >
        <Text style={[STYLES.H5, {
          textAlign: "center",
          color: name.length >= 6 ? "#00ff00" : "#777777"
        }]}>CHANGE DEVICE NAME</Text>
      </NewRectButtonWithChildren>
    </SafeAreaView>
  );
};
