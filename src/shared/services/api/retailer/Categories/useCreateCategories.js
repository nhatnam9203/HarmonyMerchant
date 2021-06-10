import useAxios from 'axios-hooks';
import { RETAILER_CATEGORIES } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useCreateCategories = () => {
  const dispatch = useDispatch();

  const [{ data: categories, loading, error, response }, execute] = useAxios(
    { method: 'POST', url: RETAILER_CATEGORIES.url },
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
  }, [categories?.data, dispatch, loading, response]);

  const createCategories = (params) => {
    execute({
      data: params,
    });
  };

  return [categories, createCategories];
};
