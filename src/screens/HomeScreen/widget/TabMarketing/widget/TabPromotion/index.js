import {NativeModules} from 'react-native';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import NavigationServices from "@navigators/NavigatorServices";

const PosLink = NativeModules.MyApp;

class TabPromotion extends Layout {

    constructor(props) {
        super(props);
    }

    applyPromorion =() =>{
        PosLink.getSomething('192.168.0.112','10009',message => alert(message));
    }

}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
    language: state.dataLocal.language
})



export default connectRedux(mapStateToProps, TabPromotion);