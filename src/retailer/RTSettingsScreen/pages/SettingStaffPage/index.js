import React from 'react';
import { Layout } from './Layout';
import { useProps } from './useProps';
import { createScreenComponent } from '@shared/helpers/createScreenComponent';
import IMAGE from '@resources';

export const SettingStaffPage = createScreenComponent(
  'retailer.settings.staff',
  (props) => <Layout {...useProps(props)} />,
  {
    title: 'Staff',
    icon: IMAGE.IconSettingStaff,
  },
);
