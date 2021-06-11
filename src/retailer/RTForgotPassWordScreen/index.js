import React from 'react';
import { createScreenComponent } from '@shared/helpers/createScreenComponent';
import { Layout } from './Layout';
import { useProps } from './useProps';

export const RTForgotPassWordScreen = createScreenComponent(
  'retailer.rtforgotpasswordscreen',
  (props) => (<Layout {...useProps(props)} />,
  {}
  ));
