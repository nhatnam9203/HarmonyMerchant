import React from 'react';
import { createScreenComponent } from '@shared/helpers/createScreenComponent';
import { Layout } from './Layout';
import { useProps } from './useProps';

export const SplashScreen = createScreenComponent(
  'merchant.splash',
  ({ params }) => <Layout {...useProps(params)} />,
);
