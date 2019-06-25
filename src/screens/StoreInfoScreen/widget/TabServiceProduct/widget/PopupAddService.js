import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Dimensions,
    ScrollView,
    Alert
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

import { ButtonCustom, PopupParent, Dropdown } from '@components';
import { scaleSzie } from '@utils';

const { width } = Dimensions.get('window');


class PopupAddService extends React.Component {

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
                status: 'Active',
            },
            arrayExtra: []
        }
        this.durationRef = React.createRef();
        this.openTimeRef = React.createRef();
        this.secondTimeRef = React.createRef();
        this.arrayExtraRef = [];
    }

    setServiceFromParent = (service) => {
        this.setState({
            serviceInfo: {
                serviceId: service.serviceId,
                categoryId: this.getCateroryName(service.categoryId),
                name: service.name,
                description: service.description,
                duration: service.duration,
                openTime: service.openTime,
                secondTime: service.secondTime,
                price: service.price,
                status: service.isDisabled === 0 ? 'Active' : 'Disable',
            },
            arrayExtra: service.extras.length > 0 ? service.extras : []
        })
    }

    getCateroryName(id) {
        const { categoriesByMerchant } = this.props;
        let name = '';
        for (let i = 0; i < categoriesByMerchant.length - 1; i++) {
            if (categoriesByMerchant[i].categoryId == id) {
                name = categoriesByMerchant[i].name;
                break;
            }
        }
        return name;
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
                status: 'Active',
            },
            arrayExtra: []
        })
    }

    addExtraRef = (ref) => {
        this.arrayExtraRef.push(ref);
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
            status: serviceInfo.status == 'Active' ? 1 : 0,
            categoryId: serviceInfo.categoryId !== '' ? this.getCateroryId(serviceInfo.categoryId) : ''
        };
        const arrayKey = Object.keys(temptServiceInfo);
        let keyError = "";
        for (let i = 0; i <= arrayKey.length; i++) {
            if (temptServiceInfo[arrayKey[i]] == "") {
                keyError = arrayKey[i];
                break;
            }
        }
        if (keyError != '') {
            Alert.alert(`${strings[keyError]}`);
        } else {
            // --- Handle extra ---
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
                if (this.props.isSave) {
                    this.props.editService(dataServiceAdd);
                } else {
                    this.props.doneAddService(dataServiceAdd);
                }

            } else {
                Alert.alert(`${strings[errorCheckExtra]}`);
            }

        }
    }

    getCateroryId(name) {
        const { categoriesByMerchant } = this.props;
        let categoryId = -1;
        for (let i = 0; i < categoriesByMerchant.length - 1; i++) {
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
            status: 'Active'
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
        const { categoryId, name, duration, description, price, status
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
                                            value={status}
                                            onChangeText={(value) => this.updateServiceInfo('status', value)}
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
        console.log('ItemExtra : ', this.props.extraInfo);
        const { extraInfo } = this.props;
        this.state = {
            // extraInfo: {
            //     name: "",
            //     description: "",
            //     duration: '',
            //     price: '',
            //     status: 'Active'
            // }
            extraInfo: {
                name: extraInfo.name,
                description: extraInfo.description,
                duration: extraInfo.duration,
                price: extraInfo.price,
                status: extraInfo.isDisabled === 0 ? 'Active' : 'Disable'
            }
        }
        this.durationRef = React.createRef();
    }

    getInfoExtraFromParent = () => {
        const { extraInfo } = this.state;
        const duration = this.durationRef.current.state.value;
        const temptExtra = {
            ...extraInfo, duration: duration,
            status: extraInfo.status == 'Active' ? 1 : 0
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
        const { name, description, duration, price, status } = this.state.extraInfo;
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
                                value={status}
                                onChangeText={(value) => this.updateExtraInfo('status', value)}
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
        console.log('ItemTime : ' + this.props.value);
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

// const mapStateToProps = state => ({
//     categoriesByMerchant: state.category.categoriesByMerchant
// });
// export default connectRedux(mapStateToProps, PopupAddService);
export default PopupAddService;

