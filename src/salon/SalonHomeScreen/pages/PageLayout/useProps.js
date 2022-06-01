export const useProps = ({ navigation }) => {
  return {
    navigation,
    openDrawer: () => {
      navigation.openDrawer();
    },
  };
};
