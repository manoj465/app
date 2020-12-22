import { timestamp_i } from "../base.types"
import { HUE_Device_t } from "../device"

export type HUE_TIMER_group_t = HUE_TIMER_t & { devices: string[] }

/** @description >- Client side Local representation of timer Object */
export interface HUE_TIMER_t extends Omit<HUE_Timer_t, "DAYS">, timestamp_i {
    DAYS: [boolean, boolean, boolean, boolean, boolean, boolean, boolean],
}

/** @description >- backend representation of timer Object */
export interface HUE_Timer_t extends timestamp_i {
    id: string,
    device: HUE_Device_t,
    HR: number,
    MIN: number,
    DT: number,
    ET: number,
    DAYS: number,
    ldb?: HUE_Ldb_t
    //TODO add LDB to data type timers
}

/** @description >- Client side Local representation of LDB Object */
export interface HUE_LDB_t {
    id?: string,
    TS: number,
    DST: number,
    DBS: number,
}

/** @description >- backend representation of LDB Object */
export interface HUE_Ldb_t {
    id: string,
    TS: number,
    DST: number,
    DBS: number,
}