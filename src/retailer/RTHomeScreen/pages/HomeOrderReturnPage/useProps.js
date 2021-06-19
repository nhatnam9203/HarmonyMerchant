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

export const useProps = ({ params: { item } }) => {
  const [itemSelected, setItemSelected] = React.useState([]);
  const [notes, setNotes] = React.useState(null);

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

  return {
    goBack: () => {
      NavigationServices.goBack();
    },
    item,
    onHandleReturn: () => {
      if (itemSelected?.length > 0) {
        const productIds = itemSelected.map((v) => v.productId);
        returnAppointment(item?.appointmentId, {
          bookingProductIds: productIds,
          notes: notes,
        });
      }
    },
    onCheckedRow,
    itemSelected,
    setNotes,
  };
};
