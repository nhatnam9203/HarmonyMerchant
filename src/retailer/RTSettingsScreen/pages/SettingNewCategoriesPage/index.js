import React from 'react';
import { Layout } from './Layout';
import { useProps } from './useProps';
import { createScreenComponent } from '@shared/helpers/createScreenComponent';

export const SettingNewCategoriesPage = createScreenComponent(
  'retailer.settings.categories.new',
  (props) => <Layout {...useProps(props)} />,
  {
    title: 'Customer List',
  },
);
