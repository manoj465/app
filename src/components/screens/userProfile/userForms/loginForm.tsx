import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { appOperator } from '../../../../app.operator';
import { logger } from '../../../../@logger';
import Alert from '../../../common/Alert';
import { NewRectButtonWithChildren } from '../../../common/buttons/RectButtonCustom';
import { navigationProp, userScreenState } from '../index';
import * as WebBrowser from 'expo-web-browser';

interface LoginHeader_t {
  navigation: navigationProp;
  setHeaderView?: React.Dispatch<React.SetStateAction<userScreenState>>;
  log?: logger;
}
export const LoginHeader = ({ navigation, setHeaderView, log }: LoginHeader_t) => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  return (
    <View style={styles.headerContainer}>
      <View /* Sec2: Form Container  */
        style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}
      >
        <Text /* Sec3: Form Heading  */
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#555',
            paddingHorizontal: 20,
          }}
        >
          Let's get started
        </Text>
        <Text /* Sec3: Form Description text  */
          style={{
            fontSize: 15,
            color: '#555',
            textAlign: 'center',
            paddingVertical: 20,
            paddingHorizontal: 30,
          }}
        >
          Your Account is required to setup your devices with Alexa and Google Assistant
        </Text>
        <TextInput /* Sec3: Email Input  */
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

        <TextInput /* Sec3: Password Input  */
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

        <NewRectButtonWithChildren /// Login Button
          onPress={async () => {
            log?.print('login button pressed');
            appOperator.user({
              cmd: 'LOGIN',
              email: email.trim().toLowerCase(),
              password,
              onLoginFailed: ({ ERR }) => {
                Alert.alert(
                  ERR?.errCode ? ERR?.errCode : 'UNKNOWN ERROR',
                  ERR?.errMsg
                    ? ERR.errMsg
                    : 'This could be due to technical error at backend, you can report the issue our forum. We regret for the inconveniences'
                );
              },
              onLoginSuccess: () => {
                log?.print(
                  'login successful>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>'
                );
                navigation.replace('dashboard');
              },
              //log: log ? new logger("user login operator", log) : undefined
              log: new logger('login Operator'),
            });
          }}
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
        >
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}> Login</Text>
        </NewRectButtonWithChildren>
        <NewRectButtonWithChildren /// forgot password button
          onPress={() => {
            WebBrowser.openBrowserAsync('https://www.huelite.in/account/reset-password-mail');
          }}
        >
          <Text style={{ fontWeight: 'bold', color: '#777' }}>Forgot password? Reset here.</Text>
        </NewRectButtonWithChildren>
      </View>
      <NewRectButtonWithChildren /* Sec2: Signup Form switch button */
        style={{ marginTop: '5%' }}
        onPress={() => {
          log?.print('Signup button pressed');
          setHeaderView ? setHeaderView(userScreenState.SIGNUP) : {};
        }}
      >
        <Text
          style={{
            textAlign: 'center',
          }}
        >
          {' '}
          Don't have an account?
          <Text
            style={{
              color: '#5555ff',
              fontWeight: 'bold',
            }}
          >
            {' '}
            SignUp
          </Text>
        </Text>
      </NewRectButtonWithChildren>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginVertical: '2%',
  },
});
