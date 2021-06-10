import useAxios from 'axios-hooks';
import { RETAILER_ATTRIBUTES } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useDeleteAttributes = (onCallback) => {
  const dispatch = useDispatch();

  const [{ data: attributes, loading, error, response }, execute] = useAxios(
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

  const deleteAttributes = (attributesId) => {
    execute({
      url: `${RETAILER_ATTRIBUTES.url}/${attributesId}`,
    });
  };

  return [attributes, deleteAttributes];
};
