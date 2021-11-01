import { MaterialIcons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, { interpolate } from 'react-native-reanimated';
import { useTimingTransition } from 'react-native-redash';
import { PairingStackParamList } from '../index';
import { logger } from '../../../../@logger';
import { NewRectButtonWithChildren } from '../../../common/buttons/RectButtonCustom';
import Support from '../SupportComp';
import Frame2 from './Frame2';
import Frame1 from './Frame1';
import Notify from '../../../common/notificationComp';
import { STYLES } from '../../../../@styles';
import UNIVERSALS from '../../../../@universals';
import reduxStore from '../../../../redux';

type pairingScreen1NavigationProp = StackNavigationProp<PairingStackParamList, 'PairScreen_1'>;
type pairingScreen1RouteProp = RouteProp<PairingStackParamList, 'PairScreen_1'>;

interface Props {
  navigation: pairingScreen1NavigationProp;
  route: pairingScreen1RouteProp;
}

const { width, height } = Dimensions.get('window');
/**
 *
 * @param param0
 *
 *
 * @todo
 * - [ ] add groupName addition feature
 * - [x] handle addition of rgb product
 * - [ ] handle addition of RGBW product
 */
export default ({ navigation }: Props) => {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [newDevice, setNewDevice] = useState<undefined | DEVICE_t>(undefined);
  const log = new logger('PAIRING_SCREEN_1');
  const [groupName, setGroupName] = useState('BedRoom');
  let _animation = null;
  const transition = useTimingTransition(step);

  useEffect(() => {
    return () => {
      reduxStore.store.dispatch(
        reduxStore.actions.appCTX.notificationsRedux({
          notifications: reduxStore.store
            .getState()
            .appCTXReducer.notifications.filter((item) => item.topic != 'PAIRING'),
        })
      );
    };
  }, []);

  return (
    <View
      //behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      //keyboardVerticalOffset={80}
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}
    >
      <Notify topic={'PAIRING'} />

      {/* Sec: headerSection */}
      <NewPairingBackground />

      {/* StepsIndicator container */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: height - 50, // subctracted header height from total height
          width,
          //backgroundColor: "red"
        }}
      >
        <View // top section
          style={{
            //backgroundColor: "green",
            flex: 0.3,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'flex-end',
          }}
        >
          <View
            style={{
              backgroundColor: step == 0 ? '#2ecc71' : '#777',
              height: 6,
              width: step == 0 ? 18 : 6,
              borderRadius: 20,
              overflow: 'hidden',
              marginHorizontal: 5,
              marginVertical: 10,
            }}
          ></View>
          <View
            style={{
              backgroundColor: step == 1 ? '#2ecc71' : '#777',
              height: 6,
              width: step == 1 ? 18 : 6,
              borderRadius: 20,
              overflow: 'hidden',
              marginHorizontal: 5,
              marginVertical: 10,
            }}
          ></View>
          <View
            style={{
              backgroundColor: step == 2 ? '#2ecc71' : '#777',
              height: 6,
              width: step == 2 ? 18 : 6,
              borderRadius: 20,
              overflow: 'hidden',
              marginHorizontal: 5,
              marginVertical: 10,
            }}
          ></View>
        </View>
      </View>

      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: interpolate(transition, {
            inputRange: [0, 1, 2],
            outputRange: [0, -width, -width * 2],
          }),
          //flex: 1,
          height: height - 50, //substracted header height
          width: width * 2,
          //backgroundColor: "red",
          display: 'flex',
          flexDirection: 'row',
          zIndex: 2,
        }}
      >
        <Frame1 show={step == 0} setStep={setStep} newDevice={newDevice} setNewDevice={setNewDevice} />

        <Frame2
          show={step == 1}
          setStep={setStep}
          newDevice={newDevice}
          setNewDevice={setNewDevice}
          navigation={navigation}
        />
      </Animated.View>
    </View>
  );
};

const BulletPoint = ({
  children,
  ...props
}: {
  children: any;
  hintTxt?: String;
  mainTxtStyle?: StyleProp<TextStyle>;
  hintTxtStyle?: StyleProp<TextStyle>;
}) => {
  return (
    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
      <Text style={[{ color: '#333', fontSize: 18, fontWeight: 'bold' }, props.mainTxtStyle]}>{'\u2022  '}</Text>
      <View>
        <Text style={[{ color: '#333', fontSize: 18, fontWeight: 'bold' }, props.mainTxtStyle]}>{children}</Text>
        {props.hintTxt && (
          <Text style={[{ marginTop: 5, color: '#555', fontSize: 16 }, props.hintTxtStyle]}>{props.hintTxt}</Text>
        )}
      </View>
    </View>
  );
};

const NewPairingBackground = (props: {}) => {
  return (
    <View
      style={{
        height: height - 50,
        width,
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1,
      }}
    >
      <View
        style={{
          flex: 0.3,
        }}
      ></View>

      <View
        style={{
          flex: 0.7,
          marginHorizontal: 15,
          borderTopRightRadius: 50,
          borderTopLeftRadius: 50,
          shadowOffset: {
            width: 0,
            height: -1,
          },
          shadowOpacity: 0.3,
          shadowRadius: 2.22,
          shadowColor: '#000000',
          elevation: 5,
          backgroundColor: '#fff',
        }}
      ></View>
    </View>
  );
};

export const PairingFrame = (props: {
  cardSectionStyle?: StyleProp<ViewStyle>;
  headerSectionStyle?: StyleProp<ViewStyle>;
  header?: any;
  children?: any;
  functionComponent?: any;
  showFunctionComponent?: boolean;
}) => {
  return (
    <View
      style={{
        flex: 1,
        width,
        backgroundColor: '#ffffff00',
      }}
    >
      {/* functional component */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: 1,
          width: 10,
          backgroundColor: '#000',
          opacity: props.showFunctionComponent ? 1 : 0,
          zIndex: 5,
        }}
      >
        {props.functionComponent &&
          (props.showFunctionComponent == true || props.showFunctionComponent == undefined) && (
            <props.functionComponent />
          )}
      </View>

      {/* header section */}
      <View
        style={[
          {
            flex: 0.3,
            overflow: 'hidden',
            backgroundColor: '#ffffff00',
          },
          props.headerSectionStyle,
        ]}
      >
        {props.header && <props.header />}
      </View>

      {/* card section */}
      <View
        style={[
          {
            backgroundColor: '#ffffff00',
            flex: 0.7,
            overflow: 'hidden',
          },
          props.cardSectionStyle,
        ]}
      >
        {props.children}
      </View>
    </View>
  );
};
