import axios from "axios";

const _server = "http://192.168.1.6:80";
//const _server = "https://www.huelite.in"

export const AuthAPI = async (IPAddress) => {
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
        if (response.data) resolve(response.data);
        else reject({ ER_MSG: "NO_DATA_RECEIVED" });
      })
      .catch((error) => {
        {
          debug && console.log("axios error:", error);
        }
        reject({ ERR: error });
      });
  });
};
