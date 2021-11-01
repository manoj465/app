import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, Image, TextStyle, StyleProp } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import UNIVERSALS from '../../../../@universals';
import { NewRectButtonWithChildren } from '../../../common/buttons/RectButtonCustom';
import { AntDesign } from '@expo/vector-icons';
import { appOperator } from '../../../../app.operator';
import { logger } from '../../../../@logger';
import { device } from '../../../../@universals/globals/globalTypes';
import reduxStore, { appState } from '../../../../redux';
import { useSelector } from 'react-redux';
import { ToggleSwitch } from '../../../common/ToggleSwitch';
import { getCurrentTimeStampInSeconds } from '../../../../util/DateTimeUtil';
import CustomTextField1 from '../../../common/text/CustomTextField1';

interface Props {
  navigation: any;
  route: {
    params: {
      device: DEVICE_t;
    };
  };
}

const deviceIconsArray = [
  require('../../../../../assets/icons/deviceIcons/ceiling-lamp.png'),
  require('../../../../../assets/icons/deviceIcons/desk-lamp.png'),
  require('../../../../../assets/icons/deviceIcons/led-strip.png'),
  require('../../../../../assets/icons/deviceIcons/double-bed.png'),
  require('../../../../../assets/icons/deviceIcons/lamp.png'),
  require('../../../../../assets/icons/deviceIcons/kitchen-outline.png'),
  require('../../../../../assets/icons/deviceIcons/kitchen.png'),
  require('../../../../../assets/icons/deviceIcons/bar.png'),
  require('../../../../../assets/icons/deviceIcons/lightbulb.png'),
  require('../../../../../assets/icons/deviceIcons/table-lamp.png'),
  require('../../../../../assets/icons/deviceIcons/monitor.png'),
  require('../../../../../assets/icons/deviceIcons/television.png'),
];

const getManufacturer = (props: { Hostname: String }) => {
  if (props.Hostname.split('_')[0] == 'HUE') return 'HUElite Smart home';
  else if (props.Hostname.split('_')[0] == 'BDE') return 'BDE Electronic';
};

const primaryColor = '#55f';
const { height, width } = Dimensions.get('window');
export default (props: Props) => {
  const device = useSelector((state: appState) =>
    state.deviceReducer.deviceList.find((item) => item.Mac == props.route.params.device.Mac)
  );

  const fullScreen = props.navigation.canGoBack();

  return (
    <View //outerContainer
      style={{
        flex: 1,
        backgroundColor: fullScreen ? '#ffffff00' : '#ffffff',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      <View /// headerContainer
        style={{
          flex: 0.3,
          //height: 80,
          backgroundColor: fullScreen ? '#ffffff00' : '#ffffff',
        }}
      >
        {fullScreen ? (
          <View /// dialogTypeHeader
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                height: 6,
                marginBottom: 7,
                borderRadius: 10,
                width: 150,
                backgroundColor: '#999',
                overflow: 'hidden',
              }}
            ></View>
            <View
              style={{
                height: 50,
                backgroundColor: '#55f',
                width,
                overflow: 'hidden',
                borderTopLeftRadius: 25,
                borderTopRightRadius: 25,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <NewRectButtonWithChildren /// closeButton
                style={{
                  position: 'absolute',
                  right: 20,
                  marginLeft: 10,
                  height: 40,
                  backgroundColor: 'transparent',
                  zIndex: 2,
                }}
                innerCompStyle={{
                  height: 40,
                  backgroundColor: 'transparent',
                }}
                onPress={() => {
                  //props.navigation.replace("dashboard")
                  if (props.navigation.canGoBack()) props.navigation.goBack();
                  else props.navigation.reset({ index: 0, routes: [{ name: 'dashboard' }] });
                }}
              >
                <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Done</Text>
              </NewRectButtonWithChildren>

              <Text
                style={{
                  color: '#eee',
                  fontSize: 16,
                  fontWeight: 'bold',
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                Setup your device
              </Text>
            </View>
          </View>
        ) : (
          <View //fullScreenHeader
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-end',
            }}
          >
            <View // imageContainer [absolute]
              style={{
                flex: 1,
                height: '100%',
                width: '100%',
                //backgroundColor: "red",
                position: 'absolute',
                top: 0,
                left: 0,
                justifyContent: 'flex-start',
                alignItems: 'flex-end',
                paddingRight: 30,
              }}
            >
              <Image
                style={{ height: 150, width: 150, opacity: 0.5 }}
                source={require('../../../../../assets/images/setupScreen/bg.jpg')}
              />
            </View>

            <NewRectButtonWithChildren // closeButton [absolute]
              style={{
                position: 'absolute',
                top: 38,
                left: 10,
                padding: 0,
                margin: 0,
                marginTop: 0,
                width: 40,
                height: 40,
                backgroundColor: 'transparent',
              }}
              innerCompStyle={{
                padding: 0,
                margin: 0,
                marginTop: 0,
                width: 40,
                height: 40,
                backgroundColor: 'transparent',
              }}
              onPress={() => {
                //props.navigation.replace("dashboard")
                if (props.navigation.canGoBack()) props.navigation.goBack();
                else props.navigation.reset({ index: 0, routes: [{ name: 'dashboard' }] });
              }}
            >
              <AntDesign name="close" size={24} color="#777" style={{ fontWeight: 'bold' }} />
            </NewRectButtonWithChildren>

            <View
              style={{
                backgroundColor: 'red',
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                height: 40,
              }}
            >
              <Text style={{ color: '#777', fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>
                Setup your device
              </Text>
            </View>
          </View>
        )}
      </View>

      <View
        style={{
          backgroundColor: fullScreen ? '#55f' : 'white',
          flex: 1,
        }}
      >
        <ScrollView //innerContainer
          showsVerticalScrollIndicator={false}
          style={{
            backgroundColor: 'white',
            flex: 1,
            borderTopRightRadius: 25,
            borderTopLeftRadius: 25,
            overflow: 'hidden',
            paddingHorizontal: 10,
            shadowOffset: {
              width: 0,
              height: -1,
            },
            shadowOpacity: 0.3,
            shadowRadius: 2.22,
            shadowColor: '#000000',
            elevation: 5,
          }}
        >
          <Text style={{ color: primaryColor, fontSize: 15, fontWeight: 'bold', marginTop: 30 }}>
            Enter device name
          </Text>
          <Text style={{ color: '#999', fontSize: 12 }}>
            device name must be unique and <Text style={{ fontWeight: 'bold' }}>six</Text> characters or longer.
          </Text>
          <CustomTextField1
            primaryColor={primaryColor}
            placeholder={device ? device.deviceName : 'Enter device name'}
            validateInput={(text) => {
              if (text.length >= 6 && text != device?.deviceName) return true;
              return false;
            }}
            onSave={(text) => {
              console.log('new Device name  = ' + text);
              if (device) {
                appOperator.device({
                  cmd: 'ADD_UPDATE_DEVICES',
                  newDevices: [
                    {
                      ...device,
                      //@ts-ignore - String <=> string mismatch.
                      deviceName: text,
                      localTimeStamp: getCurrentTimeStampInSeconds(),
                    },
                  ],
                  log: new logger('TEST'),
                });
              }
            }}
          />
          <GroupSection device={device} />
          <Text style={{ color: primaryColor, fontSize: 15, fontWeight: 'bold', marginTop: 50 }}>
            Select device Icon
          </Text>
          <Text style={{ color: '#999', fontSize: 12 }}>this feature is experimental and is subject to changes</Text>

          <View /// iconsContainer
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 30,
            }}
          >
            {deviceIconsArray.map((item, index) => {
              return (
                <View
                  key={'' + index}
                  style={{
                    backgroundColor: '#fff',
                    margin: 2,
                    height: width * 0.29,
                    width: width * 0.29,
                    justifyContent: 'center',
                    alignItems: 'center',
                    display: 'flex',
                  }}
                >
                  <NewRectButtonWithChildren
                    onPress={() => {
                      if (device) {
                        appOperator.device({
                          cmd: 'ADD_UPDATE_DEVICES',
                          newDevices: [
                            {
                              ...device,
                              icon: index,
                              localTimeStamp: getCurrentTimeStampInSeconds(),
                            },
                          ],
                          log: new logger('TEST'),
                        });
                      }
                    }}
                    style={{
                      backgroundColor: '#fff',
                      borderColor: '#999',
                      borderRadius: 0,
                      borderWidth: device && device.icon == index ? 3 : 0,
                      width: width * 0.22,
                      height: width * 0.22,
                      //overflow: "hidden",
                      elevation: 2,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    innerCompStyle={{}}
                  >
                    <Image
                      style={{
                        width: width * 0.18,
                        height: width * 0.18,
                        opacity: 1,
                      }}
                      source={item}
                    />
                  </NewRectButtonWithChildren>
                </View>
              );
            })}
          </View>

          <View /// divider
            style={{
              marginTop: 30,
              display: 'flex',
              flexDirection: 'row',
              paddingHorizontal: 30,
              justifyContent: 'space-between',
            }}
          >
            <View style={{ borderBottomWidth: 0.5, borderColor: '#555', height: 1, width: width / 3 }}></View>
            <View style={{ borderBottomWidth: 0.5, borderColor: '#555', height: 1, width: width / 3 }}></View>
          </View>

          <View /// saveLastStateContainer
            style={{
              marginTop: 50,
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <View
              style={{
                flex: 1,
              }}
            >
              <Text style={{ color: primaryColor, fontSize: 15, fontWeight: 'bold' }}>Save last state</Text>
              <Text style={{ color: '#999', fontSize: 12 }}>
                weather or not to save and restore device color state during power loss
              </Text>
            </View>
            <View
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
              }}
            >
              <ToggleSwitch
                onPress={() => {
                  // - [ ] hit device config api here
                  if (device)
                    appOperator.device({
                      cmd: 'ADD_UPDATE_DEVICES',
                      newDevices: [
                        {
                          ...device,
                          config: {
                            saveLastState: !device?.config?.saveLastState,
                          },
                          localTimeStamp: getCurrentTimeStampInSeconds(),
                        },
                      ],
                    });
                }}
                state={device?.config?.saveLastState ? true : false}
              />
            </View>
          </View>

          <View /// firmwareVersionContainer
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: 50,
            }}
          >
            <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 22, color: '#ccc' }}>Device Info</Text>
            <View style={{ display: 'flex', flexDirection: 'row', marginTop: 10 }}>
              <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#555' }}>Firmware ver :</Text>
              <Text style={{ textAlign: 'center', marginLeft: 10, color: '#000' }}>
                {device?.deviceInfo?.firmwareVersion}
              </Text>
            </View>

            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#555' }}>UUID :</Text>
              <Text style={{ textAlign: 'center', marginLeft: 10, color: '#555', fontWeight: 'bold' }}>
                {device?.Hostname}
              </Text>
            </View>

            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#555' }}>Manufacturer :</Text>
              <Text style={{ textAlign: 'center', marginLeft: 10, color: '#000' }}>
                {device ? getManufacturer({ Hostname: device?.Hostname }) : 'Sternet Industries'}
              </Text>
            </View>
          </View>

          <View // divider
            style={{
              marginTop: 30,
              display: 'flex',
              flexDirection: 'row',
              paddingHorizontal: 30,
              justifyContent: 'space-between',
            }}
          >
            <View style={{ borderBottomWidth: 0.5, borderColor: '#555', height: 1, width: width / 3 }}></View>
            <View style={{ borderBottomWidth: 0.5, borderColor: '#555', height: 1, width: width / 3 }}></View>
          </View>

          <View //bottom spacer
            style={{
              height: 30,
            }}
          ></View>
        </ScrollView>
      </View>
    </View>
  );
};

const GroupSection = ({ device }: { device?: DEVICE_t }) => {
  const [invalidGroup, setInvalidGroup] = useState(false);
  return (
    <View>
      <Text style={{ color: primaryColor, fontSize: 15, fontWeight: 'bold', marginTop: 30 }}>Add device to group</Text>
      <Text style={{ color: invalidGroup ? 'red' : '#999', fontSize: 12 }}>
        {invalidGroup
          ? "Can't add to this group due to incompaitable devices"
          : 'you can group devices from similiar modal and kind'}
      </Text>
      <CustomTextField1
        primaryColor={primaryColor}
        placeholder={device && device?.groupName ? device.groupName : 'Enter group name'}
        validateInput={(text) => {
          if (text.length >= 6 && text != device?.groupName) {
            let otherGroupDevice = reduxStore.store
              .getState()
              .deviceReducer.deviceList.find((item) => item.groupName == text);

            if (
              !otherGroupDevice ||
              (otherGroupDevice && otherGroupDevice.channel.deviceType == device?.channel.deviceType)
            ) {
              return true;
            } else if (otherGroupDevice && otherGroupDevice.channel.deviceType != device?.channel.deviceType) {
            }
          }
          return false;
        }}
        onSave={(text) => {
          console.log('new group name  = ' + text);
          if (device) {
            appOperator.device({
              cmd: 'ADD_UPDATE_DEVICES',
              newDevices: [
                {
                  ...device,
                  groupName: text,
                  localTimeStamp: getCurrentTimeStampInSeconds(),
                },
              ],
            });
          }
        }}
      />
      {device?.groupName ? (
        <NewRectButtonWithChildren /// remove from group button
          onPress={() => {
            appOperator.device({
              cmd: 'ADD_UPDATE_DEVICES',
              newDevices: [
                {
                  ...device,
                  groupName: '',
                  localTimeStamp: getCurrentTimeStampInSeconds(),
                },
              ],
            });
          }}
        >
          <Text style={{ color: 'red', textAlign: 'center' }}>Remove device from group</Text>
        </NewRectButtonWithChildren>
      ) : null}
    </View>
  );
};
