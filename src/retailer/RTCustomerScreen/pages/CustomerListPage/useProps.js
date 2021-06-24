import React from 'react';
import {
  useGetCustomerList,
  useReportCustomer,
} from '@shared/services/api/retailer';
import {
  CustomerGroupTypes,
  SORT_TYPE,
  statusSuccess,
} from '@shared/utils/app';
import { createFilePath, getInfoPathFile } from '@shared/utils/files';
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
  const [files, setFiles] = React.useState('');
  const [typeExport, setTypeExport] = React.useState('');
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
      groupdId: groupType,
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
  const [reportCustomer, getReportCustomer] = useReportCustomer();
  const callGetReportCustomer = React.useCallback((values) => {
    const params = Object.assign({}, values, {
      quickFilter: 'thisWeek',
    });
    setTypeExport(values.type);
    getReportCustomer(params, true);
  }, []);

  const saveFilePath = async (url) => {
    let filePath = await createFilePath({
      fileName: 'Customer',
      extention: typeExport,
      url,
    });
    if (filePath) {
      let files = await getInfoPathFile(filePath);
      setFiles(files);
      exportRef.current.show();
    }
  };

  React.useEffect(() => {
    const { codeStatus, data } = reportCustomer || {};
    if (statusSuccess(codeStatus)) {
      saveFilePath(data);
    }
  }, [reportCustomer]);

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
    files,
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
    callGetReportCustomer,
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
