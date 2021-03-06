import { State } from 'react-native-gesture-handler';
import { actionChannel, select } from 'redux-saga/effects';
import UNIVERSALS from '../../../@universals';
import { convertHSVToRgbShortRange, convertRGBToHex, hsv2hex, hsv2hex_shortRange } from '../../../util/Color';
import { logger } from '../../../@logger';
import { HBSocketList_t } from '../../helperSideEffect/reducers/HBReducer';
import { _reduxConstant } from '../../ReduxConstant';
import { _appState } from '../../rootReducer';
import { _delay } from '../../sagas/helper';
import { _getWorker } from '../../sagas/sagaBaseWorkers';
import { device } from '../../../@api/v1/cloud';
import { getCurrentTimeStampInSeconds } from '../../../util/DateTimeUtil';
import mqtt from '../../../services/backGroundServices/mqtt';
import {
  outputChannelTypes_e,
  deviceType_e,
  channelState_e,
} from '../../../../sternet/helpers/universals/device/deviceEnum';

import reduxStore from '../..';

enum com_channels_e {
  COM_CHANNEL_SOCKET,
  COM_CHANNEL_MQTT,
}

interface onActionCompleted_props {
  newDeviceList: DEVICE_t[];
}
/**
 * @colorObjects
 * colorSaga provides multiple ways you can define the channel output. if more than one is present than only one with highest priority will be considered
 *
 * - state
 * - channelBrightnessObject
 * - stateObject
 *
 * @responsiblities
 * - updates timestamp to current UTC time in seconds
 * - [x] decides weather to send msg over socket or mqtt
 * - [ ] ability to consume communication channel priority via `com_channels_e`
 *
 *
 * @roadmap *
 *
 * ## channel object priorities
 *
 */
export interface _colorAction_Props {
  deviceMac: string[];
  state?: string;
  gestureState: number;
  channelBrightnessObject?: {
    /** `value` - brightness value for active channels */
    value: number;
    /** `activeChannel` array of boolean representing the actie channels at respectives index flagged as true */
    activeChannel: boolean[];
  };
  stateObject?: {
    state: channelState_e;
    hsv?: {
      h?: number;
      s?: number;
      v?: number;
    };
  };
  onActionComplete?: ({ newDeviceList }: onActionCompleted_props) => void;
  log?: logger;
}
const [_colorSaga_watcher, _colorSaga_action] = _getWorker<_colorAction_Props & {}>({
  type: _reduxConstant.COLOR_UPDATE_SAGA,
  shouldTakeLatest: true,
  callable: function* containersWorker({
    deviceMac,
    state,
    channelBrightnessObject,
    stateObject,
    gestureState,
    onActionComplete,
    log,
  }) {
    //console.log('color-saga priorStartDeviceList : ' + JSON.stringify(reduxStore.store.getState().deviceReducer.deviceList));
    //log = new logger('debug');
    let deviceSocketList: HBSocketList_t[] = yield select((state: _appState) => state.HBReducer.HBSocketList);
    let devicelist: DEVICE_t[] = yield select((state: _appState) => state.deviceReducer.deviceList);
    //@ts-ignore
    const newDeviceList = yield Promise.all(
      devicelist.map(async (device) => {
        if (deviceMac.includes(device.Mac)) {
          /* check weather this device is present in requested deviceMac array */
          let [newHex, newDevice] = getHex({ device, channelBrightnessObject, stateObject });
          let deviceSocketObject = deviceSocketList.find((item) => item.Mac == newDevice.Mac);
          if (/* deviceSocketObject?.socket */ false) {
            log?.print('sending color to device. state: ' + newHex + ', IP: ' + device.IP);
            if (state) {
              //deviceSocketObject.socket.send(state);
            } else if (newHex) {
              //deviceSocketObject.socket.send(newHex);
            }
          }
          log?.print('new Device from HexConverter ' + JSON.stringify(newDevice));
          return newDevice;
        }
        return device;
      })
    );
    // REMOVE yield _delay(400); /* note : wait until gesture interval 200ms exceeds to ensure this next line of code only executes upon gesture end */
    log?.print(
      '[COLOR SAGA] Gesture has ended >> sending Redux Data Update' + JSON.stringify(newDeviceList /* , null, 2 */)
    );
    //NOTE : deviceList has already been set to be updated, no need here
    devicelist.forEach(async (_device) => {
      if (deviceMac.includes(_device.Mac)) {
        let [newHex, newDevice] = getHex({ device: _device, channelBrightnessObject, stateObject });
        let deviceSocketObject = deviceSocketList.find((item) => item.Mac == newDevice.Mac);
        if (/* !deviceSocketObject?.socket */ true) {
          log?.print('sending color to device. state: ' + newHex + ', over mqtt ');
          let publishChannelMac =
            _device?.deviceInfo?.firmwareVersion && _device?.deviceInfo?.firmwareVersion >= 2
              ? (() => {
                  return (
                    _device.Mac.substring(0, 2) +
                    _device.Mac.substring(3, 5) +
                    _device.Mac.substring(6, 8) +
                    _device.Mac.substring(9, 11) +
                    _device.Mac.substring(12, 14) +
                    _device.Mac.substring(15, 17)
                  );
                })()
              : _device.Mac;
          /* if device has no socket than send the color over mqtt only upon gestureState end */
          if (newHex) {
            log?.print('newHex: ' + newHex);
            mqtt.sendToDevice({ Mac: publishChannelMac, Hostname: _device.Hostname, payload: newHex });
          } else if (state) {
            log?.print('state: ' + state);
            mqtt.sendToDevice({ Mac: publishChannelMac, Hostname: _device.Hostname, payload: state });
          }
        }
      }
    });
    if (onActionComplete) onActionComplete({ newDeviceList });
  },
});

interface getHex_i {
  channelBrightnessObject?: {
    /** `value` - brightness value for active channels */
    value: number;
    /** `activeChannel` array of boolean representing the actie channels at respectives index flagged as true */
    activeChannel: boolean[];
  };
  stateObject?: {
    state: channelState_e;
    hsv?: {
      h?: number;
      s?: number;
      v?: number;
    };
  };
  device: DEVICE_t;
}
/**
 * - [x] consume & handle `channelBrightnessObject` variable
 *
 * - ### handle `channelBrightnessObject` for *handle for perticular device according to respective `outputChannelTypes_e`*
 * - [x] `outputChannelTypes_e.colorChannel_temprature`
 * - [ ] `outputChannelTypes_e.colorChannel_hsv`
 * - [x] send newState hex code upon processing and updateing channelObject
 * - [ ] make activeChannel optional in which case if activeChannel props is missing than apply the value to all channel
 *
 * - BUG #cleared hex code not generated properly in case of channelType `outputChannelTypes_e.colorChannel_temprature`
 * - BUG for deviceType NW4 hex should be 4 pair which is currently 5 pair --resolution remove new pair addition code to newState from `line 149-150`
 */
const getHex: (props: getHex_i) => [string | undefined, DEVICE_t] = ({
  channelBrightnessObject,
  stateObject,
  ...props
}) => {
  let newDevice: DEVICE_t = { ...props.device };
  newDevice.localTimeStamp = getCurrentTimeStampInSeconds();
  if (channelBrightnessObject) {
    //console.log("active channels are " + JSON.stringify(channelBrightnessObject.activeChannel))
    if (channelBrightnessObject.value < 10) {
      if (newDevice.channel.preState != channelState_e.CH_STATE_OFF)
        newDevice.channel.preState = newDevice.channel.state;
      newDevice.channel.state = channelState_e.CH_STATE_OFF;
    } else if (newDevice.channel.preState != undefined && newDevice.channel.preState != channelState_e.CH_STATE_OFF) {
      newDevice.channel.state = newDevice.channel.preState;
    } else {
      newDevice.channel.state = channelState_e.CH_STATE_ALL_ON;
    }
    let newState = '#';
    newDevice.channel.outputChannnel.forEach((channel, index) => {
      if (channel.type == outputChannelTypes_e.colorChannel_temprature) {
        /// update the brightness value to newDevice
        if (channelBrightnessObject.activeChannel[index])
          newDevice.channel.outputChannnel[index].v =
            channelBrightnessObject.value < 10 ? 0 : channelBrightnessObject.value;
        /// append newState with hex for this perticular channel
        if (newDevice.channel.outputChannnel[index].v <= 15)
          newState += '0' + newDevice.channel.outputChannnel[index].v.toString(16);
        else if (newDevice.channel.outputChannnel[index].v < 5)
          newState += '00' + newDevice.channel.outputChannnel[index].v.toString(16);
        else newState += newDevice.channel.outputChannnel[index].v.toString(16);
      } else if (channel.type == outputChannelTypes_e.colorChannel_hsv) {
        /// update the brightness value to newDevice
        if (channelBrightnessObject.activeChannel[index])
          newDevice.channel.outputChannnel[index].v =
            channelBrightnessObject.value < 10 ? 0 : channelBrightnessObject.value;

        /// append newState with hex for this perticular channel
        //@ts-ignore
        newState += hsv2hex_shortRange({ hsv: [channel.h, channel.s, channelBrightnessObject.value] }).substring(1);
      }
    });
    if (newDevice.channel.outputChannnel.length == 4)
      // REMOVE to be removed --description additional pair addition for firmware dependency of 5 pair decoding technique/algo
      newState = newState + '00';
    return [newState, newDevice];
  } else if (stateObject) {
    /**
     * @description handles colorchange in case `stateObject` is present
     */
    //console.log('--------state to device  ' + stateObject.state);
    // Handles `CH_STATE_OFF` stateObject for all device types
    if (stateObject.state == channelState_e.CH_STATE_OFF) {
      //console.log('preState  ' + newDevice.channel.state);
      newDevice.channel.preState = newDevice.channel.state;
      newDevice.channel.state = channelState_e.CH_STATE_OFF;
      //console.log('newstate to device  ' + newDevice.channel.state);
      return ['#0000000000', newDevice];
    }
    // Handles `CH_STATE_RGB` stateObject for RGB device channel
    else if (
      stateObject.state == channelState_e.CH_STATE_RGB &&
      newDevice.channel.deviceType == deviceType_e.deviceType_RGB
    ) {
      if (stateObject?.hsv?.h != undefined) newDevice.channel.outputChannnel[0].h = stateObject?.hsv?.h;
      if (stateObject?.hsv?.s) newDevice.channel.outputChannnel[0].s = stateObject?.hsv?.s;
      if (stateObject?.hsv?.v) newDevice.channel.outputChannnel[0].v = stateObject?.hsv?.v;
      newDevice.channel.preState = stateObject.state;
      newDevice.channel.state = stateObject.state;
      let newHex = hsv2hex_shortRange({
        hsv: [
          //@ts-ignore
          newDevice.channel.outputChannnel[0].h,
          //@ts-ignore
          newDevice.channel.outputChannnel[0].s,
          newDevice.channel.outputChannnel[0].v,
        ],
      });
      return [newHex, newDevice];
    }
    // Handles `CH_STATE_ALL_ON` stateObject for NW4 device channel
    else if (
      stateObject.state == channelState_e.CH_STATE_ALL_ON &&
      newDevice.channel.deviceType == deviceType_e.deviceType_NW4
    ) {
      /**
       * - [ ] get previous brightness from each channel and if brightness is above 10(or minimum limit) than use previous brightness else user preset 80% or anything
       */
      newDevice.channel.preState = stateObject.state;
      newDevice.channel.state = stateObject.state;
      let newHex = '#5050505000';
      return [newHex, newDevice];
    }
  }
  return [undefined, newDevice];
};

export { _colorSaga_watcher, _colorSaga_action };
