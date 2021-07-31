import React from 'react';
import { Layout } from './Layout';
import { useProps } from './useProps';
import { createScreenComponent } from '@shared/helpers/createScreenComponent';

export const InventoryAdjustQtyPage = createScreenComponent(
  'retailer.inventory.product.qty',
  (props) => <Layout {...useProps(props)} />,
  {
    title: 'Customer List',
  },
);
