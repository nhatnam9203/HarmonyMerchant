import React from 'react';
export const useProps = ({ navigation }) => {
  const openDrawer = () => {
    navigation.openDrawer();
  };

  const onChangeTab = (index) => {
    console.log(index);
  };

  return { openDrawer, onChangeTab };
};
