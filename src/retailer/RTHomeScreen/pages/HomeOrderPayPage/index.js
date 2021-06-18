import React from 'react';
import { Layout } from './Layout';
import { useProps } from './useProps';
import { createScreenComponent } from '@shared/helpers/createScreenComponent';

export const HomeOrderPayPage = createScreenComponent(
  'retailer.home.order.pay',
  (props) => <Layout {...useProps(props)} />,
  {
    title: 'Customer List',
  },
);
