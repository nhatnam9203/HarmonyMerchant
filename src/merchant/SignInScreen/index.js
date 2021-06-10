import { createScreenComponent } from '@shared/helpers/createScreenComponent';
import React from 'react';
import { Layout } from './Layout';
import { useProps } from './useProps';

export const SignInScreen = createScreenComponent(
  'merchant.signin',
  ({ params }) => <Layout {...useProps(params)} />,
  {},
);
