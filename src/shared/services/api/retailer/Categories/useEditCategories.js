import useAxios from 'axios-hooks';
import { RETAILER_CATEGORIES } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useEditCategories = () => {
  const dispatch = useDispatch();

  const [{ data: categories, loading, error, response }, execute] = useAxios(
    { method: 'PUT' },
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

  const editCategories = (params, id) => {
    execute({
      data: params,
      url: `${RETAILER_CATEGORIES.url}/${id}`,
    });
  };

  return [categories, editCategories];
};
