import React from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    Alert,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

import ButtonCustom from './ButtonCustom';
import PopupParent from './PopupParent';
import { Dropdown } from './react-native-material-dropdown';
import BrowserFile from './BrowserFile';
import { scaleSzie } from '@utils';
import connectRedux from '@redux/ConnectRedux';

class PopupEditAddExtra extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            extraInfo: {
                name: "",
                description: "",
                duration: '',
                price: '',
                isDisable: 'Active'
            },
            fileId: 0,
            imageUrl: '',
            isSubmitButton: true
        }

        this.durationRef = React.createRef();
        this.scrollExtraRef = React.createRef();
    }

    setStateDefaultFromParent = async () => {
        await this.setState({
            extraInfo: {
                name: "",
                description: "",
                duration: '',
                price: '',
                isDisable: 'Active'
            },
            fileId: 0,
            imageUrl: ''
        })
    }

    setExtraFromParent = async (extra) => {
        await this.setState({
            extraInfo: { ...extra, isDisable: extra.isDisabled === 0 ? 'Active' : 'Disable' },
            imageUrl: extra.imageUrl,
            fileId: 0,
        })
    }

    updateExtraInfo(key, value, keyParent = '') {
        const { extraInfo } = this.state;
        if (keyParent !== '') {
            const temptParent = extraInfo[keyParent];
            const temptChild = { ...temptParent, [key]: value };
            const temptUpdate = { ...extraInfo, [keyParent]: temptChild };
            this.setState({
                extraInfo: temptUpdate
            })
        } else {
            const temptUpdate = { ...extraInfo, [key]: value };
            this.setState({
                extraInfo: temptUpdate
            })
        }
    }

    doneAddExtra = () => {
        const { extraInfo } = this.state;
        const temptExtraInfo = {
            ...extraInfo, duration: this.durationRef.current.state.value,
            isDisable: extraInfo.isDisable === 'Active' ? 0 : 1
        };
        const arrayKey = Object.keys(temptExtraInfo);
        let keyError = "";
        for (let i = 0; i < arrayKey.length; i++) {
            if (arrayKey[i] === 'description') {
                continue;
            } else if (temptExtraInfo[arrayKey[i]] === '' && arrayKey[i] !== 'imageUrl') {
                keyError = arrayKey[i];
                break;
            }
        }

        if (keyError != "") {
        //console.log('keyError:',keyError);
            Alert.alert(`${strings[keyError]}`);
        } else {
            if (this.props.isEdit) {
                this.props.editExtra({
                    ...temptExtraInfo, isDisabled: temptExtraInfo.isDisable,
                    fileId: this.state.fileId
                });
            } else {
                this.props.doneAddExtra({
                    ...temptExtraInfo, isDisabled: temptExtraInfo.isDisable,
                    fileId: this.state.fileId
                });
            }

        }
    }

    updateFileId = async (fileId) => {
        await this.setState({
            fileId
        })
    }

    onRequestClose = async () => {
        await this.setState({
            fileId: 0
        });
        this.props.onRequestClose();
    }

    editButtonSubmit = async (isSubmit) => {
        await this.setState({
            isSubmitButton: isSubmit
        })
    }

    scrollExtraTo(position){
        this.scrollExtraRef.current.scrollTo({x: 0, y: scaleSzie(position), animated: true})
    }


    // -------- Render -------

    renderButtonSubmit() {
        const { isEdit,loading } = this.props;
        const { isSubmitButton } = this.state;
        const temptTitleButton = isEdit ? 'Save' : 'Done';
        if (!loading) {
            return (
                <ButtonCustom
                    width={150}
                    height={35}
                    backgroundColor="#0764B0"
                    title={temptTitleButton}
                    textColor="#fff"
                    onPress={this.doneAddExtra}
                    style={{ borderRadius: scaleSzie(2) }}
                    styleText={{
                        fontSize: scaleSzie(14)
                    }}
                />
            );
        } else {
            return (
                <View style={{
                    width: 150, height: scaleSzie(35), backgroundColor: '#0764B0',
                    borderRadius: scaleSzie(2), justifyContent: 'center', alignItems: 'center'
                }} >
                    < ActivityIndicator
                        size="large"
                        color="#fff"
                    />
                </View>
            );
        }

    }

    render() {
        const { title, visible, onRequestClose, isEdit } = this.props;
        const { name, description, price, isDisable } = this.state.extraInfo;
        return (
            <PopupParent
                title={title}
                visible={visible}
                onRequestClose={this.onRequestClose}
                style={{ justifyContent: 'flex-start', paddingTop: scaleSzie(20) }}
            >
                <View style={{
                    height: scaleSzie(480), backgroundColor: '#fff',
                    borderBottomLeftRadius: scaleSzie(15), borderBottomRightRadius: scaleSzie(15),
                    paddingHorizontal: scaleSzie(30)
                }} >
                    <View style={{ flex: 1, }} >
                        <ScrollView
                            ref={this.scrollExtraRef}
                            showsVerticalScrollIndicator={false}
                        >
                            <TouchableOpacity activeOpacity={1}>
                                {/* ------ Extra ---- */}
                                <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(10), marginTop: scaleSzie(20) }} >
                                    Extra name *
                            </Text>
                                <View style={{
                                    height: scaleSzie(30), borderWidth: 1, borderColor: '#C5C5C5',
                                    paddingLeft: scaleSzie(10),
                                }} >
                                    <TextInput
                                        placeholder="Extra name"
                                        style={{ flex: 1, fontSize: scaleSzie(16) }}
                                        value={name}
                                        onChangeText={(value) => this.updateExtraInfo('name', value)}
                                    />
                                </View>
                                <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(10), marginTop: scaleSzie(7) }} >
                                    Description
                            </Text>
                                <View style={{
                                    height: scaleSzie(60), borderWidth: 1, borderColor: '#C5C5C5',
                                    paddingLeft: scaleSzie(10), backgroundColor: '#FAFAFA', paddingTop: scaleSzie(5)
                                }} >
                                    <TextInput
                                        placeholder=""
                                        style={{ flex: 1, fontSize: scaleSzie(16) }}
                                        multiline={true}
                                        value={description}
                                        onChangeText={value => this.updateExtraInfo('description', value)}
                                        onFocus={() =>this.scrollExtraTo(80)}
                                    />
                                </View>
                                {/* -------------------------- */}
                                <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(10), marginTop: scaleSzie(7) }} >
                                    Duration
                            </Text>
                                <ItemTime
                                    ref={this.durationRef}
                                    title="Minutes *"
                                    value={this.state.extraInfo.duration}
                                    onFocus={() =>this.scrollExtraTo(200)}
                                />
                                <View style={{ height: scaleSzie(70), flexDirection: 'row',marginTop:scaleSzie(6) }} >
                                    <View style={{ flex: 1, paddingRight: scaleSzie(50) }}  >
                                        <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(10), marginTop: scaleSzie(7) }} >
                                            Price *
                                    </Text>
                                        <View style={{
                                            height: scaleSzie(30), paddingHorizontal: scaleSzie(5),
                                            borderWidth: 1, borderColor: '#C5C5C5', flexDirection: 'row'
                                        }} >
                                            <TextInputMask
                                                // type="only-numbers"
                                                type={'money'}
                                                options={{
                                                    precision: 2,
                                                    separator: '.',
                                                    delimiter: ',',
                                                    unit: '',
                                                    suffixUnit: ''
                                                }}
                                                style={{ flex: 1, fontSize: scaleSzie(16) }}
                                                placeholder="$ 100"
                                                value={price}
                                                onChangeText={value => this.updateExtraInfo('price', value)}
                                                onFocus={() =>this.scrollExtraTo(265)}
                                            />
                                        </View>
                                    </View>
                                    {/* ------ */}
                                    <View>
                                        <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(10), marginTop: scaleSzie(7) }} >
                                            Status *
                                    </Text>
                                        <View style={{
                                            height: scaleSzie(30), width: scaleSzie(90),
                                            flexDirection: 'row'
                                        }} >
                                            <Dropdown
                                                label='Active'
                                                data={[{ value: 'Active' }, { value: 'Disable' }]}
                                                value={isDisable}
                                                onChangeText={(value) => this.updateExtraInfo('isDisable', value)}
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
                                {/* ------- Upload Image ----- */}
                                <BrowserFile
                                    updateFileId={this.updateFileId}
                                    imageUrl={this.state.imageUrl}
                                    editButtonSubmit={this.editButtonSubmit}
                                />
                                <View style={{ height: scaleSzie(250) }} />
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                    {/* ---- Footer ---- */}
                    <View style={{ height: scaleSzie(50), alignItems: 'center' }} >
                        {this.renderButtonSubmit()}
                    </View>
                </View>
            </PopupParent>
        );
    }

}

class ItemTime extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value
        }
    }

    render() {
        const { title ,onFocus} = this.props;
        const { value } = this.state;
        return (
            <View>
                <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(10), marginTop: scaleSzie(7) }} >
                    {title}
                </Text>
                <View style={{
                    height: scaleSzie(30), width: scaleSzie(90),
                    borderWidth: 1, borderColor: '#C5C5C5', flexDirection: 'row'
                }} >
                    <View style={{ flex: 1, paddingLeft: scaleSzie(5) }} >
                        <TextInputMask
                            type="only-numbers"
                            placeholder='10'
                            style={{ flex: 1, fontSize: scaleSzie(16) }}
                            value={value}
                            onChangeText={(value) => this.setState({ value })}
                            onFocus={() => onFocus()}
                        />
                    </View>
                    <View style={{ justifyContent: 'flex-end', paddingRight: 4 }} >
                        <Text style={{ color: '#C5C5C5', fontSize: scaleSzie(14) }} >
                            min
                </Text>
                    </View>

                </View>
            </View>
        );
    }
}

const strings = {
    name: 'Mising info : Name service',
    description: 'Mising info : Description',
    duration: 'Mising info : Duration',
    price: 'Mising info : Price',
    status: 'Mising info :Status',
}

const mapStateToProps = state => ({
    loading: state.app.loading,
})


export default connectRedux(mapStateToProps, PopupEditAddExtra);
// export default PopupEditAddExtra


