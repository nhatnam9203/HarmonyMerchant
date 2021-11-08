import { useDispatch } from "react-redux";

export const useProps = ({ navigation }) => {
  const dispatch = useDispatch();

  const openDrawer = () => {
    navigation.openDrawer();
  };

  return {
    openDrawer,
    navigation,
    handleLockScreen: () => {},
    // tabPermission: useSelector((state) => state.app?.staffLogtimeTabPermission),
    // togglePopupPermission: (bl) => {
    //   dispatch(actions.app.toggleStaffLogtimeTabPermission(bl ?? true));
    // },
  };
};
