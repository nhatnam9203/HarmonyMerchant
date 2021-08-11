import NavigationServices from "@navigators/NavigatorServices";
import { useFocusEffect } from "@react-navigation/native";
import {
  useEditLayout,
  useGetLayout,
} from "@shared/services/api/retailer";
import { SORT_TYPE, statusSuccess } from "@shared/utils/app";
import React from "react";
import { useTranslation } from "react-i18next";
import _ from "lodash";

export const useProps = ({ params: { reload }, reloadPage }) => {
  const [t] = useTranslation();
  
  /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */
  const [layout, getLayout] = useGetLayout();
  const callGetLayout = React.useCallback(() => {
    getLayout();
  });
  const [, editLayout] = useEditLayout();

  React.useEffect(() => {
    callGetLayout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeText = (value, key) => {
    const layoutEdit = {}
    this.setState({layout: layoutEdit})
  }

  const onButtonSavePress = (layout) => {
    editLayout(layout)
  }
  return {
    layout,
    onChangeText,
    onButtonSavePress,
  };
};
