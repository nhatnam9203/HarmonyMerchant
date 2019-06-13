import React from 'react';
import {
    View,
    Image,
    Dimensions
} from 'react-native';

import { scaleSzie } from '../../../../../../../utils';
import styles from '../style';
import IMAGE from '../../../../../../../resources';
import { Button, Text } from '../../../../../../../components';

const { width } = Dimensions.get('window');

class ItemPromo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isSelected: false,
            isShowContent: false
        }

    }

    selectCheckBox = () => {
        this.setState(prevState => ({
            isSelected: !prevState.isSelected
        }))
    }

    showContent = () => {
        this.setState(prevState => ({
            isShowContent: !prevState.isShowContent
        }))
    }

    render() {
        const { isSelected, isShowContent } = this.state;
        const { title,style} = this.props;
        const temptIconCheckBox = isSelected ? IMAGE.checkBox : IMAGE.checkBoxEmpty;
        return (
            <View style={[{ width: width, paddingHorizontal: scaleSzie(15) },style]} >
                <View style={{
                    paddingTop: scaleSzie(10), backgroundColor: '#fff',
                    borderRadius: scaleSzie(2)
                }} >
                    {/* ------- Header ------- */}
                    <View style={{
                        flexDirection: 'row',
                        paddingHorizontal: scaleSzie(10),
                    }} >
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: "center" }} >
                            <Button onPress={this.selectCheckBox} style={{ marginRight: scaleSzie(10) }} >
                                <Image
                                    source={temptIconCheckBox}
                                    style={{ width: scaleSzie(20), height: scaleSzie(20) }}
                                />
                            </Button>
                            <Text style={{ color: '#404040', fontSize: scaleSzie(14) }} >
                                {title}
                        </Text>
                        </View>
                        <Button onPress={this.showContent} style={{
                            width: scaleSzie(50), justifyContent: 'center',
                            alignItems: 'flex-end'
                        }} >{
                                isShowContent ? <Image source={IMAGE.sub} style={{ width: scaleSzie(18), height: scaleSzie(5) }} />
                                    :
                                    <Image source={IMAGE.plus} style={{ width: scaleSzie(18), height: scaleSzie(18) }} />
                            }

                        </Button>
                    </View>
                    {/* ------- Line ---- */}
                    <View style={{ height: scaleSzie(10), justifyContent: 'flex-end' }}  >
                        {
                            isShowContent ? <View style={{ height: 1, backgroundColor: '#A9A9A9' }} /> : <View />
                        }

                    </View>
                    {/* ------- Content ------- */}
                    {
                        isShowContent ? this.props.children : <View />
                    }
                </View>

            </View>
        );
    }

}

export default ItemPromo;

