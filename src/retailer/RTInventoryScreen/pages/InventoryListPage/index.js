import React from 'react';
import { Layout } from './Layout';
import { useProps } from './useProps';
import { createScreenComponent } from '@shared/helpers/createScreenComponent';

export const InventoryListPage = createScreenComponent(
  'retailer.inventory.list',
  (props) => <Layout {...useProps(props)} />,
  {
    title: 'Inventory List',
  },
);
