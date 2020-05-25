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
    // backgroundColor:"red"
  },

  row: {
    flexDirection: 'row',
    // height:scaleSzie(20),
    // flex:1,
    // backgroundColor:"red",
    paddingLeft:scaleSzie(10)

  },

  flex: {
    flex: 1,
  },

  accessory: {
    top: 4,
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
});
