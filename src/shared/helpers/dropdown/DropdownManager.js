import React from "react";

export class DropdownManager {
  dropdown = [];
  onDropdownChangeEvents = [];

  open(componentClass, dropdownProps) {
    this.dropdown.push({ isOpen: true, componentClass, dropdownProps });
    this.callDropdownChangeEvents();
  }

  close(currentDropdown) {
    currentDropdown.isOpen = false;
    this.callDropdownChangeEvents();
  }

  callDropdownChangeEvents() {
    this.onDropdownChangeEvents.forEach((cb) => cb());
  }

  subscribeToDropdownChange(callback) {
    this.onDropdownChangeEvents.push(callback);
  }
}
