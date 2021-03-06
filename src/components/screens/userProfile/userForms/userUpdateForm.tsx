import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useSelector } from 'react-redux';
import UNIVERSALS from '../../../../@universals';
import { _appState } from '../../../../redux/rootReducer';
import { appOperator } from '../../../../app.operator';
import { logger } from '../../../../@logger';
import { navigationProp, userScreenState } from '../index';
import Alert from '../../../common/Alert';
import { NewRectButtonWithChildren } from '../../../common/buttons/RectButtonCustom';

/**
 *
 * //TODO email validation before signing up
 * //TODO retype pass must match before procceding
 */
interface SignUpHeader_t {
  navigation: navigationProp;
  setHeaderView?: React.Dispatch<React.SetStateAction<userScreenState>>;
  user?: USER_t;
  log?: logger;
}
export const UserUpdateForm = ({ navigation, setHeaderView, user, log }: SignUpHeader_t) => {
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');

  return (
    <View style={styles.headerContainer}>
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
          Welcome to HUElite Community
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
          Your HUElite Account will be used to link and setup your devices with Alexa and Google Assistant
        </Text>
        <TextInput /* Sec3: userName textField */
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
          autoCompleteType="username"
        />

        <TextInput /* Sec3: oldPassword textField */
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
            setOldPassword(text);
          }}
          placeholder="old-password"
          value={oldPassword}
          autoCompleteType="password"
        />

        <TextInput /* Sec3: newPassword textField */
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
            if (user?.id) {
              appOperator.user({
                cmd: 'UPDATE',
                id: user?.id ? user.id : '',
                userName,
                password,
                onUpdateFailed: ({ ERR }) => {
                  Alert.alert(
                    ERR?.errCode ? ERR?.errCode : 'UNKNOWN ERROR',
                    ERR?.errMsg
                      ? ERR.errMsg
                      : 'This could be due to technical error at backend, you can report the issue our forum. We regret for the inconveniences'
                  );
                },
                onUpdateSuccess: () => {},
                log: log ? new logger('user update operator', log) : undefined,
              });
            } else {
              Alert.alert(
                'CANNOT UPDATE USER DATA',
                'the associated user with this account might be temprory or it could be due to techniocal error.  you can find more abou related issues on HUElite forum'
              );
            }
          }}
        >
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Update</Text>
        </NewRectButtonWithChildren>
      </View>
      <NewRectButtonWithChildren
        style={{ marginTop: '5%' }}
        onPress={() => {
          console.log('Signup');
          setHeaderView ? setHeaderView(userScreenState.USER_PROFILE) : {};
        }}
      >
        <Text style={{ textAlign: 'center' }}>
          Everythings is in place
          <Text style={{ color: '#5555ff', fontWeight: 'bold' }}> discard changes</Text>
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

//TODO adjust headers for smaller screen sizes
