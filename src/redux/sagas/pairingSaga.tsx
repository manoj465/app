import { put, takeEvery } from "redux-saga/effects";
import { _delay } from "./helper";
import { _reduxConstant } from "../ReduxConstant";
import { reduxStore } from "../../../App";
import {
  dummyGroup,
  GROUP_TYPES,
  deviceContainerType,
  deviceType,
} from "../../util/dummyData/DummyData";
import { deviceListSagaAction } from "../deviceListReducer/actions/DeviceListAction";
import { newDeviceSagaAction_Props } from "../actions/pairingActions";
import { _appState } from "../reducers";
import { uuidv4 } from "../../util/UUID_utils";

/* function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (Crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
} */

interface newDeviceWorkerProps {
  props: newDeviceSagaAction_Props;
}
function* newDeviceWorker({
  props: { newDevice, conType: groupType },
}: newDeviceWorkerProps) {
  console.log("newDeviceWorker => new Device :: " + JSON.stringify(newDevice));
  const _store: _appState = store.getState();
  const deviceList = _store.deviceReducer.deviceList;
  console.log("deviceList Length :: " + deviceList.length);
  const updatedDeviceList: deviceContainerType[] = [];
  ///remove device from list if already present
  deviceList.map((group, index) => {
    let found = false;
    const updatedDevices: deviceType[] = [];
    group.devices.map((device, index) => {
      if (device.Mac == newDevice.Mac) {
        found = true;
      } else {
        updatedDevices.push(device);
      }
    });
    if (updatedDevices.length > 0) {
      if (updatedDevices.length == 1) {
        updatedDeviceList.push({
          ...group,
          devices: updatedDevices,
          groupType: GROUP_TYPES.SINGLETON,
        });
      } else {
        updatedDeviceList.push({ ...group, devices: updatedDevices });
      }
    } else {
    }
  });

  console.log("updatedDeviceList length :: " + updatedDeviceList.length);
  let newDeviceList: deviceContainerType[] = [];
  ///device to be added in group
  if (groupType == GROUP_TYPES.MULTIPLE) {
    console.log("GroupName is " + newDevice.groupName);
    let added = false;
    ///add device to group if group exists with same name
    newDeviceList = updatedDeviceList.map((group, index) => {
      console.log("current GroupName " + group.groupName);
      if (group.groupName == newDevice.groupName) {
        console.log("GroupName found in list " + newDevice.groupName);
        added = true;
        return Object.assign({}, group, {
          devices: [...group.devices, newDevice],
          groupType: GROUP_TYPES.MULTIPLE,
        });
      } else {
        return group;
      }
    });
    ///if group with similiar group doesn't exist, create new group
    if (!added) {
      console.log("device not added in list");
      newDeviceList.push(
        Object.assign({}, dummyGroup, {
          groupName: newDevice.groupName,
          groupUUID: uuidv4(),
          groupType: GROUP_TYPES.MULTIPLE,
          devices: [newDevice],
        })
      );
    }
    console.log("New Device List :: " + JSON.stringify(newDeviceList));
  }
  ///device to be stored as Singleton
  else {
    console.log("DEVICE TO BE ADDED AS SINGLETON DEVOCE");
    newDeviceList = updatedDeviceList;
    newDeviceList.push(
      Object.assign({}, dummyGroup, {
        groupName: "singleton",
        groupUUID: uuidv4(),
        groupType: GROUP_TYPES.SINGLETON,
        devices: [newDevice],
      })
    );
    console.log(
      "New Device List after singleton addition :: \n" +
      JSON.stringify(newDeviceList)
    );
  }

  ///update storage and redux store with new List
  yield put(deviceListSagaAction({ deviceList: newDeviceList }));
}

export function* watchNewDevice() {
  yield takeEvery(_reduxConstant.NEW_DEVICE_SAGA, newDeviceWorker);
}
