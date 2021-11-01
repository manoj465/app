import { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { MainRouterStackParamList } from '../../../routers/MainRouter';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { STYLES } from '../../../@styles';
import { NewRectButtonWithChildren } from '../../common/buttons/RectButtonCustom';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import api from '../../../@api';
import reduxStore from '../../../redux';
import Axios from 'axios';
import { appOperator } from '../../../app.operator';
import { logger } from '../../../@logger';

enum deleteScreenStep_e {
  wait,
  deleting,
  cloudError,
  unpairError,
  deleted,
}
enum status_e {
  idle = 'idle',
  working = 'working',
  done = 'done',
  error = 'error',
}

export type navigationProp = StackNavigationProp<MainRouterStackParamList, 'deleteDevice'>;
type routeProp = RouteProp<MainRouterStackParamList, 'deleteDevice'>;
interface Props {
  navigation: navigationProp;
  route: routeProp;
}
export default ({
  navigation,
  route: {
    params: { device },
  },
}: Props) => {
  const [step, setStep] = useState<deleteScreenStep_e>(deleteScreenStep_e.wait);
  const [cloudDeletionStatus, setCloudDeletionStatus] = useState<status_e>(status_e.idle);
  const [unpairingStatus, setUnpairingStatus] = useState<status_e>(status_e.idle);

  const deleteFun = async () => {
    console.log('now deleting device : ' + JSON.stringify(device));
    let _unpairingStatus: status_e = status_e.idle,
      _cloudDeletionStatus: status_e = status_e.idle,
      user = reduxStore.store.getState().appCTXReducer.user;
    /// unlink device from user's devices
    if (user?.id && device.id && cloudDeletionStatus != status_e.working && cloudDeletionStatus != status_e.done) {
      _cloudDeletionStatus = status_e.working;
      setCloudDeletionStatus(status_e.working);
      let res = await api.cloudAPI.user.userDeviceUpdateMutation.v1({
        id: user.id,
        deviceID: device.id,
        connect: false,
      });
      if (res.ERR) {
        console.log('error while deleting device from cloud ' + JSON.stringify(res.ERR));
        setCloudDeletionStatus(status_e.error);
        _cloudDeletionStatus = status_e.error;
      } else if (res?.RES?.updateUser.devices.find((item) => item.id == device.id)) {
        console.log('device not yet deleted');
        setCloudDeletionStatus(status_e.error);
        _cloudDeletionStatus = status_e.error;
      } else {
        console.log('device deleted from cloud' + JSON.stringify(res));
        setCloudDeletionStatus(status_e.done);
        _cloudDeletionStatus = status_e.done;
      }
    } else {
      if (cloudDeletionStatus == status_e.done) console.log('device deleted already');
      else console.log('user/device id missing, no need to unlink from cloud');
      setCloudDeletionStatus(status_e.done);
      _cloudDeletionStatus = status_e.done;
    }
    /// unpair device
    if (_cloudDeletionStatus == status_e.done && unpairingStatus != status_e.done) {
      if (unpairingStatus != status_e.done && unpairingStatus != status_e.working) {
        console.log('attempting device unpairing');
        _unpairingStatus = status_e.working;
        setUnpairingStatus(status_e.working);
        let unpairRes = await Axios.get(`http://${device.IP}/unpair`, { timeout: 5000 })
          .then((res) => {
            if (res.status == 200) {
              console.log('device unpaired successfully ' + JSON.stringify(res));
              setUnpairingStatus(status_e.done);
              _unpairingStatus = status_e.done;
            } else {
              console.log('unpair device API failed. ' + JSON.stringify(res));
              setUnpairingStatus(status_e.error);
              _unpairingStatus = status_e.error;
            }
          })
          .catch((err) => {
            console.log('unpair device API error. ' + JSON.stringify(err));
            setUnpairingStatus(status_e.error);
            _unpairingStatus = status_e.error;
          });
      }
    } else {
      console.log('cloud deletion failed, which must be completed to delete the device');
    }

    /// analyse unpairing status and clpoud deletion status and proceed accordingly
    console.log('cloudDeletion status is ' + _cloudDeletionStatus);
    console.log('unpairing status is ' + _unpairingStatus);
    //@ts-ignore - incompatiable warning as `_unpairingStatus` typescript isn't considering that we are setting it to `status_e.error` inside catch block
    if (_cloudDeletionStatus == status_e.error) {
      setStep(deleteScreenStep_e.cloudError);
    }
    //@ts-ignore - incompatiable warning as `_unpairingStatus` typescript isn't considering that we are setting it to `status_e.error` inside catch block
    else if (_unpairingStatus == status_e.error) {
      console.log('device deleted from cloud but unpairing failed');
      setStep(deleteScreenStep_e.unpairError);
    }
    //@ts-ignore - incompatiable warning as `_unpairingStatus` typescript isn't considering that we are setting it to `status_e.done` inside catch block
    else if (_unpairingStatus == status_e.done && _cloudDeletionStatus == status_e.done) {
      console.log('device deleted and successfully unpaired');
      //setStep(deleteScreenStep_e.deleted);
      appOperator.device({
        cmd: 'REMOVE_DEVICE',
        Mac: device.Mac,
      });
      if (navigation.canGoBack()) navigation.goBack();
      else navigation.replace('dashboard');
    }
  };

  useEffect(() => {
    if (step == deleteScreenStep_e.deleted) {
      if (navigation.canGoBack()) navigation.goBack();
      else navigation.replace('dashboard');
    }
    return () => {};
  }, [step]);

  if (device)
    return (
      <View
        style={{
          backgroundColor: '#ffffff',
          flex: 1,
          flexDirection: 'column',
        }}
      >
        {/* /// content section */}
        <View style={{ flex: 0.8, justifyContent: 'center', alignItems: 'center' }}>
          {/* <Text style={{ textAlign: 'center', fontSize: 22, color: STYLES.textColors.warning, fontWeight: 'bold' }}>Delete Device</Text> */}
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <MaterialCommunityIcons name="delete-forever" size={200} color={STYLES.textColors.warning} style={{ alignSelf: 'center', opacity: 0.5 }} />
          </View>
          {step == deleteScreenStep_e.wait ? (
            <Text
              style={{
                textAlign: 'center',
                fontSize: 14,
                color: '#777',
                marginTop: 20,
                marginHorizontal: 20,
              }}
            >
              Deleting the device from app, will also reset your hardware. third-party integrations and shared features won't work after that.
            </Text>
          ) : step == deleteScreenStep_e.deleting || step == deleteScreenStep_e.unpairError || step == deleteScreenStep_e.cloudError ? (
            <>
              <DeletingView device={device} setStep={setStep} cloudDeletionStatus={cloudDeletionStatus} unpairingStatus={unpairingStatus} />
              {step == deleteScreenStep_e.unpairError ? (
                <Text style={{ color: STYLES.textColors.warning, textAlign: 'center', marginHorizontal: '10%', marginBottom: 20, fontWeight: 'bold' }}>
                  Device unlinked from cloud but failed to reset the hardware. you can retry or try to reset the device manually
                </Text>
              ) : step == deleteScreenStep_e.cloudError ? (
                <Text style={{ color: STYLES.textColors.warning, textAlign: 'center', marginHorizontal: '10%', marginBottom: 20, fontWeight: 'bold' }}>
                  Device unlinking failed. this coud be due to network error. kindly, check network connection and try again.
                </Text>
              ) : (
                <></>
              )}
              {}
            </>
          ) : (
            <></>
          )}
        </View>
        {/* /// button secttion */}
        <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center' }}>
          <NewRectButtonWithChildren
            style={{
              backgroundColor: 'red',
              width: '80%',
              maxWidth: 300,
            }}
            onPress={() => {
              if (
                cloudDeletionStatus != status_e.working &&
                unpairingStatus != status_e.working &&
                (step == deleteScreenStep_e.wait || step == deleteScreenStep_e.unpairError || step == deleteScreenStep_e.cloudError)
              ) {
                if (step == deleteScreenStep_e.wait) setStep(deleteScreenStep_e.deleting);
                deleteFun();
              }
            }}
          >
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
              {step == deleteScreenStep_e.unpairError || step == deleteScreenStep_e.cloudError ? 'Retry' : 'Delete'}
            </Text>
          </NewRectButtonWithChildren>
          <NewRectButtonWithChildren
            style={{ marginTop: 15 }}
            onPress={() => {
              if (step != deleteScreenStep_e.deleting) {
                if (step == deleteScreenStep_e.unpairError) {
                  //- [ ] remove device from local state
                  appOperator.device({
                    cmd: 'REMOVE_DEVICE',
                    Mac: device.Mac,
                  });
                }
                if (navigation.canGoBack()) navigation.goBack();
                else navigation.replace('dashboard');
              }
            }}
          >
            <Text>{step == deleteScreenStep_e.unpairError ? 'I will reset device manually' : 'Not really, go back.'}</Text>
          </NewRectButtonWithChildren>
        </View>
      </View>
    );
  /// in-case device prop is not present
  return <></>;
};

/**
 * @description DelitingView memoized component
 *
 * @responsiblities
 * - delete device from cloud
 * - unpair device
 */
const DeletingView = ({
  device,
  cloudDeletionStatus,
  unpairingStatus,
  setStep,
}: {
  device: DEVICE_t;
  cloudDeletionStatus: status_e;
  unpairingStatus: status_e;
  setStep: React.Dispatch<React.SetStateAction<deleteScreenStep_e>>;
}) => {
  return (
    <View
      style={{
        //backgroundColor: 'green',
        width: '100%',
      }}
    >
      {/* /// cloudDeletion view */}
      <View
        style={{
          //backgroundColor: 'red',
          height: 50,
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <View style={{ marginLeft: '10%', height: 50, width: 50, backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {cloudDeletionStatus == status_e.idle || cloudDeletionStatus == status_e.error || cloudDeletionStatus == status_e.done ? (
            <MaterialCommunityIcons
              name="checkbox-marked-circle"
              size={24}
              color={
                cloudDeletionStatus == status_e.idle
                  ? STYLES.textColors.tertiary
                  : cloudDeletionStatus == status_e.error
                  ? STYLES.textColors.warning
                  : cloudDeletionStatus == status_e.done
                  ? STYLES.textColors.success
                  : STYLES.textColors.tertiary
              }
            />
          ) : (
            <ActivityIndicator color={STYLES.textColors.tertiary} />
          )}
        </View>
        <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#999', textAlign: 'center' }}>Unlink device from user</Text>
      </View>
      {/* /// unpairing device view */}
      <View
        style={{
          //backgroundColor: 'red',
          height: 50,
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <View style={{ marginLeft: '10%', height: 50, width: 50, backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {unpairingStatus == status_e.idle || unpairingStatus == status_e.error || unpairingStatus == status_e.done ? (
            <MaterialCommunityIcons
              name="checkbox-marked-circle"
              size={24}
              color={
                unpairingStatus == status_e.idle
                  ? STYLES.textColors.tertiary
                  : unpairingStatus == status_e.error
                  ? STYLES.textColors.warning
                  : unpairingStatus == status_e.done
                  ? STYLES.textColors.success
                  : STYLES.textColors.tertiary
              }
            />
          ) : (
            <ActivityIndicator color={STYLES.textColors.tertiary} />
          )}
        </View>
        <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#999' }}>Reset hardware</Text>
      </View>
    </View>
  );
};
