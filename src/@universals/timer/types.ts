
export type HUE_TIMER_group_t = HUE_TIMER_t & { devices: string[] }

export enum HUE_TIMER_EVENT_TYPE_e {
    undefined,
    ON,
    OFF
}

export enum HUE_TIMER_DAYTIME_e {
    undefined,
    AM,
    PM
}

export enum HUE_TIMER_STATUS_e {
    undefined,
    INACTIVE,
    ONCE,
    REPEAT
}

export type HUE_TIMER_DAYS_t = [boolean, boolean, boolean, boolean, boolean, boolean, boolean]

/** @description >- Client side Local representation of timer Object */
export interface HUE_TIMER_t {
    id: string,
    H: number,
    M: number,
    DT: HUE_TIMER_DAYTIME_e,
    ET: HUE_TIMER_EVENT_TYPE_e,
    STATUS: HUE_TIMER_STATUS_e,
    DAYS: HUE_TIMER_DAYS_t,
}

