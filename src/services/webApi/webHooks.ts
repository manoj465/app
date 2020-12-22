import React, { useEffect, useState } from "react";
import api from "../api";
import { scan_result_i } from "../api/v1/device/scan.api";

const useFetchData: (timeout: number) => [scan_result_i[], number, boolean, boolean, () => Promise<void>, React.Dispatch<React.SetStateAction<scan_result_i[]>>] = (timeout) => {
  const [data, setData] = useState<scan_result_i[]>([]);
  const [status, setStatus] = useState(-4);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await api.v1.deviceAPI.scanAPI()
      if (res.RES?.networks) {
        setData(res.RES.networks);
      } else {
        console.log("No Networks Found -- -- Starting Timeout");
        setTimeout(() => {
          load();
        }, 5500);
      }
    } catch (e) {
      setError(true);
      console.log("Starting Timeout -- Error:: " + e);
      setTimeout(() => {
        load();
      }, 5500);
    }
    setLoading(false);
  }

  useEffect(() => {
    console.log("useFetchData");
    return () => {
      console.log("useFetchData unsubscribe");
    };
  }, []);

  return [data, status, loading, error, load, setData];
};


export default useFetchData