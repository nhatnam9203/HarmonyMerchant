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
import { ScaleSzie, localize, getCategoryName } from '@utils';
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
                    height: ScaleSzie(240), backgroundColor: '#fff',
                    borderBottomLeftRadius: ScaleSzie(15),
                    borderBottomRightRadius: ScaleSzie(15),
                    paddingHorizontal: ScaleSzie(30),
                    paddingTop: ScaleSzie(30)
                }} >
                    <View style={{ flex: 1, }} >
                        {/* --------- Row 1 ------- */}
                        <View style={{ flexDirection: 'row', height: ScaleSzie(40) }} >
                            <View style={{ marginRight: ScaleSzie(10), justifyContent: 'center' }} >
                                <Text style={{ color: '#404040', fontSize: ScaleSzie(20) }} >
                                    
                                    {localize('Save as', language)}
                                </Text>
                            </View>
                            <View style={{ flex: 1, borderWidth: 1, borderColor: '#C5C5C5', paddingHorizontal: ScaleSzie(10) }}>
                                <TextInput
                                    style={{ flex: 1, fontSize: ScaleSzie(18), color: '#404040' }}
                                    value={this.state.value}
                                    onChangeText={value => this.setState({ value })}
                                />
                            </View>
                        </View>
                        {/* --------- Row 2 ------- */}
                        <View style={{ flexDirection: 'row', marginTop: ScaleSzie(30) }} >
                            <Button onPress={() => this.setState({isExportAll:false})} style={{ width: ScaleSzie(70), justifyContent: 'center', alignItems: 'center' }} >
                                <Image source={temptIconRow2} style={{ width: ScaleSzie(25), height: ScaleSzie(25) }} />
                            </Button>
                            <View style={{ flex: 1, justifyContent: 'center' }} >
                                <Text style={{ color: '#404040', fontSize: ScaleSzie(20) }} >
                                    
                                    {localize('The products need to order more', language)}
                                </Text>
                            </View>
                        </View>
                        {/* --------- Row 3 ------- */}
                        <View style={{ flexDirection: 'row', marginTop: ScaleSzie(15) }} >
                            <Button  onPress={() => this.setState({isExportAll:true})} style={{ width: ScaleSzie(70), justifyContent: 'center', alignItems: 'center' }} >
                                <Image source={temptIconRow3} style={{ width: ScaleSzie(25), height: ScaleSzie(25) }} />
                            </Button>
                            <View style={{ flex: 1, justifyContent: 'center' }} >
                                <Text style={{ color: '#404040', fontSize: ScaleSzie(20) }} >
                                   
                                    {localize('All product', language)}
                                </Text>
                            </View>
                        </View>
                        {/* --------- Button ------- */}
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                            <ButtonCustom
                                width={ScaleSzie(120)}
                                height={40}
                                backgroundColor="#0764B0"
                                title={localize('Export', language)}
                                textColor="#fff"
                                onPress={this.exportFile}
                                style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                                styleText={{ fontSize: ScaleSzie(18), fontWeight: 'normal' }}
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


