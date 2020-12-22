import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { OnboardingButton } from "./OnboardingButton";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: 44,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#777",
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#555",
    textAlign: "center",
  },
  nextButton: {},
});

export const WelcomeFooterSlide = ({ footerContent, last, onPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{footerContent.title}</Text>
      <Text style={styles.description}>{footerContent.description}</Text>
      <OnboardingButton
        label={last ? "Let's get started" : "Next"}
        varient={last ? "primary" : "default"}
        {...{ onPress }}
      />
    </View>
  );
};
