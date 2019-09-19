import React from 'react';
import {
    View,
    Image,
} from 'react-native';

import { scaleSzie,WorkingTime } from '@utils';
import styles from '../style';
import IMAGE from '@resources';
import { Button, Text,Dropdown } from '@components';

class ItemDropdown extends React.Component {

    constructor(props){
        super(props);
        this.state = {
        }

    }

    render(){
        const { title, width ,placeholder,value,onChangeText,dataDropdown} = this.props;
        const temptData = dataDropdown ? dataDropdown : WorkingTime;
        return(
            <View style={{ height: scaleSzie(30), flexDirection: 'row', marginTop: scaleSzie(8) }} >
            <View style={{
                justifyContent: 'center', width: scaleSzie(80), paddingRight: scaleSzie(10),
                alignItems: 'flex-end'
            }} >
                <Text style={styles.textNormal} >
                    {title}
                </Text>
            </View>

            <View style={{ width: scaleSzie(180)}} >
                <View style={{ height: scaleSzie(30), width: scaleSzie(width) }} >
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