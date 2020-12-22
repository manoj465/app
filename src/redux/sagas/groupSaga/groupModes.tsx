import { put, takeEvery, all, call, takeLatest } from "redux-saga/effects";
import { _delay } from "..";
import { store } from "../../../../App";
import { deviceListSagaAction } from "../../deviceListReducer/actions/DeviceListAction";
import { groupModes_saga_action_propsInterface } from "../../actions/groupActions/groupModeActions";
import { groupPropsModification_saga_action_propsInterface } from "../../actions/groupActions/groupPropsModification";
import { _appState } from "../../reducers";
import { _reduxConstant } from "../../ReduxConstant";

/* Sec1:------------------COLOR UPDATE => worker || listener------------------- */
interface groupModesWorker_Prop {
  props: groupModes_saga_action_propsInterface;
}
function* groupModesWorker({
  props: { Mode, Action, groupUUID, deviceMac },
}: groupModesWorker_Prop) {
  console.log(
    "<<<<<<<<<<<<<<<<<< GROUP_MODES => SAGA_WORKER >>>>>>>>>>>>>>>>>>>>>>"
  );
  ///map over deviceList
  const {
    deviceReducer: { deviceList },
  }: _appState = store.getState();
  const updatedDeviceList = deviceList.map((groupFromState, groupIndex) => {
    if (groupFromState.groupUUID == groupUUID) {
      groupFromState.devices.forEach((deviceInLoop) => {
        if (deviceMac.includes(deviceInLoop.Mac)) {
          ///Take Actions Here
          console.log("Command Came for Device >> " + deviceInLoop.deviceName);
        }
      });
      return Object.assign({}, groupFromState, {
        activeMode: Mode,
      });
    }
    return groupFromState;
  });
  //yield call(_delay, 500);
  yield put(deviceListSagaAction({ deviceList: updatedDeviceList }));
}
export function* watchGroupModes() {
  yield takeLatest(_reduxConstant.GROUP_MODES_SAGA, groupModesWorker);
}
