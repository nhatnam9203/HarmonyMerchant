import useAxios from 'axios-hooks';
import { RETAILER_LAYOUT } from '../../route';
import { appMerchant } from '@redux/slices';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

export const useEditLayout = () => {
  const dispatch = useDispatch();

  const [{ data: layout, loading, error, response }, execute] = useAxios(
    { method: 'POST', url: RETAILER_LAYOUT.url },
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
  }, [layout, dispatch, loading, response]);

  const editLayout = (layout) => {
    execute({
      data: layout,
      url: `${RETAILER_LAYOUT.url}`,
    });
  };

  return [layout, editLayout];
};
