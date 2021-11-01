import React from 'react';
import { View, Text } from 'react-native';
import { RectButton, TapGestureHandler, State } from 'react-native-gesture-handler';
import { onGestureEvent, useValue } from 'react-native-redash';
import Animated, { Value, useCode, cond, eq, set, not, block, call, event } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { NewRectButtonWithChildren } from '../../../common/buttons/RectButtonCustom';

interface props {
  groupName: string;
  open: any;
  setOpen: any;
  deviceContainerHeaderIconSkew: any;
  navigateToGroup: any;
}
export const GroupHeader = ({ groupName, open, setOpen, deviceContainerHeaderIconSkew, navigateToGroup }: props) => {
  const state = useValue(State.UNDETERMINED);
  const gestureHandler = event([{ nativeEvent: { state: state } }]);

  useCode(() => cond(eq(state, State.END), set(open, not(open))), [open, state]);

  return (
    <View
      style={{
        height: 50,
      }}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          //backgroundColor: "red",
        }}
      >
        <NewRectButtonWithChildren
          style={{
            //backgroundColor: 'red',
            height: '100%',
            flex: 1,
          }}
          innerCompStyle={{
            alignItems: 'flex-start',
          }}
          onPress={() => {
            navigateToGroup();
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: 'bold',
              textAlign: 'left',
              marginLeft: 20,
            }}
          >
            {groupName}
          </Text>
        </NewRectButtonWithChildren>

        <TapGestureHandler onHandlerStateChange={gestureHandler}>
          {/*  < RectButton
          onPress={() => {
            if (open == 0) setOpen(1);
            else setOpen(0);
          }}
        > */}
          <Animated.View
            style={[
              {
                height: 40,
                width: 40,
                marginHorizontal: 10,
                borderRadius: 20,
                backgroundColor: 'white',
                shadowColor: '#000',
                alignItems: 'center',
                justifyContent: 'center',
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.22,
                shadowRadius: 2.22,
                elevation: 3,
              },
              { transform: [{ rotate: deviceContainerHeaderIconSkew }] },
            ]}
          >
            <MaterialIcons name="navigate-next" size={20} color="black" />
          </Animated.View>
          {/* </RectButton> */}
        </TapGestureHandler>
      </View>
    </View>
  );
};
