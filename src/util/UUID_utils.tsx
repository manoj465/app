import UNI from '../@universals';

export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function uuidv4_8() {
  return 'xxxxx-xxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 *
 * @TODO
 * - [ ] consume an optional array object with id param to map over and verify that new uuid is unique
 */
export function generate_UUID_10_withVenderPrefix() {
  return (
    UNI.venderConf.venderPrefix +
    '_xxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    })
  );
}

export function generateRandomUserId() {
  return 'xxxxxxxx-xxxx-4xxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** @deprecated */
export function generateUUID() {
  return 'xxxxxxxx-xxxx-xxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** @deprecated */
export const getContainerUUID = () => {
  let UUID = generateUUID();
  while (checkUUIDMatch(UUID)) {
    UUID = generateUUID();
  }
  return UUID;
};

/** @deprecated */
const checkUUIDMatch = (UUID: string) => {
  return false;
};
