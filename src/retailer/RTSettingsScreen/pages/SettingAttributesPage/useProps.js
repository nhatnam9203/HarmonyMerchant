import React from 'react';
import {
  useGetAttributesList,
  useDeleteAttributes,
} from '@shared/services/api/retailer';
import { SORT_TYPE } from '@shared/utils/app';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import NavigationServices from '@navigators/NavigatorServices';

export const useProps = ({ params: { reload }, reloadPage }) => {
  const [t] = useTranslation();
  const [searchVal, setSearchVal] = React.useState();
  const [sortLabel, setSortLabel] = React.useState(SORT_TYPE.ASC);
  const [page, setPage] = React.useState(1);

  /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */
  const [attributesList, getAttributesList] = useGetAttributesList();
  const callGetAttributesList = React.useCallback(() => {
    getAttributesList({
      key: searchVal ?? '',
      page: page,
      sort: { label: sortLabel },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortLabel, searchVal]);

  const [, deleteAttributes] = useDeleteAttributes(() => {
    callGetAttributesList();
  });

  React.useEffect(() => {
    callGetAttributesList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (reload || reloadPage) callGetAttributesList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload, reloadPage]);

  React.useEffect(() => {
    callGetAttributesList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortLabel, searchVal]);

  const onSortWithKey = (sortKey) => {
    switch (sortKey) {
      case 'label':
        const sorted =
          sortLabel === SORT_TYPE.ASC ? SORT_TYPE.DESC : SORT_TYPE.ASC;
        setSortLabel(sorted);
        break;

      default:
        break;
    }
  };

  const onChangeValueSearch = (text) => {
    if (text) {
      setSearchVal(text);
    }
  };

  const onButtonSearchPress = () => {
    callGetAttributesList();
  };

  const onButtonNewAttributePress = () => {
    NavigationServices.navigate('retailer.settings.attributes.new', {
      isNew: true,
    });
  };
  const onButtonEditAttributePress = (item) => {
    NavigationServices.navigate('retailer.settings.attributes.new', {
      isEdit: true,
      item,
    });
  };
  const onButtonDeleteAttributePress = (item) => {
    if (!item) return;
    deleteAttributes(item.id);
  };

  return {
    items: attributesList?.data,
    sortLabel,
    onSortWithKey,
    onChangeValueSearch,
    onButtonSearchPress,
    onButtonNewAttributePress,
    onButtonEditAttributePress,
    onButtonDeleteAttributePress,
    onSelectRow: () => {},
  };
};
