import {
    Platform,
    Dimensions,
    Linking,
    Alert
} from 'react-native';
import axios from 'axios';
import { openSettings } from 'react-native-permissions';
import moment from 'moment';
import PrintManager from '@lib/PrintManager';

import Configs from '../configs';
import apiConfigs from '../configs/api';
import Localization from '../localization';

const { width } = Dimensions.get('window');

export const hiddenTabbar = stack => {
    stack.navigationOptions = ({ navigation }) => {
        let tabBarVisible = true;
        if (navigation.state.index > 0) {
            tabBarVisible = false;
        }
        return {
            tabBarVisible,
        };
    };
}

export const isPlatformIOS = _ => {
    return Platform.OS === 'ios';
}

export const scaleSzie = size => {
    return width * size / Configs.DEFAULT_WIDTH;
}

function fetchWithTimeout(url, options, timeout = 10000) {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
            setTimeout(() => reject('timeout'), timeout)
        )
    ]);
}

export const requestAPI = async (action, header = {}) => {
    //console.log('action : ',action);
    let method = action.method || "GET";
    let baseURL = action.api;
    let headers = Object.assign({ "Accept": "application/json", "Content-Type": "application/json" }, header);
    if (action.token) {
        headers['Authorization'] = `Bearer ${action.token}`;
    }
    // headers['User-Agent'] = `HarmonyMerchant/1.0.1/ios`;
    const configs = {
        method: `${method}`.toLowerCase(),
        baseURL: baseURL,
        url: '',
        headers: headers,
        timeout: 30000,
        validateStatus: (status) => status >= 200 && status < 600,
    };
    if ((method == "POST" || method == "DELETE" || method == "PUT") && action.body) {
        configs['data'] = JSON.stringify(action.body);
    }
    try {
        let response = await axios(configs);
        //console.log('response : ' + JSON.stringify(response));
        const codeNumber = response.status ? response.status : 0;
        if (codeNumber === 401) {
            return { codeNumber: codeNumber }
        }
        return response.data;
    } catch (error) {
        //console.log('error message : ', error);
        if (error.request) {
            if (error.message.includes('timeout')) {
                throw 'TIME_OUT'
            } else if (error.message.includes('Network Error')) {
                throw 'NET_WORK_REQUEST_FAIL'
            } else {
                throw error;
            }
        }
    }
}


export const uploadFromData = async (action, header = {}) => {
    let method = action.method || "GET";
    let baseURL = action.api;
    let headers = Object.assign({ "Accept": "application/json", "Content-Type": "application/json" }, header);
    if (action.token) {
        headers['Authorization'] = `Bearer ${action.token}`
    }
    const configs = {
        method: `${method}`.toLowerCase(),
        baseURL: baseURL,
        url: '',
        headers: headers,
        timeout: 20000,
        validateStatus: (status) => status >= 200 && status < 600,
    };
    configs['data'] = this.createFormData(action.media);
    try {
        let response = await axios(configs);
        return response.data;
    } catch (error) {
        if (error.request) {
            if (error.message.includes('timeout')) {
                throw 'TIME_OUT'
            } else if (error.message.includes('Network Error')) {
                throw 'NET_WORK_REQUEST_FAIL'
            } else {
                throw error;
            }
        }
    }
};


createFormData = (media) => {
    const data = new FormData();
    for (let i = 0; i < media.length; i++) {
        data.append("files[]", {
            uri:
                Platform.OS === "android"
                    ? media[i].uri
                    : media[i].uri.replace("file://", ""),
            name: media[i].fileName ? media[i].fileName : "phi.jpg",
            type: media[i].type ? media[i].type : "image/jpeg"
        });
    }
    // Object.keys(body).forEach(key => {
    //     data.append(key, body[key]);
    // });
    return data;
};

export const getPosotion = (options = { timeout: 20000, maximumAge: 20000, enableHighAccuracy: true }) => {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
};


export const gotoSettingsDevice = () => {
    Alert.alert(
        'Confirmation',
        'You not allowed this permission. Please go to settings .Then enable allow this permission!',
        [
            { text: 'Ask me later', onPress: () => { } },
            {
                text: 'Cancel',
                onPress: () => { },
                style: 'cancel',
            },
            { text: 'OK', onPress: () => openSettings().catch(() => console.warn('cannot open settings')) },
        ],
        { cancelable: false },
    );
}

export const isIphoneX = () => {
    const { height, width } = Dimensions.get('window');
    return (Platform.OS === 'ios' && (height === 812 || width === 812)
    );
}

export const validateEmail = (email) => {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export const validYear = (year) => {
    let rex = /^[12][0-9]{3}$/;
    return rex.test(year);
}

export const openBrowser = (urlSocial) => {
    Linking.canOpenURL(urlSocial).then(supported => {
        if (!supported) {
        } else {
            return Linking.openURL(urlSocial);
        }
    }).catch(err => console.error('An error occurred', err));
}

export const validateIsNumber = (number) => {
    var n = Number(number);
    return !(n !== n);
}

export const localize = (value, lang = 'en') => {
    const temptValue = Localization[lang][value];
    return temptValue ? `${Localization[lang][value]}` : `${value}`
};

export const getCategoryName = (categories, id) => {
    let name = '';
    for (let i = 0; i < categories.length; i++) {
        if (categories[i].categoryId == id) {
            name = categories[i].name;
            break;
        }
    }
    return name;
}

export const getCategoryIdByName = (categories, name, type = '') => {
    let categoryId = '';
    for (let i = 0; i < categories.length; i++) {
        if (categories[i].name == name) {
            if (type === '') {
                categoryId = categories[i].categoryId;
                break;
            } else {
                if (categories[i].categoryType == type) {
                    categoryId = categories[i].categoryId;
                    break;
                }
            }
        }
    }
    return categoryId;
}

export const getArrayNameCategories = (categories = [], type = '') => {
    const arrayName = [];
    for (let i = 0; i < categories.length; i++) {
        if (type == '') {
            arrayName.push({ value: categories[i].name });
        } else {
            if (categories[i].categoryType == type) {
                arrayName.push({ value: categories[i].name });
            }
        }
    }
    return arrayName

}

export const getArrayNameStateCity = (stateCity = []) => {
    const arrayName = stateCity.map(state => {
        return { value: state.name }
    });
    return arrayName;
}

export const getIdStateByName = (stateCity = [], name = '') => {
    let stateId = '';
    for (let i = 0; i < stateCity.length; i++) {
        if (stateCity[i].name == name) {
            stateId = stateCity[i].stateId;
            break;
        }
    }
    if (stateId == '') {
        return 0;
    }
    return stateId;
}

export const getNameStateById = (stateCity = [], id = '') => {
    let stateName = '';
    for (let i = 0; i < stateCity.length; i++) {
        if (stateCity[i].stateId == id) {
            stateName = stateCity[i].name;
            break;
        }
    };
    return stateName
}

export const getNameLanguage = (keyLanguage) => {
    let language = '';
    switch (keyLanguage) {
        case 'en':
            language = 'English';
            break;
        case 'vi':
            language = 'Viet Nam';
            break;
        default:
            language = 'Viet Nam';
            break;
    }
    return language;
}

export const getArrayProductsFromAppointment = (products = []) => {
    const temptArrayProducts = products.map((product) => {
        return {
            type: 'Product',
            id: `${product.productId}_pro`,
            quanlitySet: product.quantity,
            data: {
                name: product.productName,
                productId: product.productId,
                price: product.price,
                bookingProductId: product.bookingProductId
            }
        }
    });
    return temptArrayProducts
}

export const getArrayServicesFromAppointment = (services = []) => {
    const temptArrayServices = services.map((service) => {
        //console.log('staff : ',service.staff);
        return {
            type: 'Service',
            id: `${service.serviceId}_ser`,
            data: {
                name: service.serviceName,
                serviceId: service.serviceId,
                price: service.price,
                bookingServiceId: service.bookingServiceId
            },
            serviceName: 'Service',
            staff: service.staff
        }
    });
    return temptArrayServices
}

export const getArrayExtrasFromAppointment = (extras = []) => {
    const temptArrayExtras = extras.map(extra => {
        return {
            type: 'Extra',
            id: `${extra.extraId}_extra`,
            data: {
                name: extra.extraName,
                extraId: extra.extraId,
                price: extra.price,
                bookingExtraId: extra.bookingExtraId
            },
            serviceName: 'Extra'
        }
    });

    return temptArrayExtras;
}

export const getArrayGiftCardsFromAppointment = (giftCards = []) => {
    const temptArrayGiftCards = giftCards.map(gift => {
        return {
            type: 'GiftCards',
            id: `${gift.giftCardId}_gift`,
            quanlitySet: gift.quantity,
            data: {
                name: gift.name ? gift.name : "Gift Card",
                giftCardId: gift.giftCardId,
                price: gift.price,
                bookingGiftCardId: gift.bookingGiftCardId
            },
        }
    });

    return temptArrayGiftCards;
}

export const updateStateChildren = (key, value, parent) => {
    return { ...parent, [key]: value };
}

export const ListCodeAreaPhone = [
    {
        value: '+1'
    },
    {
        value: '+84'
    }
]

export const getCodeAreaPhone = (phone) => {
    if (`${phone}`.includes('+1')) {
        const temptPhone = phone.split('+1');
        return {
            phone: temptPhone[1],
            areaCode: '+1'
        }
    } else if (`${phone}`.includes('+84')) {
        const temptPhone = phone.split('+84');
        return {
            phone: temptPhone[1],
            areaCode: '+84'
        }
    }
    return {
        phone: phone,
        areaCode: '+1'
    }
}

export const formatNumberFromCurrency = currency => {
    //console.log('formatNumberFromCurrency : ',currency);
    return Number(`${currency}`.replace(/[^0-9.-]+/g, ""));
}


export const formatMoney = (number, decimalCount = 2, decimal = ".", thousands = ",") => {
    let amount = formatNumberFromCurrency(number);
    try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? "-" : "";

        let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        let j = (i.length > 3) ? i.length % 3 : 0;

        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
        console.log(e)
    }
}


export const getStaffInfoById = (staffs, staffId) => {
    const temptData = staffs.filter((staff, index) => staff.staffId == staffId);
    if (temptData.length > 0) {
        return { ...temptData[0] };
    }
    return false
}

export const getServiceNameById = (services, serviceId = 0) => {
    let serviceName = '';
    for (let i = 0; i < services.length; i++) {
        if (services[i].serviceId === serviceId) {
            serviceName = services[i].name;
            break;
        }
    }
    return serviceName;
}



export const getServiceIdByName = (services, name) => {
    let serviceId = 0;
    for (let i = 0; i < services.length; i++) {
        if (services[i].name === name) {
            serviceId = services[i].serviceId;
            break;
        }
    }

    if (serviceId === 0) {
        return name;
    }
    return serviceId;
}

export const getQuickFilterTimeRange = (type) => {
    let quickFilter = '';
    switch (type) {
        case 'Today':
            quickFilter = 'today';
            break;
        case 'Yesterday':
            quickFilter = 'yesterday';
            break;
        case 'This Week':
            quickFilter = 'thisWeek';
            break;
        case 'Last Week':
            quickFilter = 'lastWeek';
            break;
        case 'This Month':
            quickFilter = 'thisMonth';
            break;
        case 'Last Month':
            quickFilter = 'lastMonth';
            break;
        default:
            quickFilter = ''
    }
    return quickFilter;

}

export const YOUTUBE_DATA = [
    {
        videoId: 'eQq5knMITLk',
        description: "HarmonyPayment - Mobile Payment App With POS Systems"
    },
]

export const checkEnvironment = () => {
    return apiConfigs.BASE_API === "http://api2.levincidemo.com/api/" ? "DEV" : "PRO";
}

export const removeAccent = str => {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/ |/g, "");
    return str;
};

export const checkStateIsValid = (arrayState, state) => {
    let isValid = false;
    for (let i = 0; i < arrayState.length; i++) {
        if (removeAccent(arrayState[i].name.toLowerCase()) === removeAccent(state.toLowerCase())) {
            isValid = true;
            break;
        }
    }
    return isValid;
}

export const splitPlusInPhoneNumber = (phone) => {
    let temptPhone = [];
    for (let i = 0; i < phone.length; i++) {
        if (phone[i] !== '+') {
            temptPhone.push(phone[i]);
        }
    }
    return temptPhone.join('');
}

export const WorkingTime = [
    {
        value: '00:00 AM',
    },
    {
        value: '00:30 AM',
    },
    {
        value: '01:00 AM',
    },
    {
        value: '01:30 AM',
    },
    {
        value: '02:00 AM',
    },
    {
        value: '02:30 AM',
    },
    {
        value: '03:00 AM',
    },
    {
        value: '03:30 AM',
    },
    {
        value: '04:00 AM',
    },
    {
        value: '04:30 AM',
    },
    {
        value: '05:00 AM',
    },
    {
        value: '05:30 AM',
    },
    {
        value: '06:00 AM',
    },
    {
        value: '06:30 AM',
    },
    {
        value: '07:00 AM',
    },
    {
        value: '07:30 AM',
    },
    {
        value: '08:00 AM',
    },
    {
        value: '08:30 AM',
    },
    {
        value: '09:00 AM',
    },
    {
        value: '09:30 AM',
    },
    {
        value: '10:00 AM',
    },
    {
        value: '10:30 AM',
    },
    {
        value: '11:00 AM',
    },
    {
        value: '11:30 AM',
    },
    {
        value: '12:00 AM',
    },
    {
        value: '12:30 AM',
    },
    {
        value: '01:00 PM',
    },
    {
        value: '01:30 PM',
    },
    {
        value: '02:00 PM',
    },
    {
        value: '02:30 PM',
    },
    {
        value: '03:00 PM',
    },
    {
        value: '03:30 PM',
    },
    {
        value: '04:00 PM',
    },
    {
        value: '04:30 PM',
    },
    {
        value: '05:00 PM',
    },
    {
        value: '05:30 PM',
    },
    {
        value: '06:00 PM',
    },
    {
        value: '06:30 PM',
    },
    {
        value: '07:00 PM',
    },
    {
        value: '07:30 PM',
    },
    {
        value: '08:00 PM',
    },
    {
        value: '08:30 PM',
    },
    {
        value: '09:00 PM',
    },
    {
        value: '09:30 PM',
    },
    {
        value: '10:00 PM',
    },
    {
        value: '10:30 PM',
    },
    {
        value: '11:00 PM',
    },
    {
        value: '11:30 PM',
    }
]

export const Roles = [
    {
        value: 'Admin'
    },
    {
        value: 'Staff'
    }
]

export const Status = [
    {
        value: 'Active'
    },
    {
        value: 'Disable'
    }
];
export const getMonthNameShort = (month) => {
    const monthNamesShort = {
        '01': 'Jan',
        '02': 'Fer',
        '03': 'Mar',
        '04': 'Apr',
        '05': 'May',
        '06': 'Jun',
        '07': 'Jul',
        '08': 'Aug',
        '09': 'Sep',
        '10': 'Oct',
        '11': 'Nov',
        '12': 'Dec'
    };
    return monthNamesShort[month];
};
export function formatDateApi(eDate) {
    var dateT = eDate.split('T');
    var date = dateT[0].split('-');
    var month = getMonthNameShort(date[1]);
    return {
        month,
        day: date[2],
        year: date[0]
    };
}


export const PRINTER_MACHINE = {
    "BT:mPOP": {
        printerModels: "mPOP",
        portName: "BT:mPOP",
        isCashier: true,
        isPrint: true,
        emulation: "StarPRNT",
        widthPaper: "400",
    },
    "BT:TSP100": {
        printerModels: "TSP100",
        portName: "BT:TSP100",
        isCashier: false,
        isPrint: true,
        emulation: "StarGraphic",
        widthPaper: "576"
    },
};

export const getShortNameToPrintInvoice = (name) => {
    if (name.length < 17) {
        return name;
    }
    const shortName = name.slice(0, 16);

    return `${shortName}...`
}

export const getPaymentString = (type) => {
    let method = '';
    switch (type) {
        case 'harmony':
            method = 'HarmonyPay';
            break;
        case 'cash':
            method = 'Cash';
            break;
        case 'credit_card':
            method = 'Credit Cards';
            break;
        case 'other':
            method = 'Others - Check';
            break;
        default:
            method = ''
    }
    return method
}

export const formatWithMoment = (data, key) => {
    return moment.parseZone(data).local().format(key);
}

export const checkStatusPrint = async () => {
    try {
        const printer = await PrintManager.getInstance().portDiscovery();
        if (printer.length > 0) {
            let portName = false;
            for (let i = 0; i < printer.length; i++) {
                let tempt_portName = printer[i].portName ? printer[i].portName : "";
                if (tempt_portName === "BT:mPOP" || tempt_portName === "BT:TSP100") {
                    portName = tempt_portName;
                    break;
                }
            };
            return portName ? portName : false;
        } else {
            return false
        }
    } catch (error) {
    }
}

export const roundNumber = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
}

export const roundFloatNumber = num => {
    return (Math.round(num * 100) / 100).toFixed(2);
}

export const TimeZones = [
    { value: "(UTC +07:00) Bangkok,HaNoi,Jakarta" },
    { value: "(UTC -09:00) US/Alaska" },
    { value: "(UTC -10:00) US/Aleutian" },
    { value: "(UTC -07:00) US/Arizona" },
    { value: "(UTC -06:00) US/Central" },
    { value: "(UTC -06:00) US/East-Indiana" },
    { value: "(UTC -05:00) US/Eastern" },
    { value: "(UTC -10:00) US/Hawaii" },
    { value: "(UTC -06:00) US/Indiana-Starke" },
    { value: "(UTC -05:00) US/Michigan" },
    { value: "(UTC -07:00) US/Mountain" },
    { value: "(UTC -08:00) US/Pacific" },
    { value: "(UTC -08:00) US/Pacific-New" },
    { value: "(UTC -11:00) US/Samoa" },
]