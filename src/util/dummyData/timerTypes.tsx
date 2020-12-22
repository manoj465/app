export enum timerEventType {
  OFF = 0,
  ON = 1,
}

export enum timerDaytimeType {
  AM = 0,
  PM = 1,
}

export type weekDaysType = [
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean
];

export const EmptyWeekDayList: weekDaysType = [
  false,
  false,
  false,
  false,
  false,
  false,
  false,
];

/**
 * @deprecated
 */
export type timerType = {
  eventType: timerEventType;
  daytime: timerDaytimeType;
  hr: number;
  min: number;
  timerUUID: string;
  weekDays: weekDaysType;
  devicesMac: string[];
};


/**
 * @deprecated
 */
export type timerType__1_1 = {
  timerUUID?: string;
  id?: string;
  HR: number;
  MIN: number;
  DAYS: number;
  ET: timerEventType;
  DT: timerDaytimeType;
  ldb: {
    id?: string;
    TS: number;
    DST: number;
    DBS: number;
  }
  deviceMac: string[] | string;
};
