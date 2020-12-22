import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

interface Props {
  initValue: number;
  _rowHeight?: number;
  _width?: number;
  heading?: string;
  maxVal: number;
  value: string;
  index: number;
  setIndex: (index: number) => void;
}

export const TimePicker = ({
  initValue,
  _rowHeight = 60,
  _width = 80,
  heading,
  maxVal,
  value = "",
  index = 0,
  setIndex,
}: Props) => {
  const onPressUp = () => {
    if (index == 0) setIndex(maxVal - 1);
    else if (index > 0) setIndex(index - 1);
  };

  const onPressDown = () => {
    if (index < maxVal - 1) setIndex(index + 1);
    else setIndex(0);
  };

  return (
    <View
      style={[styles.container, { width: _width, height: _rowHeight * 3 + 20 }]}
    >
      <View style={styles.heading}>
        {heading && <Text style={styles.headingText}>{heading}</Text>}
      </View>
      <View style={[styles.scrollContainer, { height: _rowHeight }]}>
        <TouchableOpacity
          onPress={onPressUp}
          style={[styles.button, { height: _rowHeight }]}
        >
          <MaterialIcons name="navigation" size={24} color="#ddd" />
          {/* <FontAwesome name="angle-double-up" size={24} color="#555" /> */}
        </TouchableOpacity>
        <View style={[styles.numberContainer, { height: _rowHeight }]}>
          <Text style={styles.value}>{value}</Text>
        </View>
        <TouchableOpacity
          onPress={onPressDown}
          style={[
            styles.button,
            { height: _rowHeight, transform: [{ rotate: "180deg" }] },
          ]}
        >
          {/* <FontAwesome name="angle-double-up" size={24} color="#555" /> */}
          <MaterialIcons
            style={{ transform: [{ rotate: "360deg" }] }}
            name="navigation"
            size={24}
            color="#ddd"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    //backgroundColor: "red",
  },
  heading: { height: 20, alignItems: "center", justifyContent: "center" },
  headingText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#555",
    textAlign: "center",
  },
  scrollContainer: {},
  numberContainer: { alignItems: "center", justifyContent: "center" },
  value: { fontSize: 20, fontWeight: "bold", color: "#555" },
  button: {
    alignItems: "center",
    justifyContent: "center",
    //backgroundColor: "green",
  },
});
