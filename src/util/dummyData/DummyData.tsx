import { timerType } from "./timerTypes";

export enum GROUP_TYPES {
  SINGLETON = 1,
  MULTIPLE = 0,
}

export enum GROUP_CATEGORIES {
  STRIP_OW = 0,
  STRIP_CW = 1,
  STRIP_RGB = 2,
  STRIP_RGBW = 3,
  STRIP_NEO = 4,
}

export type deviceType = {
  deviceName: string;
  Mac: string;
  HostName: string;
  SSID: string;
  IP: string;
  groupName: string;
  socket: WebSocket | null;
  Last_WS_Msg_Sent_Time_Stamp: number;
  Last_WS_Msg_Received_Time_Stamp: number;
  Last_Heart_Time_Stamp: number;
  Connected: boolean;
  LastColorState: string;
  Grad: string[];
  offset: { x: number; y: number };
  hsv: { h: number; s: number; v: number };
  timers: (timerType | undefined)[];
};

export const dummyDevice: deviceType = {
  deviceName: "",
  Mac: "",
  HostName: "",
  SSID: "",
  IP: "",
  groupName: "",
  socket: null,
  Last_WS_Msg_Sent_Time_Stamp: 0,
  Last_WS_Msg_Received_Time_Stamp: 0,
  Last_Heart_Time_Stamp: 0,
  Connected: false,
  LastColorState: "#00ffff",
  Grad: ["#00ffff", "#0066ff"],
  offset: { x: 0, y: 0 },
  hsv: { h: 120, s: 80, v: 80 },
  timers: [],
};

export type deviceContainerType = {
  groupName: string;
  groupUUID: string;
  groupAdmin: string;
  activeMode: string;
  groupType: GROUP_TYPES;
  category: GROUP_CATEGORIES;
  timers: (timerType | undefined)[];
  devices: deviceType[];
};

export const dummyGroup: deviceContainerType = {
  groupName: "group",
  groupUUID: "",
  groupAdmin: "",
  activeMode: "",
  groupType: GROUP_TYPES.SINGLETON,
  category: GROUP_CATEGORIES.STRIP_RGB,
  timers: [],
  devices: [],
};

export const HallRGBGroupDummyData: deviceContainerType[] = [
  {
    groupName: "Hall",
    groupUUID: "khg;sdjfh-zksdhbfk.j",
    groupAdmin: "",
    activeMode: "",
    groupType: GROUP_TYPES.MULTIPLE,
    category: GROUP_CATEGORIES.STRIP_RGB,
    timers: [],
    devices: [
      {
        deviceName: "Hall Light 1",
        Mac: "DC:4F:22:5F:65:76",
        HostName: "HUE_CLA1_DC:76",
        SSID: "Homelink1",
        IP: "192.168.1.70",
        groupName: "Hall",
        socket: null,
        Last_WS_Msg_Sent_Time_Stamp: 0,
        Last_WS_Msg_Received_Time_Stamp: 0,
        Last_Heart_Time_Stamp: 0,
        Connected: false,
        LastColorState: "#ffffff",
        Grad: ["#00ffff", "#0066ff"],
        offset: { x: 0, y: 0 },
        hsv: { h: 120, s: 80, v: 80 },
        timers: [],
      },
      {
        deviceName: "Hall Light 2",
        Mac: "2C:F4:32:57:74:00",
        HostName: "HUE_CLE3_2C:00",
        SSID: "Homelink1",
        IP: "192.168.1.71",
        groupName: "Hall",
        socket: null,
        Last_WS_Msg_Sent_Time_Stamp: 0,
        Last_WS_Msg_Received_Time_Stamp: 0,
        Last_Heart_Time_Stamp: 0,
        Connected: false,
        LastColorState: "#ffffff",
        Grad: ["#00ffff", "#0066ff"],
        offset: { x: 0, y: 0 },
        hsv: { h: 120, s: 80, v: 80 },
        timers: [],
      },
    ],
  },
];
