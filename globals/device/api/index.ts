export enum _DEVICE_WIFI_STATE_e {
    DEVICE_WL_NO_SHIELD = 255,   // for compatibility with WiFi Shield library
    DEVICE_WL_IDLE_STATUS = 0,
    DEVICE_WL_NO_SSID_AVAIL = 1,
    DEVICE_WL_SCAN_COMPLETED = 2,
    DEVICE_WL_CONNECTED = 3,
    DEVICE_WL_CONNECT_FAILED = 4,
    DEVICE_WL_CONNECTION_LOST = 5,
    DEVICE_WL_DISCONNECTED = 6
}



export enum _DEVICE_WIFI_API_ERRORS_e {
    ERR_WIFI_UNABLE_CONNECT_TO_SSID = "ERR-041", //wifi unable to connect to SSID
    ERR_WIFI_ALREADY_PAIRED_STATE = "ERR-042",   //wifi cannot connect to another wifi, as already paired
    ERR_WIFI_BUSY_IN_PAIRING = "ERR-043",        //wifi cannot connect to another wifi, busy pairing
    ERR_WIFI_PAIRING_UNEXPECTED = "ERR-044",     //wifi cannot connect to another wifi, unexpected error
    ERR_WIFI_PAIRING_TIMEOUT = "ERR-045",     //wifi connection timeout
    ERR_WIFI_PAIRING_PASS_INCORRECT = "ERR-046", //wifi password incorrect
    ERR_WIFI_SSID_INVALID = "ERR-047",    //wifi SSID not found
    ERR_WIFI_CNF_NOT_SAVED = "ERR-048"          //wifi SSID not found
}