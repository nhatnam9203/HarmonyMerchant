import useAxios from 'axios-hooks';
import { RETAILER_LAYOUT } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';
import _ from "lodash"

export const useGetLayout = () => {
  const dispatch = useDispatch();

  const [{ data: layout, loading, error, response }, execute] = useAxios(
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
  }, [layout?.data, dispatch, loading, response]);

  const getLayout = () => {
    execute({
      url: `${RETAILER_LAYOUT.url}`,
    });
  };

  return [layout, getLayout];
};
