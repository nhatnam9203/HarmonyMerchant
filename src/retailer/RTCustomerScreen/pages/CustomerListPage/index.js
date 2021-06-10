import React from 'react';
import { Layout } from './Layout';
import { useProps } from './useProps';
import { createScreenComponent } from '@shared/helpers/createScreenComponent';

export const CustomerListPage = createScreenComponent(
  'retailer.customer.list',
  (props) => <Layout {...useProps(props)} />,
  {
    title: 'Customer List',
  },
);
