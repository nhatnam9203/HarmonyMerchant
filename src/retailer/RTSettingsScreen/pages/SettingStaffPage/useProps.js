import React from 'react';
import {
  useGetAttributesList,
  useDeleteAttributes,
} from '@shared/services/api/retailer';
import { SORT_TYPE } from '@shared/utils/app';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import NavigationServices from '@navigators/NavigatorServices';
import { useFocusEffect } from '@react-navigation/native';
import { getStaffByMerchantId } from '@redux/actions/staff';

const INITIAL_VALUE_SEARCH = {
  keySearch: '',
  role: '',
  status: '',
};

export const useProps = (props) => {
  const dispatch = useDispatch();

  const listStaffByMerchant = useSelector(
    (state) => state.staff.listStaffByMerchant
  );

  const isShowSearchStaff = useSelector(
    (state) => state.staff.isShowSearchStaff
  );

  const listSearchStaff = useSelector((state) => state.staff.listSearchStaff);

  const [searchFilter, setSearchFilter] = React.useState({
    INITIAL_VALUE_SEARCH,
  });
  const [sortLabel, setSortLabel] = React.useState(SORT_TYPE.ASC);

  const onChangeValueSearch = async (key, value, keyParent = '') => {
    if (keyParent !== '') {
      const temptParent = searchFilter[keyParent];
      const temptChild = { ...temptParent, [key]: value };
      const temptUpdate = { ...searchFilter, [keyParent]: temptChild };
      await setSearchFilter(temptUpdate);
    } else {
      const temptUpdate = { ...searchFilter, [key]: value };
      await setSearchFilter(temptUpdate);
    }
    // if (key !== 'keySearch') {
    //   setTimeout(() => {
    //     searchStaff();
    //   }, 100);
    // } else {
    //   if (value === '') {
    //     searchStaff();
    //   }
    // }
  };

  const onSortWithKey = (sortKey) => {
    switch (sortKey) {
      case 'displayName':
        const sorted =
          sortLabel === SORT_TYPE.ASC ? SORT_TYPE.DESC : SORT_TYPE.ASC;
        setSortLabel(sorted);
        break;

      default:
        break;
    }
  };

  const getStaffListByMerchant = () => {
    dispatch(getStaffByMerchantId('', '', '', false, false));
  };

  onButtonSearchPress = (isShowLoading = true) => {
    const { keySearch, role, status } = searchFilter;
    const sort = { displayName: sortLabel };
    dispatch(
      getStaffByMerchantId(
        keySearch,
        role,
        status,
        searchFilter,
        isShowLoading,
        sort
      )
    );
  };

  const onButtonNewStaffPress = () => {
    NavigationServices.navigate('retailer.settings.staffs.new', {
      isNew: true,
    });
  };
  const onButtonEditStaffPress = (item) => {
    NavigationServices.navigate('retailer.settings.staffs.new', {
      isEdit: true,
      item,
    });
  };

  React.useEffect(() => {
    getStaffListByMerchant();
  }, []);

  React.useEffect(() => {
    onButtonSearchPress();
  }, [sortLabel]);

  return {
    items: isShowSearchStaff ? listSearchStaff : listStaffByMerchant,
    onChangeValueSearch,
    onButtonSearchPress,
    getStaffListByMerchant,
    onButtonNewStaffPress,
    onButtonEditStaffPress,
    onSortWithKey,
    sortLabel,
  };
};
