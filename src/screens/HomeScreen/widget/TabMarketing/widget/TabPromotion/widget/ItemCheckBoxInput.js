import React from 'react';
import {
    View,
    Image,
} from 'react-native';

import { scaleSzie } from '@utils';
import styles from '../style';
import IMAGE from '@resources';
import { InputForm, Button } from '@components';

class ItemCheckBoxInput extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    selectCheckbox = () => {
        this.props.selectCheckbox();
    }

    render() {
        const { title, placeholder, isSelectCheckBox, value, onChangeText } = this.props;
        const temptIconCheckbox = isSelectCheckBox ? IMAGE.checkBox : IMAGE.checkBoxEmpty;
        return (
            <View style={{ height: scaleSzie(55), flexDirection: 'row', marginTop: scaleSzie(8) }} >
                <View style={{
                    justifyContent: 'flex-start', width: scaleSzie(80), paddingRight: scaleSzie(10),
                    alignItems: 'flex-end'
                }} >
                    <Button onPress={this.selectCheckbox} >
                        <Image source={temptIconCheckbox} style={{ width: scaleSzie(20), height: scaleSzie(20) }} />
                    </Button>
                </View>
                <View style={{
                    width: scaleSzie(180),
                }} >
                    <InputForm
                        title={title}
                        subTitle=""
                        placeholder={placeholder}
                        value={value}
                        onChangeText={(value) => onChangeText(value)}
                        style={{ marginBottom: scaleSzie(10) }}
                        isOnlyNumber={true}
                        editable={isSelectCheckBox}
                    />
                </View>
            </View>
        );
    }

}

export default ItemCheckBoxInput;