import { getInfoFromModelNameOfPrinter, getReceiptItems } from "@utils";
import { useSelector } from "react-redux";

export const useProps = ({ appointment, invoice, groupAppointment }) => {
  const { profile, profileStaffLogin, printerList, printerSelect } =
    useSelector((state) => state.dataLocal) ?? {};

  const { portName, emulation, widthPaper } = getInfoFromModelNameOfPrinter(
    printerList,
    printerSelect
  );

  const { paymentMachineType } = useSelector((state) => state.hardware) ?? {};

  const getItems = () => {
    if (appointment) {
      return getReceiptItems(appointment);
    }

    if (groupAppointment) {
      let temps = [];
      groupAppointment.appointments?.forEach((app) => {
        temps.push(...getReceiptItems(appointment));
      });
      return temps;
    }

    if (invoice) {
      return getReceiptItems(invoice.basket);
    }
  };

  const getCustomer = () => {
    return null;
  };

  const getSymbol = () => {};

  return {
    portName,
    emulation,
    widthPaper,
    profile,
    profileStaffLogin,
    items: getItems(),
    customer: getCustomer(),
    machineType: paymentMachineType,
  };
};
