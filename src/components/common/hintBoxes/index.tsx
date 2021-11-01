import React from 'react';
import { View, Text, StyleProp, ViewStyle } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { NewRectButtonWithChildren } from '../buttons/RectButtonCustom';

interface AlexaHintBoxProps {
  style?: StyleProp<ViewStyle>;
}

export const AlexaHintBox = (props: AlexaHintBoxProps) => {
  return (
    <View // hintBox
      style={[
        {
          width: '100%',
          backgroundColor: '#85C1E955',
          borderColor: '#85C1E9',
          borderStyle: 'dashed',
          borderWidth: 1.5,
          borderRadius: 15,
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
        props.style,
      ]}
    >
      <View /// text section
        style={{ marginHorizontal: '10%' }}
      >
        <Text style={{ textAlign: 'center', color: '#2E86C1', fontSize: 18, fontWeight: 'bold' }}>
          Let's start with Alexa
        </Text>
        <Text style={{ color: '#777', fontSize: 15, textAlign: 'center', marginTop: 15 }}>
          Follow the HUElite guide to setup your device with alexa
        </Text>
      </View>

      <NewRectButtonWithChildren /// goToGuide button
        style={{ backgroundColor: '#3498DB', height: 50, width: 150, borderRadius: 25, marginTop: 25 }}
      >
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Follow guide</Text>
      </NewRectButtonWithChildren>

      <NewRectButtonWithChildren /// close button
        style={{ position: 'absolute', top: 0, right: 15 }}
      >
        <AntDesign name="close" size={24} color="black" />
      </NewRectButtonWithChildren>
    </View>
  );
};
