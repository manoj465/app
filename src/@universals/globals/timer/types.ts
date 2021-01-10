export enum TIMER_EVENT_TYPE_e {
    undefined,
    ON,
    OFF
}

export enum TIMER_DAYTIME_e {
    undefined,
    AM,
    PM
}

export enum TIMER_STATUS_e {
    undefined,
    INACTIVE,
    ONCE,
    REPEAT
}

export type TIMER_DAYS_t = [boolean, boolean, boolean, boolean, boolean, boolean, boolean]

/** @description >- Client side Local representation of timer Object */
export interface TIMER_t {
    id: string,
    H: number,
    M: number,
    DT: TIMER_DAYTIME_e,
    ET: TIMER_EVENT_TYPE_e,
    STATUS: TIMER_STATUS_e,
    DAYS: TIMER_DAYS_t,
}

