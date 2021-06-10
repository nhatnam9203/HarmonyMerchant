import React from 'react';
import { Layout } from './Layout';
import { useProps } from './useProps';
import { createScreenComponent } from '@shared/helpers/createScreenComponent';
import IMAGE from '@resources';

export const SettingGeneralPage = createScreenComponent(
  'retailer.settings.general',
  (props) => <Layout {...useProps(props)} />,
  {
    title: 'General',
    icon: IMAGE.IconSettingGeneral,
  },
);
