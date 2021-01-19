import { optional_timestamp_i, timestamp_i } from "../base.types";
import { Device_t } from "../device";

/** @description >- Client side Local representation of user Object */
export interface USER_t extends Omit<Omit<Omit<User_t, "id">, "devices">, "ts">, optional_timestamp_i {
    id?: string,    /* if user is temp(skipped login/signup) than id is yo be undefined*/
    localTimeStamp: number
}

/** @description >- backend representation of user Object */
export interface User_t extends timestamp_i {
    id: string,
    userName?: string,
    email: string,
    devices?: Device_t[]
}