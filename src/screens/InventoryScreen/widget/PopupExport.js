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
import { scaleSize, localize, getCategoryName } from '@utils';
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
                    height: scaleSize(240), backgroundColor: '#fff',
                    borderBottomLeftRadius: scaleSize(15),
                    borderBottomRightRadius: scaleSize(15),
                    paddingHorizontal: scaleSize(30),
                    paddingTop: scaleSize(30)
                }} >
                    <View style={{ flex: 1, }} >
                        {/* --------- Row 1 ------- */}
                        <View style={{ flexDirection: 'row', height: scaleSize(40) }} >
                            <View style={{ marginRight: scaleSize(10), justifyContent: 'center' }} >
                                <Text style={{ color: '#404040', fontSize: scaleSize(20) }} >

                                    {localize('Save as', language)}
                                </Text>
                            </View>
                            <View style={{ flex: 1, borderWidth: 1, borderColor: '#C5C5C5', paddingHorizontal: scaleSize(10) }}>
                                <TextInput
                                    style={{ flex: 1, fontSize: scaleSize(18), color: '#404040' }}
                                    value={this.state.value}
                                    onChangeText={value => this.setState({ value })}
                                />
                            </View>
                        </View>
                        {/* --------- Row 2 ------- */}
                        <View style={{ flexDirection: 'row', marginTop: scaleSize(30) }} >
                            <Button onPress={() => this.setState({isExportAll:false})} style={{ width: scaleSize(70), justifyContent: 'center', alignItems: 'center' }} >
                                <Image source={temptIconRow2} style={{ width: scaleSize(25), height: scaleSize(25) }} />
                            </Button>
                            <View style={{ flex: 1, justifyContent: 'center' }} >
                                <Text style={{ color: '#404040', fontSize: scaleSize(20) }} >

                                    {localize('The products need to order more', language)}
                                </Text>
                            </View>
                        </View>
                        {/* --------- Row 3 ------- */}
                        <View style={{ flexDirection: 'row', marginTop: scaleSize(15) }} >
                            <Button  onPress={() => this.setState({isExportAll:true})} style={{ width: scaleSize(70), justifyContent: 'center', alignItems: 'center' }} >
                                <Image source={temptIconRow3} style={{ width: scaleSize(25), height: scaleSize(25) }} />
                            </Button>
                            <View style={{ flex: 1, justifyContent: 'center' }} >
                                <Text style={{ color: '#404040', fontSize: scaleSize(20) }} >

                                    {localize('All product', language)}
                                </Text>
                            </View>
                        </View>
                        {/* --------- Button ------- */}
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                            <ButtonCustom
                                width={scaleSize(120)}
                                height={40}
                                backgroundColor="#0764B0"
                                title={localize('Export', language)}
                                textColor="#fff"
                                onPress={this.exportFile}
                                style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                                styleText={{ fontSize: scaleSize(18), fontWeight: 'normal' }}
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


