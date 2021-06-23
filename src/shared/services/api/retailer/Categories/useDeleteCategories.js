import useAxios from 'axios-hooks';
import { RETAILER_CATEGORIES } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useDeleteCategories = (onCallback) => {
  const dispatch = useDispatch();

  const [{ data: categories, loading, error, response }, execute] = useAxios(
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

  const deleteCategories = (categoriesId) => {
    execute({
      url: `${RETAILER_CATEGORIES.url}/${categoriesId}`,
    });
  };

  return [categories, deleteCategories];
};
