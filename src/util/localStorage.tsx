import React, { useEffect, useState } from 'react';
import reduxStore from '../redux';
import mqtt from '../services/backGroundServices/mqtt';
import { getData } from '../services/db/storage';

interface Props {}
export default (props: Props) => {
  const [appCTX, setAppCTX] = useState<any>(undefined);
  const [deviceList, setDeviceList] = useState<any>(undefined);

  const isHUElite = process.env.APP_PARTY == 'HUELITE';
  const storageKey_appCTX = 'appCTX';
  const storageKey_deviceList = 'deviceList_v2';

  const loadAsync = async () => {
    const deviceList = await getData(storageKey_deviceList);
    //console.log('deviceList data ::  ' + JSON.stringify(deviceList));
    if (deviceList) reduxStore.store.dispatch(reduxStore.actions.deviceList.deviceListRedux({ deviceList }));

    const _appCTX = await getData(storageKey_appCTX);
    //console.log('[APPCTX] >>' + JSON.stringify(_appCTX));
    if (_appCTX) {
      setAppCTX(_appCTX);
      if (_appCTX?.user?.id) mqtt.setup({ userId: _appCTX.user.id });
      reduxStore.store.dispatch(
        reduxStore.actions.appCTX.appCtxSagaAction({ data: _appCTX, saveToDB: false /*, log */ })
      );
    } else setAppCTX({});
  };

  useEffect(() => {
    //console.log('this is localStorage class');
    loadAsync();
    return () => {};
  }, []);

  return [appCTX, deviceList];
};

//EXP: store dummy data in storage
//log("Dummy Data data ::  " + JSON.stringify(HallRGBGroupDummyData));
//await storeData("deviceList", HallRGBGroupDummyData);
//EXP: remove data from storage
//await storeData("deviceList", null);//REMOVE
//await storeData("appCTX", null);//REMOVE
