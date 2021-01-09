
export type HUE_TIMER_group_t = HUE_TIMER_t & { devices: string[] }

/** @description >- Client side Local representation of timer Object */
export interface HUE_TIMER_t {
    H: number,
    M: number,
    DT: number,
    ET: number,
    STATUS: number,
    DAYS: [boolean, boolean, boolean, boolean, boolean, boolean, boolean],
}

/** test-001 */
