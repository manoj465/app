import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 *
 * @param {* key_<String> >> dataKey} key
 * @param {* value_<Object> >> dataSet} value
 */
export const storeData = async (key: "appCTX" | "deviceList", value: Object) => {
  //console.log("SAVING DATA >> " + JSON.stringify(value))
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(e);
  }
};

/**
 *
 * @param {* key_<String> >> dataKey for the dataSet to be resolved} key
 *
 * @returns {* null:: in case dataSet doesn't exists}
 * @returns {* Object: if data exists}
 */
export const getData = async (key: "appCTX" | "deviceList") => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.warn(e);
    return null;
  }
};

export const saveAppCTX = (props: any) => {
  console.log("appCTX props" + JSON.stringify(props));
  new Promise(() => {
    storeData("appCTX", props);
  });
};
