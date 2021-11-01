import UNIVERSALS from '../@universals';
import reduxStore from '../redux';

export const getSafeDeviceList = (deviceList?: DEVICE_t[]) => {
  if (!deviceList) deviceList = reduxStore.store.getState().deviceReducer.deviceList;
  return deviceList.map((device) => {
    return {
      ...device,
      socket: null,
    };
  });
};
