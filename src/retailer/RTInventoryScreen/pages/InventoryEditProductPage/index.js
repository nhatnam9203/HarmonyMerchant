import React from 'react';
import { Layout } from './Layout';
import { useProps } from './useProps';
import { createScreenComponent } from '@shared/helpers/createScreenComponent';

export const InventoryEditProductPage = createScreenComponent(
  'retailer.inventory.product.edit',
  (props) => <Layout {...useProps(props)} />,
  {
    title: 'Customer List',
  },
);
