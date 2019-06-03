import { StyleSheet } from 'react-native';

import {scaleSzie} from '../../../../../utils';

export default StyleSheet.create({
  inputContainer: {
    backgroundColor: 'transparent',
  },

  input: {
    // top: scaleSzie(-10),
    padding: 0,
    margin: 0,
    flex: 1,
  },

  row: {
    flexDirection: 'row',
  },

  flex: {
    flex: 1,
  },

  accessory: {
    top: 2,
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
});
