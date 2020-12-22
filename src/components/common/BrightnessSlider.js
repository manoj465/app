import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Slider from "react-native-slider";
import { LinearGradient } from "expo-linear-gradient";

export const BrightnessSlider = (props) => {
  let { onSlidingComplete, selectedColor, gradColorArr } = props;
  return (
    <View style={styles.container}>
      <View style={styles.cover}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          //colors={[gradColorArr[1], "#f2f2f205", "#ffffff00"]}
          colors={["#ffffff00", "#ffffff77"]}
          style={styles.linearGradient}
        />
        <Slider
          value={props.value ? props.value : 0}
          minimumValue={0}
          maximumValue={100}
          trackStyle={styles.track}
          thumbStyle={styles.thumb}
          animateTransitions={true}
          minimumTrackTintColor="transparent"
          style={styles.slider}
          onValueChange={(value) => onSlidingComplete(Math.round(value))}
          //onSlidingComplete={(value) => onSlidingComplete(Math.round(value))}
        />
      </View>
    </View>
  );
};

var styles = StyleSheet.create({
  container: {
    alignItems: "stretch",
    flexDirection: "row",
    borderRadius: 15,
    opacity: 1,
  },
  slider: {},
  cover: {
    borderRadius: 15,
    height: 30,
    width: "100%",
    opacity: 1,
    borderWidth: 0,
  },
  linearGradient: {
    position: "absolute",
    borderRadius: 15,
    height: 30,
    justifyContent: "center",
    width: "100%",
    opacity: 1,
  },
  track: {
    backgroundColor: "transparent",
    height: 30,
    borderRadius: 25,
    opacity: 1,
    borderWidth: 0,
  },
  thumb: {
    position: "relative",
    top: -20,
    width: 40,
    height: 40,
    backgroundColor: "#ffffff66",
    opacity: 1,
    borderColor: "#aaaaaa44",
    borderWidth: 6,
    borderRadius: 20,
    shadowColor: "rgb(46, 48, 58)",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },
});
