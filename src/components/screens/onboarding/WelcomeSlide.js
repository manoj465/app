import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");
export const SLIDE_HEIGHT = 0.61 * height;

const styles = StyleSheet.create({
  container: {
    width: width,
  },
  label: {
    fontSize: 80,
    lineHeight: 80,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  labelContainer: {
    height: 100,
    justifyContent: "center",
  },
});

export const WelcomeSlide = (props) => {
  const transform = [
    { translateY: (SLIDE_HEIGHT - 100) / 2 },
    { translateX: props.right ? width / 2 - 50 : -width / 2 + 50 },
    { rotate: props.right ? "-90deg" : "90deg" },
  ];
  return (
    <View style={styles.container}>
      <View style={[styles.labelContainer, { transform }]}>
        <Text style={styles.label}>{props.label}</Text>
      </View>
    </View>
  );
};
