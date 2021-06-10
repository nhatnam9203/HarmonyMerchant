import React from 'react';
import { Layout } from './Layout';
import { useProps } from './useProps';
import { createScreenComponent } from '@shared/helpers/createScreenComponent';

export const MarketingTabPage = createScreenComponent(
  'retailer.home.marketing',
  (props) => <Layout {...useProps(props)} />,
  {
    title: 'Marketing',
  },
);
