import React from 'react';
import { Layout } from './Layout';
import { useProps } from './useProps';
import { createScreenComponent } from '@shared/helpers/createScreenComponent';

export const HomeOrderListPage = createScreenComponent(
  'retailer.home.order.list',
  (props) => <Layout {...useProps(props)} />,
  {
    title: 'Customer List',
  },
);
