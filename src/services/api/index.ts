import { logFun_t } from "../../util/logger"
import v1 from "./v1"



const apiClass = new class {
    IP: string | undefined
    ID = "API-" + Math.floor(Math.random() * 10001);
    constructor(IP?: string) {
        console.log(">>>>api class constructor>>>>" + this.ID)
        this.IP = IP
    }
    v1 = v1
}

export default apiClass
