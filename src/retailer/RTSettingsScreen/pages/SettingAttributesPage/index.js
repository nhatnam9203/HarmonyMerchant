import React from 'react';
import { Layout } from './Layout';
import { useProps } from './useProps';
import { createScreenComponent } from '@shared/helpers/createScreenComponent';
import IMAGE from '@resources';

export const SettingAttributesPage = createScreenComponent(
  'retailer.settings.attributes',
  (props) => <Layout {...useProps(props)} />,
  {
    title: 'Attributes',
    icon: IMAGE.IconSettingAttributes,
  },
);
