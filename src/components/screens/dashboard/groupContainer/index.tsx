import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { interpolate } from 'react-native-reanimated';
import { mix, useValue } from 'react-native-redash';
import { useSpringTransition } from '../../../common/transitions/Transition';
import DeviceCard, { deviceCardHeight } from '../../../../../sternet/ui/device-card';
import { GroupHeader } from './GroupHeader';

interface Props {
  navigation: any;
  group: GROUP_t;
}

export default ({ group, navigation }: Props) => {
  const open = useValue<0 | 1>(0);
  //const [open, setOpen] = useState<boolean>(false);
  const transition = useSpringTransition(open);
  const deviceContainerheight = interpolate(transition, {
    inputRange: [0, 1],
    outputRange: [deviceCardHeight + 10 + group.devices.length * 5, group.devices.length * (deviceCardHeight + 60)],
  });
  const deviceContainerHeaderIconSkew = mix(transition, -Math.PI / 2, Math.PI / 2);
  const groupButtonHeight = interpolate(transition, {
    inputRange: [0, 1],
    outputRange: [deviceCardHeight + 30 + group.devices.length * 5 + 30, 0],
  });

  const navigateToGroup = () => {
    console.log('navigating to group');
    //navigation.navigate('deviceObjectPage', { group: group });
  };

  return (
    <View style={styles.groupContainer}>
      {group.groupName && ( /// group header
        <View
          style={{
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
            elevation: 3,
            marginHorizontal: '2%',
            width: '96%',
            backgroundColor: '#fff',
            shadowColor: '#000',
            overflow: 'hidden',
            borderRadius: 15,
          }}
        >
          <GroupHeader
            groupName={group.groupName}
            open={open}
            setOpen={'setOpen'}
            deviceContainerHeaderIconSkew={deviceContainerHeaderIconSkew}
            navigateToGroup={navigateToGroup}
          />
        </View>
      )}
      <Animated.View
        style={{
          //backgroundColor: "red",
          marginTop: 15,
          overflow: 'visible',
          height: deviceContainerheight,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {group.devices.length > 0 &&
          group.devices.map((device: any, d_index: any) => {
            const top = interpolate(transition, {
              inputRange: [0, 1],
              outputRange: [d_index * 5, d_index * (deviceCardHeight + 60)],
            });
            return (
              <Animated.View
                key={d_index}
                style={{
                  width: '96%',
                  marginHorizontal: '2%',
                  position: 'absolute',
                  zIndex: group.devices.length - d_index,
                  top,
                }}
              >
                <DeviceCard
                  groupOpen={open}
                  device={device}
                  groupMac={group.devices.map((item) => item.Mac)}
                  //deviceContainer={group}
                  navigation={navigation}
                />
              </Animated.View>
            );
          })}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  groupContainer: {
    width: '100%',
    alignSelf: 'center',
    overflow: 'hidden',
    //backgroundColor: "#ff0",
  },
});
