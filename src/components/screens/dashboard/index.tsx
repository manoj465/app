import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import DeviceCard from '../../../../sternet/ui/device-card';
import { logger } from '../../../@logger';
//native imports
import { _appState } from '../../../redux/rootReducer';
import { MainRouterStackParamList } from '../../../routers/MainRouter';
import { NewRectButtonWithChildren } from '../../common/buttons/RectButtonCustom';
import Header from './header';
import Group from './groupContainer';
import { AlexaHintBox } from '../../common/hintBoxes';
import AddDevicePrompt from './addNewDevicePrompt';

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

  let noGroupdeviceList = deviceList.filter((item) => !item.groupName);
  let groupDeviceList: GROUP_t[] = [];
  deviceList.forEach((device, deviceIndex) => {
    if (device.groupName) {
      let tempGroup = groupDeviceList.find((item) => item.groupName == device.groupName);
      if (tempGroup) {
        groupDeviceList.forEach((lc) => {
          if (lc.groupName == device.groupName) {
            lc.devices.push(device);
          }
        });
      } else {
        let sameGroupDevices = deviceList.filter((item) => item.groupName == device.groupName);
        if (sameGroupDevices.length > 1) {
          groupDeviceList.push({
            groupName: device.groupName,
            devices: [{ ...device }],
            groupType: device.channel.deviceType,
          });
        } else {
          noGroupdeviceList.push(device);
        }
      }
    }
  });
  //console.log(groupDeviceList);

  const user = useSelector(({ appCTXReducer: { user } }: _appState) => user);
  const scrollViewRef = useRef(null);

  return (
    <SafeAreaView
      style={{
        display: 'flex',
        flexDirection: 'column',
        //backgroundColor: "#002",
        flex: 1,
      }}
    >
      <Header navigation={navigation} user={user} />

      <Animated.ScrollView ///deviceListContainer
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          //backgroundColor: "#0aa",
          //paddingHorizontal: '2%',
          marginTop: 20,
        }}
      >
        {deviceList.length > 0 ? (
          <View /// deviceList container
            style={{}}
          >
            {/* <View style={{ height: HEADER_MAX_HEIGHT + 60 }}></View> */}
            {groupDeviceList.map((group, groupIndex) => {
              return <Group key={groupIndex} group={group} navigation={navigation} />;
            })}
            {noGroupdeviceList.map((device, index) => {
              return (
                <View
                  key={index}
                  style={{
                    marginVertical: 10,
                    width: '96%',
                    marginHorizontal: '2%',
                  }}
                >
                  <DeviceCard device={device} navigation={navigation} log={log} />
                </View>
              );
            })}
          </View>
        ) : (
          <AddDevicePrompt navigation={navigation} />
        )}
        {/*  <View /// hintBox container
          style={{
            marginTop: 50,
            marginBottom: 50,
            width: '95%',
            marginHorizontal: '2.5%',
          }}
        >
          <AlexaHintBox style={{ paddingVertical: 15 }} />
        </View> */}
      </Animated.ScrollView>
    </SafeAreaView>
  );
};
