import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { Image, Text, View, Modal } from "react-native";
import { MainRouterStackParamList } from "../../../routers/MainRouter";
import { getWebSocket } from "../../../services/backGroundServices/webSocket";
import { logger } from "../../../util/logger";
import { NewRectButton } from "../../common/buttons/RectButtonCustom";
import styles from "../../../styles";


const slides = [
  {
    heading: "Playful",
    subText: "choose with different preset and scenes, and play with million of colors",
    assest: require("../../../../assets/images/onboarding/OB_3.png"),
  },
  {
    heading: "Voice Control",
    subText: "Now pair your light with voice assistants like alexa, Google Assistant to enjoy effortless and voice controls",
    assest: require("../../../../assets/images/onboarding/OB_4.png"),
  },
  {
    heading: "Control from Anywhere",
    subText: "Control your appliances from anywhere in the world with HUElite Smart App",
    assest: require("../../../../assets/images/onboarding/OB_2.png"),
  }
  ,
  {
    heading: "Ease of Use",
    subText: "Full control weather you have singler or multiple lights, from one screen. Just pair your device and you are good to go",
    assest: require("../../../../assets/images/onboarding/OB_1.png"),
  }
]

type navigationProp_t = StackNavigationProp<MainRouterStackParamList, "onboarding">;
type routeProp_t = RouteProp<MainRouterStackParamList, "onboarding">;

interface props_t {
  navigation: navigationProp_t;
  route: routeProp_t;
}

export const WelcomeScreen = ({ navigation }: props_t) => {
  const [slideIndex, setSlideIndex] = useState(0)

  return (
    <View style={{
      backgroundColor: styles.themeColors.primary,
      flex: 1,
      display: "flex"
    }}>
      <Header slideIndex={slideIndex} />
      <Footer
        onNext={() => {
          if (slideIndex < slides.length - 1)
            setSlideIndex(slideIndex + 1)
          else if (slideIndex == slides.length - 1)
            navigation.replace("user")
        }}
        onSkip={() => {
          navigation.replace("user")
        }} />
    </View>
  );
};


const Header = ({ slideIndex }: { slideIndex: number }) => {
  const [ws, setWs] = useState<WebSocket | undefined | null>(undefined)

  useEffect(() => {
    if (!ws) {
      try {
        (async () => {
          let _log = new logger("SOCKET TEST")
          _log?.print("socket test loop")
          const ws = await getWebSocket({
            ipAddr: "192.168.4.1",
            onMsg: (msg) => {
              _log?.print("msg>>>> " + msg)
            },
            onErr: (err) => {
              _log?.print("err>>>>" + JSON.stringify(err))
            },
            onOpen: () => {
              _log?.print("Open>>>  new socket opened")
            },
            onClose: () => {
              _log?.print(">>>>>>>>>>>> socket closed")
            }
          })
          if (ws)
            _log?.print("we have socket")
          else
            _log?.print("socket cannot be opened")
        })()
      } catch (error) {
        console.log("error on try catch block >>> " + JSON.stringify(error))
      }
    }
    return () => { }
  }, [ws])

  return (
    <View style={{
      backgroundColor: "white",
      flex: 1,
      borderBottomLeftRadius: 25,
      borderBottomRightRadius: 25,
      overflow: "hidden"
    }}>
      <View /** header slides container */
        style={{
          flex: 1,
          height: "100%",
          width: slides.length + "00%",
          display: "flex",
          flexDirection: "row",
          position: "absolute",
          top: 0,
          left: "-" + slideIndex + "00%"
        }}>
        {slides.map((item, index) => {
          return (
            <View
              key={index}
              style={{
                paddingHorizontal: 20,
                flex: 1,
                //backgroundColor: "red",
                justifyContent: "center",
                alignItems: "center"
              }}>
              <Image
                source={item.assest}
                style={{
                  height: 300,
                  width: 250
                }} />
              <Text style={[
                styles.H1,
                {
                  textAlign: "center",
                  marginTop: 50
                }]}>{item.heading}</Text>
              <Text style={[styles.H7, { textAlign: "center", marginTop: 20 }]}>{item.subText}</Text>
            </View>
          )
        })}
      </View >
      <View /** slider dots container */
        style={{
          position: "absolute",
          width: "100%",
          bottom: 15,
          left: 0,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          //backgroundColor: "green"
        }}>
        {slides.map((item, index) => {
          return (
            <View
              key={index}
              style={{
                height: 8,
                width: slideIndex == index ? 15 : 8,
                borderRadius: 10,
                backgroundColor: styles.themeColors.primary,
                marginHorizontal: 5
              }} />
          )
        })}
      </View>
    </View >

  )
}

const Footer = ({ onNext, onSkip }: { onNext: () => void, onSkip: () => void }) => {

  return (
    <View style={{
      //backgroundColor: 'red',
      backgroundColor: styles.themeColors.primary,
      justifyContent: "flex-end",
    }}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 20
        }}>
        <NewRectButton
          text="Skip"
          textStyle={[styles.H6, { color: "white" }]}
          buttonStyle={{
            width: 100,
            alignSelf: "center",
            backgroundColor: "transparent",
            shadowOpacity: 0,
            elevation: 0
          }}
          onPress={onSkip} />
        <NewRectButton
          text="Next"
          textStyle={[styles.H6, { color: "white" }]}
          buttonStyle={{
            width: 100,
            alignSelf: "center",
            backgroundColor: "transparent",
            shadowOpacity: 0,
            elevation: 0
          }}
          onPress={onNext} />
      </View>
    </View >
  )
}