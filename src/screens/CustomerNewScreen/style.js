import { StyleSheet } from 'react-native';

import { scaleSize } from '@utils';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  borderStyle: {
    borderWidth: 1,
    borderColor: '#C5C5C5',
    borderRadius: scaleSize(4),
    backgroundColor: '#F1F1F1',
  },
  iconSearch: {
    width: scaleSize(22),
    height: scaleSize(22),
    resizeMode: 'contain',
  },
  inputSearch: { flex: 1, fontSize: scaleSize(17) },
  padRight: {
    paddingRight: scaleSize(8),
  },
  btnBorderStyle: {
    borderColor: '#C5C5C5',
    borderWidth: 1,
    borderRadius: scaleSize(4),
  },

  btnTextStyle: { fontSize: scaleSize(15), fontWeight: '500' },
});
