import React from 'react';
import { Layout } from './Layout';
import { useProps } from './useProps';
import { createScreenComponent } from '@shared/helpers/createScreenComponent';

export const HomeOrderDetailPage = createScreenComponent(
  'retailer.home.order.detail',
  (props) => <Layout {...useProps(props)} />,
  {
    title: 'Customer List',
  },
);
