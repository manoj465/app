import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NewRectButtonWithChildren } from '../../common/buttons/RectButtonCustom';

interface Props {
  navigation: any;
}

export default (props: Props) => {
  const { height, width } = useWindowDimensions();
  return (
    <View
      style={{
        height: height - 300,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        paddingHorizontal: '5%',
      }}
    >
      <View
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          borderColor: '#82E0AA',
          borderWidth: 0.5,
          borderRadius: 25,
          paddingVertical: 30,
        }}
      >
        <NewRectButtonWithChildren
          onPress={() => {
            props.navigation.navigate('pairing');
          }}
        >
          <MaterialIcons name="add-circle" size={80} color="#82E0AA" />
        </NewRectButtonWithChildren>
        <Text style={{ color: '#82E0AA', textAlign: 'center', fontSize: 25, fontWeight: 'bold', marginTop: 20 }}>
          ADD NEW DEVICE
        </Text>
      </View>
    </View>
  );
};
