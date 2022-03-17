import { useSelector } from "react-redux";
import { checkIsTablet, getInfoFromModelNameOfPrinter } from "@utils";

export const useProps = () => {
  const { profile, profileStaffLogin, printerList, printerSelect } =
    useSelector((state) => state.dataLocal) ?? {};

  const { portName, emulation, widthPaper } = getInfoFromModelNameOfPrinter(
    printerList,
    printerSelect
  );

  return { portName, emulation, widthPaper, profile, profileStaffLogin };
};
