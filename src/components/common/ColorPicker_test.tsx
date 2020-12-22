import React, { useState, memo } from "react";
import {
  Dimensions,
  View,
  StyleSheet,
  Image,
  Text,
  Platform,
} from "react-native";

import { Surface } from "gl-react-expo";
import { GLSL, Node, Shaders } from "gl-react";
import Animated from "react-native-reanimated";
import ColorPickerPin, { CANVAS_SIZE } from "./ColorPickerPin";
import Svg, { Circle } from "react-native-svg";
import { deviceType } from "../../util/dummyData/DummyData.js";
import { onColorValueChange_Props } from "../screens/devicePage";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  surface: {
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
  },
  hue: {
    alignSelf: "center",
    //backgroundColor: "red",
  },
});

const shaders = Shaders.create({
  hue: {
    frag: GLSL`
  #define PI  3.141592653589793
  #define TAU 6.283185307179586
  precision highp float;
  varying vec2 uv;
  uniform float size;
  // https://stackoverflow.com/questions/15095909/from-rgb-to-hsv-in-opengl-glsl
  vec3 rgb2hsv(vec3 c)
  {
      vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
      vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
      vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
      float d = q.x - min(q.w, q.y);
      float e = 1.0e-10;
      return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
  }
  // All components are in the range [0…1], including hue.
  vec3 hsv2rgb(vec3 c)
  {
      vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
      vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
      return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }
  vec3 getColor(vec3 c)
  {
    //vec3 p = vec3(cos(c.x),c.y, c.z);
    //vec3 pc = vec3(clamp(p.x,240.0/360.0, 360.0/360.0),c.y, c.z);  
    //return hsv2rgb(pc);
    
    vec3 vc = vec3(sin(c.x),c.y, c.z);  
    //vec3 vcc = vec3(mix(0.0/360.0, 1.0, sin(c.x)),   mix(0.0/360.0, 1.0, -cos(c.x)),  mix(0.0/360.0, 1.0, cos(c.x)));  
    vec3 vcc = vec3(mix(0.0, 1.0, -cos(c.x)-cos(c.x)),   mix(0.0, 1.0, -sin(c.x)),  mix(0.0, 1.0, cos(c.x)));  
    vec3 pc = vec3(vcc.x,c.y, c.z);  
    vec3 p = hsv2rgb(pc);
    return vcc;
  }
  float quadraticIn(float t) {
    return t * t;
  }
  void main() {
    float mag = distance(uv, vec2(0.5));
    vec2 pos = vec2(0.5) - uv;
    float a = atan(pos.y, pos.x);
    float progress = a * 0.5 / PI + 0.5 ;
    gl_FragColor = mag < 0.5 ? vec4(getColor(vec3(a, quadraticIn(mag * 2.0), 1.0)), 1.0) : vec4(0, 0, 0, 0);
  }
  `,
  },
});

interface Props {
  hue: Animated.Value<number>;
  saturation: Animated.Value<number>;
  backgroundColor: Animated.Node<number>;
  device: deviceType;
  onValueChange: onColorValueChange_Props;
}

const ColorPicker = ({
  hue,
  saturation,
  backgroundColor,
  device,
  onValueChange,
}: Props) => {
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  console.log("Sine Value ========== " + Math.sin(90));

  return (
    <View style={styles.container}>
      <View style={styles.hue}>
        <Surface style={styles.surface}>
          <Node shader={shaders.hue} />
        </Surface>
        <ColorPickerPin
          h={hue}
          s={saturation}
          backgroundColor={backgroundColor}
          device={device}
          onValueChange={onValueChange}
        />
      </View>
    </View>
  );
};

export default ColorPicker;
