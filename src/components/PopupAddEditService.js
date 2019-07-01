import React from 'react';
import {
    View,
    Text,
    TextInput,
    Dimensions,
    ScrollView,
    Alert
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

import ButtonCustom from './ButtonCustom';
import PopupParent from './PopupParent';
import {Dropdown} from './react-native-material-dropdown';

import { scaleSzie, getCategoryName } from '@utils';

const { width } = Dimensions.get('window');

class PopupAddEditService extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            serviceInfo: {
                categoryId: '',
                name: "",
                description: "",
                duration: '',
                openTime: '',
                secondTime: '',
                price: '',
                isDisabled: 'Active',
            },
            arrayExtra: []
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
                // categoryId:'dd',
                name: service.name,
                description: service.description,
                duration: service.duration,
                openTime: service.openTime,
                secondTime: service.secondTime,
                price: service.price,
                isDisabled: service.isDisabled === 0 ? 'Active' : 'Disable',
            },
            arrayExtra: service.extras.length > 0 ? service.extras : []
        });
    }


    setDefaultStateFromParent = () => {
        this.setState({
            serviceInfo: {
                categoryId: '',
                name: "",
                description: "",
                duration: '',
                openTime: '',
                secondTime: '',
                price: '',
                isDisabled: 'Active',
            },
            arrayExtra: []
        })
    }

    addExtraRef = (ref) => {
        if (ref != null) {
            this.arrayExtraRef.push(ref);
        }
    }

    filterCategories(categories) {
        return categories.map(category => ({ value: category.name, id: category.categoryId }));
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
            categoryId: serviceInfo.categoryId !== '' ? this.getCateroryId(serviceInfo.categoryId) : ''
        };
        const arrayKey = Object.keys(temptServiceInfo);
        let keyError = "";
        for (let i = 0; i <= arrayKey.length - 1; i++) {
            if (temptServiceInfo[arrayKey[i]] == "") {
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
                    arrayExtra.push(extra.getInfoExtraFromParent().data);
                } else {
                    checkValidateExtra = false;
                    errorCheckExtra = extra.getInfoExtraFromParent().errorMessage;
                }

            });
            if (checkValidateExtra) {
                const dataServiceAdd = { ...temptServiceInfo, extras: arrayExtra };
                this.arrayExtraRef = [];
                if (this.props.isSave) {
                    this.props.editService({ ...dataServiceAdd, isDisabled: dataServiceAdd.isDisabled === 'Active' ? 0 : 1 });
                } else {
                    this.props.doneAddService({ ...dataServiceAdd, isDisabled: dataServiceAdd.isDisabled === 'Active' ? 0 : 1 });
                }

            } else {
                Alert.alert(`${strings[errorCheckExtra]}`);
            }

        }
    }

    getCateroryId(name) {
        const { categoriesByMerchant } = this.props;
        let categoryId = '';
        for (let i = 0; i <= categoriesByMerchant.length - 1; i++) {
            if (categoriesByMerchant[i].name == name) {
                categoryId = categoriesByMerchant[i].categoryId;
                break;
            }
        }
        return categoryId;
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

    // ------- Render -----

    render() {
        const { title, visible, onRequestClose, doneAddService, isSave,
            categoriesByMerchant
        } = this.props;
        const { categoryId, name, duration, description, price, isDisabled
        } = this.state.serviceInfo;
        const temptHeight = width - scaleSzie(500);
        const temptTitleButton = isSave ? 'Save' : 'Done';
        return (
            <PopupParent
                title={title}
                visible={visible}
                onRequestClose={() => onRequestClose()}
                style={{ justifyContent: 'flex-start', paddingTop: scaleSzie(20) }}
            >
                <View style={{
                    height: scaleSzie(temptHeight), backgroundColor: '#fff',
                    borderBottomLeftRadius: scaleSzie(15), borderBottomRightRadius: scaleSzie(15),
                    paddingHorizontal: scaleSzie(30)
                }} >
                    <View style={{ flex: 1, }} >
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                        >
                            <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginTop: scaleSzie(10), marginBottom: scaleSzie(10) }} >
                                Category
                            </Text>
                            <View style={{ width: scaleSzie(200), height: scaleSzie(30), }} >
                                <Dropdown
                                    label='Facial'
                                    data={this.filterCategories(categoriesByMerchant)}
                                    value={categoryId}
                                    onChangeText={(value) => this.updateServiceInfo('categoryId', value)}
                                    containerStyle={{
                                        backgroundColor: '#F1F1F1',
                                        borderWidth: 1,
                                        borderColor: '#6A6A6A',
                                        flex: 1
                                    }}
                                />
                            </View>
                            <Text style={{ color: '#404040', fontSize: scaleSzie(12), marginBottom: scaleSzie(10), marginTop: scaleSzie(7) }} >
                                Service
                            </Text>
                            <View style={{
                                height: scaleSzie(30), borderWidth: 1, borderColor: '#6A6A6A',
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
                                height: scaleSzie(60), borderWidth: 1, borderColor: '#6A6A6A',
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
                                        borderWidth: 1, borderColor: '#6A6A6A', flexDirection: 'row'
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
                                                borderColor: '#6A6A6A',
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
        const { extraInfo } = this.props;
        this.state = {
            extraInfo: {
                extraId: extraInfo.extraId ? extraInfo.extraId : '00',
                name: extraInfo.name,
                description: extraInfo.description,
                duration: extraInfo.duration,
                price: extraInfo.price,
                isDisabled: extraInfo.isDisabled === 0 ? 'Active' : 'Disable'
            }
        }
        this.durationRef = React.createRef();
    }

    getInfoExtraFromParent = () => {
        const { extraInfo } = this.state;
        const duration = this.durationRef.current.state.value;
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
                    height: scaleSzie(30), borderWidth: 1, borderColor: '#6A6A6A',
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
                    height: scaleSzie(60), borderWidth: 1, borderColor: '#6A6A6A',
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
                    ref={this.durationRef}
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
                            borderWidth: 1, borderColor: '#6A6A6A', flexDirection: 'row'
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
                                    borderColor: '#6A6A6A',
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
        }
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
                    borderWidth: 1, borderColor: '#6A6A6A', flexDirection: 'row'
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
                        <Text style={{ color: '#6A6A6A', fontSize: scaleSzie(14) }} >
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

