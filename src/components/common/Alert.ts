import { Alert, Platform } from "react-native"


export default Platform.OS == "web" ? { alert: (heading: string, message: string, _?: any, __?: any) => { alert(message) } } : Alert