import React, { Component } from 'react';
import { useSignOut } from '@shared/services/api/merchant';

export const WithLogout = (WrappedComponent) => {
  return function WithLogoutComponent(props) {
    const [, merchantLogout] = useSignOut();

    const singOutSubmit = () => {
      merchantLogout({});
    };

    return <WrappedComponent {...props} confimYes={singOutSubmit} />;
  };
};
