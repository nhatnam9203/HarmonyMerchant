import React from 'react';
import {
    View,
} from 'react-native';

import { ScaleSzie,WorkingTime } from '@utils';
import styles from '../style';
import { Text,Dropdown } from '@components';

class ItemDropdown extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        const { title, width ,placeholder,value,onChangeText,dataDropdown} = this.props;
        const temptData = dataDropdown ? dataDropdown : WorkingTime;
        return(
            <View style={{ height: ScaleSzie(30), flexDirection: 'row', marginTop: ScaleSzie(8) }} >
            <View style={{
                justifyContent: 'center', width: ScaleSzie(80), paddingRight: ScaleSzie(10),
                alignItems: 'flex-end'
            }} >
                <Text style={styles.textNormal} >
                    {title}
                </Text>
            </View>

            <View style={{ width: ScaleSzie(180)}} >
                <View style={{ height: ScaleSzie(30), width: ScaleSzie(width) }} >
                    <Dropdown
                        label={placeholder}
                        data={temptData}
                        value={value}
                        onChangeText={(value) => onChangeText(value)}
                        containerStyle={{
                            backgroundColor: '#F1F1F1',
                            borderWidth: 1,
                            borderColor: '#C5C5C5',
                            flex: 1
                        }}
                    />
                </View>
            </View>
        </View>
        );
    }

}


export default ItemDropdown;