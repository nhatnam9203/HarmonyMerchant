import React from 'react';
import { Layout } from './Layout';
import { useProps } from './useProps';
import { createScreenComponent } from '@shared/helpers/createScreenComponent';

export const SettingNewAttributesPage = createScreenComponent(
  'retailer.settings.attributes.new',
  (props) => <Layout {...useProps(props)} />,
  {
    title: 'Customer List',
  },
);
