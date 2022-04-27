import React from 'react';
import { Layout } from './Layout';
import { useProps } from './useProps';
import { createScreenComponent } from '@shared/helpers/createScreenComponent';

export const HomeTopTabScreen = createScreenComponent(
  'salon.home.top_tab',
  (props) => <Layout {...useProps(props)} />,
  {
    title: 'Customer List',
  },
);
