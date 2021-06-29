import React from 'react';
import {
  useGetCustomerList,
  useExportCustomer,
} from '@shared/services/api/retailer';
import {
  CustomerGroupTypes,
  SORT_TYPE,
  statusSuccess,
} from '@shared/utils/app';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import NavigationServices from '@navigators/NavigatorServices';
import { useFocusEffect } from '@react-navigation/native';

const log = (obj, message = '') => {
  Logger.log(`[CustomerListPage] ${message}`, obj);
};

/**
 * reload: call api lai khi truyen them reload
 */
export const useProps = ({ params: { reload }, navigation }) => {
  const [t] = useTranslation();
  const exportRef = React.useRef();
  const [groupType, setGroupType] = React.useState(CustomerGroupTypes[0].value);
  const [page, setPage] = React.useState(1);
  const [sortName, setSortName] = React.useState(SORT_TYPE.ASC);
  const [sortPhoneNumber, setSortPhoneNumber] = React.useState(SORT_TYPE.DESC);
  const [searchVal, setSearchVal] = React.useState();
  /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */
  const [customerList, getCustomerList] = useGetCustomerList();
  const callGetCustomerList = React.useCallback(() => {
    getCustomerList({
      key: searchVal ?? '',
      page: page,
      groupId: groupType,
      sort: { CustomerName: sortName, PhoneNumber: sortPhoneNumber },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupType, page, sortName, sortPhoneNumber, searchVal]);

  React.useEffect(() => {
    callGetCustomerList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (reload) callGetCustomerList();
    }, [reload])
  );

  React.useEffect(() => {
    callGetCustomerList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupType, sortName, sortPhoneNumber, searchVal]);

  /**
  |--------------------------------------------------
  |  API EXPORT
  |--------------------------------------------------
  */
  const [customerExport, ExportCustomer] = useExportCustomer();
  const callExportCustomer = (values) => {
    const params = Object.assign({}, values, {
      quickFilter: 'thisMonth',
      key: searchVal ?? '',
      page: page,
      groupId: groupType,
      sort: { CustomerName: sortName, PhoneNumber: sortPhoneNumber },
    });
    ExportCustomer(params);
  };

  React.useEffect(() => {
    const { codeStatus, data } = customerExport || {};
    if (statusSuccess(codeStatus)) {
      exportRef.current?.onCreateFile(data);
    }
  }, [customerExport]);

  const getCustomerGroupLabel = (value) => {
    const group = CustomerGroupTypes.find((x) => x.value === value);
    return t(group?.label) || 'None';
  };

  const onRefresh = () => {
    callGetCustomerList();
  };

  const onSortWithKey = (sortKey) => {
    switch (sortKey) {
      case 'customerName':
        const sortedName =
          sortName === SORT_TYPE.ASC ? SORT_TYPE.DESC : SORT_TYPE.ASC;
        setSortName(sortedName);
        break;
      case 'phone':
        const sortedPhone =
          sortName === SORT_TYPE.ASC ? SORT_TYPE.DESC : SORT_TYPE.ASC;
        setSortPhoneNumber(sortedPhone);
        break;
      default:
        break;
    }
  };

  const onChangeValueSearch = (text) => {
    setSearchVal(text);
  };

  const onButtonSearchPress = () => {
    callGetCustomerList();
  };

  const onButtonNewCustomerPress = () => {
    NavigationServices.navigate('retailer.customer.edit', {
      isNew: true,
    });
  };

  return {
    items: customerList?.data,
    groupType,
    exportRef,
    setGroupType,
    customerGroups: CustomerGroupTypes,
    getCustomerGroupLabel,
    sortName,
    sortPhoneNumber,
    onSortWithKey,
    onChangeValueSearch,
    onButtonSearchPress,
    onButtonNewCustomerPress,
    onRefresh,
    callExportCustomer,
    onSelectRow: ({ item }) => {
      NavigationServices.navigate('retailer.customer.detail', {
        item: item,
      });
    },
    onEditCustomer: (item) => {
      NavigationServices.navigate('retailer.customer.edit', {
        item,
        isEdit: true,
      });
    },
  };
};
