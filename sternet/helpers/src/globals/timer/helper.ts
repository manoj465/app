import { TIMER_t, TIMER_EVENT_TYPE_e, TIMER_DAYTIME_e } from "./types"




/*
'########:'##::::'##:'########::::::'######::'########:'########:::::::::'##:::::'#######::'########::::::::'##:
... ##..:: ###::'###: ##.... ##::::'##... ##:... ##..:: ##.... ##::::::::. ##:::'##.... ##: ##.... ##::::::: ##:
::: ##:::: ####'####: ##:::: ##:::: ##:::..::::: ##:::: ##:::: ##:'#####::. ##:: ##:::: ##: ##:::: ##::::::: ##:
::: ##:::: ## ### ##: ########:::::. ######::::: ##:::: ########::.....::::. ##: ##:::: ##: ########:::::::: ##:
::: ##:::: ##. #: ##: ##.. ##:::::::..... ##:::: ##:::: ##.. ##:::'#####::: ##:: ##:::: ##: ##.... ##:'##::: ##:
::: ##:::: ##:.:: ##: ##::. ##:::::'##::: ##:::: ##:::: ##::. ##::.....::: ##::: ##:::: ##: ##:::: ##: ##::: ##:
::: ##:::: ##:::: ##: ##:::. ##::::. ######::::: ##:::: ##:::. ##:::::::: ##::::. #######:: ########::. ######::
:::..:::::..:::::..::..:::::..::::::......::::::..:::::..:::::..:::::::::..::::::.......:::........::::......:::
*/


interface convertTimersStringToObj_props {
    timersString?: string
}
type convertTimersStringToObj_t = (props: convertTimersStringToObj_props) => TIMER_t[] | undefined
export const convertTimersStringToObj: convertTimersStringToObj_t = ({ timersString, log }) => {
    if (timersString) {
        try {
            let timersObject: (Omit<Omit<Omit<TIMER_t, "DAYS">, "ET">, "DT"> & { DAYS: number, ET: number, DT: number })[] = JSON.parse(timersString)
            if (timersObject) {
                const newTimersObject = timersObject.map((timer, index) => {
                    let tempDAYS: [boolean, boolean, boolean, boolean, boolean, boolean, boolean,] = [false, false, false, false, false, false, false]
                    for (let daysIndex = 0; daysIndex < 7; daysIndex++) {
                        tempDAYS[daysIndex] = getBit(daysIndex, timer.DAYS)
                    }
                    let tempTimer: TIMER_t = {
                        ...timer,
                        ET: timer.ET == 1
                            ? TIMER_EVENT_TYPE_e.ON
                            : TIMER_EVENT_TYPE_e.OFF,
                        DT: timer.DT == 1
                            ? TIMER_DAYTIME_e.AM
                            : TIMER_DAYTIME_e.PM,
                        DAYS: tempDAYS
                    }
                    return tempTimer
                });
                return newTimersObject
            } else {
            }
        } catch (error) {
            //console.log(error)
        }
    }
    return undefined
}


/*
'########:'##::::'##:'########::::::'#######::'########::::::::'##::::::::'##:::::'######::'########:'########::
... ##..:: ###::'###: ##.... ##::::'##.... ##: ##.... ##::::::: ##::::::::. ##:::'##... ##:... ##..:: ##.... ##:
::: ##:::: ####'####: ##:::: ##:::: ##:::: ##: ##:::: ##::::::: ##:'#####::. ##:: ##:::..::::: ##:::: ##:::: ##:
::: ##:::: ## ### ##: ########::::: ##:::: ##: ########:::::::: ##:.....::::. ##:. ######::::: ##:::: ########::
::: ##:::: ##. #: ##: ##.. ##:::::: ##:::: ##: ##.... ##:'##::: ##:'#####::: ##:::..... ##:::: ##:::: ##.. ##:::
::: ##:::: ##:.:: ##: ##::. ##::::: ##:::: ##: ##:::: ##: ##::: ##:.....::: ##:::'##::: ##:::: ##:::: ##::. ##::
::: ##:::: ##:::: ##: ##:::. ##::::. #######:: ########::. ######::::::::: ##::::. ######::::: ##:::: ##:::. ##:
:::..:::::..:::::..::..:::::..::::::.......:::........::::......::::::::::..::::::......::::::..:::::..:::::..::
*/



interface converLocalTimerObjectToBackendString_props {
    timers: TIMER_t[]
}
type converLocalTimerObjectToBackendString_t = (props: converLocalTimerObjectToBackendString_props) => string | undefined
export const converLocalTimerObjectToBackendString: converLocalTimerObjectToBackendString_t = ({ timers, log }) => {
    let newTimers = timers.map((timer) => {
        return {
            ...timer,
            ET: timer.ET == TIMER_EVENT_TYPE_e.ON
                ? 1
                : timer.ET == TIMER_EVENT_TYPE_e.OFF
                    ? 2
                    : 0,
            DT: timer.DT == TIMER_DAYTIME_e.AM
                ? 1
                : timer.DT == TIMER_DAYTIME_e.PM
                    ? 2
                    : 0,
            DAYS: (() => {
                let daysInt = 0
                timer.DAYS.forEach((day, index) => {
                    daysInt = setBit(index, daysInt, day)
                });
                return daysInt
            })()
        }
    })
    return JSON.stringify(newTimers)
}


const getBit = (bitIndex: number, bitHolderNumber: number) => {
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

const setBit = (bitIndex: number, bitHolderNumber: number, b: boolean) => {
    if (b) {
        let t = 1;
        t = t << bitIndex;
        bitHolderNumber = bitHolderNumber | t;
    }
    return bitHolderNumber
};