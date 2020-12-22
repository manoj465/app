import axios from "axios";

const _server = "http://192.168.1.6:80";
//const _server = "https://www.huelite.in"

const AuthAPI = async (IPAddress) => {
  let debug = false;
  return new Promise(async (resolve, reject) => {
    await axios
      .get("http://" + IPAddress + "/auth", { timeout: 1000 })
      .then((response) => {
        {
          debug &&
            console.log(
              "axios response-- " +
                "LoginAPI_status::" +
                response.status +
                "LoginAPI_body::" +
                response.data
            );
        }
        resolve(response);
      })
      .catch((error) => {
        {
          debug && console.log("axios error:", error);
        }
        reject(error);
      });
  });
};

const getStatusApi = async (ipAddr) => {
  let statusUrl = `http://${ipAddr}/status`;
  return await fetch(statusUrl)
    .then((res) => {
      return res.json();
    })
    .catch((e) => {
      console.log("Error: ", e);
    });
};

const pairDeviceApi = async (wifiName, password) => {
  return await fetch("http://192.168.4.1/config", {
    method: "POST",
    headers: {
      Accept: "application/json, application/text",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `config=wifi_connect&ssid=${wifiName}&pass=${password}`,
  })
    .then((res) => {
      let resText = res.text();
      //console.log("pairDeviceApi res : ",resText);
      return resText;
    })
    .catch((e) => {
      console.log("Error: ", e);
    });
};

const saveWifiConfigApi = async (cb) => {
  return await fetch("http://192.168.4.1/config", {
    method: "POST",
    headers: {
      Accept: "application/json, application/text",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `config=save_wifi_cnf`,
  })
    .then((res) => {
      let resText = res.text();
      console.log("saveWifiConfigApi res : ", resText);
      return resText;
    })
    .catch((e) => {
      console.log("Error: ", e);
    });
};

const modesApi = async (IP, mode_msg, cbRes) => {
  let modesUrl = `http://${IP}/config`;
  await fetch(modesUrl, {
    method: "POST",
    headers: {
      Accept: "application/json, application/text",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `config=mode_start&mode_msg=${mode_msg}`,
  })
    .then((res) => {
      //res.json()
      let resText = res.text();
      console.log("modesApi res : ", resText);
      if (resText == "rainbow") return cbRes("RAINBOW");
      else return cbRes("ELSE");
    })
    .catch((e) => {
      console.log("Error: ", e);
      return cbRes("ERR");
    });
};

const getWiFiList = async (cbRes) => {
  await axios
    .post(
      "http://192.168.4.1/config",
      /* <--urlEncodedParameters--> */ "config=wifi_scan",
      {
        headers: {
          Accept: "application/json, application/text",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
    .then((response) => {
      const d = response.data;
      let { Status } = d;
      wifiArray = [];
      console.log(":::::" + Status);
      /* Networks.map(item => {
                console.log(":::::" + item.ssid)
                let wifiName = {}
                wifiName["value"] = item.SSID
                wifiArray.push(wifiName)
            }) */
      cbRes(response.data);
    })
    .catch((error) => {
      console.log("axios error:", error);
      cbRes(null);
    })
    .finally(function () {});
};

const loginAPI = async (_username, _pass) => {
  let debug = false;
  return new Promise(async (resolve, reject) => {
    await axios
      .post(
        _server + "/user/authenticate",
        {
          username: _username,
          password: _pass,
        },
        { timeout: 2000 }
      )
      .then((response) => {
        {
          debug &&
            console.log(
              "axios response-- " +
                "LoginAPI_status::" +
                response.status +
                "LoginAPI_body::" +
                response.data
            );
        }
        resolve(response);
        //cbRes("pass")
      })
      .catch((error) => {
        {
          debug && console.log("axios error:", error.response.data.message);
        }
        reject(error.response.data.message);
      });
  });
};

const signUpAPI = async (_username, _pass) => {
  let debug = true;
  return new Promise(async (resolve, reject) => {
    await axios
      .post(
        _server + "/user/register",
        {
          username: _username,
          password: _pass,
        },
        { timeout: 2000 }
      )
      .then((response) => {
        {
          debug &&
            console.log(
              "axios response-- " +
                "LoginAPI_status::" +
                response.status +
                "LoginAPI_body::" +
                response.data
            );
        }
        resolve(response);
        //cbRes("pass")
      })
      .catch((error) => {
        {
          debug && console.log("axios error:", error.response.data.message);
        }
        reject(error.response.data.message);
      });
  });
};

const UnpairAPI = async (IPAddress) => {
  let debug = true;
  return new Promise(async (resolve, reject) => {
    await axios
      .get("http://" + IPAddress + "/unpair", {}, { timeout: 2000 })
      .then((response) => {
        {
          debug &&
            console.log(
              "axios response-- " +
                "LoginAPI_status::" +
                response.status +
                "LoginAPI_body::" +
                response.data
            );
        }
        resolve(response);
        //cbRes("pass")
      })
      .catch((error) => {
        {
          debug && console.log("axios error:", error.response.data);
        }
        reject(error.response.data);
      });
  });
};

/**
 *
 * @param {IPAddress-->ip of device if swnding over local network --optional} props
 * @param {config-->`SET` parameter --required} props
 * look into the CONFIG file for available commands
 */
const ConfigAPI = async (IPAddress, SET) => {
  //TODO: add the props for set parameter
  let debug = true;
  {
    debug && console.log("CONFIG API--" + IPAddress);
  }
  return new Promise(async (resolve, reject) => {
    let param = "";
    if (SET) param = "SET=SET101";
    else param = "SET=SET102";
    await axios
      .post("http://" + IPAddress + "/set", param, { timeout: 2000 })
      .then((response) => {
        {
          debug &&
            console.log(
              "axios response-- " +
                "LoginAPI_status::" +
                response.status +
                "LoginAPI_body::" +
                response.data.LED_SAVE
            );
        }
        resolve(response.data.LED_SAVE);
        //cbRes("pass")
      })
      .catch((error) => {
        {
          debug && console.log("axios error+++CONFIGAPI:", error);
        }
        reject(error);
      });
  });
};

/**
 *
 * @param {*} IPAddress ipaddress for the request -->default is 192.168.4.1
 * @param {*} timeout integer value for request timeout in ms-->default is 2000
 */
const StatusAPI = async (IPAddress, timeout) => {
  let debug = false;
  return new Promise(async (resolve, reject) => {
    await axios
      .get("http://" + IPAddress + "/status", { timeout: timeout })
      .then((response) => {
        {
          debug &&
            console.log(
              "axios response-- " +
                "StatusAPI::" +
                response.status +
                "StatusAPI_body::" +
                response.data
            );
        }
        resolve(response.data);
        //cbRes("pass")
      })
      .catch((error) => {
        {
          debug && console.log("StatusAPI error:", error);
        }
        reject(error);
      });
  });
};

export {
  AuthAPI,
  StatusAPI,
  ConfigAPI,
  UnpairAPI,
  signUpAPI,
  loginAPI,
  getWiFiList,
  getStatusApi,
  pairDeviceApi,
  saveWifiConfigApi,
  modesApi,
};
