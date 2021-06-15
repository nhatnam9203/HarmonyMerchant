import React from 'react';
import { createScreenComponent } from '@shared/helpers/createScreenComponent';
import { Layout } from './Layout';
import { useProps } from './useProps';

export const RTSignupScreen = createScreenComponent(
  'retailer.rtsignupscreen',
  (props) => (<Layout {...useProps(props)} />,
  {}
  ));
