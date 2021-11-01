import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useRef, useState } from 'react';
import { Text, View, TextInput, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
//native imports
import { _appState } from '../../../redux/rootReducer';
import { MainRouterStackParamList } from '../../../routers/MainRouter';
import { STYLES } from '../../../@styles';
import { appOperator } from '../../../app.operator';
import { logger } from '../../../@logger';
import { NewRectButton, NewRectButtonWithChildren } from '../../common/buttons/RectButtonCustom';
import useDeleteDeviceModal from '../../common/useDeleteDeviceModal';
import Header from './header';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import DeviceCard from '../../../../sternet/ui/device-card';
import mqtt from '../../../services/backGroundServices/mqtt';

const navigationIconSize = 25;

export type navigationProp = StackNavigationProp<MainRouterStackParamList, 'dashboard'>;

type routeProp = RouteProp<MainRouterStackParamList, 'dashboard'>;

interface Props {
  navigation: navigationProp;
  route: routeProp;
}

export const Dashboard = ({ navigation, route: { params } }: Props) => {
  let log = new logger('DASHBOARD');
  const deviceList = useSelector(({ deviceReducer: { deviceList } }: _appState) => deviceList);
  const user = useSelector(({ appCTXReducer: { user } }: _appState) => user);
  //const user = useSelector(({ appCTXReducer: { user } }: _appState) => user);
  const scrollViewRef = useRef(null);
  //const state = useValue(State.UNDETERMINED)
  //const onScroll = onScrollEvent({ y })
  //const scroll = useRef(null);

  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} user={user} />
      {/* /Sec1: deviceListContainer */}
      <Animated.ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} style={styles.deviceListContainer}>
        <View>
          {/* <View style={{ height: HEADER_MAX_HEIGHT + 60 }}></View> */}
          {deviceList.map((device, index) => {
            return (
              <View
                key={index}
                style={{
                  marginVertical: 10,
                }}
              >
                <DeviceCard device={device} navigation={navigation} log={log} />
              </View>
            );
          })}
        </View>
      </Animated.ScrollView>

      {/* Sec:  */}
      {false && (
        <View style={styles.navigatorMenu}>
          <NewRectButtonWithChildren
            onPress={() => {
              //navigation.navigate("pairing");
              /* dispatch(
              newDeviceSagaAction({
                newDevice: Object.assign({}, dummyDevice, {
                  deviceName: "Kitchen TubeLight",
                  SSID: "Homelink1",
                  wifiPass: "Ioplmkjnb@1",
                  Mac: "ED:98:H3:49:f5",
                  groupName: "group",
                }),
                groupType: GROUP_TYPES.SINGLETON,
              })
            ); */
            }}
            style={{
              borderRightWidth: 0.5,
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingRight: 10,
            }}
          >
            <View
              style={{
                //backgroundColor: "green",
                flex: 1,
                justifyContent: 'center',
                height: 35,
              }}
            >
              <FontAwesome5 name="layer-group" size={navigationIconSize} color="white" />
            </View>
            <View style={{ paddingVertical: 2 }}>
              <Text style={{ color: 'white', fontSize: 12 }}>New Group</Text>
            </View>
          </NewRectButtonWithChildren>
          <NewRectButtonWithChildren
            onPress={() => {
              navigation.navigate('pairing');
            }}
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingLeft: 10,
            }}
          >
            <View
              style={{
                //backgroundColor: "green",
                flex: 1,
                justifyContent: 'center',
                height: 35,
              }}
            >
              <MaterialIcons name="add-circle-outline" size={navigationIconSize} color="white" />
            </View>
            <View style={{ paddingVertical: 2 }}>
              <Text style={{ color: 'white', fontSize: 12 }}>Add Device</Text>
            </View>
          </NewRectButtonWithChildren>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    //backgroundColor: "#002",
    flex: 1,
  },
  ScreenName: {
    fontSize: 20,
    marginHorizontal: 100,
    transform: [{ translateX: 2 }],
  },
  deviceListContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    //backgroundColor: "#0aa",
    paddingHorizontal: '2%',
    marginTop: 20,
  },
  navigatorMenu: {
    backgroundColor: '#33f',
    paddingHorizontal: 10,
    borderRadius: 15,
    overflow: 'hidden',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 10,
    display: 'flex',
    flexDirection: 'row',
    /* shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 1, */
  },
});
