import {
    Platform,
    Dimensions,
    Linking
} from 'react-native';

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

export const requestAPI = async (action, headers = {}) => {
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
    let response = await fetch(action.api, request);
    const codeNumber = response.status;
    if (codeNumber === 401) {
        return { codeNumber: codeNumber }
    }
    const data = await response.json();
    return { ...data };
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

export const isIphoneX = () => {
    const { height, width } = Dimensions.get('window');
    return (Platform.OS === 'ios' && (height === 812 || width === 812)
    );
}

export const validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
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
                price: product.price
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
                price: service.price
            },
            serviceName: 'Service'
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
                price: extra.price
            },
            serviceName: 'Extra'
        }
    });

    return temptArrayExtras;
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
        value: '06:300 PM',
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
    },
    {
        value: '12:00 PM',
    },
    {
        value: '12:30 PM',
    },
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