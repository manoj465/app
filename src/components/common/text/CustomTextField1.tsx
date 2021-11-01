import React, { useState } from 'react';
import { TextInput, StyleProp, Text, TextStyle, View } from 'react-native';
import { NewRectButtonWithChildren } from '../buttons/RectButtonCustom';

export default ({
  placeholder,
  onChangeText,
  validateInput,
  onSave,
  textInputStyle,
  primaryColor = '#000',
}: {
  primaryColor?: string;
  placeholder?: String;
  onChangeText?: (text: String) => void;
  validateInput?: (text: String) => boolean;
  onSave?: (text: String) => void;
  textInputStyle?: StyleProp<TextStyle>;
}) => {
  const [value, setValue] = useState('');

  return (
    <View
      style={{
        //backgroundColor: "red",
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: primaryColor,
      }}
    >
      <TextInput
        style={{
          //backgroundColor: "red",
          height: 60,
          fontSize: 18,
          marginTop: 0,
          paddingHorizontal: 0,
          fontWeight: 'bold',
          flexGrow: 1,
        }}
        //@ts-ignore
        placeholder={placeholder ? placeholder : ''}
        value={value}
        onChangeText={(text) => {
          setValue(text);
          if (onChangeText) onChangeText(text);
        }}
      />
      <NewRectButtonWithChildren
        style={{
          paddingTop: 0,
        }}
        innerCompStyle={{
          paddingTop: 0,
          //backgroundColor: "green",
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          if (onSave) onSave(value);
        }}
      >
        {((validateInput && validateInput(value)) || (!validateInput && value.length > 0)) && (
          <View
            style={{
              backgroundColor: '#27ae60',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 30,
              paddingHorizontal: 10,
              marginHorizontal: 10,
              borderRadius: 8,
              overflow: 'hidden',
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>SAVE</Text>
          </View>
        )}
      </NewRectButtonWithChildren>
    </View>
  );
};
