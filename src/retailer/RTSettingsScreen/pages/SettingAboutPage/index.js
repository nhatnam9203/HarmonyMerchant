import React from 'react';
import { Layout } from './Layout';
import { useProps } from './useProps';
import { createScreenComponent } from '@shared/helpers/createScreenComponent';

export const SettingAboutPage = createScreenComponent(
  'retailer.settings.about',
  (props) => <Layout {...useProps(props)} />,
  {
    title: 'Customer List',
  },
);
