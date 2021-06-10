import React from 'react';
import { createScreenComponent } from '@shared/helpers/createScreenComponent';
import { Layout } from './Layout';
import { useProps } from './useProps';

export const RTEnterPincode = createScreenComponent(
  'retailer.rtenterpincode',
  (props) => <Layout {...useProps(props)} />,
);
