import useAxios from 'axios-hooks';
import { RETAILER_PRODUCTS } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useRestockProducts = () => {
  const dispatch = useDispatch();

  const [{ data: productsRestock, loading, error, response }, execute] =
    useAxios(
      { method: 'PUT', url: `${RETAILER_PRODUCTS.url}/restock` },
      {
        manual: true,
      },
    );

  React.useEffect(() => {
    if (loading) {
      dispatch(appMerchant.showLoading());
    }
    if (!loading && response) {
      dispatch(appMerchant.hideLoading());
    }
  }, [productsRestock?.data, dispatch, loading, response]);

  const restockProducts = (params) => {
    execute({
      data: params,
    });
  };

  return [productsRestock, restockProducts];
};
