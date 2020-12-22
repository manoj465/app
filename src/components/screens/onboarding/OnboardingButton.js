import React from "react";
import { Text, StyleSheet } from "react-native";
import { RectButton } from "react-native-gesture-handler";

const styles = StyleSheet.create({
  container: {
    borderRadius: 25,
    height: 50,
    width: "70%",
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
  },
});

export const OnboardingButton = ({ label, varient, onPress }) => {
  const backgroundColor =
    varient === "primary" ? "#2CB9B0" : "rgba(12, 13, 52, 0.05)";
  const color = varient === "primary" ? "white" : "#0C0D34";
  return (
    <RectButton
      style={[styles.container, { backgroundColor }]}
      {...{ onPress }}
    >
      <Text style={[styles.label, { color }]}>{label}</Text>
    </RectButton>
  );
};
