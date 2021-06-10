import React from 'react';
import { Layout } from './Layout';
import { useProps } from './useProps';
import { createScreenComponent } from '@shared/helpers/createScreenComponent';
import IMAGE from '@resources';

export const SettingTaxPage = createScreenComponent(
  'retailer.settings.tax',
  (props) => <Layout {...useProps(props)} />,
  {
    title: 'TAX',
    icon: IMAGE.IconSettingTAX,
  },
);
