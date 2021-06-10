import React from 'react';
import { Layout } from './Layout';
import { useProps } from './useProps';
import { createScreenComponent } from '@shared/helpers/createScreenComponent';
import IMAGE from '@resources';

export const SettingCategoriesPage = createScreenComponent(
  'retailer.settings.categories',
  (props) => <Layout {...useProps(props)} />,
  {
    title: 'Categories',
    icon: IMAGE.IconSettingCategories,
  },
);
