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
import { scaleSize, localize ,checkIsTablet} from '@utils';
import connectRedux from '@redux/ConnectRedux';

class PopupEditAddExtra extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            extraInfo: {
                name: "",
                description: "",
                duration: '',
                price: 0.00,
                isDisable: 'Active',
                supplyFee: 0.00
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
                price: 0.00,
                isDisable: 'Active',
                supplyFee: 0.00
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

    scrollExtraTo(position) {
        this.scrollExtraRef.current.scrollTo({ x: 0, y: scaleSize(position), animated: true })
    }


    // -------- Render -------

    renderButtonSubmit() {
        const { isEdit, loading } = this.props;
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
                    style={{ borderRadius: scaleSize(2) }}
                    styleText={{
                        fontSize: scaleSize(14)
                    }}
                />
            );
        } else {
            return (
                <View style={{
                    width: 150, height: scaleSize(35), backgroundColor: '#0764B0',
                    borderRadius: scaleSize(2), justifyContent: 'center', alignItems: 'center'
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
        const { title, visible, language } = this.props;
        const { name, description, price, isDisable ,supplyFee} = this.state.extraInfo;
        const tempHeight = checkIsTablet() ? scaleSize(390) : scaleSize(480);

        return (
            <PopupParent
                title={title}
                visible={visible}
                onRequestClose={this.onRequestClose}
                // style={{ justifyContent: 'flex-start', paddingTop: scaleSize(20) }}
            >
                <View style={{
                    height:tempHeight, backgroundColor: '#fff',
                    borderBottomLeftRadius: scaleSize(15), borderBottomRightRadius: scaleSize(15),
                    paddingHorizontal: scaleSize(30)
                }} >
                    <View style={{ flex: 1, }} >
                        <ScrollView
                            ref={this.scrollExtraRef}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="always"
                        >
                            <TouchableOpacity activeOpacity={1}>
                                {/* ------ Extra ---- */}
                                <Text style={{ color: '#404040', fontSize: scaleSize(12), marginBottom: scaleSize(10), marginTop: scaleSize(20) }} >
                                    {`${localize('Extra Name', language)}*`}
                                </Text>
                                <View style={{
                                    height: scaleSize(30), borderWidth: 1, borderColor: '#C5C5C5',
                                    paddingLeft: scaleSize(10),
                                }} >
                                    <TextInput
                                        placeholder={`${localize('Extra Name', language)}`}
                                        style={{ flex: 1, fontSize: scaleSize(16), padding: 0 }}
                                        value={name}
                                        onChangeText={(value) => this.updateExtraInfo('name', value)}
                                    />
                                </View>
                                <Text style={{ color: '#404040', fontSize: scaleSize(12), marginBottom: scaleSize(10), marginTop: scaleSize(7) }} >
                                    {localize('Description', language)}
                                </Text>
                                <View style={{
                                    height: scaleSize(60), borderWidth: 1, borderColor: '#C5C5C5',
                                    paddingLeft: scaleSize(10), backgroundColor: '#FAFAFA', paddingTop: scaleSize(5)
                                }} >
                                    <TextInput
                                        placeholder=""
                                        style={{ flex: 1, fontSize: scaleSize(16), padding: 0,
                                        textAlignVertical:"top"
                                        }}
                                        multiline={true}
                                        value={description}
                                        onChangeText={value => this.updateExtraInfo('description', value)}
                                        onFocus={() => this.scrollExtraTo(80)}
                                    />
                                </View>
                                {/* -------------------------- */}
                                <Text style={{ color: '#404040', fontSize: scaleSize(12), marginBottom: scaleSize(10), marginTop: scaleSize(7) }} >

                                    {`${localize('Duration', language)}*`}
                                </Text>
                                <View style={{ flexDirection: "row" }} >
                                    <ItemTime
                                        ref={this.durationRef}
                                        title="Minutes*"
                                        value={this.state.extraInfo.duration}
                                        onFocus={() => this.scrollExtraTo(200)}
                                    />
                                    <View style={{ width: scaleSize(10) }} />
                                    <View style={{ flex: 1 }} />
                                    <View style={{ width: scaleSize(10) }} />
                                    <View style={{ flex: 1 }} />
                                </View>

                                <View style={{ height: scaleSize(70), flexDirection: 'row', marginTop: scaleSize(6) }} >
                                    {/* ------------- Price ------------ */}
                                    <View style={{ flex: 1, }}  >
                                        <Text style={{ color: '#404040', fontSize: scaleSize(12), marginBottom: scaleSize(10), marginTop: scaleSize(7) }} >
                                            {`${localize('Price', language)}*`}
                                        </Text>
                                        <View style={{
                                            height: scaleSize(30), paddingHorizontal: scaleSize(5),
                                            borderWidth: 1, borderColor: '#C5C5C5', flexDirection: 'row'
                                        }} >
                                            <TextInputMask
                                                type={'money'}
                                                options={{
                                                    precision: 2,
                                                    separator: '.',
                                                    delimiter: ',',
                                                    unit: '',
                                                    suffixUnit: ''
                                                }}
                                                style={{ flex: 1, fontSize: scaleSize(16) , padding: 0 }}
                                                placeholder="$ 100"
                                                value={price}
                                                onChangeText={value => this.updateExtraInfo('price', value)}
                                                onFocus={() => this.scrollExtraTo(265)}
                                            />
                                        </View>
                                    </View>

                                    <View style={{ width: scaleSize(10) }} />
                                    {/* ------------- Supply ------------ */}
                                    <View style={{ flex: 1, }}  >
                                        <Text style={{ color: '#404040', fontSize: scaleSize(12), marginBottom: scaleSize(10), marginTop: scaleSize(7) }} >
                                            {`${localize('Surcharged', language)}`}
                                        </Text>
                                        <View style={{
                                            height: scaleSize(30), paddingHorizontal: scaleSize(5),
                                            borderWidth: 1, borderColor: '#C5C5C5', flexDirection: 'row'
                                        }} >
                                            <TextInputMask
                                                type={'money'}
                                                options={{
                                                    precision: 2,
                                                    separator: '.',
                                                    delimiter: ',',
                                                    unit: '',
                                                    suffixUnit: ''
                                                }}
                                                style={{ flex: 1, fontSize: scaleSize(16), padding: 0  }}
                                                placeholder="$ 100"
                                                value={supplyFee}
                                                onChangeText={value => this.updateExtraInfo('supplyFee', value)}
                                                onFocus={() => this.scrollExtraTo(265)}
                                            />
                                        </View>
                                    </View>

                                    <View style={{ width: scaleSize(10) }} />
                                    {/* ------------- Status ------------ */}
                                    <View style={{ flex: 1 }} >
                                        <Text style={{ color: '#404040', fontSize: scaleSize(12), marginBottom: scaleSize(10), marginTop: scaleSize(7) }} >
                                            {`${localize('Status', language)}*`}
                                        </Text>
                                        <View style={{
                                            width: "100%",
                                            height: scaleSize(30),

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
                                <View style={{ height: scaleSize(250) }} />
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                    {/* ---- Footer ---- */}
                    <View style={{ height: scaleSize(50), alignItems: 'center' }} >
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
        const { title, onFocus } = this.props;
        const { value } = this.state;
        return (
            <View style={{  flex: 1,}} >
                <Text style={{ color: '#404040', fontSize: scaleSize(12), marginBottom: scaleSize(10), marginTop: scaleSize(7) }} >
                    {title}
                </Text>
                <View style={{
                    height: scaleSize(30),
                    flex: 1,
                    borderWidth: 1, borderColor: '#C5C5C5', flexDirection: 'row'
                }} >
                    <View style={{ flex: 1, paddingLeft: scaleSize(5) }} >
                        <TextInputMask
                            type="only-numbers"
                            placeholder='10'
                            style={{ flex: 1, fontSize: scaleSize(16) , padding: 0 }}
                            value={value}
                            onChangeText={(value) => this.setState({ value })}
                            onFocus={() => onFocus()}
                        />
                    </View>
                    <View style={{ justifyContent: 'flex-end', paddingRight: 4 }} >
                        <Text style={{ color: '#C5C5C5', fontSize: scaleSize(14) }} >
                            min
                </Text>
                    </View>

                </View>
            </View>
        );
    }
}

const strings = {
    name: 'Missing Info: Name Service',
    description: 'Missing Info: Description',
    duration: 'Missing Info: Duration',
    price: 'Missing Info: Price',
    status: 'Missing Info:Status',
}

const mapStateToProps = state => ({
    loading: state.app.loading,
    language: state.dataLocal.language,
})


export default connectRedux(mapStateToProps, PopupEditAddExtra);


