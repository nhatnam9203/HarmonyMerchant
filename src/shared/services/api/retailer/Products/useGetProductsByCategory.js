import useAxios from 'axios-hooks';
import { RETAILER_PRODUCTS } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useGetProductsByCategory = () => {
  const dispatch = useDispatch();

  const [{ data: subCategories, loading, error, response }, execute] = useAxios(
    { method: 'GET' },
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
  }, [subCategories?.data, dispatch, loading, response]);

  const getProductsByCategory = (categoryId) => {
    execute({
      url: `${RETAILER_PRODUCTS.url}/getbycategory/${categoryId}`,
    });
  };

  return [subCategories, getProductsByCategory];
};
