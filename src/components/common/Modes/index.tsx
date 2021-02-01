import React, { useState } from "react";
import { FlatList, Image, Text, View } from "react-native";
import UNIVERSALS from "../../../@universals";
import API from "../../../@api";
import styles from "../../../styles";
import { NewRectButtonWithChildren } from "../buttons/RectButtonCustom";

interface mode_i {
  name: string
  img: any
  modeData: { modeSet: { time: number, color: string }[] }
}
const modes: mode_i[] = [
  {
    name: "Romance",
    img: require("../../../../assets/images/presetImages/scenes/romance.jpg"),
    modeData: { modeSet: [{ time: 5000, color: "#4f0000" }, { time: 3000, color: "#300726" }, { time: 4000, color: "#301040" }] }
  },
  {
    name: "Candle Light",
    img: require("../../../../assets/images/presetImages/scenes/candle_light.jpg"),
    modeData: { modeSet: [{ time: 6000, color: "#644100" }, { time: 2000, color: "#645500" }, { time: 1000, color: "#645920" }] }
  },
  {
    name: "Realxing",
    img: require("../../../../assets/images/presetImages/scenes/relaxing.jpg"),
    modeData: { modeSet: [{ time: 6000, color: "#00ffff" }, { time: 3000, color: "#4a4a4a" }, { time: 3000, color: "#25424b" }] }
  },
  {
    name: "Rainbow",
    img: require("../../../../assets/images/presetImages/scenes/rainbow.jpg"),
    modeData: { modeSet: [{ time: 4000, color: "#0000ff" }, { time: 4000, color: "#180726" }, { time: 4000, color: "#4a4a4a" }, { time: 4000, color: "#00ff00" }, { time: 4000, color: "#645700" }, { time: 4000, color: "#ff3a00" }, { time: 4000, color: "#ff0000" }] }
  },
  {
    name: "SoS",
    img: require("../../../../assets/images/presetImages/scenes/sos.jpg"),
    modeData: { modeSet: [{ time: 500, color: "#0000ff" }, { time: 500, color: "#ff0000" }] }
  },
  {
    name: "Night Light",
    img: require("../../../../assets/images/presetImages/scenes/night_light.jpg"),
    modeData: { modeSet: [{ time: 7000, color: "#210000" }, { time: 7000, color: "#002100" }, { time: 7000, color: "#000021" }] }
  },
  {
    name: "Energising",
    img: require("../../../../assets/images/presetImages/scenes/energising.jpg"),
    modeData: { modeSet: [{ time: 4000, color: "#921212" }, { time: 4000, color: "#647812" }, { time: 4000, color: "#445743" }, { time: 4000, color: "#003755" }] }
  },
  {
    name: "Warmth",
    img: require("../../../../assets/images/presetImages/scenes/warmth.jpg"),
    modeData: { modeSet: [{ time: 5500, color: "#ff0000" }, { time: 5500, color: "#ff2a00" }, { time: 5500, color: "#645700" }] }
  },
  {
    name: "Aurora",
    img: require("../../../../assets/images/presetImages/scenes/aurora.jpg"),
    modeData: { modeSet: [{ time: 5000, color: "#0000ff" }, { time: 5000, color: "#08562b" }, { time: 5000, color: "#00ff00" }] }
  },
  {
    name: "Fortnite",
    img: require("../../../../assets/images/presetImages/scenes/fortnite.jpg"),
    modeData: { modeSet: [{ time: 5000, color: "#0000ff" }, { time: 5000, color: "#180726" }, { time: 5000, color: "#300726" }] }
  }
];

interface Props {
  device: UNIVERSALS.GLOBALS.DEVICE_t;
}

export const Modes = ({ device }: Props) => {
  const [modeBusy, setModeBusy] = useState(false)

  return (
    <View
      style={{
        //backgroundColor: "#555",
        width: "100%",
      }}>
      <FlatList
        horizontal
        data={modes}
        keyExtractor={(_, index) => {
          return "" + index;
        }}
        renderItem={({ item, index }) => {
          return (
            <ModesCard item={item} device={device} modeBusy={modeBusy} setModeBusy={setModeBusy} />
          );
        }}
      />
    </View>
  );
};


const ModesCard = ({ item, device, modeBusy, setModeBusy }: { item: mode_i, device: UNIVERSALS.GLOBALS.DEVICE_t, modeBusy: boolean, setModeBusy: React.Dispatch<React.SetStateAction<boolean>> }) => {

  return (
    <NewRectButtonWithChildren
      style={[, styles.shadow, {
        width: 135,
        height: 200,
        backgroundColor: "#eee",
        marginRight: 20
      }]}
      innerCompStyle={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
      onPress={async () => {
        if (!modeBusy) {
          setModeBusy(true)
          const res = await API.deviceAPI.modeAPI.v1({
            IP: device.IP,
            modeData: JSON.stringify(item.modeData)
          })
          setTimeout(async () => {
            setModeBusy(false)
          }, 1000);
        }
      }}>
      <Image
        style={{
          height: 210,
          width: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          opacity: modeBusy ? 0.5 : 1
        }}
        source={item.img}
      />
      <View style={{
        position: "absolute",
        left: 0,
        top: 0,
        height: "100%",
        width: "100%",
        opacity: 0.2,
        zIndex: 2,
        backgroundColor: "black"
      }} />
      <Text
        style={{ fontSize: 18, color: "#fff", fontWeight: "bold", zIndex: 3, marginBottom: 25 }}
      > {item.name} </Text>
    </NewRectButtonWithChildren>
  )
}
