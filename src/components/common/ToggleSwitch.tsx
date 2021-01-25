import React, { useState } from "react";
import { View } from "react-native";
import { NewRectButtonWithChildren } from "./buttons/RectButtonCustom";

interface Props {
  _height?: number;
  _width?: number;
  initialState?: boolean;
  onPress?: (state: boolean) => void;
}

/**
 *
 * @param _width<optional>
 * @param _height<optional>
 * @param initialState<optional> @default -false
 */
export const ToggleSwitch = ({
  _height = 40,
  _width = 80,
  initialState = false,
  onPress,
}: Props) => {
  const [state, setState] = useState<boolean>(initialState);
  return (
    <NewRectButtonWithChildren
      onPress={() => {
        setState(!state);
        if (onPress) onPress(state);
      }}
      style={{
        backgroundColor: "#eee",
        height: _height,
        width: _width,
        borderRadius: 50,
        justifyContent: "center",
        shadowColor: "#000",
        borderWidth: 2,
        borderColor: "#eee",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2.41,
        elevation: 3,
      }}
    >
      {/* ///Indicator */}
      <View
        style={{
          backgroundColor: state ? "#5f5" : "#f55",
          alignSelf: state ? "flex-end" : "flex-start",
          height: _height,
          width: _height,
          borderRadius: 50,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.2,
          shadowRadius: 2.41,
          elevation: 2,
        }}
      />
    </NewRectButtonWithChildren>
  );
};
