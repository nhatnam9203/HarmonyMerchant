export const useProps = ({ navigation }) => {
  return {
    navigation,
    openDrawer: () => {
      navigation.openDrawer();
    },
    onChangeTab: (routeName) => {
      console.log(routeName);
    },
  };
};
