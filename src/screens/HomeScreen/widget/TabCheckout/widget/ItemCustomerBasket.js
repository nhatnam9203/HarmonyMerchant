import React from 'react';
import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    Platform,
    Image,
    TouchableOpacity
} from 'react-native';

import { ButtonCustom, PopupParent, Button } from '@components';
import { scaleSzie, localize, getCategoryName, formatMoney } from '@utils';
import IMAGE from '@resources';

const { width } = Dimensions.get('window');

class ItemCustomerBasket extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    // ---------- Render --------

    renderHeaderCustomerBaket(){
        return(
            <View style={{height:scaleSzie(35),backgroundColor:"#0764B0"}} >

            </View>
        );
    }

    render() {
        const {} = this.props;
        return (
            <View>
                {this.renderHeaderCustomerBaket()}
            </View>
        );
    }
}



const styles = StyleSheet.create({
    
})

export default ItemCustomerBasket;


