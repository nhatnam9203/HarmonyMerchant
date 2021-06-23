import React from "react";
export class DropdownWrapper extends React.Component {
  componentDidMount() {
    this.props.dropdownManager.subscribeToDropdownChange(() =>
      this.forceUpdate()
    );
  }

  onClose(currentDropdown, params) {
    this.props.dropdownManager.close(currentDropdown);

    currentDropdown.props &&
      currentDropdown.props.onClose &&
      currentDropdown.props.onClose(...params);
  }

  render() {
    const { dropdownManager } = this.props;

    return dropdownManager.dropdown.map((currentDropdown) => (
      <currentDropdown.componentClass
        {...currentDropdown.dropdownProps}
        isOpen={currentDropdown.isOpen}
        onClose={(...params) => this.onClose(currentDropdown, params)}
      />
    ));
  }
}
