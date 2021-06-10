import useAxios from 'axios-hooks';
import { RETAILER_PRODUCTS } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useDeleteProducts = (onCallback) => {
  const dispatch = useDispatch();

  const [{ data: productsDelete, loading, error, response }, execute] =
    useAxios(
      { method: 'DELETE' },
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
      if (onCallback && typeof onCallback === 'function') {
        onCallback();
      }
    }
  }, [dispatch, loading, response]);

  const deleteProducts = (productsId) => {
    execute({
      url: `${RETAILER_PRODUCTS.url}/${productsId}`,
    });
  };

  return [productsDelete, deleteProducts];
};
