import React from "react";
import { useSelector } from "react-redux";
import _ from "lodash";

export const useIsPayment = () => {
  const blockAppointments = useSelector(
    (state) => state.appointment.blockAppointments
  );
  const groupAppointment = useSelector(
    (state) => state.appointment.groupAppointment
  );

  const [isPayment, setIsPayment] = React.useState(false);

  React.useEffect(() => {
    if (
      !_.isEmpty(groupAppointment) ||
      (blockAppointments && blockAppointments.length > 0)
    ) {
      setIsPayment(true);
    } else {
      setIsPayment(false);
    }
  }, [blockAppointments, groupAppointment]);

  return isPayment;
};
