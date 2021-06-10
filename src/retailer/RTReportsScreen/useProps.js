export const useProps = ({ navigation }) => {
  const openDrawer = () => {
    navigation.openDrawer();
  };

  return { openDrawer };
};
