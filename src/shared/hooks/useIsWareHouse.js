import * as l from "lodash";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export const useIsWareHouse = () => {
  const { isWareHouse = true } = useSelector((state) => state.dataLocal) || {};

  return {
    isWareHouse,
  };
};
