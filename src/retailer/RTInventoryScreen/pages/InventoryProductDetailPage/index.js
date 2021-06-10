import React from 'react';
import { Layout } from './Layout';
import { useProps } from './useProps';
import { createScreenComponent } from '@shared/helpers/createScreenComponent';

export const InventoryProductDetailPage = createScreenComponent(
  'retailer.inventory.product.detail',
  (props) => <Layout {...useProps(props)} />,
  {
    title: 'Customer List',
  },
);
