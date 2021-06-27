import useAxios from 'axios-hooks';
import { RETAILER_REPORT_SALES } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useExportSaleOrder = () => {
  const dispatch = useDispatch();

  const [{ data: exportSalesOrder, loading, error, response }, execute] =
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
  }, [dispatch, loading, response, exportSalesOrder?.data]);

  const ExportSalesOrder = (params) => {
    execute({
      params,
      url: `${RETAILER_REPORT_SALES.url}/order/export`,
    });
  };

  return [exportSalesOrder, ExportSalesOrder];
};
