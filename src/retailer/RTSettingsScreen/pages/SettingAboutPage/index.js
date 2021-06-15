import React from 'react';
import { Layout } from './Layout';
import { useProps } from './useProps';
import { createScreenComponent } from '@shared/helpers/createScreenComponent';
import IMAGE from '@resources';
export const SettingAboutPage = createScreenComponent(
  'retailer.settings.about',
  (props) => <Layout {...useProps(props)} />,
  {
    title: 'About',
    icon: IMAGE.IconSettingAbout,
  },
);
