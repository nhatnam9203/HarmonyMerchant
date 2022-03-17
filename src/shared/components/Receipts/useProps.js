import { useSelector } from "react-redux";

export const useProps = () => {
  const { profile, profileStaffLogin, printerList, printerSelect } =
    useSelector((state) => state.dataLocal) ?? {};
};
