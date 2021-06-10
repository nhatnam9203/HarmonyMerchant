import React from 'react';
import { Layout } from './Layout';
import { useProps } from './useProps';
import { createScreenComponent } from '@shared/helpers/createScreenComponent';

export const ReportSalesPage = createScreenComponent(
  'retailer.report.sales',
  (props) => <Layout {...useProps(props)} />,
  {
    title: 'Customer List',
  },
);
