import {
    Platform,
    Dimensions,
    Linking,
    Alert,
} from 'react-native';
import axios from 'axios';
import { openSettings } from 'react-native-permissions';
import moment from 'moment';
import PrintManager from '@lib/PrintManager';

import Configs from '../configs';
import apiConfigs from '../configs/api';
import Localization from '../localization';
import ICON from "../resources";

const { width, height } = Dimensions.get('window');

export const checkIsTablet = () => {
    const isTablet = parseFloat(width / height) > 1.5 ? true : false;
    return isTablet;
}

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


export const requestAPI = async (action, header = {}) => {
    let method = action.method || "GET";
    let baseURL = action.api;
    let headers = Object.assign({ "Accept": "application/json", "Content-Type": "application/json" }, header);
    if (action.token) {
        headers['Authorization'] = `Bearer ${action.token}`;
    }

    headers['User-Agent'] = `HarmonyMerchant/${action.versionApp ? `${action.versionApp}.${Configs.CODEPUSH_VERSION}` : `${Configs.VERSION}.${Configs.CODEPUSH_VERSION}`}/${Platform.OS}`;
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
        const codeNumber = response.status ? response.status : 0;
        if (codeNumber === 401) {
            return { codeNumber: codeNumber }
        }
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
            staff: service.staff,
            note: service.note ? service.note : ""
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
        // console.log(e)
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
        value: '12:00 AM',
    },
    {
        value: '12:30 AM',
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
        value: '12:00 PM',
    },
    {
        value: '12:30 PM',
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
            method = 'Other - Check';
            break;
        case 'giftcard':
            method = 'Gift Card';
            break;

        default:
            method = 'Debit Cards'
    }
    return method
}

export const formatWithMoment = (data, key) => {
    return moment.parseZone(data).format(key);
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
    "WIFI": {
        printerModels: "TSP100",
        portName: "TCP:192.168.254.12",
        isCashier: false,
        isPrint: true,
        emulation: "StarGraphic",
        widthPaper: "576"
    }
};

export const getInfoFromModelNameOfPrinter = (printers = [], modelName = []) => {

    let emulation = "";
    let widthPaper = "";
    let portName = "";

    for (let i = 0; i < printers.length; i++) {
        const printer = printers[i];
        if (printer.modelName == modelName) {
            portName = printer.portName;
            break;
        }
    };

    if (portName) {
        const tempPortName = `${modelName}`.toLowerCase();
        if (tempPortName.indexOf("pop") != -1) {
            emulation = "StarPRNT";
            widthPaper = "400"
        } else if (tempPortName.indexOf("tsp") != -1) {
            emulation = "StarGraphic";
            widthPaper = "576"
        }
    }

    return { portName, emulation, widthPaper }
}

export const getPortNameOfPrinter = (printers = [], modelName = "") => {
    let portName = "";
    for (let i = 0; i < printers.length; i++) {
        const printer = printers[i];
        if (printer.modelName == modelName) {
            portName = printer.portName;
            break;
        }
    };
    if (portName) {

    }
    return portName;
}

export const getModalNameOfPrinter = (printers, tempModalName) => {
    let modelName = "";
    for (let i = 0; i < printers.length; i++) {
        const printer = printers[i];
        if (printer.modelName == tempModalName) {
            modelName = printer.modelName;
            break;
        }
    };
    return modelName;
}

export const checkStatusPrint = async (portType = "Bluetooth") => {
    try {
        const printer = await PrintManager.getInstance().portDiscovery(portType);
        // console.log("--- printer : ", JSON.stringify(printer));
        return printer ? printer : [];
    } catch (error) {
        throw error
    }
}


export const roundNumber = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
}

export const roundFloatNumber = num => {
    return (Math.round(num * 100) / 100).toFixed(2);
}

export const TimeZones = [
    { value: "(UTC+07:00) Asia/Bangkok" },
    { value: "(UTC-09:00) US/Alaska" },
    { value: "(UTC-10:00) US/Aleutian" },
    { value: "(UTC-07:00) US/Arizona" },
    { value: "(UTC-06:00) US/Central" },
    { value: "(UTC-06:00) US/East-Indiana" },
    { value: "(UTC-05:00) US/Eastern" },
    { value: "(UTC-10:00) US/Hawaii" },
    { value: "(UTC-06:00) US/Indiana-Starke" },
    { value: "(UTC-05:00) US/Michigan" },
    { value: "(UTC-07:00) US/Mountain" },
    { value: "(UTC-08:00) US/Pacific" },
    { value: "(UTC-08:00) US/Pacific-New" },
    { value: "(UTC-11:00) US/Samoa" },
];

export const validBirthday = (birthday) => {
    const temptBirthday = new Date(birthday);
    const currentDay = new Date();

    if (currentDay.getTime() < temptBirthday.getTime()) {
        return false;
    }
    return true
}

export const PAYMENT_METHODS = [{ value: '' }, { value: 'HarmonyPay' },
{ value: 'Credit Card' }, { value: 'Cash' }, { value: 'Other' }, { value: 'Gift Card' }];

export const getPaymentStringInvoice = (type) => {
    let method = '';
    switch (type) {
        case 'HarmonyPay':
            method = 'harmony';
            break;
        case 'Cash':
            method = 'cash';
            break;
        case 'Credit Card':
            method = 'credit_card';
            break;
        case 'Other':
            method = 'other';
            break;
        case 'Debit Card':
            method = 'debit_card';
            break;
        case 'Gift Card':
            method = 'giftcard';
            break;
        default:
            method = ''
    }
    return method
}

export const getStatusStringInvoice = (type) => {
    let status = '';
    switch (type) {
        case 'Pending':
            status = 'pending';
            break;
        case 'Paid':
            status = 'paid';
            break;
        case 'Fail':
            status = 'fail';
            break;
        case 'Cancel':
            status = 'cancel';
            break;
        case 'Void':
            status = 'void';
            break;
        case 'Refund':
            status = 'refund';
            break;
        default:
            status = 'pending'
    }
    return status
}

export const getQuickFilterStringInvoice = (type) => {
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
    return quickFilter
}

export const getStaffNameForInvoice = (profileStaffLogin = {}, basket = []) => {

    const staffNameLogin = profileStaffLogin.displayName ? profileStaffLogin.displayName : "";

    let staffArr = [];
    for (let i = 0; i < basket.length; i++) {
        if (basket[i].type === "Service") {
            let temptName = basket[i].staff && basket[i].staff.displayName ? basket[i].staff.displayName : "";
            staffArr.push(temptName);
        }
    }

    const staffs = [...new Set(staffArr)];
    return staffs.length > 0 ? staffs.join(", ") : staffNameLogin;
}

export const hideCharactes = (str, numShow = 4) => {
    let temptStr = [];
    for (let i = parseInt(str.length - 1); i >= 0; i--) {
        if (temptStr.length < numShow) {
            temptStr.unshift(str[i]);
        } else {
            str[i] === "-" || str[i] === " " ? temptStr.unshift(str[i]) : temptStr.unshift("*");
        }
    }

    return temptStr.join("");
}

export const BusinessWorkingTime = {
    Monday: {
        timeStart: '10:00 AM',
        timeEnd: '08:00 PM',
        isCheck: true
    },
    Tuesday: {
        timeStart: '10:00 AM',
        timeEnd: '08:00 PM',
        isCheck: true
    },
    Wednesday: {
        timeStart: '08:00 AM',
        timeEnd: '08:00 PM',
        isCheck: true
    },
    Thursday: {
        timeStart: '10:00 AM',
        timeEnd: '08:00 PM',
        isCheck: true
    },
    Friday: {
        timeStart: '08:00 AM',
        timeEnd: '08:00 PM',
        isCheck: true
    },
    Saturday: {
        timeStart: '08:00 AM',
        timeEnd: '08:00 PM',
        isCheck: true
    },
    Sunday: {
        timeStart: '08:00 AM',
        timeEnd: '08:00 PM',
        isCheck: true
    }
}

export const getCredicardIcon = (type) => {
    let icon = "";
    if (`${type}`.indexOf("visa") !== -1) {
        icon = ICON.visaLogo;
    } else if (`${type}`.indexOf("mastercard") !== -1) {
        icon = ICON.masterCardLogo;
    } else if (`${type}`.indexOf("discover") !== -1) {
        icon = ICON.discover;
    } else if (`${type}`.indexOf("americanexpress") !== -1) {
        icon = ICON.amricanExpressLogo;
    } else if (`${type}`.indexOf("other") !== -1) {
        icon = ICON.otherPaymentLogo;
    } else {
        icon = ICON.otherPaymentLogo;
    }

    return icon;
}

export const getTotalProductByQuantity = (unitPrice = 0, quantity = 0) => {
    const total = formatNumberFromCurrency(unitPrice) * parseInt(quantity);

    return formatMoney(roundFloatNumber(total));
}


export const CARD_TYPE = ["VISA", "MASTERCARD", "AMEX", "DISCOVER"];
export const PAYMENT_TYPE = ["SALE", "RETURN", "VOID SALE"];

export const getTitleSignInAppDisplay = (value) => {
    let title = "";
    switch (value) {
        case "service_with_category":
            title = "Services with categories";
            break;
        case "category_only":
            title = "Show categories only";
            break;
        default:
            title = "Services with categories";
    }
    return title;
}

export const getValueSignInAppDisplay = (title) => {
    let value = "";
    switch (title) {
        case "Services with categories":
            value = "service_with_category";
            break;
        case "Show categories only":
            value = "category_only";
            break;
        default:
            value = "service_with_category";
    }
    return value;
}

export const getTitleSendLinkGoogle = (value) => {
    let title = "";
    switch (value) {
        case "auto":
            title = "Automatic";
            break;
        case "manual":
            title = "Manually";
            break;
        case "off":
            title = "Off";
            break;
        default:
            title = "Manually";
    }
    return title;
}

export const getValueSendLinkGoogle = (title) => {
    let value = "";
    switch (title) {
        case "Automatic":
            value = "auto";
            break;
        case "Manually":
            value = "manual";
            break;
        case "Off":
            value = "off";
            break;
        default:
            value = "manual";
    }
    return value;
}
