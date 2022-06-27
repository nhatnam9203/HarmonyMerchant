import { useDispatch } from "react-redux";
import React from "react";
import * as controllers from "../../controllers";
import { ScreenName } from "@src/ScreenName";

export const useProps = ({ navigation }) => {
  const dispatch = useDispatch();

  return {
    navigation,
  };
};
