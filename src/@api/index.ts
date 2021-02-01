import * as API from "./v1";


export const apiClass = new class {
    IP: string | undefined
    ID = "API-" + Math.floor(Math.random() * 10001);
    constructor(IP?: string) {
        console.log(">>>>api class constructor>>>>" + this.ID)
        this.IP = IP
    }
}

export default API
