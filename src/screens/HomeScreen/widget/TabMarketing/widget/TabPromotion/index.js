import {NativeModules} from 'react-native';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import NavigationServices from "@navigators/NavigatorServices";

const PosLink = NativeModules.PosLink;

class TabPromotion extends Layout {

    constructor(props) {
        super(props);
    }

    applyPromorion =() =>{
        PosLink.getSomething(message => alert(message));
    }

}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
    language: state.dataLocal.language
})



export default connectRedux(mapStateToProps, TabPromotion);