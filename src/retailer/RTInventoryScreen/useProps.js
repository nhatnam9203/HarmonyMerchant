import React from 'react';
import { useGetCategoriesList } from '@shared/services/api/retailer';

export const useProps = ({ navigation }) => {
  /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */
  const [, getCategoriesList] = useGetCategoriesList();

  React.useEffect(() => {
    getCategoriesList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openDrawer = () => {
    navigation.openDrawer();
  };

  return { openDrawer };
};
