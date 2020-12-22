import React from "react";
import { string } from "react-native-redash";
import { HUE_CONTAINER_t, types } from "./@types/huelite/globalTypes";
import { reduxStore } from "./redux";
import MainRouter from "./routers/MainRouter";




interface App_i { }
const Application = ({ }: App_i) => {

  const initialScreen = reduxStore.store.getState().appCTXReducer.user?.email
    ? reduxStore.store.getState().deviceReducer.deviceList ? "dashboard" : "pairing"
    : "onboarding";

  return <MainRouter initialScreen={initialScreen} />;
};


export default Application