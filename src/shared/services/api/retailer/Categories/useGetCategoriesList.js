import useAxios from "axios-hooks";
import { RETAILER_CATEGORIES } from "../../route";
import { appMerchant, inventoryRetailer } from "@redux/slices";
import React from "react";
import { useDispatch } from "react-redux";

export const useGetCategoriesList = () => {
  const dispatch = useDispatch();
  const [paramsBackup, setParamsBackup] = React.useState(null);

  const [{ data: categoriesList, loading, error, response }, execute] =
    useAxios(
      { method: "GET", url: `${RETAILER_CATEGORIES.url}/search` },
      {
        manual: true,
      }
    );

  React.useEffect(() => {
    if (loading) {
      dispatch(appMerchant.showLoading());
    }
    if (!loading && response) {
      if (!paramsBackup) {
        dispatch(inventoryRetailer.saveCategories(categoriesList?.data));
      }
      dispatch(appMerchant.hideLoading());
    }
  }, [categoriesList?.data, dispatch, loading, response]);

  const getCategoriesList = (params) => {
    if (params) {
      setParamsBackup(params);
    } else setParamsBackup(null);

    execute({
      params: params,
    });
  };

  return [categoriesList, getCategoriesList];
};
