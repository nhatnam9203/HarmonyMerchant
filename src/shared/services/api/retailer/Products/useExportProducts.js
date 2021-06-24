import useAxios from 'axios-hooks';
import { RETAILER_PRODUCTS } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useExportProducts = () => {
  const dispatch = useDispatch();

  const [{ data: productsExport, loading, error, response }, execute] =
    useAxios(
      { method: 'GET' },
      {
        manual: true,
      }
    );

  React.useEffect(() => {
    if (loading) {
      dispatch(appMerchant.showLoading());
    }
    if (!loading && response) {
      dispatch(appMerchant.hideLoading());
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
