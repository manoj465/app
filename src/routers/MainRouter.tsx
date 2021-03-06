import { createStackNavigator, StackNavigationProp, CardStyleInterpolators } from '@react-navigation/stack';
import React from 'react';
import UNIVERSALS from '../@universals';
import AppConfigScreen from '../components/screens/appConfig';
import { Dashboard } from '../components/screens/dashboard';
import DevicePage from '../components/screens/devicePage';
import { WelcomeScreen } from '../components/screens/onboarding/WelcomeScreen';
import PairingScreen from '../components/screens/pairing/PairingConnectorScreen1';
import UserProfileScreen from '../components/screens/userProfile';
import { deviceContainerType } from '../util/dummyData/DummyData';
import SetupDeviceScreen from '../components/screens/devicePage/SetupScreen';
import DeleteDeviceScreen from '../components/screens/devicePage/DeleteScreen';
import { Dimensions } from 'react-native';

export type MainRouterStackParamList = {
  //login_signup: undefined;
  deleteDevice: { device: DEVICE_t };
  setupDevice: { device: DEVICE_t };
  onboarding: undefined;
  pairing: undefined;
  //DashboardRouter: undefined;
  config: undefined;
  user: undefined;
  dashboard: undefined;
  devicePage: { device: DEVICE_t };
  deviceObjectPage: { group: deviceContainerType };
};

export type MainRouterNavigationProp = StackNavigationProp<MainRouterStackParamList>;
const Stack = createStackNavigator<MainRouterStackParamList>();
const MainRouter = (props: any) => {
  return (
    <Stack.Navigator
      initialRouteName={props.initialScreen ? props.initialScreen : 'DashboardRouter'}
      //initialRouteName="user"
      screenOptions={{
        //headerShown: false,
        gestureEnabled: false,
        cardStyle: {
          opacity: 1,
          backgroundColor: '#fff',
        },
      }}
    >
      {/* <Stack.Screen name="login_signup" component={GetStarted} /> */}
      <Stack.Screen
        name="onboarding"
        component={WelcomeScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="pairing"
        component={PairingScreen}
        options={{
          title: 'Add new device',
          gestureEnabled: false,
        }}
      />

      <Stack.Screen
        name="dashboard"
        component={Dashboard}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />

      <Stack.Screen
        name="config"
        component={AppConfigScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-layouts.screen.width, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
      />

      <Stack.Screen
        name="user"
        component={UserProfileScreen}
        options={{
          gestureEnabled: false,
          headerTitle: 'User Account',
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="devicePage"
        component={DevicePage}
        options={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      />

      <Stack.Screen
        name="setupDevice"
        component={SetupDeviceScreen}
        options={{
          title: 'Setup new device',
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: 'vertical',
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          cardStyle: {
            backgroundColor: '#ffffffdd',
          },
        }}
      />

      <Stack.Screen
        name="deleteDevice"
        component={DeleteDeviceScreen}
        options={{
          title: 'Delete device',
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          cardStyle: {
            backgroundColor: '#ffffffff',
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default MainRouter;
