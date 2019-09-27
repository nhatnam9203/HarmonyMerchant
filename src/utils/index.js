import {
    Platform,
    Dimensions,
    Linking,
} from 'react-native';
import axios from 'axios';

import Configs from '../configs';
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
        timeout: 5,
    };
    if ((method == "POST" || method == "DELETE" || method == "PUT") && action.body) {
        configs['data'] = JSON.stringify(action.body);
    }
    try {
        let response = await axios(configs);
        const codeNumber = response.status;
        if (codeNumber === 401) {
            return { codeNumber: codeNumber }
        }
        return response.data;
    } catch (error) {
        // console.log('error message : ' + error.message);
        if (error.message.includes('timeout')) {
            throw 'TIMEOUT'
        } else if (error.message.includes('Network Error')) {
            throw 'NETWORK_ERROR'
        } else {
            throw error
        }
    }
}

export const requestAPI1 = async (action, headers = {}) => {
    let method = action.method || 'GET';
    let request = {
        method: method,
        headers: Object.assign({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }, headers)
    };
    if (action.token) {
        request.headers['Authorization'] = "Bearer " + action.token;
    }
    if ((method == "POST" || method == "DELETE" || method == "PUT") && action.body) {
        request['body'] = JSON.stringify(action.body);
    }
    try {
        let response = await fetchWithTimeout(action.api, request, 10000);
        const codeNumber = response.status;
        if (codeNumber === 401) {
            return { codeNumber: codeNumber }
        }
        const data = await response.json();
        return { ...data };
    } catch (error) {
        throw (error);
    }

}

export const uploadFromData = async (action, headers = {}) => {
    let method = action.method || 'GET';
    let request = {
        method: method,
        headers: Object.assign({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }, headers)
    };
    if (action.token) {
        request.headers['Authorization'] = "Bearer " + action.token;
    }
    request["body"] = this.createFormData(action.media);
    // if (
    //     (method == "POST" || method == "DELETE" || method == "PUT") &&
    //     action.body
    // ) {
    //     request["body"] = this.createFormData(action.media, action.body);
    // }
    try {
        let response = await fetch(action.api, request);
        return await response.json();
    } catch (error) {
        // console.log("error uploadMultiImage : ", error);
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

export const getPosotion = (options = {}) => {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
};

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
        // console.log('staff : ',service.staff);
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
    return Number(currency.replace(/[^0-9.-]+/g, ""));
}

export const formatMoney = (number, decPlaces, decSep, thouSep) => {
    decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
        decSep = typeof decSep === "undefined" ? "." : decSep;
    thouSep = typeof thouSep === "undefined" ? "," : thouSep;
    var sign = number < 0 ? "-" : "";
    var i = String(parseInt(number = Math.abs(Number(number) || 0).toFixed(decPlaces)));
    var j = (j = i.length) > 3 ? j % 3 : 0;

    return sign +
        (j ? i.substr(0, j) + thouSep : "") +
        i.substr(j).replace(/(\decSep{3})(?=\decSep)/g, "$1" + thouSep) +
        (decPlaces ? decSep + Math.abs(number - i).toFixed(decPlaces).slice(2) : "");
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
]