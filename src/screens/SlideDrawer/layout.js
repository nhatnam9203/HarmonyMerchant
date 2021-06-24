import React from 'react';
import {
    View,
    Image
} from 'react-native';

import { Text, Button } from '@components';
import { scaleSzie, localize } from '@utils';
import styles from './style';
import IMAGE from '@resources';

const dataDrawer = ['Home', 'Invoice', 'Settlement', 'Customer', 'Inventory', 'GiftCard', 'Reports', 'Setting', 'Support'];

export default class Layout extends React.Component {

    render() {
        const { language } = this.props;
        const activeItemKey = this.props?.activeItemKey || "Home";

        return (
            <View style={styles.container} >
                <View style={{ height: scaleSzie(10) }} />
                {
                    dataDrawer.map((item, index) => <ItemDrawer
                        key={index}
                        title={localize(item, language)}
                        icon={item === activeItemKey ? IMAGE[`Se_${item}`] : IMAGE[item]}
                        onPress={() => this.changeLanguage(item)}
                        style={item === activeItemKey ? { fontWeight: "bold", color: "orange", fontSize: scaleSzie(20) } : {}}
                    />)
                }
                <View style={{ height: scaleSzie(10) }} />
            </View>

        );
    }
}

const ItemDrawer = ({ title, icon, onPress, style }) => {
    return (
        <Button onPress={() => onPress()} style={{
            flexDirection: 'row',
            alignItems: 'center', height: scaleSzie(40)
        }} >
            <Image source={icon}
                style={{
                    width: scaleSzie(22), height: scaleSzie(22),
                    marginRight: scaleSzie(23), marginLeft: scaleSzie(18)
                }}
            />
            <Text style={[{ color: '#fff', fontSize: scaleSzie(17) }, style]} >
                {title !== "GiftCard" ? title : "Gift Card"}
            </Text>
        </Button>
    );
}
