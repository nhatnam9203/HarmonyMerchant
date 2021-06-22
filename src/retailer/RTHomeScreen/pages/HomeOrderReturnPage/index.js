import React from 'react';
import { Layout } from './Layout';
import { useProps } from './useProps';
import { createScreenComponent } from '@shared/helpers/createScreenComponent';

export const HomeOrderReturnPage = createScreenComponent(
  'retailer.home.order.return',
  (props) => <Layout {...useProps(props)} />,
  {
    title: 'Customer List',
  },
);
