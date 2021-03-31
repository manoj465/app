export enum TIMER_EVENT_TYPE_e {
    ON,
    OFF
}

export enum TIMER_DAYTIME_e {
    AM,
    PM
}

export enum TIMER_STATUS_e {
    INACTIVE,
    REPEAT,
    ONCE
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


export const getBit = (bitIndex: number, bitHolderNumber: number) => {
    let b = false;
    if (bitIndex >= 0) {
        let t = 1;
        let nt = bitHolderNumber >> (bitIndex);
        t = nt & t;
        if (t > 0)
            b = true;
    }
    return b;
}

export const setBit = (bitIndex: number, bitHolderNumber: number, b: boolean) => {
    if (b) {
        let t = 1;
        t = t << bitIndex;
        bitHolderNumber = bitHolderNumber | t;
    }
    return bitHolderNumber
};