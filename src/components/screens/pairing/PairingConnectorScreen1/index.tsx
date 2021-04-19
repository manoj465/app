import { MaterialIcons } from '@expo/vector-icons';
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { ActivityIndicator, Dimensions, StyleProp, Text, TextStyle, View, ViewStyle } from "react-native";
import Animated, { interpolate } from "react-native-reanimated";
import { useTimingTransition } from "react-native-redash";
import { PairingStackParamList } from "..";
import { logger } from "../../../../@logger";
import { NewRectButtonWithChildren } from "../../../common/buttons/RectButtonCustom";
import Support from "../SupportComp";
import Frame2 from "./Frame2";
import Frame1 from "./Frame1";
import { STYLES } from '../../../../@styles';



type pairingScreen1NavigationProp = StackNavigationProp<PairingStackParamList, "PairScreen_1">;
type pairingScreen1RouteProp = RouteProp<PairingStackParamList, "PairScreen_1">;

interface Props {
  navigation: pairingScreen1NavigationProp;
  route: pairingScreen1RouteProp;
}

const { width, height } = Dimensions.get("window");
/**
 * 
 * @param param0 
 * 
 * 
 * @todo
 * - [ ] add groupName addition feature
 * - [x] handle addition of rgb product
 * - [ ] handle addition of RGBW product
 */
export const PairingConnectorScreen1 = ({ navigation }: Props) => {
  const [step, setStep] = useState<0 | 1 | 2>(0)
  const log = new logger("PAIRING_SCREEN_1")
  const [groupName, setGroupName] = useState("BedRoom");
  let _animation = null;
  const transition = useTimingTransition(step)



  return (
    <View style={{
      flex: 1,
      backgroundColor: "#fff",
    }}>

      {/* Sec: headerSection */}
      <NewPairingBackground />


      {/* Steps container */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: height - 50, // subctracted header height from total height
          width,
          //backgroundColor: "red"
        }}>
        <View // top section
          style={{
            //backgroundColor: "green",
            flex: 0.3,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "flex-end"
          }}>

          <View
            style={{
              backgroundColor: "#2ecc71",
              height: 8,
              width: 24,
              borderRadius: 20,
              overflow: "hidden",
              marginHorizontal: 5,
              marginVertical: 10
            }}></View>
          <View
            style={{
              backgroundColor: "#777",
              height: 8,
              width: 8,
              borderRadius: 20,
              overflow: "hidden",
              marginHorizontal: 5,
              marginVertical: 10
            }}></View>
          <View
            style={{
              backgroundColor: "#777",
              height: 8,
              width: 8,
              borderRadius: 20,
              overflow: "hidden",
              marginHorizontal: 5,
              marginVertical: 10
            }}></View>
        </View>
      </View>


      <Frame1
        //@ts-ignore
        setStep={setStep} />



      {
        false && <View style={{ flex: 1, backgroundColor: "#fff" }}>

          <PairingCard
            title="Let's connect to your device"
            style={{
              marginTop: 20
            }}
            height={interpolate(transition, {
              inputRange: [0, 1, 2],
              outputRange: [height * 0.6, 60, 60],
            })}
            showContent={step == 0}
            shadow={step != 0}
            cardIcon={() => {
              if (step == 0)
                return (
                  <ActivityIndicator size="small" color="#55f" style={{ marginHorizontal: 6 }} />
                )
              else return (
                <View style={{
                  backgroundColor: "#00FF50",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 50,
                  overflow: "hidden",
                  padding: 2,
                  marginHorizontal: 5
                }}>
                  <MaterialIcons name="done" size={16} color="white" />
                </View>
              )
            }}>
            <Frame1 setStep={setStep} />
          </PairingCard>

          <PairingCard
            title="Select your Home network"
            style={{
              marginTop: 10
            }}
            height={interpolate(transition, {
              inputRange: [0, 1, 2],
              outputRange: [60, height * 0.6, 60],
            })}
            shadow={step != 1}
            showContent={step == 1}>
            <Frame2
              navigation={navigation}
              newDevice={""}
            />

          </PairingCard>

          <PairingCard
            title="Setup your device"
            style={{
              marginTop: 10
            }}
            height={interpolate(transition, {
              inputRange: [0, 1, 2],
              outputRange: [60, 60, height * 0.6],
            })}
            showContent={step == 2}
            shadow={step != 2}>
            <NewRectButtonWithChildren
              onPress={() => {
                setStep(1)
              }}><Text>Pre</Text></NewRectButtonWithChildren>
          </PairingCard>

          <Support />
        </View>
      }
    </View >
  )
}



const BulletPoint = ({ children, ...props }: { children: any, hintTxt?: String, mainTxtStyle?: StyleProp<TextStyle>, hintTxtStyle?: StyleProp<TextStyle> }) => {
  return (
    <View style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start" }}>
      <Text style={[{ color: "#333", fontSize: 18, fontWeight: "bold" }, props.mainTxtStyle]}>{'\u2022  '}</Text>
      <View>
        <Text style={[{ color: "#333", fontSize: 18, fontWeight: "bold" }, props.mainTxtStyle]}>{children}</Text>
        {props.hintTxt && <Text style={[{ marginTop: 5, color: "#555", fontSize: 16, }, props.hintTxtStyle]}>{props.hintTxt}</Text>}
      </View>
    </View>
  )
}


const NewPairingBackground = (props: {}) => {
  return (
    <View style={{
      height: height - 50,
      width,
      position: "absolute",
      top: 0,
      left: 0,
      zIndex: 1
    }}>
      <View
        style={{
          flex: 0.3
        }}>
      </View>

      <View
        style={{
          flex: 0.7,
          marginHorizontal: 15,
          borderTopRightRadius: 50,
          borderTopLeftRadius: 50,
          shadowOffset: {
            width: 0,
            height: -1,
          },
          shadowOpacity: 0.3,
          shadowRadius: 2.22,
          shadowColor: '#000000',
          elevation: 5,
          backgroundColor: "#fff",
        }}>
      </View>
    </View>
  )
}

const PairingCard = (props: {
  cardIcon?: any,
  title?: String,
  children?: any,
  shadow?: boolean,
  height?: Animated.Node<any>,
  style?: StyleProp<Animated.AnimateStyle<ViewStyle>>,
  showContent?: boolean
}) => {

  return (
    <Animated.View
      style={{}}>
      {/* Main Container */}
      <View style={{ flex: 1 }}></View>

    </Animated.View>
  )
}

