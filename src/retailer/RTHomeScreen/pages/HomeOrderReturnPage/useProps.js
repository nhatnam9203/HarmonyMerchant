import NavigationServices from "@navigators/NavigatorServices";
import { useReturnAppointment } from "@shared/services/api/retailer";
import { statusSuccess } from "@shared/utils";
import _ from "lodash";
import React from "react";

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

  const updateQuantity = (itemQuantity, value) => {
    let originItem = null;
    if (itemQuantity?.bookingProductId) {
      originItem = _.find(_.get(item, "products"), (originItem) => {
        return originItem.bookingProductId == itemQuantity.bookingProductId;
      });
    } else if (itemQuantity?.bookingGiftCardId) {
      originItem = _.find(_.get(item, "giftCards"), (originItem) => {
        return originItem.bookingGiftCardId == itemQuantity.bookingGiftCardId;
      });
    }

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
        (itemQuantity?.bookingProductId &&
          tempItem?.bookingProductId === itemQuantity.bookingProductId) ||
        (itemQuantity?.bookingGiftCardId &&
          tempItem?.bookingGiftCardId === itemQuantity.bookingGiftCardId)
      ) {
        let returnAmount = (originItem.total / originItem.quantity) * value;

        if (
          originItem.returnQuantity + parseInt(value) ===
          originItem.quantity
        ) {
          returnAmount = originItem.total - originItem.returnAmount;
        }

        tempItem.returnAmount = parseFloat(returnAmount).toFixed(2);
        tempItem.returnQuantity = value;
      }
      return tempItem;
    });

    setItemSelected(updateList);

    let updateListData = null;
    if (itemQuantity?.bookingProductId) {
      updateListData = _.map(_.get(data, "products"), (itemTemp) => {
        let temp = itemTemp;
        if (
          itemQuantity?.bookingProductId &&
          temp?.bookingProductId === itemQuantity.bookingProductId
        ) {
          temp.returnAmount = (originItem.total / originItem.quantity) * value;
          temp.returnQuantity = value;
        }
        return temp;
      });

      let tempData = data;
      tempData.products = updateListData;
      setData(tempData);
    }

    if (itemQuantity?.bookingGiftCardId) {
      updateListData = _.map(_.get(data, "giftCards"), (itemTemp) => {
        let temp = itemTemp;
        if (
          itemQuantity?.bookingGiftCardId &&
          temp?.bookingGiftCardId === itemQuantity.bookingGiftCardId
        ) {
          temp.returnAmount = (originItem.total / originItem.quantity) * value;
          temp.returnQuantity = value;
        }
        return temp;
      });

      let tempData = data;
      tempData.giftCards = updateListData;
      setData(tempData);
    }
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
        (itemChange?.bookingProductId &&
          tempItem?.bookingProductId === itemChange.bookingProductId) ||
        (itemChange?.bookingGiftCardId &&
          tempItem?.bookingGiftCardId === itemChange.bookingGiftCardId)
      ) {
        tempItem.returnAmount = value;
      }
      return tempItem;
    });

    setItemSelected(updateList);

    let updateListData = null;
    if (itemTemp?.bookingProductId) {
      updateListData = _.map(_.get(data, "products"), (itemTemp) => {
        let temp = itemTemp;
        if (
          itemQuantity?.bookingProductId &&
          temp?.bookingProductId === itemQuantity.bookingProductId
        ) {
          temp.returnAmount = value;
        }
        return temp;
      });

      let tempData = data;
      tempData.products = updateListData;
      setData(tempData);
    }

    if (itemTemp?.bookingGiftCardId) {
      updateListData = _.map(_.get(data, "giftCards"), (itemTemp) => {
        let temp = itemTemp;
        if (
          itemQuantity?.bookingGiftCardId &&
          temp?.bookingGiftCardId === itemQuantity.bookingGiftCardId
        ) {
          temp.returnAmount = value;
        }
        return temp;
      });

      let tempData = data;
      tempData.giftCards = updateListData;
      setData(tempData);
    }
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

        const params = filterList
          ?.filter((x) => x.bookingProductId)
          .map((itemTemp) => {
            return {
              bookingProductId: _.get(itemTemp, "bookingProductId"),
              total: _.get(itemTemp, "returnAmount"),
              quantity: _.get(itemTemp, "returnQuantity"),
            };
          });

        const giftCards = filterList
          ?.filter((x) => x.bookingGiftCardId)
          .map((x) => x.bookingGiftCardId);

        returnAppointment(item?.appointmentId, {
          orderReturns: params?.length > 0 ? params : [],
          bookingGiftCardIds: giftCards?.length > 0 ? giftCards : [],
          notes: notes,
        });
      }
    },
    onCheckedRow: (checkItem, selected) => {

      let cloneList = [];
      if (checkItem?.bookingProductId) {
        cloneList =
          itemSelected?.filter(
            (v) => v.bookingProductId !== checkItem.bookingProductId
          ) || [];
      }

      if (checkItem?.bookingGiftCardId) {
        cloneList =
          itemSelected?.filter(
            (v) => v.bookingGiftCardId !== checkItem.bookingGiftCardId
          ) || [];
      }

      if (selected) {
        setItemSelected([...cloneList, checkItem]);
      } else {
        setItemSelected(cloneList);
      }
    },
    itemSelected,
    setNotes,
    updateQuantity,
    updateTotal,
  };
};
