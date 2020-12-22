import React from "react";
import { Text, View, Button } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export const NestedRouter = (props) => {
  return (
    <Stack.Navigator initialRouteName="screen1">
      <Stack.Screen name="screen1" component={screen1} />
      <Stack.Screen name="screen2" component={screen2} />
    </Stack.Navigator>
  );
};

const screen1 = (props) => {
  return (
    <View
      style={{
        display: "flex",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text>screen1</Text>
      <Button
        title="Go To Screen2"
        onPress={() => {
          console.log("button pressed");
          props.navigation.navigate("screen2");
        }}
      />
    </View>
  );
};

const screen2 = (props) => {
  return (
    <View
      style={{
        display: "flex",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text>screen2</Text>
      <Button
        title="Go To Screen1"
        onPress={() => {
          console.log("button pressed");
          props.navigation.navigate("screen1");
        }}
      />
    </View>
  );
};
