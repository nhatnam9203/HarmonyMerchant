import NavigationServices from "@navigators/NavigatorServices";
import React from "react";
import {
  useGetAppointment,
  useCancelAppointment,
  useConfirmAppointment,
  useShippingAppointment,
  useCompleteAppointment,
  useReturnAppointment,
  useEditNotes,
} from "@shared/services/api/retailer";
import {
  BIRTH_DAY_DATE_FORMAT_STRING,
  statusSuccess,
  dateToString,
} from "@shared/utils";
import _ from "lodash";

export const useProps = ({ params: { item } }) => {
  const [itemSelected, setItemSelected] = React.useState([]);
  const [notes, setNotes] = React.useState(null);
  const [data, setData] = React.useState(JSON.parse(JSON.stringify(item)));

  /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */
  const [appointmentReturn, returnAppointment] = useReturnAppointment();

  /**
  |--------------------------------------------------
  | USE EFFECT
  |--------------------------------------------------
  */

  React.useEffect(() => {
    const { codeStatus, message, data } = appointmentReturn || {};
    if (statusSuccess(codeStatus)) {
      NavigationServices.navigate("retailer.home.order.list", { reload: true });
    }
  }, [appointmentReturn]);

  const onCheckedRow = (checkItem, selected) => {
    const cloneList =
      itemSelected?.filter(
        (v) => v.bookingProductId !== checkItem.bookingProductId
      ) || [];
    if (selected) {
      setItemSelected([...cloneList, checkItem]);
    } else {
      setItemSelected(cloneList);
    }
  };

  const updateQuantity = (itemQuantity, value) => {
    const originItem = _.find(_.get(item, "products"), (originItem) => {
      return originItem.bookingProductId == itemQuantity.bookingProductId;
    });

    //validate quantity update > original quantity
    if (
      value >
      _.get(originItem, "quantity") - _.get(originItem, "returnQuantity", 0)
    ) {
      return;
    }

    const updateList = _.map(itemSelected, (updateItem) => {
      let tempItem = updateItem;
      if (
        _.get(updateItem, "bookingProductId") ==
        _.get(itemQuantity, "bookingProductId")
      ) {
        tempItem.returnAmount = parseFloat(
          (originItem.total / originItem.quantity) * value
        ).toFixed(2);
        tempItem.returnQuantity = value;
      }
      return tempItem;
    });

    setItemSelected(updateList);

    const updateListData = _.map(_.get(data, "products"), (itemTemp) => {
      let temp = itemTemp;
      if (
        _.get(itemTemp, "bookingProductId") ==
        _.get(itemQuantity, "bookingProductId")
      ) {
        temp.returnAmount = (originItem.total / originItem.quantity) * value;
        temp.returnQuantity = value;
      }
      return temp;
    });
    let tempData = data;
    tempData.products = updateListData;
    setData(tempData);
  };

  const updateTotal = (itemChange, value) => {
    const originItem = _.find(_.get(item, "products"), (originItem) => {
      return originItem.bookingProductId == itemChange.bookingProductId;
    });

    //validate amount update > original amount
    if (
      value >
      _.get(originItem, "total") - _.get(originItem, "returnAmount", 0)
    ) {
      return;
    }
    const updateList = _.map(itemSelected, (updateItem) => {
      let tempItem = updateItem;
      if (
        _.get(updateItem, "bookingProductId") ==
        _.get(itemChange, "bookingProductId")
      ) {
        tempItem.returnAmount = value;
      }
      return tempItem;
    });

    setItemSelected(updateList);

    const updateListData = _.map(_.get(data, "products"), (itemTemp) => {
      let temp = itemTemp;
      if (
        _.get(itemTemp, "bookingProductId") ==
        _.get(itemChange, "bookingProductId")
      ) {
        temp.returnAmount = value;
      }
      return temp;
    });
    let tempData = data;
    tempData.products = updateListData;
    setData(tempData);
  };

  return {
    goBack: () => {
      NavigationServices.goBack();
    },
    item: JSON.parse(JSON.stringify(data)),
    onHandleReturn: () => {
      if (itemSelected?.length > 0) {
        const filterList = _.filter(itemSelected, (temp) => {
          return (
            _.get(temp, "returnAmount") > 0 || _.get(temp, "returnQuantity") > 0
          );
        });
        const params = _.map(filterList, (itemTemp) => {
          return {
            bookingProductId: _.get(itemTemp, "bookingProductId"),
            total: _.get(itemTemp, "returnAmount"),
            quantity: _.get(itemTemp, "returnQuantity"),
          };
        });
        returnAppointment(item?.appointmentId, {
          orderReturns: params,
          notes: notes,
        });
      }
    },
    onCheckedRow,
    itemSelected,
    setNotes,
    updateQuantity,
    updateTotal,
  };
};
