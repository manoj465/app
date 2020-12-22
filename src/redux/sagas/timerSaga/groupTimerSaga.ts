import { put, takeEvery, all, call, takeLatest } from "redux-saga/effects";
import { _delay } from "../index";
import { _reduxConstant } from "../../ReduxConstant";
import { timerSagaAction_Props } from "../../actions/timerActions";
import { reduxStore } from "../../../../App";
import { deviceListSagaAction } from "../../deviceListReducer/actions/DeviceListAction";
import { timerDialogShowHideReduxAction } from "../../actions/AppCTXActions";

interface groupTimerWorker_Props {
  props: timerSagaAction_Props;
}

function* groupTimerWorker({
  props: { timer, groupUUID },
}: groupTimerWorker_Props) {
  ///mapOverDeviceList
  let toBeDeletedTimer = "";
  const updatedDeviceList = reduxStore.store
    .getState()
    .deviceReducer.deviceList.map((groupFromStore, groupFromStoreIndex) => {
      ///
      ///modify group
      if (groupFromStore.groupUUID == groupUUID) {
        ///
        ///
        ///map over perticular group timers
        let timerAdded = false;
        const updatedTimerList = groupFromStore?.timers.map(
          (timerFromStore, timerFromStoreIndex) => {
            if (timer.timerUUID == timerFromStore?.timerUUID) {
              timerAdded = true;
              console.log(
                "Timer to be modified is " + timerFromStore?.timerUUID
              );
              ///return updated timer instead
              if (timer.devicesMac.length == 0) {
                toBeDeletedTimer = timerFromStore.timerUUID;
                return null;
              }
              return timer;
            } else return timerFromStore;
          }
        );
        if (!timerAdded && timer.devicesMac.length > 0) {
          /// Adding new Timer
          console.log("To be added as new timer");
          updatedTimerList.push(timer);
          //console.log("new Timer List " + JSON.stringify(updatedTimerList));
        }

        ///
        ///
        ///mapOverGroupDevices to update timers Inside each Device
        const updatedDeviceListWithTimer = groupFromStore?.devices.map(
          (deviceForTimerUpdateFromStore, DFTUFSIndex) => {
            ///
            ///
            ///
            ///map over device timer list
            //TODO make create timer mutation here
            //TODO make modify mutation here
            let timerInDeviceFound = false;
            const updatedDeviceTimerList = deviceForTimerUpdateFromStore.timers.map(
              (deviceTimer, DTIndex) => {
                console.log(
                  "Timer index is : " +
                  DTIndex +
                  "  UUID" +
                  timer.timerUUID +
                  "  :: " +
                  deviceTimer?.timerUUID
                );
                if (deviceTimer?.timerUUID == timer.timerUUID) {
                  timerInDeviceFound = true;
                  if (toBeDeletedTimer == deviceTimer.timerUUID) {
                    console.log("Timer to be deleted");
                    //TODO delete mutation here
                    return null;
                  } else if (
                    timer.devicesMac.includes(deviceForTimerUpdateFromStore.Mac)
                  ) {
                    console.log(
                      "Timer to be edited in device " +
                      deviceForTimerUpdateFromStore.Mac
                    );
                    return Object.assign({}, deviceTimer, {
                      devicesMac: [deviceForTimerUpdateFromStore.Mac],
                    });
                  } else {
                    console.log(
                      "removing timer on device" +
                      deviceForTimerUpdateFromStore.Mac
                    );
                    //TODO delete mutation here
                    return null;
                  }
                } else if (DTIndex == 4) {
                  console.log("no more timers can be added");
                  timerInDeviceFound = true;
                  return null;
                }
                return deviceTimer;
              }
            );
            if (
              !timerInDeviceFound &&
              timer.timerUUID != toBeDeletedTimer &&
              timer.devicesMac.includes(deviceForTimerUpdateFromStore.Mac)
            ) {
              console.log("pushing new timer to device");
              updatedDeviceTimerList.push(
                Object.assign({}, timer, {
                  devicesMac: [deviceForTimerUpdateFromStore.Mac],
                })
              );
            }
            ///
            ///
            ///
            ///update new timerList in deviceObject
            return Object.assign({}, deviceForTimerUpdateFromStore, {
              timers: updatedDeviceTimerList.filter((item) => item != null),
            });
          }
        );

        ///
        ///
        ///update new group
        const updatedGroupItem = Object.assign({}, groupFromStore, {
          timers: updatedTimerList.filter((item) => item != null),
          devices: updatedDeviceListWithTimer,
        });
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        console.log(JSON.stringify(updatedGroupItem, null, 2));
        return updatedGroupItem;
      }
      ///
      ///return group as-it-is
      else return groupFromStore;
    });
  ///dispatch updated devicelist
  yield put(deviceListSagaAction({ deviceList: updatedDeviceList }));
  yield put(
    timerDialogShowHideReduxAction({ showTimerDialog: false, timer: undefined })
  );
}

export function* groupTimerWatcher() {
  yield takeLatest(_reduxConstant.GROUP_TIMER_SAGA, groupTimerWorker);
}