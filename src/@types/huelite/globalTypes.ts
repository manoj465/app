export * from "./user"
export * from "./device"
export * from "./timer"



export interface err_i { errCode: "UNKNOWN_ERR" | "NO_USER" | "USER_CREATION_FAILED" | "DUPLICATE_EMAIL" | "PASSWORD_MIN_LENGTH", errMsg: string, error: any }