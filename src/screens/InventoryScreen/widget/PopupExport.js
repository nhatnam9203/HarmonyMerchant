import React from 'react';
import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    Platform,
    Image,
    TouchableOpacity,
    TextInput
} from 'react-native';

import { ButtonCustom, PopupParent, Button } from '@components';
import { scaleSzie, localize, getCategoryName } from '@utils';
import IMAGE from '@resources';

const { width } = Dimensions.get('window');

class PopupExport extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: 'Inventory',
            isExportAll: true
        }
    }

    exportFile = () => {
        this.props.exportFile();
    }

    render() {
        const { title, visible, onRequestClose, language } = this.props;
        const {isExportAll} = this.state;
        const temptIconRow2 = isExportAll ? IMAGE.radioExport : IMAGE.radioExportSe;
        const temptIconRow3 = isExportAll ? IMAGE.radioExportSe : IMAGE.radioExport;

        return (
            <PopupParent
                title={title}
                visible={visible}
                onRequestClose={() => onRequestClose()}
                style={{}}
                width={600}
            >
                <View style={{
                    height: scaleSzie(240), backgroundColor: '#fff',
                    borderBottomLeftRadius: scaleSzie(15),
                    borderBottomRightRadius: scaleSzie(15),
                    paddingHorizontal: scaleSzie(30),
                    paddingTop: scaleSzie(30)
                }} >
                    <View style={{ flex: 1, }} >
                        {/* --------- Row 1 ------- */}
                        <View style={{ flexDirection: 'row', height: scaleSzie(40) }} >
                            <View style={{ marginRight: scaleSzie(10), justifyContent: 'center' }} >
                                <Text style={{ color: '#404040', fontSize: scaleSzie(20) }} >
                                    Save as
                                </Text>
                            </View>
                            <View style={{ flex: 1, borderWidth: 1, borderColor: '#C5C5C5', paddingHorizontal: scaleSzie(10) }}>
                                <TextInput
                                    style={{ flex: 1, fontSize: scaleSzie(18), color: '#404040' }}
                                    value={this.state.value}
                                    onChangeText={value => this.setState({ value })}
                                />
                            </View>
                        </View>
                        {/* --------- Row 2 ------- */}
                        <View style={{ flexDirection: 'row', marginTop: scaleSzie(30) }} >
                            <Button onPress={() => this.setState({isExportAll:false})} style={{ width: scaleSzie(70), justifyContent: 'center', alignItems: 'center' }} >
                                <Image source={temptIconRow2} style={{ width: scaleSzie(25), height: scaleSzie(25) }} />
                            </Button>
                            <View style={{ flex: 1, justifyContent: 'center' }} >
                                <Text style={{ color: '#404040', fontSize: scaleSzie(20) }} >
                                    The products need to order more
                                </Text>
                            </View>
                        </View>
                        {/* --------- Row 3 ------- */}
                        <View style={{ flexDirection: 'row', marginTop: scaleSzie(15) }} >
                            <Button  onPress={() => this.setState({isExportAll:true})} style={{ width: scaleSzie(70), justifyContent: 'center', alignItems: 'center' }} >
                                <Image source={temptIconRow3} style={{ width: scaleSzie(25), height: scaleSzie(25) }} />
                            </Button>
                            <View style={{ flex: 1, justifyContent: 'center' }} >
                                <Text style={{ color: '#404040', fontSize: scaleSzie(20) }} >
                                    All product
                                </Text>
                            </View>
                        </View>
                        {/* --------- Button ------- */}
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                            <ButtonCustom
                                width={scaleSzie(120)}
                                height={40}
                                backgroundColor="#0764B0"
                                title={localize('Export', language)}
                                textColor="#fff"
                                onPress={this.exportFile}
                                style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                                styleText={{ fontSize: scaleSzie(18), fontWeight: 'normal' }}
                            />
                        </View>
                    </View>
                </View>
            </PopupParent>
        );
    }
}



const styles = StyleSheet.create({
})

export default PopupExport;

