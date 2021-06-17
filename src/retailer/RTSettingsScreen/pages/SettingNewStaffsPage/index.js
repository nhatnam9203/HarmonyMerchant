import React from 'react';
import { Layout } from './Layout';
import { useProps } from './useProps';
import { createScreenComponent } from '@shared/helpers/createScreenComponent';

export const SettingNewStaffsPage = createScreenComponent(
  'retailer.settings.staffs.new',
  (props) => <Layout {...useProps(props)} />,
  {
    title: '',
  },
);
