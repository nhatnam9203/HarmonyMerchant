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
  const [layoutData, setLayoutData] = React.useState({});
  
  const [, editLayout] = useEditLayout();

  React.useEffect(() => {
    getLayout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const { codeStatus, data } = layout || {};
    if (statusSuccess(codeStatus)) {
        setLayoutData(data);
    }
  }, [layout]);

  const onChangeText = (value, key) => {
    let layoutEdit = JSON.parse(JSON.stringify(layoutData))
    if(layoutEdit.hasOwnProperty(key)){
      layoutEdit[key] = value
    }else{
      layoutEdit = {...layoutEdit, [key]: value}
    }
    setLayoutData(layoutEdit)
  }

  const onButtonSavePress = (layoutData) => {
    editLayout(layoutData)
  }
  return {
    layoutData,
    onChangeText,
    onButtonSavePress,
  };
};
