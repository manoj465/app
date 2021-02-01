import React, { useEffect, useState } from "react";
import { logger } from "../../@logger";
import api from "../../@api";

interface userScanApiHelper_props {
  timeout?: number
  autoStart?: boolean
  log?: logger
}
type userScanApiHelper_t = (props: userScanApiHelper_props) => [
  api.deviceAPI.scanAPI.ScanApiReturnType | undefined,
  number,
  boolean,
  boolean, () => Promise<void>
]
const useScanApiHook: userScanApiHelper_t = ({ timeout = 0, autoStart, log }) => {
  const [data, setData] = useState<api.deviceAPI.scanAPI.ScanApiReturnType | undefined>(undefined);
  const [status, setStatus] = useState(-4);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  log?.print("---------------")

  useEffect(() => {
    if (data) {
      log?.print("data is -- " + JSON.stringify(data))
      if (data.RES?.status == -2) {
        log?.print("wifi started scanning, wait for 5 sec")
        setTimeout(() => {
          load()
        }, 3000);
      }
      else if (data.RES?.status == -1) {
        log?.print("wifi currently scanning, wait for few sec and try again")
        setTimeout(() => {
          load()
        }, 3000);
      }
    }
    if (autoStart && !data) {
      load()
    }
    return () => { }
  }, [data])

  async function load() {
    log?.print("hitting scan api request")
    const res = await api.deviceAPI.scanAPI.v1({ IP: "192.168.4.1", log: log ? new logger("pair-API", log) : undefined })
    log?.print("RES - scanAPI " + JSON.stringify(res, null, 2))
    setData(res)
  }

  return [data, status, loading, error, load];
};


export default useScanApiHook