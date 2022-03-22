import { useAxiosReport } from "@shared/services/api/useAxiosReport";
import { RETAILER_REPORT_PRODUCT } from '../../route';
import { appMerchant } from '@redux/slices';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useExportSaleByCategory = () => {
  const dispatch = useDispatch();

  const [{ data: saleByCategoryExport, loading, error, response }, execute] =
  useAxiosReport(
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
  }, [saleByCategoryExport?.data, dispatch, loading, response]);

  const ExportSaleByCategory = (params) => {
    execute({
      params: params,
      url: `${RETAILER_REPORT_PRODUCT.url}/saleByCategory/export`,
    });
  };

  return [saleByCategoryExport, ExportSaleByCategory];
};
