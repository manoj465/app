import user from "./user.operator"
import device from "./device.operator"
import { userStoreUpdateFunction } from "./user.operator"


export const appOperator = { user, device, userStoreUpdateFunction }