import { logger } from '../@logger';
import UNIVERSALS from '../@universals';
import reduxStore from '../redux';
import { _colorAction_Props } from '../redux/deviceListReducer/saga/color.saga';
import { getCurrentTimeStampInSeconds } from '../util/DateTimeUtil';

/*
:::'###::::'########::'########::::::::'##:'##::::'##:'########::'########:::::'###::::'########:'########::::'########::'########:'##::::'##:'####::'######::'########:
::'## ##::: ##.... ##: ##.... ##::::::'##:: ##:::: ##: ##.... ##: ##.... ##:::'## ##:::... ##..:: ##.....::::: ##.... ##: ##.....:: ##:::: ##:. ##::'##... ##: ##.....::
:'##:. ##:: ##:::: ##: ##:::: ##:::::'##::: ##:::: ##: ##:::: ##: ##:::: ##::'##:. ##::::: ##:::: ##:::::::::: ##:::: ##: ##::::::: ##:::: ##:: ##:: ##:::..:: ##:::::::
'##:::. ##: ##:::: ##: ##:::: ##::::'##:::: ##:::: ##: ########:: ##:::: ##:'##:::. ##:::: ##:::: ######:::::: ##:::: ##: ######::: ##:::: ##:: ##:: ##::::::: ######:::
 #########: ##:::: ##: ##:::: ##:::'##::::: ##:::: ##: ##.....::: ##:::: ##: #########:::: ##:::: ##...::::::: ##:::: ##: ##...::::. ##:: ##::: ##:: ##::::::: ##...::::
 ##.... ##: ##:::: ##: ##:::: ##::'##:::::: ##:::: ##: ##:::::::: ##:::: ##: ##.... ##:::: ##:::: ##:::::::::: ##:::: ##: ##::::::::. ## ##:::: ##:: ##::: ##: ##:::::::
 ##:::: ##: ########:: ########::'##:::::::. #######:: ##:::::::: ########:: ##:::: ##:::: ##:::: ########:::: ########:: ########:::. ###::::'####:. ######:: ########:
..:::::..::........:::........:::..:::::::::.......:::..:::::::::........:::..:::::..:::::..:::::........:::::........:::........:::::...:::::....:::......:::........::
*/

interface add_updateDevices_props {
  cmd: 'ADD_UPDATE_DEVICES';
  newDevices: DEVICE_t[];
  /** weather or not coming devices are coming from cloud as user's all devices latest state */
  cloudState?: boolean;
  log?: logger;
}
interface add_updateDevices_t {
  (props: add_updateDevices_props): DEVICE_t[];
}
const add_updateDevices: add_updateDevices_t = ({ newDevices, cloudState, ...props }) => {
  let localDeviceList = reduxStore.store.getState().deviceReducer.deviceList;
  let newDeviceList = localDeviceList;
  newDevices.forEach((newDevice, newDevice_index) => {
    let localStateDevice = newDeviceList.find((item) => item.Mac == newDevice.Mac);
    if (localStateDevice) {
      let localStateDeviceIndex = newDeviceList.findIndex((item) => item.Mac == newDevice.Mac);
      props.log?.print('device found in local state');
      newDeviceList = newDeviceList.filter((item) => item.Mac != newDevice.Mac);
      newDeviceList.splice(localStateDeviceIndex, 0, newDevice);
    } else {
      console.log('device : ' + newDevice.Mac + ', not found in local state ');
      newDeviceList.push(newDevice);
    }
  });
  props.log?.print('Sending Saga Action with new list is ' + JSON.stringify(newDeviceList, null, 2));
  reduxStore.store.dispatch(
    reduxStore.actions.deviceList.deviceListSaga({
      deviceList: newDeviceList,
      log: props.log ? new logger('devicelist saga', props.log) : undefined,
    })
  );
  return newDeviceList;
};
/*
'########::'########:'##::::'##::'#######::'##::::'##:'########::::'########::'########:'##::::'##:'####::'######::'########:
 ##.... ##: ##.....:: ###::'###:'##.... ##: ##:::: ##: ##.....::::: ##.... ##: ##.....:: ##:::: ##:. ##::'##... ##: ##.....::
 ##:::: ##: ##::::::: ####'####: ##:::: ##: ##:::: ##: ##:::::::::: ##:::: ##: ##::::::: ##:::: ##:: ##:: ##:::..:: ##:::::::
 ########:: ######::: ## ### ##: ##:::: ##: ##:::: ##: ######:::::: ##:::: ##: ######::: ##:::: ##:: ##:: ##::::::: ######:::
 ##.. ##::: ##...:::: ##. #: ##: ##:::: ##:. ##:: ##:: ##...::::::: ##:::: ##: ##...::::. ##:: ##::: ##:: ##::::::: ##...::::
 ##::. ##:: ##::::::: ##:.:: ##: ##:::: ##::. ## ##::: ##:::::::::: ##:::: ##: ##::::::::. ## ##:::: ##:: ##::: ##: ##:::::::
 ##:::. ##: ########: ##:::: ##:. #######::::. ###:::: ########:::: ########:: ########:::. ###::::'####:. ######:: ########:
..:::::..::........::..:::::..:::.......::::::...:::::........:::::........:::........:::::...:::::....:::......:::........::
*/

interface removeDeviceProps {
  cmd: 'REMOVE_DEVICE';
  Mac: string;
  log?: logger;
}
const removeDevice = (props: removeDeviceProps) => {
  let device = reduxStore.store.getState().deviceReducer.deviceList.find((item) => item.Mac == props.Mac);
  if (device) {
    let newDeviceList = reduxStore.store
      .getState()
      .deviceReducer.deviceList.filter((device) => device.Mac != props.Mac);
    props.log?.print('device removed > sending saga update')._print(JSON.stringify(newDeviceList, null, 2));
    reduxStore.store.dispatch(
      reduxStore.actions.deviceList.deviceListSaga({
        deviceList: newDeviceList,
        log: props.log,
      })
    );
  }
};

/*
:'######:::'#######::'##::::::::'#######::'########:::::'##::::'##:'########::'########:::::'###::::'########:'########:
'##... ##:'##.... ##: ##:::::::'##.... ##: ##.... ##:::: ##:::: ##: ##.... ##: ##.... ##:::'## ##:::... ##..:: ##.....::
 ##:::..:: ##:::: ##: ##::::::: ##:::: ##: ##:::: ##:::: ##:::: ##: ##:::: ##: ##:::: ##::'##:. ##::::: ##:::: ##:::::::
 ##::::::: ##:::: ##: ##::::::: ##:::: ##: ########::::: ##:::: ##: ########:: ##:::: ##:'##:::. ##:::: ##:::: ######:::
 ##::::::: ##:::: ##: ##::::::: ##:::: ##: ##.. ##:::::: ##:::: ##: ##.....::: ##:::: ##: #########:::: ##:::: ##...::::
 ##::: ##: ##:::: ##: ##::::::: ##:::: ##: ##::. ##::::: ##:::: ##: ##:::::::: ##:::: ##: ##.... ##:::: ##:::: ##:::::::
. ######::. #######:: ########:. #######:: ##:::. ##::::. #######:: ##:::::::: ########:: ##:::: ##:::: ##:::: ########:
:......::::.......:::........:::.......:::..:::::..::::::.......:::..:::::::::........:::..:::::..:::::..:::::........::
*/

interface colorUpdate_props extends _colorAction_Props {
  cmd: 'COLOR_UPDATE';
}
/**
 * ## featureRequest
 * - [ ] send the updated devicelist to devicelistAddUpdater
 */
const colorUpdate = (props: colorUpdate_props) => {
  reduxStore.store.dispatch(reduxStore.actions.deviceList.colorSaga(props));
};

/*
'########::'########:'##::::'##:'####::'######::'########:::::'#######::'########::'########:'########:::::'###::::'########::'#######::'########::
 ##.... ##: ##.....:: ##:::: ##:. ##::'##... ##: ##.....:::::'##.... ##: ##.... ##: ##.....:: ##.... ##:::'## ##:::... ##..::'##.... ##: ##.... ##:
 ##:::: ##: ##::::::: ##:::: ##:: ##:: ##:::..:: ##:::::::::: ##:::: ##: ##:::: ##: ##::::::: ##:::: ##::'##:. ##::::: ##:::: ##:::: ##: ##:::: ##:
 ##:::: ##: ######::: ##:::: ##:: ##:: ##::::::: ######:::::: ##:::: ##: ########:: ######::: ########::'##:::. ##:::: ##:::: ##:::: ##: ########::
 ##:::: ##: ##...::::. ##:: ##::: ##:: ##::::::: ##...::::::: ##:::: ##: ##.....::: ##...:::: ##.. ##::: #########:::: ##:::: ##:::: ##: ##.. ##:::
 ##:::: ##: ##::::::::. ## ##:::: ##:: ##::: ##: ##:::::::::: ##:::: ##: ##:::::::: ##::::::: ##::. ##:: ##.... ##:::: ##:::: ##:::: ##: ##::. ##::
 ########:: ########:::. ###::::'####:. ######:: ########::::. #######:: ##:::::::: ########: ##:::. ##: ##:::: ##:::: ##::::. #######:: ##:::. ##:
........:::........:::::...:::::....:::......:::........::::::.......:::..:::::::::........::..:::::..::..:::::..:::::..::::::.......:::..:::::..::
*/

type containerListOperation_t = (props: add_updateDevices_props | removeDeviceProps | colorUpdate_props) => void;
const deviceOperation: containerListOperation_t = async (props) => {
  switch (props.cmd) {
    case 'ADD_UPDATE_DEVICES':
      add_updateDevices(props);
      break;

    case 'REMOVE_DEVICE':
      removeDevice(props);
      break;

    case 'COLOR_UPDATE':
      props.log = props.log ? new logger("D's OP - color update", props.log) : undefined;
      colorUpdate(props);
      break;

    default:
      break;
  }
  return {};
};

export default deviceOperation;
