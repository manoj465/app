import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScrollView, State } from 'react-native-gesture-handler';
import { add, max, min } from 'react-native-reanimated';
import { hsv2color, useValue } from 'react-native-redash';
import { SafeAreaView } from 'react-native-safe-area-context';
import { logger } from '../../../../../@logger';
import { appOperator } from '../../../../../app.operator';
import { STYLES } from '../../../../../@styles';
import { NewRectButtonWithChildren } from '../../../../common/buttons/RectButtonCustom';
import { Modes } from '../../../../common/Modes';
import { ColorPickerSection } from './colorPickerSection';
import { DevicePageHeader } from '../DevicePageHeader';
import UNIVERSALS from '../../../../../@universals';
import { MainRouterStackParamList } from '../../../../../routers/MainRouter';
import { StackNavigationProp } from '@react-navigation/stack';
import { channelState_e } from '../../../../../../sternet/helpers/universals/device/deviceEnum';

export enum viewTypeEnum {
  DEVICE_COLOR_PICKER_SCREEN = 0,
  DEVICE_MODES_SCREEN = 1,
  DEVICE_SETTING_SCREEN = 2,
}

interface Props {
  navigation: StackNavigationProp<MainRouterStackParamList, 'devicePage'>;
  device: DEVICE_t;
  navigateToTimer?: () => void;
  hue: any;
  saturation: any;
  value: any;
  backgroundColor: any;
}
export default ({ navigation, device, ...props }: Props) => {
  const log = new logger('DEVICE COLOR PICKER');

  const colorSnippets = [
    { h: 0, s: 100, v: 100, hex: '#ff0000' },
    { h: 60, s: 100, v: 100, hex: '#ffff00' },
    { h: 119, s: 100, v: 100, hex: '#00ff00' },
    { h: 180, s: 100, v: 100, hex: '#00ffff' },
    { h: 240, s: 100, v: 100, hex: '#0000ff' },
    { h: 299, s: 100, v: 100, hex: '#ff00ff' },
  ];
  interface updateColorProps {
    h: number;
    s: number;
  }
  const updateColor = ({ h, s }: updateColorProps) => {
    appOperator.device({
      cmd: 'COLOR_UPDATE',
      deviceMac: [device.Mac],
      stateObject: {
        state: channelState_e.CH_STATE_RGB,
        hsv: { h, s },
      },
      gestureState: 0,
      onActionComplete: ({ newDeviceList }) => {
        appOperator.device({
          cmd: 'ADD_UPDATE_DEVICES',
          newDevices: newDeviceList,
          //log: new logger("debug", undefined)
        });
      },
      log,
    });
  };

  return (
    <View
      style={{
        width: '100%',
        display: 'flex',
        backgroundColor: '#fff',
      }}
    >
      <ScrollView
        style={
          {
            /* Sec1: color picker container scrollview */
            //backgroundColor: "green",
          }
        }
        showsVerticalScrollIndicator={false}
      >
        <View /// ColorPicker container
          style={{
            //backgroundColor: "blue",
            marginTop: 20,
          }}
        >
          <ColorPickerSection
            hue={props.hue}
            saturation={props.saturation}
            value={props.value}
            backgroundColor={props.backgroundColor}
            device={device}
            navigation={navigation}
            log={log}
          />
        </View>

        <View /// Modes container
          style={{}}
        >
          <View /// headingSection
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 20,
            }}
          >
            <View /** /// headingText */>
              <Text
                style={{
                  color: '#555',
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginTop: 10,
                }}
              >
                Modes
              </Text>
              <Text
                style={{
                  color: '#aaa',
                  fontSize: 14,
                }}
              >
                Choose from multiple modes
              </Text>
            </View>

            <View /** /// Timer button */
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <NewRectButtonWithChildren /* Sec3: timer button */
                style={{}}
                onPress={() => {
                  if (props.navigateToTimer) {
                    console.log('go to timer');
                    props.navigateToTimer();
                  } else {
                    console.log('cannot go to timer');
                  }
                }}
              >
                <MaterialIcons name="access-alarm" size={35} color="#333" />
              </NewRectButtonWithChildren>
            </View>
          </View>

          <View /// modes section
            style={{ marginLeft: 10, marginTop: 10 }}
          >
            <Modes device={device} />
          </View>
        </View>

        <View
          style={
            {
              /* Sec2: dividerText => colorPicker - colorSnippets */
            }
          }
        >
          <Text style={[STYLES.H1, { textAlign: 'center', marginTop: 50 }]}>More Colors</Text>
          <Text
            style={[
              STYLES.H7,
              STYLES.textFeather,
              { textAlign: 'center', marginTop: 5, marginBottom: '5%', paddingHorizontal: '8%' },
            ]}
          >
            Color is the power which directly influences human soul. colors are the smile of nature with{' '}
            <Text style={[STYLES.H7, { color: '#555' }]}> HUElite </Text> Express your self in colors, as colors is the
            most beautiful language
          </Text>
        </View>

        <View /// color snippets
          style={{
            /* Sec2: Color snippets container  */ flex: 1,
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            //backgroundColor: "blue",
            marginBottom: 300,
            alignItems: 'center',
          }}
        >
          {colorSnippets.map((color, index) => {
            return (
              <NewRectButtonWithChildren
                key={index}
                style={[
                  STYLES.shadow,
                  {
                    backgroundColor: color.hex,
                    margin: 10,
                    borderRadius: 15,
                    height: 60,
                    width: 60,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                ]}
                onPress={() => {
                  updateColor({ h: color.h, s: color.s });
                }}
              ></NewRectButtonWithChildren>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};
