import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import UNIVERSALS from '../../../../@universals';
import { appOperator } from '../../../../app.operator';
import { logger } from '../../../../@logger';
import { NewRectButtonWithChildren } from '../../../common/buttons/RectButtonCustom';
import { navigationProp, userScreenState } from '../index';
import Alert from '../../../common/Alert';

/**
 *
 * //TODO email validation before signing up
 * //TODO retype pass must match before procceding
 */
interface SignUpHeader_t {
  navigation: navigationProp;
  setHeaderView?: React.Dispatch<React.SetStateAction<userScreenState>>;
  log?: logger;
}
export const SignUpHeader = ({ navigation, setHeaderView, log }: SignUpHeader_t) => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');

  return (
    <View
      style={{
        flex: 1,
        marginVertical: '2%',
      }}
    >
      <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#555',
            paddingHorizontal: 20,
          }}
        >
          We are happy to have you
        </Text>
        <Text
          style={{
            fontSize: 15,
            color: '#555',
            textAlign: 'center',
            paddingVertical: 20,
            paddingHorizontal: 30,
          }}
        >
          Your Account will be used to link and setup your devices with Alexa and Google Assistant
        </Text>
        <TextInput
          style={{
            minHeight: 50,
            width: '80%',
            maxWidth: 400,
            borderColor: '#5555ff7f',
            color: '#5555ff',
            borderWidth: 1,
            borderRadius: 25,
            textAlign: 'center',
            alignSelf: 'center',
            marginTop: '10%',
          }}
          onChangeText={(text) => {
            setEmail(text);
          }}
          placeholder="Email"
          value={email}
          autoCompleteType="email"
        />

        <TextInput
          style={{
            minHeight: 50,
            width: '80%',
            maxWidth: 400,
            borderColor: '#5555ff7f',
            color: '#5555ff',
            borderWidth: 1,
            borderRadius: 25,
            textAlign: 'center',
            alignSelf: 'center',
            marginTop: '10%',
          }}
          onChangeText={(text) => {
            setUserName(text);
          }}
          placeholder="Username"
          value={userName}
          //autoCompleteType="username"
        />

        <TextInput
          style={{
            minHeight: 50,
            width: '80%',
            maxWidth: 400,
            borderColor: '#5555ff7f',
            color: '#5555ff',
            borderWidth: 1,
            borderRadius: 25,
            textAlign: 'center',
            alignSelf: 'center',
            marginTop: '10%',
          }}
          onChangeText={(text) => {
            setPassword(text);
          }}
          placeholder="password"
          value={password}
          secureTextEntry={true}
        />
        <NewRectButtonWithChildren /* Sec3: SignUp button */
          style={{
            backgroundColor: '#5555ff',
            height: 50,
            width: '80%',
            maxWidth: 400,
            borderRadius: 25,
            alignSelf: 'center',
            marginTop: '10%',
            alignItems: 'center',
            justifyContent: 'center',
            elevation: 5,
          }}
          onPress={() => {
            appOperator.user({
              cmd: 'SIGNUP',
              userName,
              password,
              email,
              onSignupFailed: ({ ERR }) => {
                Alert.alert(
                  ERR?.errCode ? ERR?.errCode : 'UNKNOWN ERROR',
                  ERR?.errMsg
                    ? ERR.errMsg
                    : 'This could be due to technical error at backend, you can report the issue our forum. We regret for the inconveniences'
                );
              },
              onSignupSuccess: (user) => {
                navigation.replace('dashboard');
              },
              log: log ? new logger('user signup operator', log) : undefined,
            });
          }}
        >
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Signup</Text>
        </NewRectButtonWithChildren>
      </View>
      <NewRectButtonWithChildren
        style={{ marginTop: '5%' }}
        onPress={() => {
          console.log('Signup');
          setHeaderView ? setHeaderView(userScreenState.LOGIN) : {};
        }}
      >
        <Text style={{ textAlign: 'center' }}>
          Already have an account?
          <Text style={{ color: '#5555ff', fontWeight: 'bold' }}> Login</Text>
        </Text>
      </NewRectButtonWithChildren>
    </View>
  );
};

//TODO adjust headers for smaller screen sizes
