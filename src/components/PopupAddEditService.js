import React from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    Alert,
    TouchableOpacity,
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

import ButtonCustom from './ButtonCustom';
import PopupParent from './PopupParent';
import BrowserFile from './BrowserFile';
import { Dropdown } from './react-native-material-dropdown';

import { scaleSzie, getCategoryName, getArrayNameCategories, getCategoryIdByName } from '@utils';

class PopupAddEditService extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            serviceInfo: {
                categoryId: '',
                name: "",
                description: "",
                duration: 0,
                openTime: 0,
                secondTime: 0,
                price: '',
                isDisabled: 'Active',
            },
            arrayExtra: [],
            fileId: 0,
            imageUrl: ''
        }
        this.durationRef = React.createRef();
        this.openTimeRef = React.createRef();
        this.secondTimeRef = React.createRef();
        this.arrayExtraRef = [];
    }

    setServiceFromParent = async (service) => {
        const { categoriesByMerchant } = this.props;
        await this.setState({
            serviceInfo: {
                serviceId: service.serviceId,
                categoryId: getCategoryName(categoriesByMerchant, service.categoryId),
                name: service.name,
                description: service.description,
                duration: service.duration,
                openTime: service.openTime,
                secondTime: service.secondTime,
                price: service.price,
                isDisabled: service.isDisabled === 0 ? 'Active' : 'Disable',
            },
            arrayExtra: service.extras.length > 0 ? service.extras : [],
            fileId: 0,
            imageUrl: service.imageUrl
        });
    }


    setDefaultStateFromParent = () => {
        this.setState({
            serviceInfo: {
                categoryId: '',
                name: "",
                description: "",
                duration: 0,
                openTime: 0,
                secondTime: 0,
                price: '',
                isDisabled: 'Active',
            },
            arrayExtra: [],
            fileId: 0,
            imageUrl: ''
        })
    }

    addExtraRef = (ref) => {
        if (ref != null) {
            this.arrayExtraRef.push(ref);
        }
    }

    updateServiceInfo(key, value, keyParent = '') {
        const { serviceInfo } = this.state;
        if (keyParent !== '') {
            const temptParent = serviceInfo[keyParent];
            const temptChild = { ...temptParent, [key]: value };
            const temptUpdate = { ...serviceInfo, [keyParent]: temptChild };
            this.setState({
                serviceInfo: temptUpdate
            })
        } else {
            const temptUpdate = { ...serviceInfo, [key]: value };
            this.setState({
                serviceInfo: temptUpdate
            })
        }
    }

    done = () => {
        const { serviceInfo } = this.state;
        const duration = this.durationRef.current.state.value;
        const openTime = this.openTimeRef.current.state.value;
        const secondTime = this.secondTimeRef.current.state.value;
        const temptServiceInfo = {
            ...serviceInfo,
            duration,
            openTime,
            secondTime,
            categoryId: serviceInfo.categoryId !== '' ? getCategoryIdByName(this.props.categoriesByMerchant, serviceInfo.categoryId, 'Service') : ''
        };
        const arrayKey = Object.keys(temptServiceInfo);
        let keyError = "";
        for (let i = 0; i <= arrayKey.length - 1; i++) {
            if (temptServiceInfo[arrayKey[i]] === "") {
                // console.log(arrayKey[i] + '-' + temptServiceInfo[arrayKey[i]]);
                keyError = arrayKey[i];
                break;
            }
        }
        if (keyError != '') {
            Alert.alert(`${strings[keyError]}`);
        } else {
            // --- Handle extra ---
            // console.log('Handle extra :  ', this.arrayExtraRef);
            const arrayExtra = [];
            let checkValidateExtra = true;
            let errorCheckExtra = '';
            this.arrayExtraRef.forEach(extra => {
                if (extra.getInfoExtraFromParent().isValid) {
                    const data = extra.getInfoExtraFromParent().data;
                    const temptData = { ...data, isDisabled: data.isDisabled === 'Active' ? 0 : 1 };
                    arrayExtra.push(temptData);
                } else {
                    checkValidateExtra = false;
                    errorCheckExtra = extra.getInfoExtraFromParent().errorMessage;
                }

            });
            if (checkValidateExtra) {
                const dataServiceAdd = { ...temptServiceInfo, extras: arrayExtra };
                this.arrayExtraRef = [];
                if (this.props.isSave) {
                    this.props.editService({
                        ...dataServiceAdd, isDisabled: dataServiceAdd.isDisabled === 'Active' ? 0 : 1,
                        fileId: this.state.fileId
                    });
                } else {
                    this.props.doneAddService({
                        ...dataServiceAdd, isDisabled: dataServiceAdd.isDisabled === 'Active' ? 0 : 1,
                        fileId: this.state.fileId
                    });
                }

            } else {
                Alert.alert(`${strings[errorCheckExtra]}`);
            }

        }
    }


    addMoreExtra = () => {
        const temptArrayExtra = [...this.state.arrayExtra];
        temptArrayExtra.push({
            name: "",
            description: "",
            duration: '',
            price: '',
            isDisabled: 'Active'
        });
        this.setState({
            arrayExtra: temptArrayExtra
        })
    }

    resetRefPopup = () => {
        this.arrayExtraRef = [];
        this.props.onRequestClose();
    }

    updateFileId = (fileId) => {
        console.log('updateFileId : ' + fileId);
        this.setState({
            fileId
        })
    }

    // ------- Render -----

    render() {
        const { title, visible, isSave, categoriesByMerchant } = this.props;
        const { categoryId, name, duration, description, price, isDisabled
        } = this.state.serviceInfo;
        const temptTitleButton = isSave ? 'Save' : 'Done';
        return (
            <PopupParent
                title={title}
                visible={visible}
                onRequestClose={this.resetRefPopup}
                style={{ justifyContent: 'flex-start', paddingTop: scaleSzie(20) }}
            >
                <View style={{
                    height: scaleSzie(480), backgroundColor: '#fff',
                    borderBottomLeftRadius: scaleSzie(15), borderBottomRightRadius: scaleSzie(15),
                    paddingHorizontal: scaleSzie(30)
                }} >
                    <View style={{ flex: 1, }} >
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                        >
                            <TouchableOpacity activeOpacity={1}>
                                <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginTop: scaleSzie(10), marginBottom: scaleSzie(10) }} >
                                    Category
                            </Text>
                                <View style={{ width: scaleSzie(200), height: scaleSzie(30), }} >
                                    <Dropdown
                                        label='Facial'
                                        data={getArrayNameCategories(categoriesByMerchant, 'Service')}
                                        value={categoryId}
                                        onChangeText={(value) => this.updateServiceInfo('categoryId', value)}
                                        containerStyle={{
                                            backgroundColor: '#F1F1F1',
                                            borderWidth: 1,
                                            borderColor: '#C5C5C5',
                                            flex: 1
                                        }}
                                    />
                                </View>
                                <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(10), marginTop: scaleSzie(7) }} >
                                    Service
                            </Text>
                                <View style={{
                                    height: scaleSzie(30), borderWidth: 1, borderColor: '#C5C5C5',
                                    paddingLeft: scaleSzie(10),
                                }} >
                                    <TextInput
                                        placeholder="Gel Nails"
                                        style={{ flex: 1, fontSize: scaleSzie(16) }}
                                        value={name}
                                        onChangeText={value => this.updateServiceInfo('name', value)}
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
                                        onChangeText={value => this.updateServiceInfo('description', value)}
                                    />
                                </View>
                                {/* ------- Upload Image ----- */}
                                <BrowserFile
                                    updateFileId={this.updateFileId}
                                    imageUrl={this.state.imageUrl}

                                />
                                {/* -------------------------- */}
                                <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(10), marginTop: scaleSzie(7) }} >
                                    Duration
                            </Text>
                                <View style={{ height: scaleSzie(70), flexDirection: 'row', justifyContent: 'space-between' }} >
                                    <ItemTime
                                        ref={this.durationRef}
                                        title="Minutes"
                                        value={this.state.serviceInfo.duration}
                                    />
                                    <ItemTime
                                        ref={this.openTimeRef}
                                        title="Open Time"
                                        value={this.state.serviceInfo.openTime}
                                    />
                                    <ItemTime
                                        ref={this.secondTimeRef}
                                        title="Second Time"
                                        value={this.state.serviceInfo.secondTime}
                                    />
                                </View>
                                <View style={{ height: scaleSzie(70), flexDirection: 'row' }} >
                                    <View style={{ flex: 1, paddingRight: scaleSzie(50) }}  >
                                        <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(10), marginTop: scaleSzie(7) }} >
                                            Price
                                    </Text>
                                        <View style={{
                                            height: scaleSzie(30), paddingHorizontal: scaleSzie(5),
                                            borderWidth: 1, borderColor: '#C5C5C5', flexDirection: 'row'
                                        }} >
                                            <TextInputMask
                                                type="only-numbers"
                                                style={{ flex: 1, fontSize: scaleSzie(16) }}
                                                placeholder="$ 100"
                                                value={price}
                                                onChangeText={value => this.updateServiceInfo('price', value)}
                                            />
                                        </View>
                                    </View>
                                    {/* ------ */}
                                    <View>
                                        <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(10), marginTop: scaleSzie(7) }} >
                                            Status
                                    </Text>
                                        <View style={{
                                            height: scaleSzie(30), width: scaleSzie(90),
                                            flexDirection: 'row'
                                        }} >
                                            <Dropdown
                                                label='Active'
                                                data={[{ value: 'Active' }, { value: 'Disable' }]}
                                                value={isDisabled}
                                                onChangeText={(value) => this.updateServiceInfo('isDisabled', value)}
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
                                {/* ------ Line ------ */}
                                {
                                    this.state.arrayExtra.map((extra, index) => <ItemExtra
                                        ref={this.addExtraRef}
                                        key={index}
                                        extraInfo={extra}
                                    />)
                                }


                                {/* ------ Line ------ */}
                                <View style={{ height: 3, backgroundColor: '#0764B0', marginTop: scaleSzie(8), marginBottom: scaleSzie(20) }} />

                                <View style={{ height: scaleSzie(60) }} >
                                    <ButtonCustom
                                        width={'100%'}
                                        height={35}
                                        backgroundColor="#4CD964"
                                        title={'Add more extra'}
                                        textColor="#fff"
                                        onPress={this.addMoreExtra}
                                        style={{ borderRadius: scaleSzie(2) }}
                                        styleText={{
                                            fontSize: scaleSzie(14)
                                        }}
                                    />
                                </View>
                                <View style={{ height: scaleSzie(250) }} />
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                    {/* ---- Footer ---- */}
                    <View style={{ height: scaleSzie(50), alignItems: 'center' }} >
                        <ButtonCustom
                            width={150}
                            height={35}
                            backgroundColor="#0764B0"
                            title={temptTitleButton}
                            textColor="#fff"
                            onPress={this.done}
                            style={{ borderRadius: scaleSzie(2) }}
                            styleText={{
                                fontSize: scaleSzie(14)
                            }}
                        />
                    </View>
                </View>
            </PopupParent>
        );
    }

}

class ItemExtra extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            extraInfo: {
                name: '',
                description: '',
                duration: '',
                price: '',
                isDisabled: 'Active'
            },
        }
        this.durationExtraRef = React.createRef();
    }

    componentDidMount() {
        const { extraInfo } = this.props;
        if (extraInfo.extraId) {
            this.setState({
                extraInfo: {
                    extraId: extraInfo.extraId,
                    name: extraInfo.name,
                    description: extraInfo.description,
                    duration: extraInfo.duration,
                    price: extraInfo.price,
                    isDisabled: extraInfo.isDisabled === 0 ? 'Active' : 'Disable'
                }
            });
            this.durationExtraRef.current.setStateFromParent(extraInfo.duration);
        }
    }

    getInfoExtraFromParent = () => {
        const { extraInfo } = this.state;
        const duration = this.durationExtraRef.current.state.value;
        const temptExtra = {
            ...extraInfo,
            duration: duration,
        }

        const arrayKey = Object.keys(temptExtra);
        let keyError = "";
        for (let i = 0; i <= arrayKey.length - 1; i++) {
            if (temptExtra[arrayKey[i]] == "") {
                keyError = `${arrayKey[i]}_extra`;
                break;
            }
        }
        if (keyError != "") {
            return {
                isValid: false,
                errorMessage: keyError,
                data: {}
            }
        }
        return {
            isValid: true,
            errorMessage: '',
            data: temptExtra
        }
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

    render() {
        const { name, description, duration, price, isDisabled } = this.state.extraInfo;
        return (
            <View>
                <View style={{ height: 3, backgroundColor: '#0764B0', marginTop: scaleSzie(8), marginBottom: scaleSzie(20) }} />
                {/* ------ Extra ---- */}
                <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(10), marginTop: scaleSzie(7) }} >
                    Extra name
                            </Text>
                <View style={{
                    height: scaleSzie(30), borderWidth: 1, borderColor: '#C5C5C5',
                    paddingLeft: scaleSzie(10),
                }} >
                    <TextInput
                        placeholder="Extra name"
                        style={{ flex: 1, fontSize: scaleSzie(16) }}
                        value={name}
                        onChangeText={value => this.updateExtraInfo('name', value)}
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
                    />
                </View>
                <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(10), marginTop: scaleSzie(7) }} >
                    Duration
                </Text>
                <ItemTime
                    ref={this.durationExtraRef}
                    title="Minutes"
                    value={duration}
                />
                <View style={{ height: scaleSzie(70), flexDirection: 'row' }} >
                    <View style={{ flex: 1, paddingRight: scaleSzie(50) }}  >
                        <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(10), marginTop: scaleSzie(7) }} >
                            Price
                        </Text>
                        <View style={{
                            height: scaleSzie(30), paddingHorizontal: scaleSzie(5),
                            borderWidth: 1, borderColor: '#C5C5C5', flexDirection: 'row'
                        }} >
                            <TextInputMask
                                type="only-numbers"
                                style={{ flex: 1, fontSize: scaleSzie(16) }}
                                placeholder="$ 100"
                                value={price}
                                onChangeText={value => this.updateExtraInfo('price', value)}
                            />
                        </View>
                    </View>
                    {/* ------ */}
                    <View>
                        <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(10), marginTop: scaleSzie(7) }} >
                            Status
                                    </Text>
                        <View style={{
                            height: scaleSzie(30), width: scaleSzie(90),
                            flexDirection: 'row'
                        }} >
                            <Dropdown
                                label='Active'
                                data={[{ value: 'Active' }, { value: 'Disable' }]}
                                value={isDisabled}
                                onChangeText={(value) => this.updateExtraInfo('isDisabled', value)}
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
            </View>
        );
    }

}

class ItemTime extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value
        };
    }

    setStateFromParent = (value) => {
        this.setState({
            value
        })
    }

    render() {
        const { title } = this.props;
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
    categoryId: 'Mising info : Category',
    name: 'Mising info : Name service',
    description: 'Mising info : Description',
    duration: 'Mising info : Duration',
    openTime: 'Mising info : Open time',
    secondTime: 'Mising info : Second time',
    price: 'Mising info : Price',
    status: 'Mising info :Status',

    // --- Extra ---
    name_extra: 'Mising info : Name extra',
    description_extra: 'Mising info : Description extra',
    duration_extra: 'Mising info : Duration Extra ',
    price_extra: 'Mising info : Price extra',
    status: 'Active'
}


export default PopupAddEditService;

