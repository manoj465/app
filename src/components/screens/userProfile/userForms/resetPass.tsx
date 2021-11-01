import React from 'react';
import { View, TextInput, Text } from 'react-native';
import API from '../../../../@api';
import { NewRectButtonWithChildren } from '../../../common/buttons/RectButtonCustom';

interface Props {}

export default (props: Props) => {
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          //backgroundColor: 'red',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <TextInput /// email TextInput
          style={{
            minHeight: 40,
            width: '90%',
            borderColor: '#5555ff77',
            color: '#777',
            borderBottomWidth: 1,
            borderRadius: 0,
            textAlign: 'left',
            alignSelf: 'center',
            marginHorizontal: 20,
            fontWeight: 'bold',
            fontSize: 18,
          }}
          onChangeText={(text) => {
            //setPassword(text);
          }}
          placeholderTextColor="#5555ff55"
          placeholder="Enter Email"
          //value={password}
          //autoCompleteType="username"
        />
      </View>
      <Text style={{ textAlign: 'center', marginVertical: 50, marginHorizontal: 50 }}>
        You will be sent the password reset procedure on your registered email address
      </Text>
      <View /// reset pass button
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <NewRectButtonWithChildren
          onPress={async () => {
            await API.cloudAPI.user.resetPassApi
              .v1({})
              .then((res) => {
                console.log('RESETAPI response');
                console.log(res);
              })
              .catch((err) => {
                console.log('RESETAPI error');
                console.log(err);
              });
          }}
          style={{
            backgroundColor: '#55f',
            marginBottom: 50,
            width: '90%',
          }}
        >
          <Text style={{ fontWeight: 'bold', color: '#fff' }}>RESET PASSWORD</Text>
        </NewRectButtonWithChildren>
      </View>
    </View>
  );
};
