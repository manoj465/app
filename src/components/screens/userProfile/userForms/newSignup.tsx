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
  const [rePassword, setRePassword] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');

  const [step, setStep] = useState<1 | 2 | 3>(1);

  return (
    <View
      style={{
        flex: 1,
        marginVertical: '2%',
      }}
    >
      <View style={{ flex: 1, width: '100%', alignItems: 'center' }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#555',
            paddingHorizontal: 20,
            marginTop: 100,
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
        {step == 1 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <TextInput
              style={{
                minHeight: 40,
                width: '80%',
                maxWidth: 400,
                borderColor: '#ccc',
                color: '#777',
                borderBottomWidth: 2,
                borderRadius: 0,
                textAlign: 'left',
                alignSelf: 'center',
                marginTop: '10%',
                fontWeight: 'bold',
                fontSize: 18,
              }}
              placeholderTextColor="#ccc"
              onChangeText={(text) => {
                setEmail(text);
              }}
              placeholder="Enter email address"
              value={email}
              autoCompleteType="email"
            />
          </View>
        ) : step == 2 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <TextInput
              style={{
                minHeight: 40,
                width: '80%',
                maxWidth: 400,
                borderColor: '#ccc',
                color: '#777',
                borderBottomWidth: 2,
                borderRadius: 0,
                textAlign: 'left',
                alignSelf: 'center',
                marginTop: '10%',
                fontWeight: 'bold',
                fontSize: 18,
              }}
              onChangeText={(text) => {
                setUserName(text);
              }}
              placeholderTextColor="#ccc"
              placeholder="Choose an username"
              value={userName}
              autoCompleteType="username"
            />
          </View>
        ) : step == 3 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <TextInput
              style={{
                minHeight: 40,
                width: '80%',
                maxWidth: 400,
                borderColor: '#ccc',
                color: '#777',
                borderBottomWidth: 2,
                borderRadius: 0,
                textAlign: 'left',
                alignSelf: 'center',
                marginTop: '10%',
                fontWeight: 'bold',
                fontSize: 18,
              }}
              onChangeText={(text) => {
                setPassword(text);
              }}
              placeholderTextColor="#ccc"
              placeholder="Enter Password"
              value={password}
              //autoCompleteType="username"
            />

            <TextInput
              style={{
                minHeight: 40,
                width: '80%',
                maxWidth: 400,
                borderColor: '#ccc',
                color: '#777',
                borderBottomWidth: 2,
                borderRadius: 0,
                textAlign: 'left',
                alignSelf: 'center',
                marginTop: '10%',
                fontWeight: 'bold',
                fontSize: 18,
              }}
              onChangeText={(text) => {
                setRePassword(text);
              }}
              placeholderTextColor="#ccc"
              placeholder="Re-enter Password"
              value={rePassword}
              //autoCompleteType="username"
            />
          </View>
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}></View>
        )}
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
            if (step == 3)
              appOperator.user({
                cmd: 'SIGNUP',
                userName,
                password,
                email: email.trim().toLowerCase(),
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
            else {
              setStep(step == 1 ? 2 : step == 2 ? 3 : 1);
            }
          }}
        >
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{step < 3 ? 'Next' : 'Signup'}</Text>
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
