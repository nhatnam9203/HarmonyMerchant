import React from 'react';
import { createScreenComponent } from '@shared/helpers/createScreenComponent';
import { Layout } from './Layout';
import { useProps } from './useProps';
import { Animated } from 'react-native';
import { TransitionPresets } from '@react-navigation/stack';

export const ForgotPassword = createScreenComponent(
  'merchant.forgotpassword',
  (props) => <Layout {...useProps(props)} />,
  {
    // ...TransitionPresets.SlideFromRightIOS,
  },
);
