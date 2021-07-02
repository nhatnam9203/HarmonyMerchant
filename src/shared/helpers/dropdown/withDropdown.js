import React from 'react';
import { DropdownContext } from './DropdownProvider';

export function withDropdown(WrappedComponent) {
  return (props) => (
    <DropdownContext.Consumer>
      {(context) => (
        <WrappedComponent
          {...props}
          ref={props?.dropdownRef}
          dropdown={context.dropdown}
        />
      )}
    </DropdownContext.Consumer>
  );
}
