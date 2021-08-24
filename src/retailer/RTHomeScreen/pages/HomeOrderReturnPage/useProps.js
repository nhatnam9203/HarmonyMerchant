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
      itemSelected?.filter((v) => v.productId !== checkItem.productId) || [];
    if (selected) {
      setItemSelected([...cloneList, checkItem]);
    } else {
      setItemSelected(cloneList);
    }
  };

  const updateQuantity = (itemQuantity, value) => {
    const originItem = _.find(_.get(item, 'products'), (originItem) => {
      return originItem.bookingProductId == itemQuantity.bookingProductId
    })

    //validate quantity update > original quantity
    if(value > _.get(originItem, 'quantity')){
      return
    }

    const updateList = _.map(itemSelected, updateItem => {
      let tempItem = updateItem
      if(_.get(updateItem, 'bookingProductId') == _.get(itemQuantity, 'bookingProductId')) {
        tempItem.total = (originItem.total/originItem.quantity) * value
        tempItem.quantity = value
      }
      return tempItem
    })

    setItemSelected(updateList)

    const updateListData = _.map(_.get(data, 'products'), itemTemp => {
      let temp = itemTemp
      if(_.get(itemTemp, 'bookingProductId') == _.get(itemQuantity, 'bookingProductId')) {
        temp.total = (originItem.total/originItem.quantity) * value
        temp.quantity = value
      }
      return temp
    })
    let tempData = data
    tempData.products = updateListData
    setData(tempData)
  }

  const updateTotal = (itemChange, value) => {
    const updateList = _.map(itemSelected, updateItem => {
      let tempItem = updateItem
      if(_.get(updateItem, 'bookingProductId') == _.get(itemChange, 'bookingProductId')) {
        tempItem.total = value
      }
      return tempItem
    })

    setItemSelected(updateList)

    const updateListData = _.map(_.get(data, 'products'), itemTemp => {
      let temp = itemTemp
      if(_.get(itemTemp, 'bookingProductId') == _.get(itemChange, 'bookingProductId')) {
        temp.total = value
      }
      return temp
    })
    let tempData = data
    tempData.products = updateListData
    setData(tempData)
  }

  return {
    goBack: () => {
      NavigationServices.goBack();
    },
    item: JSON.parse(JSON.stringify(data)),
    onHandleReturn: () => {
      if (itemSelected?.length > 0) {
        // const productIds = itemSelected.map((v) => v.bookingProductId);
        const params = _.map(itemSelected, itemTemp => {
          return {
            bookingId: _.get(itemTemp, 'bookingProductId'),
            amount: _.get(itemTemp, 'total'),
            quantity: _.get(itemTemp, 'quantity')
          }
        })
        returnAppointment(item?.appointmentId, {
          bookingProductIds: params,
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
