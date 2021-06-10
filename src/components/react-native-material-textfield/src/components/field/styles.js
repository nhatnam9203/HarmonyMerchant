import { StyleSheet } from 'react-native';

import {scaleSize} from '../../../../../utils';

export default StyleSheet.create({
  inputContainer: {
    backgroundColor: 'transparent',
  },

  input: {
    padding: 0,
    margin: 0,
    flex: 1,
    color:"#000"
  },

  row: {
    flexDirection: 'row',
    // height:scaleSize(20),
    // flex:1,
    // backgroundColor:"red",
    paddingLeft:scaleSize(10)

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
