import React from 'react';
import {
  useGetCategoriesList,
  useDeleteCategories,
} from '@shared/services/api/retailer';
import { SORT_TYPE } from '@shared/utils/app';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import NavigationServices from '@navigators/NavigatorServices';
import { useFocusEffect } from '@react-navigation/native';

export const useProps = ({ params: { reload }, reloadPage }) => {
  const [t] = useTranslation();
  const [searchVal, setSearchVal] = React.useState();
  const [page, setPage] = React.useState(1);

  /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */
  const [categoriesList, getCategoriesList] = useGetCategoriesList();
  const callGetCategoriesList = React.useCallback(() => {
    getCategoriesList({
      name: searchVal ?? '',
      page: page,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchVal]);

  const [, deleteCategories] = useDeleteCategories(() => {
    callGetCategoriesList();
  });

  React.useEffect(() => {
    callGetCategoriesList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // React.useEffect(() => {
  //   if (reload || reloadPage) callGetCategoriesList();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [reload, reloadPage]);

  useFocusEffect(
    React.useCallback(() => {
      if (reload || reloadPage) callGetCategoriesList();
    }, [reload, reloadPage])
  );

  React.useEffect(() => {
    callGetCategoriesList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchVal]);

  const onChangeValueSearch = (text) => {
    setSearchVal(text);
  };

  const onButtonSearchPress = () => {
    callGetCategoriesList();
  };

  const onButtonNewCategoriesPress = () => {
    NavigationServices.navigate('retailer.settings.categories.new', {
      isNew: true,
    });
  };

  const onButtonDeleteCategoriesPress = (item) => {
    if (!item) return;
    deleteCategories(item.categoryId);
  };

  const onButtonEditCategoriesPress = (item) => {
    NavigationServices.navigate('retailer.settings.categories.new', {
      isEdit: true,
      item,
    });
  };

  const onRefresh = () => {
    callGetCategoriesList();
  };

  return {
    items: categoriesList?.data,
    onChangeValueSearch,
    onButtonSearchPress,
    onButtonNewCategoriesPress,
    onButtonDeleteCategoriesPress,
    onButtonEditCategoriesPress,
    onSelectRow: () => {},
    onRefresh,
  };
};
