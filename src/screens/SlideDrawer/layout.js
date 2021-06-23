import React from 'react';
import {
    View,
    Image
} from 'react-native';

import { Text, Button } from '@components';
import { ScaleSzie, localize } from '@utils';
import styles from './style';
import IMAGE from '@resources';

const dataDrawer = ['Home', 'Invoice', 'Settlement', 'Customer', 'Inventory', 'GiftCard', 'Reports', 'Setting', 'Support'];

export default class Layout extends React.Component {

    render() {
        const { language } = this.props;
        const activeItemKey = this.props?.activeItemKey || "Home";

        return (
            <View style={styles.container} >
                <View style={{ height: ScaleSzie(10) }} />
                {
                    dataDrawer.map((item, index) => <ItemDrawer
                        key={index}
                        title={localize(item, language)}
                        icon={item === activeItemKey ? IMAGE[`Se_${item}`] : IMAGE[item]}
                        onPress={() => this.changeLanguage(item)}
                        style={item === activeItemKey ? { fontWeight: "bold", color: "orange", fontSize: ScaleSzie(20) } : {}}
                    />)
                }
                <View style={{ height: ScaleSzie(10) }} />
            </View>

        );
    }
}

const ItemDrawer = ({ title, icon, onPress, style }) => {
    return (
        <Button onPress={() => onPress()} style={{
            flexDirection: 'row',
            alignItems: 'center', height: ScaleSzie(40)
        }} >
            <Image source={icon}
                style={{
                    width: ScaleSzie(22), height: ScaleSzie(22),
                    marginRight: ScaleSzie(23), marginLeft: ScaleSzie(18)
                }}
            />
            <Text style={[{ color: '#fff', fontSize: ScaleSzie(17) }, style]} >
                {title !== "GiftCard" ? title : "Gift Card"}
            </Text>
        </Button>
    );
}
