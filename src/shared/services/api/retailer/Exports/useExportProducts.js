import { useAxiosReport } from "@shared/services/api/useAxiosReport";
import { RETAILER_PRODUCTS } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useExportProducts = () => {
  const dispatch = useDispatch();

  const [{ data: productsExport, loading, error, response }, execute] =
  useAxiosReport(
      { method: 'GET' },
      {
        manual: true,
      }
    );

  React.useEffect(() => {
    if (loading) {
      dispatch(appMerchant.showExportLoading());
    }
    if (!loading && response) {
      dispatch(appMerchant.hideExportLoading());
    }
  }, [productsExport?.data, dispatch, loading, response]);

  const exportProducts = (params) => {
    execute({
      params: params,
      url: `${RETAILER_PRODUCTS.url}/export`,
    });
  };

  return [productsExport, exportProducts];
};
