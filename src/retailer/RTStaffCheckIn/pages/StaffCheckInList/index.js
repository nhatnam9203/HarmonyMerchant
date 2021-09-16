import React from 'react';
import { Layout } from './Layout';
import { useProps } from './useProps';
import { createScreenComponent } from '@shared/helpers/createScreenComponent';

export const StaffCheckInList = createScreenComponent(
  'retailer.staff_check_in.list',
  (props) => <Layout {...useProps(props)} />,
  {
    title: 'Customer List',
  },
);
