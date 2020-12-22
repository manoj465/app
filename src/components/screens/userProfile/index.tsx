import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Image, StyleProp, Text, TextInput, View, ViewStyle } from "react-native";
import { MainRouterStackParamList } from "../../../routers/MainRouter";
import Container from "../../common/wrappers/ComponentWrapper";
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { RectButton } from "react-native-gesture-handler";

type navigationProp = StackNavigationProp<
  MainRouterStackParamList,
  "user"
>
type routeProp = RouteProp<MainRouterStackParamList, "user">;

interface props {
  navigation: navigationProp
  route: routeProp;

}
const UserScreen = ({ navigation }: props) => {


  return (
    <Container style={{ backgroundColor: "#fff", paddingHorizontal: 15 }}>
      <View>
        <RectButton onPress={() => {
          if (navigation.canGoBack())
            navigation.pop()
        }}>
          <Ionicons style={{ paddingRight: 15, paddingBottom: 10, paddingTop: 15, marginTop: 10 }} name="ios-arrow-back" size={30} color="#222" />
        </RectButton>
      </View>
      <View style={{}}>
        <Text style={{ color: "#222", fontSize: 35, fontWeight: "bold" }}>Settings</Text>
      </View>
      <View style={{ alignItems: "center", marginTop: 50 }}>
        <FontAwesome name="user" size={100} color="#222" />
        <Text>Abhimanyu</Text>
        <Text>iamlive24@gmail.com</Text>
      </View>
      <View style={{}}>
        <CustomTextField style={{ marginTop: 30 }} heading="Full Name" primaryColor="#777" />
        <CustomTextField style={{ marginTop: 25 }} heading="email" primaryColor="#777" />
      </View>
      <View style={{
        marginTop: 50,
        borderWidth: 0.3,
        //borderColor: "#777",
        borderRadius: 25,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <Text style={{ color: "#777", fontWeight: "bold" }}>Coming Next</Text>
        <Image style={{ width: "100%" }} source={require("../../../../assets/images/usageMeter.png")} />
      </View>
      {/*  <View style={{ alignItems: "center", paddingVertical: 20 }}>
        <Image style={{ height: 150, width: 150, opacity: 0.3 }} source={require("../../../../assets/icons/icon.png")} />
      </View> */}
    </Container>
  );
};

export default UserScreen


interface TextFieldProps {
  heading?: string
  placeholder?: string
  style?: StyleProp<ViewStyle>
  primaryColor?: string
}
const CustomTextField = ({ heading, placeholder, style, primaryColor = "#000000" }: TextFieldProps) => {
  return (
    <View style={[{}, style]}>
      <Text style={{ marginLeft: 15, color: primaryColor, fontWeight: "bold" }}>{heading}</Text>
      <View style={{ borderWidth: 0.5, borderRadius: 10, borderColor: primaryColor }}>
        <TextInput style={{ height: 50, marginHorizontal: 10, fontSize: 15, color: primaryColor }} placeholder={placeholder} />
      </View>
    </View>
  )
}