import useAxios from 'axios-hooks';
import { RETAILER_ATTRIBUTES } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useEditAttributes = () => {
  const dispatch = useDispatch();

  const [{ data: attributes, loading, error, response }, execute] = useAxios(
    { method: 'PUT', url: RETAILER_ATTRIBUTES.url },
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
  }, [attributes?.data, dispatch, loading, response]);

  const editAttributes = (params) => {
    execute({
      data: params,
      url: `${RETAILER_ATTRIBUTES.url}/${params.id}`,
    });
  };

  return [attributes, editAttributes];
};
