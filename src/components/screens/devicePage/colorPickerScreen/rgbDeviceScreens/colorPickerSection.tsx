import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { logger } from '../../../../../@logger';
import UNIVERSALS from '../../../../../@universals';
import { MainRouterStackParamList } from '../../../../../routers/MainRouter';
import ColorPicker from '../../../../common/ColorPicker';

interface Props {
  hue: Animated.Value<number>;
  saturation: Animated.Value<number>;
  value: Animated.Value<number>;
  backgroundColor: Animated.Node<number>;
  device: DEVICE_t;
  navigation: StackNavigationProp<MainRouterStackParamList, 'devicePage'>;
  log?: logger;
}

export const ColorPickerSection = ({ hue, saturation, value, backgroundColor, device, navigation, log }: Props) => {
  return (
    <View style={styles.container}>
      {/* Sec: timer Button */}
      <View
        style={{
          flex: 1,
          //backgroundColor: "red",
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ColorPicker hue={hue} saturation={saturation} backgroundColor={backgroundColor} device={device} log={log} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    //backgroundColor: "red",
    flex: 1,
  },
});
