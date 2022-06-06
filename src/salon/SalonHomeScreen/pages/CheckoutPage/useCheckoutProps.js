import actions from "@actions";
import { useFocusEffect } from "@react-navigation/native";
import * as AppUtils from "@utils";
import _ from "lodash";
import moment from "moment";
import React from "react";
import { NativeEventEmitter, NativeModules } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as CheckoutState from "./SalonCheckoutState";
import { useCallApis } from "./useCallApis";
import NavigatorServices from "@navigators/NavigatorServices";
import { ScreenName } from "@src/ScreenName";
import { useProps } from "./useProps";

const signalR = require("@microsoft/signalr");

const PosLinkReport = NativeModules.report;
const PosLink = NativeModules.payment;
const PoslinkAndroid = NativeModules.PoslinkModule;
const { clover } = NativeModules;

export const useCheckoutProps = (args) => {
  const dispatch = useDispatch();
  const props = useProps(args);

  const { profileStaffLogin, isOfflineMode } = props || {};

  // Effects
  useFocusEffect(
    React.useCallback(() => {
      if (!isOfflineMode) {
        props.getCategoriesByStaff(profileStaffLogin?.staffId, () => {});
        if (profileStaffLogin?.staffId >= 0)
          props.setSelectStaffFromCalendar(profileStaffLogin?.staffId, true);
      }
    }, [profileStaffLogin?.staffId, isOfflineMode])
  );

  return {
    ...props,
  };
};
