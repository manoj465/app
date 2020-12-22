import { reduxStore } from "../redux";

export function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}


export function generateRandomUserId() {
  return "xxxxxxxx-xxxx-4xxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function generateUUID() {
  return "xxxxxxxx-xxxx-xxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const getContainerUUID = () => {
  let UUID = generateUUID()
  while (checkUUIDMatch(UUID)) {
    UUID = generateUUID()
  }
  return UUID
}

const checkUUIDMatch = (UUID: string) => {
  reduxStore.store.getState().deviceReducer.containers.forEach((container, index) => {
    if (UUID == container.conUUID)
      return true
  })
  return false
}
