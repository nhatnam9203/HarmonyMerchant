import useAxios from 'axios-hooks';
import { RETAILER_LAYOUT } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useEditLayout = () => {
  const dispatch = useDispatch();

  const [{ data: data, loading, error, response }, execute] = useAxios(
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
  }, [data?.data, dispatch, loading, response]);

  const editLayout = (layout) => {
    execute({
      data: layout,
      url: `${RETAILER_LAYOUT.url}`,
    });
  };

  return [layout, editLayout];
};
