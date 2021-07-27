import actions from "@actions";
import { useGetCategoriesList } from "@shared/services/api/retailer";
import { useDispatch, useSelector } from "react-redux";

export const useProps = ({ navigation }) => {
  const dispatch = useDispatch();

  /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */
  const [, getCategoriesList] = useGetCategoriesList();

  const openDrawer = () => {
    navigation.openDrawer();
  };

  return {
    openDrawer,
    navigation,
    tabPermission: useSelector(
      (state) => state.product?.inventoryTabPermission
    ),
    togglePopupPermission: (bl) => {
      dispatch(actions.product.toggleProductTabPermission(bl ?? true));
    },
  };
};
