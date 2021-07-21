import React from 'react';
import { Layout } from './Layout';
import { useProps } from './useProps';
import { createScreenComponent } from '@shared/helpers/createScreenComponent';

export const HomeOrderCheckOutPage = createScreenComponent(
  'retailer.home.order.check_out',
  (props) => <Layout {...useProps(props)} />,
  {
    title: 'Check Out',
  },
);
