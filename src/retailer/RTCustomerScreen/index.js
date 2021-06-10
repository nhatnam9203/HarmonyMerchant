import React from 'react';
import { createScreenComponent } from '@shared/helpers/createScreenComponent';
import { Layout } from './Layout';
import { useProps } from './useProps';
import { CustomDrawerIcon } from '@shared/components/CustomDrawerContent';
import IMAGE from '@resources';

const SCREEN_KEY = 'Customer';
export const RTCustomerScreen = createScreenComponent(
  'retailer.customer',
  (props) => <Layout {...useProps(props)} />,
  {
    drawerIcon: ({ focused }) => (
      <CustomDrawerIcon
        source={focused ? IMAGE[`Se_${SCREEN_KEY}`] : IMAGE[SCREEN_KEY]}
      />
    ),
    title: 'Customer',
  },
);
