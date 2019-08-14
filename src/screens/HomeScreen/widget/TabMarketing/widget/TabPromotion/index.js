import { Alert, NativeModules } from 'react-native';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import NavigationServices from "@navigators/NavigatorServices";

const PosLink = NativeModules.MyApp;

class TabPromotion extends Layout {

  constructor(props) {
    super(props);
    this.state = {
      name: 'Phi'
    }
  }

  applyPromorion = () => {
    PosLink.setupPax('192.168.0.112', '10009', '60000', message => alert(message));
  }

  paymentCredit = () => {
    Alert.alert(
      `Alert Title`,
      `Transaction is processing,please wait...`,
      [
        {
          text: 'Cancel',
          onPress: () => PosLink.cancelTransaction(),
          style: 'cancel',
        },
      ],
      { cancelable: false },
    );
    PosLink.sendTransaction('20',this.callback)
  }

  callback(message) {
    try {
      // const p = JSON.parse(message);
      console.log('message : ',message);
    } catch (error) {
      console.log('error : ',error)
    }
   
  }

  callback1(message) {
    alert(message)
  }


  paymentCredit1 = () => {
    PosLink.sendTransaction(message => {
      Alert.alert(
        `Alert Title`,
        `${message}`,
        [
          {
            text: 'Cancel',
            onPress: () => PosLink.cancelTransaction(),
            style: 'cancel',
          },
        ],
        { cancelable: false },
      );
    }, messageEnd => alert(messageEnd));
  }

}

const mapStateToProps = state => ({
  profile: state.dataLocal.profile,
  language: state.dataLocal.language
})



export default connectRedux(mapStateToProps, TabPromotion);


