import React from 'react';
import { Layout } from './Layout';
import { useProps } from './useProps';
import { createScreenComponent } from '@shared/helpers/createScreenComponent';
import IMAGE from '@resources';

export const SettingLayoutPage = createScreenComponent(
  'retailer.settings.layout',
  (props) => <Layout {...useProps(props)} />,
  {
    title: 'Layout',
    icon: IMAGE.IconSettingLayout,
  },
);
