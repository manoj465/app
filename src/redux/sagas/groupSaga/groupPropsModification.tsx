import { put, takeEvery, all, call, takeLatest } from "redux-saga/effects";
import { _delay } from "..";
import { store } from "../../../../App";
import { deviceListSagaAction } from "../../deviceListReducer/actions/DeviceListAction";
import { groupPropsModification_saga_action_propsInterface } from "../../actions/groupActions/groupPropsModification";
import { _appState } from "../../reducers";
import { _reduxConstant } from "../../ReduxConstant";

/* Sec1:------------------COLOR UPDATE => worker || listener------------------- */
interface groupPropsModificationWorker_Prop {
  props: groupPropsModification_saga_action_propsInterface;
}
function* groupPropsModificationWorker({
  props: { newGroup, pre_groupUUID },
}: groupPropsModificationWorker_Prop) {
  console.log(
    "<<<<<<<<<<<<<<<<<< GROUP_PROPS_MODIFICATION => SAGA_WORKER >>>>>>>>>>>>>>>>>>>>>>"
  );
  ///map over deviceList
  const {
    deviceReducer: { deviceList },
  }: _appState = store.getState();
  console.log("newDeviceList >>> " + JSON.stringify(deviceList));
  const updatedDeviceList = deviceList.map((groupFromState, groupIndex) => {
    if (groupFromState.groupUUID == pre_groupUUID) {
      console.log(
        "Group to be Edited is > " +
        groupFromState.groupName +
        " as > " +
        newGroup.groupName
      );
      return Object.assign({}, newGroup, {
        groupUUID: groupFromState.groupUUID,
      });
    }
    return groupFromState;
  });
  console.log("newDeviceList >>> " + JSON.stringify(updatedDeviceList));
  //yield call(_delay, 500);
  yield put(deviceListSagaAction({ deviceList: updatedDeviceList }));
}
export function* watchGroupPropsModification() {
  yield takeLatest(
    _reduxConstant.GROUP_MODIFICATION_SAGA,
    groupPropsModificationWorker
  );
}
