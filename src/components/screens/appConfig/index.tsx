import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Linking, StyleProp, Text, TextStyle, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { logger } from '../../../@logger';
import { STYLES as styles } from '../../../@styles';
import { appOperator } from '../../../app.operator';
import reduxStore, { appState } from '../../../redux';
import { MainRouterStackParamList } from '../../../routers/MainRouter';
import { NewRectButtonWithChildren } from '../../common/buttons/RectButtonCustom';
import * as WebBrowser from 'expo-web-browser';

type navigationProp = StackNavigationProp<MainRouterStackParamList, 'config'>;
type routeProp = RouteProp<MainRouterStackParamList, 'config'>;

interface props {
  navigation: navigationProp;
  route: routeProp;
}
const AppConfigScreen = ({ navigation }: props) => {
  const log = new logger('APP SETTING');
  const User = useSelector((state: appState) => state.appCTXReducer.user);

  return (
    <View
      style={{
        backgroundColor: '#fff',
        flex: 1,
      }}
    >
      <LinearGradient /** user headerCardContainer */
        colors={['#79b6f7', '#a872fe']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          overflow: 'visible',
          backgroundColor: '#eee',
          borderRadius: 0,
          flex: 0.4,
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2,
        }}
      >
        <View //navigattion button container
          style={{
            //backgroundColor: "red",
            flexDirection: 'row',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'absolute',
            top: 30,
            width: '100%',
          }}
        >
          <NewRectButtonWithChildren
            onPress={() => {
              if (navigation.canGoBack()) navigation.pop();
            }}
            style={{
              backgroundColor: '#ffffff00',
              marginHorizontal: 10,
            }}
            innerCompStyle={{}}
          >
            <Ionicons style={{}} name="close" size={30} color="#fff" />
          </NewRectButtonWithChildren>

          <NewRectButtonWithChildren /** logout button */
            style={{
              backgroundColor: 'transparent',
              marginHorizontal: 10,
            }}
            innerCompStyle={{}}
            onPress={() => {
              appOperator.user({
                cmd: 'LOGOUT',
                onLogout: () => {
                  log?.print('logging out now');
                  navigation.replace('user');
                },
              });
            }}
          >
            <MaterialIcons name="logout" size={24} color="#fff" />
          </NewRectButtonWithChildren>
        </View>

        <View //userInfo container
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View /** header user icon */
            style={[
              styles.shadow,
              {
                borderRadius: 50,
                backgroundColor: '#fff',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}
          >
            <Feather name="user" size={45} color="#555" style={{ margin: 10 }} />
          </View>
          <Text style={[styles.H3, { color: 'white', marginTop: 10 }]}>{User?.userName ? 'Hi, ' + User?.userName : 'Hi, user'}</Text>
          <Text style={{ color: 'white' }}>{User?.email}</Text>
        </View>

        <View // headerDevicesCount
          style={[
            styles.shadow,
            {
              height: 30,
              width: '70%',
              bottom: -15,
              borderRadius: 50,
              backgroundColor: '#fff',
              position: 'absolute',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              maxWidth: 180,
            },
          ]}
        >
          <Text style={[styles.H6, { color: '#777' }]}>{reduxStore.store.getState().deviceReducer.deviceList.length + ' device connected'}</Text>
        </View>
      </LinearGradient>

      <ScrollView // bottomContentContainer
        showsVerticalScrollIndicator={false}
        style={{
          flex: 0.7,
          flexGrow: 1,
          width: '100%',
        }}
      >
        <View /** settings and other support */
          style={{
            marginTop: 50,
            marginHorizontal: 10,
          }}
        >
          <Text style={[styles.H7, { color: '#55f', opacity: 0.6 }]}>Manual & Guides</Text>
          <View style={[styles.shadow, { backgroundColor: '#fff', borderRadius: 10, marginTop: 10, paddingVertical: 10 }]}>
            <MenuHeading
              textStyles={{ fontSize: 16 }}
              heading="How to install"
              Icon={() => <></>}
              onPress={() => {
                WebBrowser.openBrowserAsync('https://www.huelite.in/support/how_to_install');
              }}
            />
            <View
              style={{
                height: 1,
                width: '95%',
                marginHorizontal: '2.5%',
                borderBottomColor: '#999',
                borderBottomWidth: 1,
              }}
            />
            <MenuHeading
              textStyles={{ fontSize: 16 }}
              heading="How to pair"
              Icon={() => <></>}
              onPress={() => {
                WebBrowser.openBrowserAsync('https://www.huelite.in/support/how_to_pair');
              }}
            />
            <View
              style={{
                height: 1,
                width: '95%',
                marginHorizontal: '2.5%',
                borderBottomColor: '#999',
                borderBottomWidth: 1,
              }}
            />
            <MenuHeading
              textStyles={{ fontSize: 16 }}
              heading="Link with Alexa"
              Icon={() => <></>}
              onPress={() => {
                WebBrowser.openBrowserAsync('https://www.huelite.in/support/linkAlexa');
              }}
            />
            <View
              style={{
                height: 1,
                width: '95%',
                marginHorizontal: '2.5%',
                borderBottomColor: '#999',
                borderBottomWidth: 1,
              }}
            />
            <MenuHeading
              textStyles={{ fontSize: 16 }}
              heading="More..."
              Icon={() => <></>}
              onPress={() => {
                WebBrowser.openBrowserAsync('https://www.huelite.in/support/getstarted');
              }}
            />
          </View>
        </View>

        <View // guides & manual
          style={{
            marginHorizontal: 10,
            marginTop: 50,
          }}
        >
          <Text style={[styles.H7, { color: '#55f', opacity: 0.6 }]}>HELP</Text>
          <View style={[styles.shadow, { backgroundColor: '#fff', borderRadius: 10, marginTop: 10, paddingVertical: 10 }]}>
            <MenuHeading
              textStyles={{ fontSize: 16 }}
              heading="Terms & Conditions"
              Icon={() => <></>}
              onPress={() => {
                WebBrowser.openBrowserAsync('https://www.huelite.in/support/termsNconditions');
              }}
            />
            <View
              style={{
                height: 1,
                width: '95%',
                marginHorizontal: '2.5%',
                borderBottomColor: '#999',
                borderBottomWidth: 1,
              }}
            />
            <MenuHeading
              textStyles={{ fontSize: 16 }}
              heading="Privacy Policy"
              Icon={() => <></>}
              onPress={() => {
                WebBrowser.openBrowserAsync('https://www.huelite.in/support/privacy_policy');
              }}
            />
            <View
              style={{
                height: 1,
                width: '95%',
                marginHorizontal: '2.5%',
                borderBottomColor: '#999',
                borderBottomWidth: 1,
              }}
            />
            <MenuHeading
              textStyles={{ fontSize: 16 }}
              heading="Support"
              Icon={() => <></>}
              onPress={() => {
                WebBrowser.openBrowserAsync('https://www.huelite.in/support');
              }}
            />
            <View
              style={{
                height: 1,
                width: '95%',
                marginHorizontal: '2.5%',
                borderBottomColor: '#bbb',
                borderBottomWidth: 1,
              }}
            />
            <MenuHeading
              textStyles={{ fontSize: 16 }}
              heading="Chat with us"
              Icon={() => <Ionicons name="logo-whatsapp" size={24} color="#25d366" />}
              onPress={() => {
                let link = 'https://wa.me/+919839531395?text=Hi,%20I%20need%20assistance';
                if (Linking.canOpenURL(link)) Linking.openURL(link);
                else console.log('cannot open url');
              }}
            />
          </View>

          <View
            style={{
              width: '100%',
              marginVertical: 25,
            }}
          >
            <Text
              style={[
                styles.H7,
                {
                  fontWeight: 'normal',
                  color: '#555',
                  textAlign: 'center',
                },
              ]}
            >
              Powered by <Text style={{ fontWeight: 'bold' }}>STERNET INDUSTRIES</Text>
            </Text>
            <Text style={[styles.H7, { fontWeight: 'normal', textAlign: 'center' }]}>ver - 2.1.1-beta</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default AppConfigScreen;

interface MenuHeadingProps {
  Icon: any;
  heading: string;
  textStyles?: StyleProp<TextStyle>;
  onPress?: () => void;
}
const MenuHeading = ({ Icon, heading, textStyles, onPress = () => {} }: MenuHeadingProps) => {
  return (
    <NewRectButtonWithChildren
      style={{
        width: '100%',
        paddingHorizontal: 10,
        marginVertical: 5,
        backgroundColor: 'transparent',
      }}
      innerCompStyle={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        //backgroundColor: "red",
        width: '100%',
        paddingRight: 10,
      }}
      onPress={onPress}
    >
      <Text style={[{ fontSize: 25, fontWeight: 'bold', color: '#777' }, textStyles]}>{heading}</Text>
      <Icon />
    </NewRectButtonWithChildren>
  );
};
