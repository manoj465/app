import React, { useState } from "react";
import { View, Text } from "react-native";
import Animated, {
  divide,
  round,
  add,
  interpolate,
  useCode,
  call,
  block,
  cond,
  eq,
  neq,
  set,
} from "react-native-reanimated";
import { useValue, onScrollEvent } from "react-native-redash";

interface Props {
  _rowHeight?: number;
  _rowWidth?: number;
  numRows?: number;
  data?: object;
  initialVlaue?: string;
  heading: string;
  onValueChange?: (value: number) => void;
}

export const IphoneSelector = ({
  _rowHeight = 60,
  numRows = 3,
  _rowWidth = 60,
  data = [],
  initialVlaue,
  heading,
  onValueChange,
}: Props) => {
  const y = useValue(0);
  const onScroll = onScrollEvent({ y });
  const selected = add(round(divide(y, _rowHeight)), 1);
  const _index = useValue(0);

  useCode(
    () => [
      cond(
        neq(_index, selected),
        block([
          set(_index, selected),
          call([_index], ([_index]) => {
            onValueChange(_index);
          }),
        ])
      ),
    ],
    [_index, selected]
  );

  return (
    <View
      style={{
        width: "100%",
        height: _rowHeight * numRows + 20,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        marginTop: 10,
      }}
    >
      {/* Sec1: Heading */}
      <View style={{ height: 20, /* backgroundColor: "red", */ width: "100%" }}>
        {data.length > 0 && heading && (
          <Text
            style={{ textAlign: "center", fontSize: 10, fontWeight: "bold" }}
          >
            {heading}
          </Text>
        )}
      </View>
      <View
        style={{
          height: _rowHeight * numRows,
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* Sec1: absolute View for center borders */}
        <View
          style={{
            position: "absolute",
            height: _rowHeight,
            //backgroundColor: "red",
            width: _rowWidth,
            borderBottomWidth: 0.5,
            borderTopWidth: 0.5,
          }}
        />
        <Animated.ScrollView
          style={{
            overflow: "hidden",
            //backgroundColor: "red",
            width: _rowWidth,
          }}
          snapToInterval={_rowHeight}
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
          bounces={false}
          scrollEventThrottle={1}
          {...{ onScroll }}
        >
          {data.length > 0 &&
            data.map((item, index) => {
              const positionY = add(y, -index * 60);
              const opacity = interpolate(positionY, {
                inputRange: [-60, 0, 60],
                outputRange: [0.5, 1, 0.5],
              });
              const scale = interpolate(positionY, {
                inputRange: [-60, 0, 60],
                outputRange: [0.7, 1, 0.7],
              });

              return (
                <View key={index}>
                  {index == 0 && <View style={{ height: _rowHeight }}></View>}
                  <View
                    style={{
                      height: _rowHeight,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Animated.Text
                      style={{
                        fontSize: 20,
                        color: "#555",
                        fontWeight: "bold",
                        opacity: opacity,
                        transform: [{ scaleX: scale }, { scaleY: scale }],
                      }}
                    >
                      {item.data ? item.data : index}
                    </Animated.Text>
                  </View>
                  {index == data.length - 1 && (
                    <View style={{ height: _rowHeight }}></View>
                  )}
                </View>
              );
            })}

          {data.length == 0 && (
            <View
              style={{
                justifyContent: "center",
                height: _rowHeight * numRows,
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 15,
                  color: "#555",
                  textAlign: "center",
                }}
              >
                {initialVlaue ? initialVlaue : "Loading"}
              </Text>
            </View>
          )}
        </Animated.ScrollView>
      </View>
    </View>
  );
};
