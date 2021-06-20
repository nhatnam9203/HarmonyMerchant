import React from "react";
import {
  useGetCustomer,
  useDeleteCustomer,
  useBlacklistCustomer,
  useEditAddress,
  useCreateAddress,
  useGetAppointmentByCustomer,
} from "@shared/services/api/retailer";
import { useTranslation } from "react-i18next";
import NavigationServices from "@navigators/NavigatorServices";
import { VIP_TYPE } from "@shared/utils";
import { useFocusEffect } from "@react-navigation/native";
import {
  BIRTH_DAY_DATE_FORMAT_STRING,
  statusSuccess,
  dateToString,
} from "@shared/utils";

export const useProps = ({ params: { item, reload, customerId } }) => {
  const [t] = useTranslation();

  const [customerItem, setCustomer] = React.useState(item);
  const [orders, setOrders] = React.useState(null);
  /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */
  const [customer, getCustomer] = useGetCustomer();
  const [, deleteCustomer] = useDeleteCustomer(() => {
    NavigationServices.navigate("retailer.customer.list", { reload: true });
  });
  const [customerBlacklist, blacklistCustomer] = useBlacklistCustomer();
  const [appointmentByCustomer, getAppointmentByCustomer] =
    useGetAppointmentByCustomer();
  /**
  |--------------------------------------------------
  | USE EFFECT
  |--------------------------------------------------
  */

  useFocusEffect(
    React.useCallback(() => {
      if (customerItem || customerId || item)
        getCustomer(customerItem?.id ?? customerId ?? item?.customerId);
    }, [reload, item, customerId])
  );

  React.useEffect(() => {
    if (customer?.data) {
      setCustomer(customer?.data);
      getAppointmentByCustomer(customer?.data?.customerId);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer]);

  React.useEffect(() => {
    if (customerBlacklist) {
      getCustomer(customerItem?.customerId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerBlacklist]);

  React.useEffect(() => {
    const { codeStatus, message, data } = appointmentByCustomer || {};
    if (statusSuccess(codeStatus)) {
      setOrders(data);
    }
  }, [appointmentByCustomer]);

  return {
    customer: customerItem,
    onEditAddress: (itemAddress) => {
      NavigationServices.navigate("retailer.customer.address", {
        item: itemAddress,
        isEdit: true,
        customerId: customerItem?.customerId,
      });
    },
    onEditRow: () => {},
    onGoBack: () => {
      NavigationServices.navigate("retailer.customer.list", {
        reload: true,
      });
    },
    onEditCustomer: () => {
      NavigationServices.navigate("retailer.customer.edit", {
        isEdit: true,
        item: customerItem,
      });
    },
    onChangeValueSearch: () => {},
    onButtonSearchPress: () => {},
    onButtonNewOrderPress: () => {},
    onEditBillingAddress: () => {
      NavigationServices.navigate("retailer.customer.address", {
        item: customerItem?.defaultBillingAddress,
        customerId: customerItem?.customerId,
        isEdit: true,
      });
    },
    onEditShippingAddress: () => {
      NavigationServices.navigate("retailer.customer.address", {
        item: customerItem?.defaultShippingAddress,
        customerId: customerItem?.customerId,
        isEdit: true,
      });
    },
    onNewCustomerAddress: () => {
      NavigationServices.navigate("retailer.customer.address", {
        customerId: customerItem?.customerId,
        isNew: true,
      });
    },
    onDeleteCustomer: () => {
      deleteCustomer(customerItem?.customerId);
    },
    onBlacklistCustomer: () => {
      if (customerItem?.isVip === VIP_TYPE.BLACK_LIST) {
        blacklistCustomer(customerItem.customerId, "remove-blacklist");
      } else {
        blacklistCustomer(customerItem.customerId, "add-blacklist");
      }
    },
    orders
  };
};
