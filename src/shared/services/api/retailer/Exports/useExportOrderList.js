import useAxios from 'axios-hooks';
import { RETAILER_ORDER } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useExportOrderList = () => {
  const dispatch = useDispatch();

  const [{ data: exportOrderList, loading, error, response }, execute] =
    useAxios(
      { method: 'GET' },
      {
        manual: true,
      }
    );

  React.useEffect(() => {
    if (loading) {
      dispatch(appMerchant.showExportLoading());
    }
    if (!loading && response) {
      dispatch(appMerchant.hideExportLoading());
    }
  }, [dispatch, loading, response, exportOrderList?.data]);

  const ExportOrderList = (params) => {
    execute({
      params,
      url: `${RETAILER_ORDER.url}/export`,
    });
  };

  return [exportOrderList, ExportOrderList];
};
