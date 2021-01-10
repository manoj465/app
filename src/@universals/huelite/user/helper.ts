import { HUE_DEVICE_t, HUE_Device_t } from "../globalTypes"
import { logger } from "../../../util/logger"
import types from ".."



type convert_hueDevice_backendToLocal_t = (props: { devices: HUE_Device_t[], socket?: any, log?: logger }) => HUE_DEVICE_t[]
//@ts-ignore
export const convert_hueDevice_backendToLocal: convert_hueDevice_backendToLocal_t = ({ devices, socket = undefined, log }) => {
    return devices.map((device, d_index) => {
        return {
            ...device,
            socket,
            hsv: getHsvFromString({ hsvString: device.hsv }),
            timers: convertTimersStringToObj({ timersString: device.timers })
        }
    })
}

/*
:'######::'########:'########::'####:'##::: ##::'######::::::::::'##::::'##::::'##::'######::'##::::'##:::::'#######::'########::::::::'##:'########::'######::'########:
'##... ##:... ##..:: ##.... ##:. ##:: ###:: ##:'##... ##:::::::::. ##::: ##:::: ##:'##... ##: ##:::: ##::::'##.... ##: ##.... ##::::::: ##: ##.....::'##... ##:... ##..::
 ##:::..::::: ##:::: ##:::: ##:: ##:: ####: ##: ##:::..:::'#####::. ##:: ##:::: ##: ##:::..:: ##:::: ##:::: ##:::: ##: ##:::: ##::::::: ##: ##::::::: ##:::..::::: ##::::
. ######::::: ##:::: ########::: ##:: ## ## ##: ##::'####:.....::::. ##: #########:. ######:: ##:::: ##:::: ##:::: ##: ########:::::::: ##: ######::: ##:::::::::: ##::::
:..... ##:::: ##:::: ##.. ##:::: ##:: ##. ####: ##::: ##::'#####::: ##:: ##.... ##::..... ##:. ##:: ##::::: ##:::: ##: ##.... ##:'##::: ##: ##...:::: ##:::::::::: ##::::
'##::: ##:::: ##:::: ##::. ##::: ##:: ##:. ###: ##::: ##::.....::: ##::: ##:::: ##:'##::: ##::. ## ##:::::: ##:::: ##: ##:::: ##: ##::: ##: ##::::::: ##::: ##:::: ##::::
. ######::::: ##:::: ##:::. ##:'####: ##::. ##:. ######:::::::::: ##:::: ##:::: ##:. ######::::. ###:::::::. #######:: ########::. ######:: ########:. ######::::: ##::::
:......::::::..:::::..:::::..::....::..::::..:::......:::::::::::..:::::..:::::..:::......::::::...:::::::::.......:::........::::......:::........:::......::::::..:::::
*/


interface getHsvFromString_props {
    hsvString: string
}
type getHsvFromString_t = (props: getHsvFromString_props) => { h: number, s: number, v: number } | undefined
const getHsvFromString: getHsvFromString_t = ({ hsvString }) => {
    const hsvStringSplitArray = hsvString.split("-")
    const hsv = { h: 0, s: 0, v: 0 }
    if (hsvStringSplitArray.length == 3) {
        hsvStringSplitArray.forEach((element, index) => {
            console.log("int at index " + index + " is " + parseInt(element))
        });
        hsv.h = parseInt(hsvStringSplitArray[0])
        hsv.s = parseInt(hsvStringSplitArray[1])
        hsv.v = parseInt(hsvStringSplitArray[2])
        return hsv
    } else {
        console.log("invalid hsv string")
    }
    return undefined
}


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
type convertTimersStringToObj_t = (props: convertTimersStringToObj_props) => types.HUE_TIMER_t[] | undefined
const convertTimersStringToObj: convertTimersStringToObj_t = ({ timersString }) => {
    console.log("timersString to convert = " + timersString)
    if (timersString) {
        try {
            let timersObject: (Omit<types.HUE_TIMER_t, "DAYS"> & { DAYS: number })[] = JSON.parse(timersString)
            if (timersObject && timersObject.length) {
                console.log("timer array size is " + timersObject.length)
                console.log(timersObject)
                const newTimersObject = timersObject.map((timer, index) => {
                    console.log("timer " + index + " HR is " + timer.H)
                    let tempDAYS: [boolean, boolean, boolean, boolean, boolean, boolean, boolean,] = [false, false, false, false, false, false, false]
                    for (let daysIndex = 0; daysIndex < 7; daysIndex++) {
                        tempDAYS[daysIndex] = getBit(daysIndex, timer.DAYS)
                    }
                    let tempTimer: types.HUE_TIMER_t = { ...timer, DAYS: tempDAYS }
                    return tempTimer
                });
                return newTimersObject
            } else {
                console.log("timers array parsing failed")
            }
        } catch (error) {
            console.log("error >> " + error)
            //console.log(error)
        }
    }
    return undefined
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



/*
'########:'########::'######::'########:::::'######:::'#######::'########::'########:
... ##..:: ##.....::'##... ##:... ##..:::::'##... ##:'##.... ##: ##.... ##: ##.....::
::: ##:::: ##::::::: ##:::..::::: ##::::::: ##:::..:: ##:::: ##: ##:::: ##: ##:::::::
::: ##:::: ######:::. ######::::: ##::::::: ##::::::: ##:::: ##: ##:::: ##: ######:::
::: ##:::: ##...:::::..... ##:::: ##::::::: ##::::::: ##:::: ##: ##:::: ##: ##...::::
::: ##:::: ##:::::::'##::: ##:::: ##::::::: ##::: ##: ##:::: ##: ##:::: ##: ##:::::::
::: ##:::: ########:. ######::::: ##:::::::. ######::. #######:: ########:: ########:
:::..:::::........:::......::::::..:::::::::......::::.......:::........:::........::
*/

/* {
    (() => {
        console.log("test code begin")
        let hsv = getHsvFromString({ hsvString: "0-100-110" })
        if (hsv) {
            console.log("h is " + hsv?.h + ", s is " + hsv?.s + ", v is " + hsv?.v)
        } else {
            console.log("could not convert string to hsv")
        }
    })()
} */

/* {
    (() => {
        //const timersString = "[{\"H\":\"11\",\"M\":\"30\",\"DT\":0,\"DAYS\":1234,\"ET\":0,\"STATUS\":1234}, {\"H\":\"12\",\"M\":\"30\",\"DT\":0,\"DAYS\":1234,\"ET\":0,\"STATUS\":1234}]"
        //let timers = convertTimersStringToObj({ timersString })
        let daysNumber = 0
        for (let index = 0; index < 7; index++) {
            daysNumber = setBit(index, daysNumber, true)
            console.log("number now is " + daysNumber)
        }
    })()
} */