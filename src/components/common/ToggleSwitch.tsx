import React, { useState } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { NewRectButtonWithChildren } from "./buttons/RectButtonCustom";

interface Props {
  state: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>
}

/**
 *
 * @param _width<optional>
 * @param _height<optional>
 * @param initialState<optional> @default -false
 */
export const ToggleSwitch = ({ state, onPress, }: Props) => {

  return (
    <NewRectButtonWithChildren
      onPress={() => {
        if (onPress)
          onPress()
      }}
      style={{
        backgroundColor: "#eee",
        height: 30,
        width: 60,
        borderRadius: 50,
        display: "flex",
        alignItems: "center",
        borderColor: "#999",
        borderWidth: 0.5,

      }}
    >
      {/* ///Indicator */}
      <View
        style={{
          backgroundColor: state ? "#58d68d" : "#777",
          alignSelf: state ? "flex-end" : "flex-start",
          height: 28,
          width: 28,
          borderRadius: 50,
        }}
      />
    </NewRectButtonWithChildren>
  );
};
